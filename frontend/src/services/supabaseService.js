import { supabase } from '../lib/supabase';

// ─── Student Service ──────────────────────────────────────────────────────────

export const studentService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  create: async ({ name, date_of_birth, imageFile, user_id }) => {
    let profile_image_url = null;

    if (imageFile) {
      profile_image_url = await uploadProfileImage(imageFile);
    }

    const { data, error } = await supabase
      .from('students')
      .insert([{ name, date_of_birth: date_of_birth || null, profile_image_url, user_id }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  update: async (id, { name, date_of_birth, imageFile, profile_image_url }) => {
    let newImageUrl = profile_image_url;

    if (imageFile) {
      newImageUrl = await uploadProfileImage(imageFile, id);
    }

    const { data, error } = await supabase
      .from('students')
      .update({ name, date_of_birth: date_of_birth || null, profile_image_url: newImageUrl })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ─── Assessment Service ───────────────────────────────────────────────────────

export const assessmentService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('assessment_date', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  getByStudentId: async (studentId) => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('student_id', studentId)
      .order('assessment_date', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  create: async (assessmentData) => {
    const scores = [
      assessmentData.speaking_score,
      assessmentData.listening_score,
      assessmentData.reading_score,
      assessmentData.writing_score,
      assessmentData.typing_score,
      assessmentData.maths_score,
      assessmentData.digital_competence_score,
      assessmentData.sports_score,
      assessmentData.character_score,
      assessmentData.hygiene_score,
    ];
    const capability_percentage = scores.reduce((sum, s) => sum + (s || 0), 0);

    const { data, error } = await supabase
      .from('assessments')
      .insert([{ ...assessmentData, capability_percentage }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ─── Statistics Service ───────────────────────────────────────────────────────

export const statisticsService = {
  getStudentStatistics: async (studentId) => {
    const assessments = await assessmentService.getByStudentId(studentId);

    if (!assessments.length) {
      return { latest_assessment: null, average_capability: 0, assessment_count: 0, trend_data: [] };
    }

    const sorted = [...assessments].sort(
      (a, b) => new Date(b.assessment_date) - new Date(a.assessment_date)
    );

    const average_capability =
      assessments.reduce((sum, a) => sum + a.capability_percentage, 0) / assessments.length;

    const trend_data = [...sorted]
      .reverse()
      .map((a) => ({ date: a.assessment_date, capability_percentage: a.capability_percentage }));

    return {
      latest_assessment: sorted[0],
      average_capability,
      assessment_count: assessments.length,
      trend_data,
    };
  },
};

// ─── Reminder Service ─────────────────────────────────────────────────────────

export const reminderService = {
  getByChild: async (childId) => {
    const { data, error } = await supabase
      .from('reminder_settings')
      .select('*')
      .eq('child_id', childId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },

  upsert: async ({ user_id, child_id, interval_days, is_active, next_reminder_at }) => {
    const { data, error } = await supabase
      .from('reminder_settings')
      .upsert(
        { user_id, child_id, interval_days, is_active, next_reminder_at, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,child_id' }
      )
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};

// ─── Storage Helper ───────────────────────────────────────────────────────────

async function uploadProfileImage(file, studentId) {
  const ext = file.name.split('.').pop();
  const path = `${studentId ?? Date.now()}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('profile-images')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('profile-images').getPublicUrl(path);
  return data.publicUrl;
}
