# RaytME API changes — Business analytics and meeting location

Envelope is unchanged: `{ success: true, data }` | `{ success: false, error }`.

## Business (cookie or Bearer, `BUSINESS_ADMIN` + org admin membership)

| Method | Path | Notes |
|---|---|---|
| GET | `/business/analytics` | Query: `period=current_month\|previous_month\|current_year\|custom`, optional `from`, `to` (ISO or `YYYY-MM-DD`), optional `employeeId`. UTC windows. Snapshot KPIs from `User.score`; period counts and trend from `Rating` events. No interpolated dates. |
| GET | `/business/employees/:userId/reputation` | Member-scoped. Starting score = first `sOld` or 3. History = stored `sNew` observations. 404 if not in org. |
| GET | `/business/employees/:userId/ratings` | Paginated **received** ratings. Query: `from`, `to`, `cursor`, `limit` (1–50). External rater identity omitted. |
| GET | `/business/ratings` | Team feed. Query: `employeeId`, `from`, `to`, `direction=received\|given\|all`, `cursor`, `limit`. Received rows never include `rater`. |

Existing `/business/overview` and `/business/activity` (recent ratings, first 12 on the UI) are unchanged.

## Mobile

| Method | Path | Notes |
|---|---|---|
| GET | `/mobile/network` | Adds `meetingCity`, `meetingCountry`, `meetingLocationSource` (nullable). |
| POST | `/mobile/network` | Optional meeting fields on **create**. Existing saves are not overwritten. |
| PATCH | `/mobile/network/:profileId` | Owner-only. Set or clear meeting city/country (`null` clears). Source becomes `manual`. |
| POST | `/mobile/network/search` | Body `{ query }`. Heuristic (and optional OpenAI) profession + location filters. Results are the caller’s saved contacts only. |

## Privacy

- Received business ratings: `toPublicRating` whitelist + attribution title. No `rater` / `raterUserId`.
- Meeting location is My List metadata, not profile residence, and is never written to QR/NFC payloads.
- Location APIs store city/country strings only.
