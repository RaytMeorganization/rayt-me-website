# SEO strategy (Google Starter Guide alignment)

Based on [Google’s SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). **Landing page marketing copy is unchanged**; improvements are technical (metadata, crawl, structured data).

## Realistic timeline (from Google)

> “Some changes might take effect in a few hours, others could take several months… wait a few weeks to assess… **there's no guarantee** that any particular site will be added to Google's index.”

**Ranking the homepage in ~2 days is not something technical SEO can promise.** What we optimize for is: **crawl → index → correct title/snippet/FAQ rich results** after you verify Search Console and request indexing.

## What we implemented (starter guide → code)

| Starter guide topic | Implementation |
| --- | --- |
| Help Google find content | `app/sitemap.ts`, `app/robots.ts`, canonical URLs |
| Sitemap submit | Manual step in Search Console (`/sitemap.xml`) |
| Canonical / duplicate URLs | `buildHomePageMetadata()`, `buildPublicPageMetadata()`, `metadataBase` |
| Title links & snippets | Unique `title` + `description` per public route |
| Structured data | `RootJsonLd`: WebSite, Organization, WebPage, SoftwareApplication, FAQPage (`lib/landing-faq.ts`) |
| Breadcrumbs | `BreadcrumbJsonLd` on `/privacy`, `/terms` |
| Site identity | `app/manifest.ts`, favicons in `app/layout.tsx` |
| Social previews | Open Graph + Twitter images (`/icon.svg`) |
| Block private app areas | `robots.txt` disallows settings, dashboards, invite tokens |
| Monitor | Search Console + optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` |

## Your launch checklist (required for “working” SEO)

1. Deploy `main` with this code.
2. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → verify property in Search Console.
3. Submit `https://raytme.me/sitemap.xml`.
4. URL Inspection → `https://raytme.me/` → **Request indexing**.
5. After 48–72h, check `site:raytme.me` and GSC **Pages** / **Performance**.

## What still drives rankings (not changed here)

Google: **helpful, unique, people-first content** and **links from other sites**. That is already on the landing page; we did not rewrite it per your request. Long-term growth = content + backlinks + GSC monitoring—not meta tags alone.

See also: [SEO_AND_SEARCH_CONSOLE.md](./SEO_AND_SEARCH_CONSOLE.md).
