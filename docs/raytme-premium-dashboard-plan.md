# Premium Business Dashboard — implementation plan

## Chart library

Use **Recharts 2.15** already on the website. Line + area for reputation history, grouped bars for period comparison and category averages, bars for rating volume. `isAnimationActive={false}`, `accessibilityLayer` where supported, tabular fallback under each chart.

## Data truth

| Metric | Source | Notes |
|---|---|---|
| Current team / employee reputation | `User.score` snapshot | Existing formula; do not recompute on the client |
| Historical reputation points | `Rating.sNew` + `createdAt` for **received** ratings | One point per stored rating. No interpolation. Starting point = first `sOld` or `STARTING_REPUTATION` (3) |
| Period reputation comparison | Last `sNew` per member **inside** each window | `null` / unavailable when a window has no ratings |
| Ratings given / received | `Rating` event counts (`isHidden = false`) | Distinct from snapshot scores |
| Category breakdown | `Rating.categoryScores` in the selected window | Only the five stored categories |
| Meeting location | `NetworkEntry.meetingCity` / `meetingCountry` | Not profile residence |

Timezone: UTC calendar boundaries (documented on the API). Qatar is UTC+3; custom ranges accept ISO timestamps.

## Backend

New service `business-analytics.ts` is the single calculator for KPIs, trend, volume, comparison, and category averages.

| Method | Path | Purpose |
|---|---|---|
| GET | `/business/analytics` | Period + optional `employeeId`. Returns snapshot KPIs, period counts, previous-period comparison, trend observations, volume buckets, category averages |
| GET | `/business/employees/:userId/reputation` | Header metrics + observation history for one member |
| GET | `/business/employees/:userId/ratings` | Paginated received ratings for that member |
| GET | `/business/ratings` | Paginated team ratings (received/given/all) |
| PATCH | `/mobile/network/:profileId` | Set/clear meeting location |
| POST | `/mobile/network` | Optional meeting fields on save |
| POST | `/mobile/network/search` | Location-aware My List search (owner-scoped) |

Existing `/business/overview` and `/business/activity` remain for roster/plan/recent-12 compatibility.

## Frontend (website)

1. Overview: premium KPI row (six requested metrics + preserved secondary cards), filter bar, four charts, recent-12 with “View all ratings”.
2. `/business-dashboard/employees/[id]` — employee reputation detail.
3. `/business-dashboard/ratings` — full feed with filters and pagination.
4. Employee cards gain a reputation-history action; public card link stays.

Filters live in the URL (`period`, `from`, `to`, `employeeId`) with abort/stale-response protection.

## Mobile

1. `expo-location` foreground-only; explain then request after signup (after push consent).
2. On My List save (QR, NFC, or link all use `useToggleSaved`), capture city/country if permission already granted.
3. My List: show, edit, remove meeting location; save without location is valid.
4. Natural-language search hits `/mobile/network/search`; local substring search remains for short queries.

## Schema

Additive on `NetworkEntry` only: `meetingCity`, `meetingCountry`, `meetingLocationSource` (`device` | `manual`). No historical score snapshot table — ratings already audit `sOld`/`sNew`.

## Privacy

- Received ratings never include rater identity.
- Given ratings may name the member rater and the target.
- Analytics and employee routes require business admin + org membership of the employee.
- My List search returns only the caller’s saved contacts.
- Location consent is optional; denial still allows saving.

## Out of scope / honest omissions

- Rating **channel** (QR/NFC/link) is not stored on `Rating` — omitted from the ratings table.
- Rating **geo** is not stored on `Rating` — omitted.
- Verified-member count has no history — no previous-period comparison.
- Pre-expansion contacts have null meeting location until the user sets one.
