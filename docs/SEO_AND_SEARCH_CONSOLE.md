# SEO & Google Search Console (raytme.me)

## What the site already ships

- `app/robots.ts` — allows `/`, blocks private dashboards; points to sitemap
- `app/sitemap.ts` — home, legal pages, demo profile, sign-in/up when enabled
- `app/layout.tsx` — titles, Open Graph, Twitter, canonical, optional **Google site verification** meta
- `components/seo/root-json-ld.tsx` — JSON-LD: `WebSite`, `Organization`, `WebPage`, `SoftwareApplication`, `FAQPage` (matches public FAQ on the landing page)
- Landing FAQ copy: `lib/landing-faq.ts` (single source for UI + structured data)

## Google Search Console (one-time, after deploy)

1. Open [Google Search Console](https://search.google.com/search-console) → **Add property** → `https://raytme.me`
2. Choose **HTML tag** verification → copy only the **content** value (not the whole `<meta>` tag)
3. On the server, set env (no `next.config` change):
   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=paste_token_here
   ```
4. Redeploy, click **Verify** in Search Console
5. **Sitemaps** → submit: `https://raytme.me/sitemap.xml`
6. **URL inspection** → request indexing for `https://raytme.me/`

Full strategy map: [SEO_STRATEGY_STARTER_GUIDE.md](./SEO_STRATEGY_STARTER_GUIDE.md).

## Realistic expectations

Technical SEO (meta tags, JSON-LD, sitemap) helps Google **understand** the site. It does **not** guarantee rankings or traffic within a fixed number of days. Position and clicks depend on competition, backlinks, content freshness, and how often Google crawls your domain. There is no legitimate “SEO div” that replaces ads and still promises traffic with zero investment.

After verification, watch **Performance** and **Indexing** in Search Console — that is the source of truth for organic impressions and clicks.

## App / store alignment (landing copy)

- Pro and Business are sold on **raytme.me**; mobile apps do not use in-app purchase for membership (`rayt-me-app/docs/IOS_WEB_ONLY_MEMBERSHIP.md`). Landing and JSON-LD `Offer` text reflects free app download + web membership.
