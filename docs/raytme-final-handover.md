# RaytME handover — premium Business Dashboard expansion

## What shipped

### 1. Employee reputation history
- Reconstructs score history from stored `Rating.sOld` / `sNew` (no fabricated snapshots).
- Page: `/business-dashboard/employees/[id]`
- API: `GET /business/employees/:userId/reputation` and `.../ratings`

### 2. Complete ratings management
- Paginated team feed: `/business-dashboard/ratings`
- Recent-12 widget on overview is preserved, with “View all ratings”
- Received ratings never include external rater identity

### 3. Advanced analytics
- `GET /business/analytics` is the single calculator for KPIs and charts
- Periods: current month, previous month, current year, custom (UTC)
- Employee filter + team scope
- Period reputation uses last stored `sNew` in the window, or unavailable — never interpolated

### 4. Premium dashboard UI
- Filter bar, six primary KPI cards, Recharts 2.15 charts (trend, comparison split by unit, volume, categories)
- Existing secondary cards kept: average incoming rating, members/seats, pending invites, plan
- Employee roster search + reputation history action

### 5. Mobile meeting location
- Additive `NetworkEntry` city/country/source
- Foreground permission after signup (chained after push consent)
- Capture on My List save (QR / NFC / link all use `useToggleSaved`) when permission is already granted
- Manual edit and remove on My List

### 6. Location-aware My List search
- `POST /mobile/network/search` — heuristic profession + GCC aliases; optional OpenAI for long ambiguous queries
- Results restricted to the caller’s saved contacts

## Charts

- ReputationTrendChart / EmployeeScoreHistoryChart (line + area, linear, no interpolated dates)
- PeriodComparisonChart (grouped bars; reputation and counts on separate charts)
- RatingVolumeChart
- CategoryBreakdownChart (five stored categories only)

## Database

See `docs/raytme-database-changes.md`. Apply `20261108010000_network_meeting_location`.

## Deploy

1. `cd rayt-me-backend && pnpm migrate && pnpm build`
2. `cd rayt-me-website && pnpm build`
3. `cd rayt-me-app && pnpm install` (picks up `expo-location`) then a **new native build** so Info.plist / Android location permission land. JS-only OTA is not enough for the permission plugin.
4. Do not enable background location.

## Honest limitations

- Rating **channel** (QR/NFC/link) and rating **geo** are not on `Rating` — omitted from the feed.
- Verified-member count has no history — no previous-period comparison.
- Existing My List rows have null meeting location until the user saves/edits.
- `expo-location` is in `package.json` but was not installed in this environment.
- Dashboard responsive layouts were not exercised in a browser this session.
- Full backend Vitest suite and website production build were not run this session.

## Files (primary)

Backend: `prisma/schema.prisma`, `prisma/migrations/20261108010000_network_meeting_location/`, `src/services/business-analytics.ts`, `src/services/network-meeting-location.ts`, `src/services/my-list-search.ts`, `src/app.ts`, `src/routes/mobile.ts`, `src/services/openai-runtime.ts`, tests.

Website: `components/product/analytics/*`, `components/product/business-dashboard.tsx`, `workspace-member-card.tsx`, `app/business-dashboard/employees/[id]/page.tsx`, `app/business-dashboard/ratings/page.tsx`, `lib/types.ts`, `lib/i18n.ts`.

App: `app.json`, `package.json`, `src/features/location/*`, `src/features/profile/use-toggle-saved.ts`, `src/app/(auth)/register.tsx`, `src/app/(tabs)/my-list.tsx`, `src/api/types.ts`, `src/features/locale/locale-copy.ts`.
