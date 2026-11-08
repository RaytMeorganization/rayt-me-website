# RaytME codebase audit — premium Business Dashboard expansion

Audit date: 7 November 2026. Scoped to the three sibling packages under this workspace.

## Stack (confirmed)

| Package | Path | Framework | Notes |
|---|---|---|---|
| Website | `rayt-me-website/` | Next.js 16 App Router, React 19, Tailwind 4 | Business dashboard is **web-only** at `/business-dashboard` |
| API | `rayt-me-backend/` | Fastify 5, Prisma, PostgreSQL | Envelope `{ success, data }` / `{ success, error }` |
| Mobile | `rayt-me-app/` | Expo SDK 57, RN 0.86, expo-router, React Query | My List is `/mobile/network` |
| Pricing | `rayt-me-shared/` | `@rayt-me/plan-pricing` | Not used by this expansion |

There is no root `package.json`. Each package is installed independently.

## Design system

- Brand tokens in `rayt-me-website/app/globals.css`: navy `#11213D`, gold `#AD8547`, sage `#2E6B4C`, cream `#FAF6EE`.
- Product chrome: `ProductShell`, `PageHeader`, `DashboardSurface`, `StatCard`, `WorkspaceTabs`.
- Light/dark landing shells exist; authenticated dashboards use the dark product chrome.
- Icons: `lucide-react`. Motion: light GSAP / `premium-motion`.

## Charts

- **Recharts `^2.15.0` is already installed** on the website (`admin-metrics-charts.tsx`).
- No other chart library. Do not add a second one.
- Recharts 2.15 supports `accessibilityLayer` on categorical Line/Bar/Area charts.

## Auth and roles

- Web: HTTP-only cookies `rayt_access` / `rayt_refresh`.
- Mobile: Bearer JWT + `x-rayt-client: mobile`.
- Business routes: `requireBusinessAdmin` then `businessMembership` (ADMIN membership on an organization).
- Employee access is company-scoped via `Membership.organizationId`.

## Reputation and ratings (existing)

- Math is **server-only** in `services/reputation-engine.ts` (`STARTING_REPUTATION = 3`, categories professionalism / communication / reliability / knowledge / collaboration).
- `Rating` already stores `sOld`, `sNew`, `r`, `categoryScores`, `relationship`, `comment`, `createdAt`, `isHidden`.
- **Historical score snapshots are reconstructable from rating events.** Do not invent earlier scores. Do not interpolate missing dates.
- Public ratings never include rater identity (`toPublicRating` / `PUBLIC_RATING_SELECT`). Org activity already hides rater names on received ratings.

## Employee / org model

- `Organization` + `Membership` + `Invitation`.
- Members expose `score`, `credibleRatingCount`, `isVerified`, `employmentStatus`, avatar, job title.
- Business overview already returns aggregate reputation (avg / min / max / verified count) and activity totals + recent ratings (capped).

## Business dashboard (existing vs missing)

| Capability | Status |
|---|---|
| Org header, logo URL, tabs (overview / org / team / brand / usage) | Exists |
| KPI cards (avg, high, low, members, verified, given/received, plan) | Exists — presentation is generic `StatCard`; no period/employee filter or previous-period comparison |
| Latest team ratings (first 12 of activity payload) | Exists |
| Full paginated ratings feed | **Missing** |
| Employee reputation detail page | **Missing** (cards link to public `/p/:id` only) |
| Historical trend / volume / comparison / category charts | **Missing** |
| Shared analytics service used by KPIs and charts | **Missing** (overview and activity compute separately) |
| Date period presets (month / previous month / year / custom) | **Missing** |

## Mobile location and My List

| Capability | Status |
|---|---|
| Save/remove contact (`POST`/`DELETE` `/mobile/network`) | Exists |
| Local name/company/role search on My List | Exists (client-side filter) |
| Community AI search | Exists (`POST /mobile/communities/search`) — **not** My List |
| `NetworkEntry` meeting city/country | **Missing** (only `ownerId`, `savedProfileId`, `savedAt`) |
| Foreground location permission | **Missing** (`expo-location` not installed; no Info.plist location strings) |
| Capture location on QR/NFC/link save | **Missing** |
| Manual meeting-location edit/remove | **Missing** |
| Location-aware My List AI search | **Missing** |

QR / NFC / link save all funnel through `useToggleSaved` → `POST /mobile/network`. Location capture belongs there plus a PATCH for later edits.

## Rating channel / geo on Rating rows

`Rating` has **no** channel (QR/NFC/link) and **no** city/country. Those fields must **not** be fabricated on the ratings feed. Meeting location lives on `NetworkEntry` only.

## Tests and performance

- Backend: Vitest (`pnpm test`), `pnpm typecheck`.
- Website: ESLint, `tsc`, Next build, Playwright e2e, some Node tests.
- App: Jest + tsc + eslint + prettier (`pnpm verify`).
- Hot-path indexes already exist on `Rating` (target/rater + createdAt) and `NetworkEntry` (owner + savedAt).
- Website fetches overview, members, invites, theme, usage, activity in parallel on dashboard load. Analytics should be a **separate** request so filters do not refetch the whole workspace.

## Conventions to keep

- No source imports across app/backend/website except `@rayt-me/plan-pricing`.
- Additive Prisma migrations only.
- Privacy enforced in API responses, not only UI.
- Foreground location only; store city/country, never lat/lng.
- Do not change reputation formulas.
