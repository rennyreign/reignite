# Capability Tracker — V2 Implementation Plan

## Hermetic Decision Tree Validation

Before building, we run the tree:

| Gate | Question | Answer |
|------|----------|--------|
| **1. Substance** | Is there real, felt pain? | **Yes.** Parents notice growth but have no simple system to record it. Milestones are remembered loosely, written inconsistently, hard to compare. |
| **2. Inevitability** | Does this problem exist without a product? | **Yes.** Every parent educating independently faces this. The problem emerges naturally from how independent education operates. |
| **3. Distillation** | Can value be named without persuasion? | **"Capability Tracker removes uncertainty from a parent's view of their child's progress."** Compresses cleanly. |
| **4. Emotional Integrity** | What emotion does this rely on? | **Relief.** Not excitement. Parents feel relief when they can see progress clearly. |
| **5. Silence Test** | Can this afford quiet? | **Yes.** The record compounds in value over time without promotion. |
| **6. Identity Leak** | Does this require the operator to be impressive? | **No.** The tool stands on its own. |
| **7. Final Calibration** | Revealing something true, or making something work? | **Revealing.** The capability is already there. We just make it visible. |

**Result: All gates passed. Proceed.**

---

## Hermetic Marketing Position

**Canonical formula:**
> "Capability Tracker removes invisible progress from a parent's record of their child."

**Substance test:** Works without hype — parents already feel the pain.
**Recognition test:** Any homeschool parent immediately understands.
**Silence test:** The accumulated record is the retention mechanism.

---

## Gap Analysis: Current App vs. Product Brief

The existing codebase is a **v0 prototype** that needs a fundamental reframe, not a patch.

| Dimension | Current App | Product Brief |
|-----------|------------|---------------|
| **Mental model** | Student → Assessment → Score | Child → Capability → Snapshot |
| **Language** | "Students", "Assessments", "Scores" | "Children", "Capabilities", "Check-ins", "Signals" |
| **Scale** | 0-10 numeric scores | 1-5 lightweight signals |
| **Categories** | 10 fixed categories | 5 editable capability areas |
| **Feel** | School dashboard | Well-designed notebook |
| **Scoring** | Required, numeric, precise | Optional, lightweight, signal-based |
| **Notes** | Secondary to scores | Equal to signals |
| **Areas** | Fixed, not editable | Parent-editable |
| **Auth** | None | Needed for privacy |
| **Backend** | Flask + SQLite | To be decided (see below) |
| **Frontend** | React + Bootstrap + MUI (mixed) | Clean, calm, cohesive UI |

**Verdict:** This is effectively a **rebuild** aligned to the new brief, not a refactor of the old app.

---

## Architecture Decision

### Option A: Keep Flask + React (evolve current stack)
- Pro: Existing code as reference
- Con: Mixed UI libraries, circular imports, Node version issues, no auth

### Option B: Next.js + Supabase (modern full-stack)
- Pro: Auth built-in, database built-in, deployable to Netlify, SSR, single codebase
- Con: New stack to set up

### Recommendation: **Option B — Next.js + Supabase**

**Rationale:**
- Supabase provides auth, database, and API out of the box
- Next.js deploys cleanly to Netlify (MCP tools available)
- Single codebase (no separate backend server)
- Row Level Security for privacy (parent sees only their children)
- Aligns with hermetic engineering: reproducible, one-command bootstrap
- Scales naturally toward future Think DiFFrent ecosystem modules

---

## Tech Stack (MVP)

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js (App Router) |
| **UI** | Tailwind CSS + shadcn/ui |
| **Icons** | Lucide |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (email/password) |
| **ORM/Client** | Supabase JS Client |
| **Deployment** | Netlify |
| **Node version** | 18 LTS (pinned via `.nvmrc`) |

---

## Data Model

### Tables

```
profiles (Supabase auth.users handles parent accounts)

children
  id          uuid PK
  parent_id   uuid FK → auth.users.id
  name        text NOT NULL
  date_of_birth date
  avatar_url  text
  created_at  timestamptz
  updated_at  timestamptz

capability_areas
  id          uuid PK
  parent_id   uuid FK → auth.users.id
  name        text NOT NULL
  sort_order  integer
  is_default  boolean
  created_at  timestamptz

capabilities
  id          uuid PK
  area_id     uuid FK → capability_areas.id
  parent_id   uuid FK → auth.users.id
  name        text NOT NULL
  description text
  sort_order  integer
  created_at  timestamptz

checkins
  id              uuid PK
  child_id        uuid FK → children.id
  capability_id   uuid FK → capabilities.id
  parent_id       uuid FK → auth.users.id
  signal          integer CHECK (1-5), nullable
  notes           text
  checkin_date    date NOT NULL
  created_at      timestamptz
```

### Row Level Security
- All tables: `parent_id = auth.uid()` — parents only see their own data.

### Default Capability Areas (seeded on signup)
1. **Communication** — Speaking, listening, reading, writing
2. **Thinking** — Problem-solving, reasoning, curiosity, focus
3. **Practical Skills** — Typing, digital tools, daily tasks, money
4. **Physical Capability** — Coordination, fitness, sports, stamina
5. **Character** — Integrity, patience, self-awareness, responsibility

---

## MVP Feature Set

### Phase 1: Foundation
1. **Auth** — Sign up, sign in, sign out (email/password)
2. **Child profiles** — Create, edit, view children
3. **Capability areas** — View defaults, add custom areas
4. **Capabilities** — Add capabilities within areas

### Phase 2: Core Loop
5. **Check-in flow** — Select child → select capability → record signal + notes
6. **Capability history** — View signal pattern over time per capability
7. **Child dashboard** — Overview of all capability areas and latest signals

### Phase 3: Polish
8. **Notes timeline** — Chronological view of all observations for a child
9. **Visual patterns** — Simple sparkline/trend indicators (not dashboards)
10. **Settings** — Edit areas, edit capabilities, manage profile

---

## UX Principles (from brief)

- **Notebook feel**, not dashboard feel
- **Warm neutrals**, not clinical blues
- **Generous whitespace**, not dense grids
- **Text-first**, charts secondary
- **Signal language**: "Just starting → Excellent", not "0-10"
- **No gamification**, no streaks, no scores
- **Fast check-in**: < 30 seconds to record a signal + note

---

## Project Structure (Hermetic Standards)

```
capability-tracker/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # Auth pages (login, signup)
│   │   ├── (app)/          # Authenticated app pages
│   │   │   ├── children/
│   │   │   ├── checkin/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/         # Shared UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...
│   ├── lib/                # Utilities, Supabase client, types
│   └── styles/             # Global styles
├── tests/                  # Test files
├── docs/                   # Documentation, ADRs
│   └── adr/
├── config/                 # Environment configs
├── scripts/                # Setup and utility scripts
├── context/                # Product context docs
├── public/                 # Static assets
├── supabase/               # Supabase migrations
│   └── migrations/
├── .nvmrc                  # Node version pin
├── .env.example            # Environment template
├── CHANGELOG.md
├── README.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Dependency List

### Production
- `next` — Framework
- `react`, `react-dom` — UI
- `@supabase/supabase-js` — Database + Auth client
- `@supabase/ssr` — Server-side Supabase helpers
- `tailwindcss`, `@tailwindcss/postcss` — Styling
- `class-variance-authority`, `clsx`, `tailwind-merge` — shadcn/ui utilities
- `lucide-react` — Icons
- `date-fns` — Date formatting

### Development
- `typescript` — Type safety
- `eslint`, `prettier` — Code quality
- `@types/react`, `@types/node` — Type definitions

---

## Risk Notes

| Risk | Mitigation |
|------|-----------|
| **Supabase dependency** | Standard PostgreSQL underneath; can self-host or migrate |
| **Auth stores PII (email)** | Supabase handles encryption; RLS enforces isolation |
| **Data loss** | Supabase automated backups; future: export feature |
| **Scope creep** | Strict MVP boundary — 3 phases, no extras until phase 3 complete |
| **Node version drift** | `.nvmrc` pins to 18 LTS |

---

## Execution Order

| Step | Action | Branch |
|------|--------|--------|
| 1 | Create fresh Next.js project in new directory | `feat/mvp-scaffold` |
| 2 | Configure Supabase project + create migrations | `feat/mvp-scaffold` |
| 3 | Implement auth (signup, login, logout) | `feat/auth` |
| 4 | Build child profiles CRUD | `feat/child-profiles` |
| 5 | Build capability areas + capabilities | `feat/capabilities` |
| 6 | Build check-in flow | `feat/checkins` |
| 7 | Build capability history view | `feat/history` |
| 8 | Build child dashboard | `feat/dashboard` |
| 9 | Polish: notes timeline, trends, settings | `feat/polish` |
| 10 | Deploy to Netlify | `chore/deploy` |

---

## What This Plan Does NOT Include (Future)

Per the brief, these are **future modules**, not MVP:
- Capability Portfolio
- Learning Planner
- Project Tracker
- Reading Tracker
- Skill Builder
- Transcript Builder
- PDF report generation
- Multi-parent collaboration

---

## Approval Required

This plan involves:
- **New Supabase project creation** (database + auth) → requires `/approve`
- **PII handling** (parent email for auth) → requires `/approve`
- **New deployment** (Netlify) → requires `/approve`

**Awaiting your review and `/approve` to begin execution.**
