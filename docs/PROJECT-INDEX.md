# Rayt Me production index

Agent contract for the live product. If this file and the code disagree, the code wins and this file should be updated in the same change.

Three git repositories. Do not import source across them. Shared marketing prices are `@rayt-me/plan-pricing` in each repo’s `.local-packages/rayt-me-shared`.

Paths below start at `apps/…` from the `raytme main` workspace. Inside one repo, drop that `apps/rayt-me-<name>/` prefix. This file is copied into each repo’s `docs/PROJECT-INDEX.md`.

## Identity

- Brand: Rayt Me. Legal entity in `apps/rayt-me-website/lib/company.ts`: **RAYTME LLC**, Wyoming, 30 N Gould St, Ste R, Sheridan, WY 82801.
- Site: `https://raytme.me`. API: `https://api.raytme.me`. Scheme: `raytme://`. iOS bundle and Android package: `me.rate.rayt`.
- `rate.me` is still an associated domain for `/p/`. New copy uses `raytme.me` and `@raytme.me`.
- English is the controlling legal language. Published mailboxes are `privacy@`, `security@`, `legal@`, `support@`, and `info@` at `raytme.me`. Do not invent more.
- iOS does not sell subscriptions. Checkout is on the website. The app shows the same prices.

## Repositories

| Directory | Stack | GitHub |
|---|---|---|
| `apps/rayt-me-website` | Next.js 16 App Router, React, pnpm | `RaytMeorganization/rayt-me-website` |
| `apps/rayt-me-backend` | Fastify, Prisma, PostgreSQL, pnpm | `RaytMeorganization/rayt-me-backend` |
| `apps/rayt-me-app` | Expo SDK 57, Expo Router | `RaytMeorganization/rayt-me-app` |

The parent `raytme main/` folder is not a git repo. Commit inside the app directory you changed.

## Production deploy

Runners are `ubuntu-24.04`. Pushing `main` runs CI and, for website and API, deploy.

Website (`.github/workflows/deploy.yml`): rsync the repo to `/opt/rayt-me/rayt-me-website/` excluding `node_modules`, `.next`, and `.git`, then:

```bash
cd /opt/rayt-me/deploy && unset WEB_IMAGE API_IMAGE && ./remote-deploy.sh web
```

API (`.github/workflows/deploy.yml`): build and `docker load` the tag `rayt-me-api:cd` on the VPS, then `API_IMAGE=rayt-me-api:cd ./remote-deploy.sh api`. A `docker` wrapper on that SSH step skips `compose pull` and `compose build` and adds `up --pull never --no-build`. Docker Hub has no `rayt-me-api` image. `/opt/rayt-me/deploy` has no default compose file; only `remote-deploy.sh` knows which file to use.

Container entrypoint `deploy/entrypoint.sh`: `prisma migrate deploy`, then `node dist/index.js`. `NODE_ENV=production` inside the image.

`prisma/seed.ts` throws `Development seed is disabled in production`. Do not point a seed at the production database. Admin lab demo users exist only after a non-production seed.

## Environment names

Parsed in `src/config/env.ts`. Never commit values.

Required: `DATABASE_URL` (`postgresql://` or `postgres://`), `JWT_SECRET` (min 32).

Production-safe defaults: `BILLING_PROVIDER=disabled` (checkout returns 503). `REPUTATION_ENGINE_ENABLED` defaults `false`, and `POST /mobile/ratings` then returns 503. Turn the engine on only when rating writes should persist. Never set `BILLING_PROVIDER=sandbox` on production.

Optional integrations, one key each, not per user: `OPENAI_API_KEY`, `OPENAI_MODEL` default `gpt-5-mini`, `RESEND_*`, `TWILIO_*`.

Cookies: same-origin `/backend` proxy uses `Lax`. `COOKIE_SAMESITE=none` requires `COOKIE_SECURE=true`.

Website origin override: `NEXT_PUBLIC_SITE_URL`. API `WEB_APP_ORIGIN` defaults to `https://raytme.me` in production.

## Website

Browser calls `/backend/*`. `next.config.mjs` rewrites that to the API. No database client in this repo.

Routes in `app/`:

| Path | Role |
|---|---|
| `/` | Landing. Hero video stays here only |
| `/p/[id]` | Public card. No rating, no snapshot |
| `/sign-in`, `/sign-up`, `/verify`, `/settings` | Account |
| `/accept-invite` | Business invite |
| `/business-dashboard` | Org admin |
| `/admin-dashboard` | Platform admin. Reputation lab section id is `engine` |
| `/legal`, `/privacy`, `/terms`, `/acceptable-use`, `/support` | Legal |
| `/subprocessors` | Redirects to `/legal` |
| `/.well-known/apple-app-site-association` | Universal Links |

Product UI: `components/product/`. Landing: `components/rate-me/`. Legal chrome: `components/legal/`. Copy: `lib/i18n.ts`, `lib/legal-docs.ts`, `lib/legal-docs-ar.ts`. Prices: `lib/plan-pricing.ts`.

CI: `pnpm lint` (`eslint .`) then `pnpm typecheck`. Errors include `@next/next/no-img-element` and `react-hooks/set-state-in-effect`. Remote images use `next/image` with `unoptimized`. Do not call `setState` synchronously in an effect. Do not commit `next-env.d.ts`.

## Backend

`src/app.ts` is the Fastify app. `src/routes/mobile.ts` is mounted at `/mobile`. Admin plugin prefix `/admin` uses `requirePlatformAdmin` (JWT role `PLATFORM_ADMIN`). Business prefix is the org dashboard API.

Public and account:

- `GET /health`, `GET /ready`, `GET /communities/catalog`
- `POST` auth register/login, `POST /auth/refresh`, `POST /auth/logout`
- `GET|PATCH /me`, `POST /me/export`, `DELETE /me`, `GET /me/entitlements`, `PATCH /me/theme`
- Verification request/confirm
- `GET /profiles/:id/preview` (card-safe), `GET /profiles/:id/resolve`
- `POST /invitations/accept`

`/mobile` (app session; ratings also need header `x-rayt-client: mobile`):

- Profile, snapshot, phone request, network, disputes, communities, themes, push token
- `POST /mobile/ratings` — the only score write
- Billing plans and invoices. Mobile `POST /mobile/billing/checkout` stays 403. Website checkout is `POST /billing/checkout`, closed until `BILLING_PROVIDER=endpoint`. See `docs/SIGNUP-AND-BILLING.md`.

`/admin`: overview, users (`GET /users/:id` for email, rating stats, and invoices), verifications, ratings, disputes, communities, organizations, plans, payments, entitlements, audit log, health, analytics, `POST /reputation-lab/simulate`, `GET /reputation-lab/check/:userId`.

Schema: `prisma/schema.prisma`. `User.score` is `Decimal(4,2)`.

CI: `pnpm exec prisma generate`, `pnpm typecheck`, `pnpm test`.

## Rating write

`POST /mobile/ratings` body:

```ts
{
  targetUserId: string
  relationship: "worked_with" | "client" | "supplier" | "manager" | "employee" | "met_professionally" | "event_networking"
  categoryScores: {
    professionalism: number
    communication: number
    reliability: number
    knowledge: number
    collaboration: number
  } // each 1–5, step 0.5
  attributionPrivate?: boolean // default true
  comment?: string // max 150
}
```

Guards, in order: engine enabled, mobile header, not self, not blocked, comment moderation, no duplicate in 90 days (409), monthly give cap, verified rater, 10 requests per hour. The server computes `R` and the new score. Clients never send a score.

## Reputation

Implemented in `src/services/reputation-engine.ts`.

- Start `S = 3`.
- `R` = mean of the five category scores.
- `α(n) = 0.045 / √(n + 10)`.
- `W = raterCredibility × relationshipWeight`.
- `Snew = clamp(Sold + α × W × (R − Sold), 1, 5)`.

Weights: manager 1.15, client 1, employee 0.95, worked_with 0.9, supplier 0.8, met_professionally 0.55, event_networking 0.4.

Credibility is 0.3–1.5 (`credibilityFromHistory`). Fewer than 3 past ratings → 0.8. Mean ≥ 4.9 removes the non-inflation bonus, so an always-5 history stays near the floor. One incoming 5 does not move a new profile to 5.

Super Voter (`super-voter-config.ts`) is a badge, not a weight multiplier and not a paid plan. Defaults: 90-day window, at least 100 unique people, earn at credibility ≥ 1.15, suspend an existing badge below 0.70. A Super Voter colleague is `credibility × 0.90`, not a second multiplier.

Admin lab (`reputation-lab.ts`) is read-only (`writesProfile: false`). Replay matches a stored score within 0.005. Max 500 simulated ratings. Fastify `{ error: "Not Found" }` means the route is missing. `User not found` means the id is not in that database.

Demo ids from the development seed only: `lab-profile-one-five`, `lab-profile-super-colleague`, `lab-profile-event`, `lab-profile-built`. Raters: `lab-rater-always-five`, `lab-rater-super-voter`.

## Plans

From `@rayt-me/plan-pricing`. Caps in `src/services/plan-entitlements.ts`.

| Tier | Price | Ratings given / month |
|---|---|---|
| Basic | $0 | 25 |
| Pro | $27 / year | 60 |
| Business | $21 / employee / year | 50 |

Received ratings are unlimited. Themes do not change the score. Custom themes require Pro or Business.

## App

Expo Router screens under `src/app/`. Tabs: Browse, communities, My List, Settings. Rating is `rating/[id]`. Snapshot is `snapshot/[id]`. Public profile deep link is `p/[id]`.

`pnpm verify` is Jest, `tsc`, eslint, and prettier. Native modules go through `pnpm exec expo install`. NFC and camera need a dev build, not Expo Go. In-app legal URLs are the `raytme.me` pages for privacy, terms, acceptable use, and support.

EAS project owner `raytme`. Do not hand-edit `ios/` or `android/` when those folders are generated.

## Legal and landing

- `/subprocessors` stays a redirect to `/legal`. Do not publish a processor list. Do not name Vercel as a subprocessor. DNS is GoDaddy.
- Legal pages use the landing-style background. No hero video and no still frame. Legal copy sits beside the existing profile phone, not inside a new phone frame.
- The landing hero video stays on `/` only.
- Do not commit unused `public/landing/legal-skyline.jpg`.

## Commands

Website: `pnpm lint`, `pnpm typecheck`. Backend tests: `./node_modules/.bin/vitest` from that repo (`pnpm exec vitest` fails at a parent that is not a package). App: `pnpm verify`.

Do not commit `.env`. Do not force-push `main`. Do not run the development seed against production.
