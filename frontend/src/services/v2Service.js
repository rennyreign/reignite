import { supabase } from '../lib/supabase';

// ─── Age Calculation Utilities ────────────────────────────────────────────────

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const getAgeBracket = (age) => {
  if (age === null || age === undefined) return null;
  if (age >= 1 && age <= 3) return 'toddler';
  if (age >= 4 && age <= 6) return 'early_years';
  if (age >= 7 && age <= 9) return 'primary';
  if (age >= 10 && age <= 12) return 'pre_teen';
  if (age >= 13) return 'teen';
  return null;
};

export const getAgeBracketLabel = (bracket) => {
  const labels = {
    toddler: 'Toddler (1-3)',
    early_years: 'Early Years (4-6)',
    primary: 'Primary (7-9)',
    pre_teen: 'Pre-Teen (10-12)',
    teen: 'Teen (13+)',
  };
  return labels[bracket] || null;
};

// ─── Capability Areas Service ────────────────────────────────────────────────

export const capabilityAreasService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('v2_capability_areas')
      .select('*, sub_capabilities:v2_sub_capabilities(id)')
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    // Filter out duplicate areas with no sub-capabilities
    return data.filter(area => area.sub_capabilities && area.sub_capabilities.length > 0);
  },

  getAllWithSubCapabilities: async () => {
    const { data, error } = await supabase
      .from('v2_capability_areas')
      .select(`
        *,
        sub_capabilities:v2_sub_capabilities(*)
      `)
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    
    // Filter out areas with no sub-capabilities and sort sub-capabilities within each area
    return data
      .filter(area => area.sub_capabilities && area.sub_capabilities.length > 0)
      .map(area => ({
        ...area,
        sub_capabilities: area.sub_capabilities.sort((a, b) => a.sort_order - b.sort_order)
      }));
  },
};

// ─── Sub-Capabilities Service ────────────────────────────────────────────────

export const subCapabilitiesService = {
  getByAreaId: async (areaId) => {
    const { data, error } = await supabase
      .from('v2_sub_capabilities')
      .select('*')
      .eq('area_id', areaId)
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },
};

// ─── Check-ins Service ────────────────────────────────────────────────────────

export const checkinsService = {
  getByChildId: async (childId) => {
    const { data, error } = await supabase
      .from('v2_checkins')
      .select(`
        *,
        scores:v2_checkin_scores(
          *,
          sub_capability:v2_sub_capabilities(
            *,
            area:v2_capability_areas(*)
          )
        )
      `)
      .eq('child_id', childId)
      .order('checkin_date', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  create: async ({ childId, scores, generalNote, durationSeconds }) => {
    // Atomic insert: check-in + scores in a single database transaction
    const { data: checkinId, error } = await supabase.rpc('create_checkin_with_scores', {
      p_child_id: childId,
      p_general_note: generalNote || null,
      p_duration_seconds: durationSeconds,
      p_scores: scores.map(s => ({
        sub_capability_id: s.sub_capability_id,
        score: s.score,
        note: s.note || null,
      })),
    });

    if (error) throw new Error(error.message);

    // Check for bias flags (post-transaction, non-critical)
    try {
      const flagResult = await checkBiasFlags(checkinId, childId, scores, durationSeconds);
      if (flagResult.shouldFlag) {
        await supabase
          .from('v2_checkins')
          .update({ is_flagged: true, flag_reason: flagResult.reason })
          .eq('id', checkinId);
      }
    } catch (flagError) {
      console.warn('Bias detection failed (non-critical):', flagError.message);
    }

    return { id: checkinId };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('v2_checkins')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ─── Bias Detection ───────────────────────────────────────────────────────────

async function enrichScoresWithAreaData(scores) {
  // Fetch all sub-capabilities with their area associations
  const subCapIds = scores.map(s => s.sub_capability_id);
  const { data: subCaps } = await supabase
    .from('v2_sub_capabilities')
    .select('id, area_id')
    .in('id', subCapIds);
  
  if (!subCaps) return scores;

  // Create a lookup map
  const areaMap = {};
  subCaps.forEach(sc => {
    areaMap[sc.id] = sc.area_id;
  });

  // Enrich scores with area_id
  return scores.map(s => ({
    ...s,
    area_id: areaMap[s.sub_capability_id],
  }));
}

async function checkBiasFlags(checkinId, childId, scores, durationSeconds) {
  const flags = [];

  // Get child age
  const { data: child } = await supabase
    .from('students')
    .select('date_of_birth')
    .eq('id', childId)
    .single();
  
  const age = child ? calculateAge(child.date_of_birth) : null;

  // Enrich scores with area data for bias detection
  const enrichedScores = await enrichScoresWithAreaData(scores);

  // Rule 1: All-tens (≥6 areas scored 9+ for child under 5)
  if (age && age < 5) {
    const areaScores = calculateAreaAverages(enrichedScores);
    const highScoreCount = Object.values(areaScores).filter(avg => avg >= 9).length;
    if (highScoreCount >= 6) {
      flags.push('All-tens: 6+ areas scored 9+ for child under 5');
    }
  }

  // Rule 2: Zero variance (all sub-capabilities identical)
  const uniqueScores = new Set(scores.map(s => s.score));
  if (uniqueScores.size === 1) {
    flags.push('Zero variance: all scores identical');
  }

  // Rule 3: Speed entry (<15 seconds)
  if (durationSeconds && durationSeconds < 15) {
    flags.push('Speed entry: completed in <15 seconds');
  }

  // Rule 4: Extreme jump (check previous check-in)
  const { data: previousCheckins } = await supabase
    .from('v2_checkins')
    .select(`
      *,
      scores:v2_checkin_scores(
        *,
        sub_capability:v2_sub_capabilities(area_id)
      )
    `)
    .eq('child_id', childId)
    .order('checkin_date', { ascending: false })
    .limit(2);

  if (previousCheckins && previousCheckins.length === 2) {
    const prevScores = previousCheckins[1].scores;
    const currentAreaAvgs = calculateAreaAverages(enrichedScores);
    const prevAreaAvgs = calculateAreaAverages(prevScores);
    
    for (const areaId in currentAreaAvgs) {
      if (prevAreaAvgs[areaId] !== undefined) {
        const jump = Math.abs(currentAreaAvgs[areaId] - prevAreaAvgs[areaId]);
        if (jump >= 5) {
          flags.push(`Extreme jump: ${jump} point change in one area`);
          break;
        }
      }
    }
  }

  return {
    shouldFlag: flags.length > 0,
    reason: flags.join('; '),
  };
}

function calculateAreaAverages(scores) {
  const areaScores = {};
  const areaCounts = {};

  scores.forEach(s => {
    const areaId = s.sub_capability?.area_id || s.area_id;
    if (!areaId) return;
    
    if (!areaScores[areaId]) {
      areaScores[areaId] = 0;
      areaCounts[areaId] = 0;
    }
    areaScores[areaId] += s.score;
    areaCounts[areaId]++;
  });

  const averages = {};
  for (const areaId in areaScores) {
    averages[areaId] = areaScores[areaId] / areaCounts[areaId];
  }
  return averages;
}

// ─── Statistics & Percentiles ─────────────────────────────────────────────────

export const statisticsService = {
  getChildStatistics: async (childId) => {
    const checkins = await checkinsService.getByChildId(childId);
    
    if (!checkins.length) {
      return {
        latest_checkin: null,
        area_averages: {},
        checkin_count: 0,
        trend_data: [],
        percentiles: {},
      };
    }

    const latestCheckin = checkins[0];
    const areaAverages = calculateAreaAveragesFromCheckin(latestCheckin);
    
    // Get child age for percentile calculation
    const { data: child } = await supabase
      .from('students')
      .select('date_of_birth')
      .eq('id', childId)
      .single();
    
    const age = child ? calculateAge(child.date_of_birth) : null;
    const bracket = getAgeBracket(age);

    // Calculate percentiles
    const percentiles = bracket ? await calculatePercentiles(childId, bracket, areaAverages) : {};

    // Trend data
    const trendData = checkins.reverse().map(c => ({
      date: c.checkin_date,
      area_averages: calculateAreaAveragesFromCheckin(c),
    }));

    // Calculate overall score percentage (latest check-in)
    const latestOverallAvg = Object.values(areaAverages).length > 0
      ? Object.values(areaAverages).reduce((sum, val) => sum + val, 0) / Object.values(areaAverages).length
      : 0;
    const overall_score_percentage = Math.round((latestOverallAvg / 10) * 100);

    // Calculate overall average percentage (across all check-ins)
    const allAreaAverages = checkins.map(c => {
      const avgs = calculateAreaAveragesFromCheckin(c);
      return Object.values(avgs).length > 0
        ? Object.values(avgs).reduce((sum, val) => sum + val, 0) / Object.values(avgs).length
        : 0;
    });
    const overallAvg = allAreaAverages.length > 0
      ? allAreaAverages.reduce((sum, val) => sum + val, 0) / allAreaAverages.length
      : 0;
    const overall_average_percentage = Math.round((overallAvg / 10) * 100);

    // Store raw average percentile rank (0–100, where 100 = better than all peers)
    let overall_percentile = null;
    if (percentiles && !percentiles.insufficient_data) {
      const pctValues = Object.values(percentiles).filter(v => typeof v === 'number');
      if (pctValues.length > 0) {
        const avgPercentile = pctValues.reduce((s, v) => s + v, 0) / pctValues.length;
        overall_percentile = Math.round(avgPercentile);
      }
    }

    return {
      latest_checkin: latestCheckin,
      area_averages: areaAverages,
      checkin_count: checkins.length,
      trend_data: trendData,
      percentiles,
      age,
      bracket,
      overall_score_percentage,
      overall_average_percentage,
      overall_percentile,
    };
  },
};

function calculateAreaAveragesFromCheckin(checkin) {
  if (!checkin.scores || !checkin.scores.length) return {};
  
  const areaScores = {};
  const areaCounts = {};

  checkin.scores.forEach(s => {
    const areaId = s.sub_capability?.area?.id;
    if (!areaId) return;
    
    if (!areaScores[areaId]) {
      areaScores[areaId] = 0;
      areaCounts[areaId] = 0;
    }
    areaScores[areaId] += s.score;
    areaCounts[areaId]++;
  });

  const averages = {};
  for (const areaId in areaScores) {
    averages[areaId] = Math.round((areaScores[areaId] / areaCounts[areaId]) * 10) / 10;
  }
  return averages;
}

async function calculatePercentiles(childId, bracket, childAreaAverages) {
  // Get all non-flagged check-ins for children in the same age bracket
  const { data: allChildren } = await supabase
    .from('students')
    .select('id, date_of_birth');
  
  if (!allChildren) return {};

  const sameBracketChildren = allChildren.filter(c => {
    const age = calculateAge(c.date_of_birth);
    return getAgeBracket(age) === bracket && c.id !== childId;
  });

  if (sameBracketChildren.length < 10) {
    return { insufficient_data: true };
  }

  const percentiles = {};

  for (const areaId in childAreaAverages) {
    const childScore = childAreaAverages[areaId];
    
    // Get all latest check-in scores for this area from same-bracket children
    const peerScores = [];
    
    for (const peer of sameBracketChildren) {
      const { data: peerCheckins } = await supabase
        .from('v2_checkins')
        .select(`
          *,
          scores:v2_checkin_scores(
            *,
            sub_capability:v2_sub_capabilities(area_id)
          )
        `)
        .eq('child_id', peer.id)
        .eq('is_flagged', false)
        .order('checkin_date', { ascending: false })
        .limit(1);
      
      if (peerCheckins && peerCheckins.length > 0) {
        const peerAreaAvg = calculateAreaAveragesFromCheckin(peerCheckins[0]);
        if (peerAreaAvg[areaId] !== undefined) {
          peerScores.push(peerAreaAvg[areaId]);
        }
      }
    }

    if (peerScores.length >= 10) {
      const lowerCount = peerScores.filter(s => s < childScore).length;
      const percentile = Math.round((lowerCount / peerScores.length) * 100);
      percentiles[areaId] = percentile;
    }
  }

  return percentiles;
}

// ─── Expected Ranges ──────────────────────────────────────────────────────────

export const expectedRangesService = {
  getByBracket: async (bracket) => {
    const { data, error } = await supabase
      .from('v2_age_expected_ranges')
      .select(`
        *,
        area:v2_capability_areas(*)
      `)
      .eq('bracket', bracket);
    if (error) throw new Error(error.message);
    return data;
  },
};
