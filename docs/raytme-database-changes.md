# RaytME database changes

## Migration

`rayt-me-backend/prisma/migrations/20261108010000_network_meeting_location/migration.sql`

Additive columns on `NetworkEntry`:

- `meetingCity` TEXT NULL
- `meetingCountry` TEXT NULL
- `meetingLocationSource` TEXT NULL (`device` | `manual`)

Indexes:

- `(ownerId, meetingCountry)`
- `(ownerId, meetingCity)`

Existing rows stay null. No data is deleted. Precise coordinates are not stored.

## Reputation history

No snapshot table. `Rating` already stores `sOld`, `sNew`, `categoryScores`, `createdAt`, `isHidden`. History is reconstructed from those events. Missing dates are omitted, not invented.

## Apply

```bash
cd rayt-me-backend
pnpm db:migrate   # local
# or
pnpm migrate      # prisma migrate deploy in production
```
