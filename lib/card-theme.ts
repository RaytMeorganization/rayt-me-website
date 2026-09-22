export type ThemeCatalogItem = {
  key: string
  background: string
  accent: string
  light: boolean
  labelEn: string
  labelAr: string
  rotating?: boolean
}

export type CustomThemeColors = {
  background: string
  accent: string
  logoUrl?: string | null
  name?: string | null
  type?: 'custom' | 'company'
}

const PACKS: Record<string, { background: string; accent: string; light: boolean }> = {
  forest: { background: '#11213D', accent: '#2E6B4C', light: false },
  ivory: { background: '#FAF6EE', accent: '#11213D', light: true },
  slate: { background: '#2C3138', accent: '#8A9099', light: false },
  sand: { background: '#F4E9D3', accent: '#8C6B37', light: true },
  midnight: { background: '#16233B', accent: '#C4A574', light: false },
  ocean: { background: '#082C3D', accent: '#2EB8C9', light: false },
  plum: { background: '#2A1524', accent: '#C47AA0', light: false },
  copper: { background: '#1A1612', accent: '#AD8547', light: false },
  sage: { background: '#14241C', accent: '#255840', light: false },
  graphite: { background: '#1B1D22', accent: '#9AA3AE', light: false },
  dune: { background: '#3A2E22', accent: '#C4A574', light: false },
  pearl: { background: '#F7F4EE', accent: '#6E7480', light: true },
  ember: { background: '#2A1814', accent: '#B85C38', light: false },
  tide: { background: '#102430', accent: '#3D7A8C', light: false },
}

export function parseCustomTheme(theme?: string | null): CustomThemeColors | null {
  if (!theme) return null
  try {
    const parsed = JSON.parse(theme) as CustomThemeColors
    if (
      parsed.background &&
      parsed.accent &&
      /^#[0-9A-Fa-f]{6}$/.test(parsed.background) &&
      /^#[0-9A-Fa-f]{6}$/.test(parsed.accent)
    ) {
      return {
        background: parsed.background,
        accent: parsed.accent,
        logoUrl: typeof parsed.logoUrl === 'string' ? parsed.logoUrl : null,
        name: typeof parsed.name === 'string' ? parsed.name : null,
        type: parsed.type === 'company' ? 'company' : 'custom',
      }
    }
  } catch {
    /* named pack */
  }
  return null
}

export function packVisual(pack: string, catalog?: ThemeCatalogItem[]) {
  const item = catalog?.find(entry => entry.key === pack)
  if (item) return { background: item.background, accent: item.accent, light: item.light }
  return PACKS[pack] ?? PACKS.forest
}

export function cardThemeBarColor(theme?: string | null) {
  if (!theme) return '#11213D'
  if (/^#[0-9A-Fa-f]{6}$/.test(theme)) return theme
  const custom = parseCustomTheme(theme)
  if (custom) return custom.accent
  return PACKS[theme]?.accent ?? '#11213D'
}

function hexIsLight(hex: string) {
  const raw = hex.replace('#', '')
  const r = parseInt(raw.slice(0, 2), 16) / 255
  const g = parseInt(raw.slice(2, 4), 16) / 255
  const b = parseInt(raw.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.62
}

export function cardThemeSurface(theme?: string | null, catalog?: ThemeCatalogItem[]) {
  const custom = parseCustomTheme(theme)
  if (custom) {
    return {
      background: custom.background,
      accent: custom.accent,
      light: hexIsLight(custom.background),
      logoUrl: custom.logoUrl ?? null,
      name: custom.name,
    }
  }
  if (theme && PACKS[theme]) {
    const pack = packVisual(theme, catalog)
    return { ...pack, logoUrl: null as string | null, name: theme }
  }
  if (theme && catalog?.some(item => item.key === theme)) {
    const pack = packVisual(theme, catalog)
    return { ...pack, logoUrl: null as string | null, name: theme }
  }
  const pack = PACKS.forest
  return { ...pack, logoUrl: null as string | null, name: 'forest' }
}

export function themePackLabel(pack: string, catalog: ThemeCatalogItem[] | undefined, locale: 'en' | 'ar') {
  const item = catalog?.find(entry => entry.key === pack)
  if (item) return locale === 'ar' ? item.labelAr : item.labelEn
  return pack.charAt(0).toUpperCase() + pack.slice(1)
}
