# Capability Tracker

**A living record of child development — built by parents, for parents.**

---

## The Problem

Parents have no objective, longitudinal way to understand their child's development outside of school report cards and clinical assessments. Schools measure curriculum completion. Clinicians measure deficits. Neither tells a parent: *"Here is what your child can actually do — and here is how that compares to children their age."*

The result is a blind spot. Parents rely on gut feeling, anecdotal comparison with other families, or wait for problems to surface before they act.

---

## The Solution

Capability Tracker is a parent-facing tool that enables structured, guided observation of a child's capabilities across **8 core areas of development**, tracked over time with **age-contextual benchmarks**.

It is not a diagnosis. It is not a grade. It is a **living record** — a thinking partner that helps parents see growth clearly and consistently.

### Core Proposition

> *Most systems ask what a child completed. This asks what a child can actually do.*

---

## How It Works

### 1. Add Your Child

A parent creates a child profile with a name and date of birth. The system automatically calculates the child's age and assigns them to an **age bracket** for peer comparison:

| Bracket | Age Range |
|---------|-----------|
| Toddler | 1–3 years |
| Preschool | 3–5 years |
| Early Primary | 5–7 years |
| Primary | 7–9 years |
| Upper Primary | 9–11 years |
| Middle School | 11–13 years |
| Teen | 13+ years |

### 2. Complete a Check-in

A check-in is a guided walk through all 8 capability areas. For each sub-capability, the parent uses a **0–10 slider** where every position has a **descriptive criteria sentence** — the parent simply slides to the description that matches what they observe.

This removes subjectivity. The parent isn't guessing a number — they're matching observed behaviour to a description.

**Example** — *Making Friends* (Social area):

| Score | What the parent sees |
|-------|---------------------|
| 0 | No interest in peers |
| 3 | Engages in simple interactions |
| 5 | Maintains several friendships |
| 7 | Strong, supportive friendships |
| 10 | Profound, mature friendships |

Each check-in takes approximately 5–10 minutes. Optional notes can be added per sub-capability for context.

### 3. View the Profile

After a check-in, the child's profile shows:

- **Current Score** — Overall percentage from the latest check-in
- **Average for Age** — Running average across all check-ins
- **Ranking** — "Top X%" compared to all same-age children in the system
- **Per-area breakdown** — Each of the 8 areas with individual score and ranking
- **Progress over time** — Historical chart with constant percentage labels

### 4. Track Over Time

Repeated check-ins build a longitudinal record. The system detects patterns, flags potential bias (e.g., all scores identical, completion in under 15 seconds, extreme jumps between check-ins), and provides percentile context as the community grows.

---

## The 8 Capability Areas

Every child is assessed across 8 areas containing 25 sub-capabilities. The language is deliberately **parent-friendly** — no clinical or school-technical jargon.

### 💬 Communication
| Sub-Capability | What it measures |
|---------------|-----------------|
| Speaking | Articulation, vocabulary, coherence, and confidence in verbal expression |
| Listening | Focus, comprehension, memory retention, and responding appropriately |
| Reading | Fluency, comprehension, vocabulary, and engagement with text |
| Writing | Idea formation, structure, grammar, and creative expression in writing |

### 🧠 Cognitive
| Sub-Capability | What it measures |
|---------------|-----------------|
| Problem Solving | Logical reasoning, troubleshooting, and applied thinking |
| Understanding Numbers | Counting, arithmetic, measurement, and math reasoning |
| Thinking Things Through | Analyzing, questioning, and forming conclusions |

### 🏃 Physical
| Sub-Capability | What it measures |
|---------------|-----------------|
| Movement & Coordination | Balance, catching, throwing, and body control |
| Strength & Energy | Stamina, physical activity, and overall fitness |
| Hand & Body Skills | Using hands skillfully, dexterity, and physical confidence |

### 💛 Emotional Intelligence
| Sub-Capability | What it measures |
|---------------|-----------------|
| Understanding Feelings | Recognizing and naming their own emotions |
| Caring About Others | Understanding how others feel and showing compassion |
| Managing Emotions | Staying calm, handling frustration, and recovering from upset |

### 🤝 Social
| Sub-Capability | What it measures |
|---------------|-----------------|
| Making Friends | Building and keeping friendships |
| Working with Others | Sharing, taking turns, and being part of a team |
| Solving Disagreements | Handling conflicts peacefully and finding solutions |

### 🌟 Character
| Sub-Capability | What it measures |
|---------------|-----------------|
| Being Responsible | Following through on tasks and keeping commitments |
| Sticking with Things | Perseverance, focus, and self-control |
| Being Honest & Fair | Telling the truth and doing the right thing |

### 🎨 Creative
| Sub-Capability | What it measures |
|---------------|-----------------|
| Creative Thinking | Inventive ideas, storytelling, and imaginative play |
| Art & Expression | Drawing, music, crafts, and creative projects |
| Curiosity | Asking questions, exploring new ideas, and seeking to learn |

### 🔧 Practical Life
| Sub-Capability | What it measures |
|---------------|-----------------|
| Taking Care of Themselves | Personal hygiene, grooming, and health habits |
| Doing Things Independently | Completing tasks alone, making decisions, managing time |
| Staying Organized | Keeping spaces tidy, planning ahead, managing belongings |

---

## The Scoring System

### 0–10 Guided Scale

Each sub-capability uses a 0–10 slider. This is **not** a free-form number entry — every integer position maps to a **descriptive criteria sentence** that tells the parent exactly what that score looks like in observed behaviour.

The parent's task is simple: **"Slide to the description that matches what you see."**

This design choice serves three purposes:

1. **Objectivity** — Removes "what does a 7 mean?" ambiguity
2. **Consistency** — Different parents scoring the same child arrive at similar results
3. **Longitudinal validity** — Scores are comparable across time because the criteria are fixed

### Bias Detection

The system automatically flags check-ins that may contain unreliable data:

| Rule | Trigger |
|------|---------|
| **All-tens** | 6+ areas scored 9+ for a child under 5 |
| **Zero variance** | All sub-capabilities scored identically |
| **Speed entry** | Check-in completed in under 15 seconds |
| **Extreme jump** | 5+ point change in any area between consecutive check-ins |

Flagged check-ins are excluded from percentile calculations but retained for the parent's record.

### Percentile Engine

When a minimum of **10 peers** exist in the same age bracket, the system calculates percentile rankings:

- Each area receives an individual percentile
- An overall "Top X%" ranking aggregates across all areas
- Rankings update as more children join the system

This is the **network effect**: the product becomes more valuable with every child added, because every new data point sharpens the benchmarks for everyone.

---

## User Experience

### Design Principles

- **Calm, not clinical** — Warm neutrals, rounded cards, no red/green pass/fail aesthetics
- **Guided, not open-ended** — Every input has structure; the parent is never staring at a blank form
- **Parent-first language** — "Making Friends" not "Peer Socialisation"; "Hand & Body Skills" not "Fine Motor Development"
- **Mobile-ready** — Designed for a parent on a couch, not a clinician at a desk

### Key Screens

| Screen | Purpose |
|--------|---------|
| **Home** | Value proposition + entry point |
| **Dashboard** | All children at a glance |
| **Child Profile** | Score summary, area breakdown, ranking, progress chart |
| **New Check-in** | Step-by-step guided flow through all 8 areas |
| **History** | Timeline of all assessments with expandable detail |

### Check-in Flow

The check-in presents **one area at a time** with a prominent area title, icon, and progress indicator ("Area 3 of 8"). Within each area, sub-capabilities are shown with their slider, criteria text, and an optional collapsed note field ("+ Add a note"). Navigation is simple: Back / Next Area / Complete.

---

## Technical Architecture

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (CRA), Material UI v5, React Router v6, Chart.js |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **Hosting** | Netlify (CI/CD from Git) |
| **Data** | Normalised V2 schema with capability areas, sub-capabilities, check-ins, scores, and age-expected ranges |

### Data Model (Simplified)

```
students
  ├── id, name, date_of_birth, profile_image_url

v2_capability_areas
  ├── id, name, icon, sort_order

v2_sub_capabilities
  ├── id, area_id (FK), name, helper_text, sort_order

v2_checkins
  ├── id, child_id (FK), checkin_date, notes, duration_seconds, is_flagged, flag_reason

v2_checkin_scores
  ├── id, checkin_id (FK), sub_capability_id (FK), score, notes

v2_age_expected_ranges
  ├── id, area_id (FK), bracket, min_expected, max_expected
```

---

## Business Model Considerations

### The Network Effect

Capability Tracker's percentile engine creates a **data moat**. Every child added to the system improves the benchmarks for every other child. Early users get progressively more value as the community grows — this is the retention loop.

### Expansion Vectors

| Vector | Description |
|--------|------------|
| **Freemium → Premium** | Free: unlimited children, check-ins. Premium: detailed analytics, PDF exports, multi-caregiver access, historical trend reports |
| **Schools & Nurseries** | Institutional version with class-level dashboards, teacher accounts, parent sharing |
| **Specialist Integrations** | Share anonymised capability profiles with tutors, therapists, or educational consultants |
| **Marketplace** | Recommend resources, activities, or programmes based on capability gaps |
| **API / White-label** | License the scoring framework and percentile engine to EdTech platforms |

### Key Metrics to Track

| Metric | Why it matters |
|--------|---------------|
| **Children registered** | Drives percentile accuracy (network effect) |
| **Check-in frequency** | Core engagement — are parents returning? |
| **Check-in completion rate** | Is the flow too long or friction-heavy? |
| **Time per check-in** | Sweet spot is 5–10 minutes |
| **Age bracket distribution** | Ensures percentiles are meaningful across all ages |
| **Flagged check-in rate** | Quality signal — are parents engaging seriously? |

---

## What This Is Not

- **Not a medical tool** — Does not diagnose conditions or replace professional assessment
- **Not a school report** — Does not measure curriculum attainment or grades
- **Not a comparison engine** — Percentiles provide context, not competition
- **Not surveillance** — Data belongs to the parent; no sharing without explicit consent

---

## Current Status

| Component | Status |
|-----------|--------|
| Child profiles (CRUD + photo) | ✅ Complete |
| 8 capability areas, 25 sub-capabilities | ✅ Complete |
| Guided check-in flow (0–10 with criteria) | ✅ Complete |
| Age calculation + bracket assignment | ✅ Complete |
| Percentile engine (per-area + overall) | ✅ Complete |
| Bias detection (4 rules) | ✅ Complete |
| Child profile with scores, ranking, chart | ✅ Complete |
| Parent-friendly language throughout | ✅ Complete |
| Assessment history with timeline | ✅ Complete |
| Netlify deployment | ✅ Complete |
| User authentication | 🔲 Next phase |
| Multi-caregiver support | 🔲 Next phase |
| PDF export / sharing | 🔲 Next phase |
| Institutional (school) accounts | 🔲 Future |

---

## The Real Secret

The genius of this product is not the scores. It's the **consistency of observation over time**.

A single check-in is a snapshot. Twenty check-ins over two years is a story. The parent who checks in monthly will, without realising it, build the most complete picture of their child's development that exists anywhere — more nuanced than any school report, more longitudinal than any clinical assessment, and entirely in their hands.

The product makes this effortless. That's the whole point.

---

*Built by Think Diffrent.*
