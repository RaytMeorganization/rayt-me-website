# Rayt Me Website

The Next.js marketing website and read-only public profile preview for Rayt Me.

## Responsibilities

- Product marketing, pricing and conversion
- English and Arabic with RTL support
- SEO and structured metadata
- Public `/p/:id` business-card preview
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
pnpm install
pnpm dev
pnpm lint
pnpm build
```

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4 and pnpm.
