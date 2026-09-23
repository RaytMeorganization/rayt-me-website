# @rayt-me/plan-pricing

Single source for **Basic / Pro / Business** marketing prices (`$27/yr` Pro, `$21/employee/yr` Business).

Consumers (sibling repos under `Rayt-Me/`):

- `rayt-me-website` — landing + admin pricing display
- `rayt-me-backend` — seed `Plan` rows
- `rayt-me-app` — Plans & Pricing screen

```bash
cd rayt-me-shared && pnpm install && pnpm build
```

**Expo / Metro:** resolves `react-native` → `src/index.native.ts` (no `dist` required).  
**Next / Node:** use `dist/` — run `pnpm build` after price changes (`dist` is gitignored; pnpm `file:` installs omit it).

After changing prices, rebuild this package and run tests in each consumer repo.
