const PACKS: Record<string, string> = {
  forest: '#11213D',
  ivory: '#FAF6EE',
  slate: '#6E7480',
  sand: '#F4E9D3',
  midnight: '#16233B',
  ocean: '#2E6B4C',
  plum: '#8C6B37',
  copper: '#AD8547',
  sage: '#255840',
  graphite: '#11213D',
}

export function cardThemeBarColor(theme?: string | null) {
  if (!theme) return '#11213D'
  if (/^#[0-9A-Fa-f]{6}$/.test(theme)) return theme
  try {
    const parsed = JSON.parse(theme) as { accent?: string }
    if (parsed.accent && /^#[0-9A-Fa-f]{6}$/.test(parsed.accent)) return parsed.accent
  } catch {
    /* named pack */
  }
  return PACKS[theme] ?? '#11213D'
}
