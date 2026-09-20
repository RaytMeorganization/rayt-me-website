'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { useI18n } from '@/components/product/providers'
import { inputClass } from '@/components/product/shell'
import {
  cardThemeSurface,
  packVisual,
  parseCustomTheme,
  themePackLabel,
  type CustomThemeColors,
  type ThemeCatalogItem,
} from '@/lib/card-theme'

export type ThemeEntitlements = {
  activeTheme: string | null
  themes: string[]
  catalog?: ThemeCatalogItem[]
  rotatingUntil?: string | null
  customTheme: boolean
  companyBrand: { logoUrl: string | null; brandColor: string | null; name?: string | null } | null
}

export function ThemeStudioPanel({
  entitlements,
  busy,
  onSavePack,
  onSaveCustom,
  onApplyCompany,
  onSuggest,
}: {
  entitlements: ThemeEntitlements
  busy?: boolean
  onSavePack: (key: string) => void
  onSaveCustom: (custom: CustomThemeColors) => void
  onApplyCompany: () => void
  onSuggest: (mood: string) => Promise<{ background: string; accent: string; label: string; suggestions?: CustomThemeColors[] } | null>
}) {
  const { t, locale } = useI18n()
  const saved = parseCustomTheme(entitlements.activeTheme)
  const [custom, setCustom] = useState<CustomThemeColors>(
    saved ?? { background: '#FAF6EE', accent: '#11213D' },
  )
  const [mood, setMood] = useState('')
  const [suggestions, setSuggestions] = useState<{ background: string; accent: string; label?: string }[]>([])
  const [suggesting, setSuggesting] = useState(false)
  const catalog = entitlements.catalog
  const preview = cardThemeSurface(
    JSON.stringify({ type: 'custom', ...custom }),
    catalog,
  )

  const packs = useMemo(() => entitlements.themes, [entitlements.themes])

  return (
    <div className="grid gap-5">
      <div
        className="overflow-hidden rounded-[24px] border border-white/10 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)]"
        style={{ background: preview.background, color: preview.light ? '#11213D' : '#FFFFFF' }}
      >
        <div className="h-[3px]" style={{ backgroundColor: preview.accent }} />
        <div className="flex items-center justify-between gap-3 px-5 py-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-current/60">{t('publicPreview')}</p>
            <p className="mt-2 font-serif text-2xl font-semibold tracking-tight">{custom.name || t('customTheme')}</p>
          </div>
          {custom.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={custom.logoUrl} alt="" className="size-12 rounded-xl object-contain" />
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {packs.map(pack => {
          const visual = packVisual(pack, catalog)
          const selected = entitlements.activeTheme === pack
          return (
            <button
              key={pack}
              type="button"
              disabled={busy}
              onClick={() => onSavePack(pack)}
              className="overflow-hidden rounded-2xl border text-start transition hover:border-white/30"
              style={{
                background: visual.background,
                borderColor: selected ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                borderWidth: selected ? 2 : 1,
              }}
            >
              <span className="block h-1" style={{ backgroundColor: visual.accent }} />
              <span
                className="block px-3 py-3 text-sm font-semibold"
                style={{ color: visual.light ? '#11213D' : '#FFFFFF' }}
              >
                {themePackLabel(pack, catalog, locale)}
              </span>
            </button>
          )
        })}
      </div>
      {catalog?.some(item => item.rotating) ? (
        <p className="text-sm text-muted-foreground">{t('rotatingThemesHint')}</p>
      ) : null}

      {entitlements.companyBrand ? (
        <div className="rounded-2xl border border-white/10 bg-muted/20 p-4" style={{ borderInlineStart: `4px solid ${entitlements.companyBrand.brandColor || '#AD8547'}` }}>
          <p className="text-sm font-semibold text-foreground">{t('brandedTheme')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('companyBrandBody')}</p>
          <Button className="mt-3" variant="outline" disabled={busy} onClick={onApplyCompany}>
            {t('applyCompanyBrandedTheme')}
          </Button>
        </div>
      ) : null}

      {entitlements.customTheme ? (
        <div className="grid gap-4">
          <div className="grid gap-3">
            <p className="text-sm font-semibold text-foreground">{t('submitOwnTheme')}</p>
            <p className="text-sm text-muted-foreground">{t('submitOwnThemeBody')}</p>
            <Field>
              <FieldLabel>{t('themeName')}</FieldLabel>
              <Input
                className="bg-input/30"
                value={custom.name ?? ''}
                onChange={event => setCustom(current => ({ ...current, name: event.target.value }))}
                placeholder={t('themeNamePlaceholder')}
              />
            </Field>
            <Field>
              <FieldLabel>{t('themeLogoUrl')}</FieldLabel>
              <Input
                type="url"
                className="bg-input/30"
                value={custom.logoUrl ?? ''}
                onChange={event => setCustom(current => ({ ...current, logoUrl: event.target.value }))}
                placeholder="https://"
              />
              <p className="text-xs text-muted-foreground">{t('themeLogoUrlHint')}</p>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2 text-sm">
                {t('appearance')}
                <input
                  aria-label={`${t('customTheme')} ${t('appearance')}`}
                  type="color"
                  className="h-11 w-full rounded-lg border border-white/10 bg-transparent"
                  value={custom.background}
                  onChange={event => setCustom(current => ({ ...current, background: event.target.value }))}
                />
              </label>
              <label className="grid gap-2 text-sm">
                {t('brandColor')}
                <input
                  aria-label={`${t('customTheme')} ${t('brandColor')}`}
                  type="color"
                  className="h-11 w-full rounded-lg border border-white/10 bg-transparent"
                  value={custom.accent}
                  onChange={event => setCustom(current => ({ ...current, accent: event.target.value }))}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-semibold text-foreground">{t('aiThemeAssistant')}</p>
            <p className="text-sm text-muted-foreground">{t('aiThemeAssistantBody')}</p>
            <textarea
              className={`${inputClass} min-h-24 py-3`}
              value={mood}
              onChange={event => setMood(event.target.value)}
              placeholder={t('themeMoodPlaceholder')}
            />
            <Button
              variant="outline"
              disabled={busy || suggesting || mood.trim().length < 3}
              onClick={() => {
                setSuggesting(true)
                void onSuggest(mood)
                  .then(result => {
                    if (!result) return
                    setCustom(current => ({
                      ...current,
                      background: result.background,
                      accent: result.accent,
                      name: result.label,
                    }))
                    setSuggestions(result.suggestions ?? [result])
                  })
                  .finally(() => setSuggesting(false))
              }}
            >
              {suggesting ? t('suggestingColors') : t('suggestColors')}
            </Button>
            {suggestions.length ? (
              <div className="grid gap-2 sm:grid-cols-3">
                {suggestions.map(item => (
                  <button
                    key={`${item.label}-${item.background}`}
                    type="button"
                    className="overflow-hidden rounded-xl border border-white/10 text-start"
                    style={{ background: item.background }}
                    onClick={() =>
                      setCustom(current => ({
                        ...current,
                        background: item.background,
                        accent: item.accent,
                        name: item.label,
                      }))
                    }
                  >
                    <span className="block h-1" style={{ backgroundColor: item.accent }} />
                    <span className="block px-3 py-2 text-xs font-semibold text-white">{item.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Button disabled={busy} onClick={() => onSaveCustom(custom)}>
            {t('applyCustomTheme')}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t('customThemeLocked')}</p>
      )}
    </div>
  )
}
