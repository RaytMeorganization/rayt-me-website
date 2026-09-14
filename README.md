# Rayt Me Website

The Next.js marketing website and read-only public profile preview for Rayt Me.

## Responsibilities

- Product marketing, pricing and conversion
- English and Arabic with RTL support
- SEO and structured metadata
- Public `/p/:id` business-card preview
- Web sign-in, settings, verification, business/admin workspaces (when auth flags are off)
- Privacy and terms at `/privacy` and `/terms`
- App Store and Google Play calls to action

## Product boundary

The website must **never** let visitors rate, open the professional snapshot, use My List or approximate the native application. Marketing demonstrations may illustrate these features but cannot write product data.

## Structure

```text
app/                  # App Router pages and metadata
components/rate-me/   # Rayt Me product and marketing components
components/ui/        # Shared web primitives
lib/                  # Web helpers
public/               # Local website assets
```

## Development

```bash
pnpm install   # required — fixes “Cannot find module 'next'” and Playwright types in the IDE
cp .env.example .env   # API_PROXY_TARGET=http://127.0.0.1:4000
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

Open **`Rayt-Me.code-workspace`** from the parent folder so this package’s `node_modules/typescript` is used (see `.vscode/settings.json`).

Web account CTAs are on by default. Set `NEXT_PUBLIC_WEB_SIGN_IN_DISABLED=true` or
`NEXT_PUBLIC_WEB_SIGN_UP_DISABLED=true` in `.env` for marketing-only mode.

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4 and pnpm.
