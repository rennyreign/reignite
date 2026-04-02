# Capability Tracker — Plan Tracker

## Current Status
**Phase:** Beta Prep — Deployed to production, slider/scoring polish complete
**Branch:** `main`
**Last updated:** 2026-04-02

---

## Completed

### Auth & Onboarding (Session ~2026-03-30 → 2026-04-01)
- [x] Supabase: Add `user_id` to `students` table, create `reminder_settings` table
- [x] Supabase: Enable RLS on `students`, `v2_checkins`, `v2_checkin_scores`, `reminder_settings`
- [x] Fix: Drop stale `on_auth_user_created` trigger (`seed_default_capability_areas`) blocking signup
- [x] `AuthContext` provider — Google OAuth + email magic link
- [x] `LoginPage` — minimal friction, Google + email OTP
- [x] `AuthCallback` — handles OAuth redirect
- [x] `OnboardingFlow` — 3-step "How it works" → create child
- [x] `ReminderSettings` — interval picker (weekly/biweekly/monthly/none), stored via upsert
- [x] `App.js` — `AuthProvider`, protected routes, header hiding on auth pages
- [x] `Header` — user avatar + sign-out dropdown, conditional nav
- [x] `StudentList` — auto-redirect to `/onboarding` if user has no children
- [x] `AddEditStudent` — passes `user_id` on create
- [x] `NewCheckin` — onboarding-aware redirect to reminder settings after first check-in
- [x] `HomePage` — auth-aware CTAs (`Get Started Free` vs `Go to Dashboard`)
- [x] Google OAuth: Supabase provider configured + Google Cloud Console credentials set

### UX Polish (Session 2026-04-01)
- [x] `AddEditStudent` — canvas image compression (max 800px, JPEG 82%), styled upload zone
- [x] `AddEditStudent` — error handling for reader.onerror, img.onerror, toBlob null, race condition guard
- [x] `StudentProfile` — `rankLabel()` honest Top X% / Bottom X% percentile display
- [x] `StudentProfile` — area badge colour-coded green/amber based on rank
- [x] `StudentProfile` — `vs. Age Group` label with MUI Tooltip showing age bracket name
- [x] `v2Service` — store raw percentile rank (not pre-computed "100 - rank")

---

## In Progress / Next Actions

### UX Polish (Session 2026-04-02)
- [x] `AssessmentHistory` — fix broken history page (was using old `assessmentService`; rewrote to use `v2 checkinsService`)
- [x] `AssessmentHistory` — round area averages to integers; clamp scores 0–10 in `MiniScoreChip`
- [x] `Header` — fix mobile drawer showing "New Assessment" for signed-out users → now shows "Sign In"
- [x] `HomePage` — replace grey placeholder zig-zag panels with product images (HomeHowLili01, HomeHowR02, homeHow03)
- [x] `HomePage` — add Sign In hero CTA for signed-out users (edge case 1.6 fix)
- [x] `LoginPage` — `friendlyError()` mapper for raw Supabase error strings
- [x] `LoginPage` — `inputProps maxLength=254` on email field (edge case 1.7 fix)
- [x] `StudentProfile` — fix progress bar fill gap at 10/10 (remove `borderRadius` from `motion.div`; container `overflow:hidden` clips)
- [x] `NewCheckin` + `AddAssessment` — fix slider sync: correct `calc()` fill formula, `step=1`, tick marks
- [x] Site rename: `index.html` + `manifest.json` → "Capability Tracker" (was "Reignite")
- [x] Netlify production deploy — `https://capability-tracker-app.netlify.app` (commit `56f4346`)

### Immediate (next session)
- [ ] End-to-end test: Google login → onboarding → create child → check-in → reminders → dashboard
- [ ] **Supabase dashboard:** set Site URL + Redirect URLs allowlist for production domain (`https://capability-tracker-app.netlify.app/**`) so Google OAuth doesn't redirect to localhost
- [ ] Verify RLS policies work correctly for new users (students only visible to owner)
- [ ] Test email magic link flow end-to-end
- [ ] Verify `reminder_settings` upsert stores correctly in Supabase

### Near-term
- [ ] `supabaseService.getAll()` — add `user_id` filter to only return current user's children (RLS should handle this but verify)
- [ ] Handle Supabase auth session on `AuthCallback` — redirect new users to onboarding, returning users to dashboard
- [ ] `OnboardingFlow` — wire up actual student creation (currently may use standalone form or route to `/students/new`)
- [ ] Email reminder sending (backend/edge function — scheduled, Supabase cron or external)
- [ ] Add `make ci` target (runs `npm test`) so code review bundles have real CI evidence

### Backlog
- [ ] Assessment history chart improvements
- [ ] Export / share profile (PDF or link)
- [ ] Multi-child switching in header
- [ ] Push/mobile notification reminders (post-beta)

---

## Technical Debt
- `browserslist` / `caniuse-lite` outdated — run `npx update-browserslist-db@latest`
- Backend (`backend/app.py`, `models.py`, `server.py`) has uncommitted local changes — review and clean up
- `.gitignore`, `setup_github_repo.sh`, `start_app.sh` have local modifications — audit and commit or discard
- No `make ci` target — `codex` code review reports `make ci` failure; add a target running `npm test --watchAll=false`
- Netlify auth token stored in shell history — rotate after use
