# Rayt Me Website Agent Guide

This repository is the Next.js marketing site and privacy-safe public preview.

## Hard boundary

- `/p/:id` is card-only and read-only.
- Never add rating, professional snapshot or My List to a public web profile.
- Marketing demos are illustrative and must not write real product data.
- Fetch public profiles only from the backend preview DTO; never access a database directly.

## Engineering

- Next.js 16 App Router and Server Components by default.
- Keep `app/page.tsx` thin; product components belong under `components/rate-me`.
- Every visible string needs English and Arabic; set `lang` and `dir` together.
- Preserve the existing ink, paper and emerald visual system.
- Fix TypeScript errors rather than suppressing them.
- Run `pnpm lint` and `pnpm build`; verify visual changes in a browser.
