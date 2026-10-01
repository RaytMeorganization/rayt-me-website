import { arabicCopy } from '@/components/rate-me/landing-copy'
import { dictionaries } from '@/lib/i18n'
import { LEGAL_DOCUMENTS, type LegalBlock } from '@/lib/legal-docs'

export type BotLocale = 'en' | 'ar'

export type BotPassage = {
  locale: BotLocale
  href: string
  text: string
  rule: boolean
}

export type BotAnswer = {
  text: string
  href: string
}

const RULES: BotPassage[] = [
  {
    locale: 'en',
    href: '/',
    rule: true,
    text: 'Every profile score starts at 3. A single 5-star rating does not make the score 5. One rating of 5 only nudges the score a little.',
  },
  {
    locale: 'ar',
    href: '/',
    rule: true,
    text: 'تبدأ درجة كل ملف من 3. تقييم واحد بخمس نجوم لا يجعل الدرجة 5. التقييم الواحد يحرّك الدرجة قليلاً فقط.',
  },
  {
    locale: 'en',
    href: '/',
    rule: true,
    text: 'Super Voter is a badge. It is not a 1.5 times weight multiplier and it does not multiply rating weight.',
  },
  {
    locale: 'ar',
    href: '/',
    rule: true,
    text: 'Super Voter شارة فقط. ليست مضاعف وزن 1.5 ولا تضاعف وزن التقييم.',
  },
  {
    locale: 'en',
    href: '/',
    rule: true,
    text: 'Pro price: Pro costs $27 per year. Basic costs $0. Business costs $21 per employee per year. The iOS app does not sell these plans.',
  },
  {
    locale: 'ar',
    href: '/',
    rule: true,
    text: 'سعر Pro هو 27 دولاراً في السنة. Basic مجاني بسعر 0. Business سعره 21 دولاراً لكل موظف في السنة. تطبيق iOS لا يبيع هذه الخطط.',
  },
  {
    locale: 'en',
    href: '/',
    rule: true,
    text: 'Communities require a Pro or Business plan. Basic accounts cannot open profession communities.',
  },
  {
    locale: 'ar',
    href: '/',
    rule: true,
    text: 'المجتمعات تتطلب خطة Pro أو Business. حساب Basic لا يفتح مجتمعات المهن.',
  },
]

const FALLBACK: Record<BotLocale, BotAnswer> = {
  en: {
    text: 'I can only answer from what is published on this site.',
    href: '/support',
  },
  ar: {
    text: 'أجيب فقط مما هو منشور على هذا الموقع.',
    href: '/support',
  },
}

function hrefForKey(key: string) {
  if (key.startsWith('legalAcceptable')) return '/acceptable-use'
  if (/terms/i.test(key)) return '/terms'
  if (key.startsWith('legal')) return '/privacy'
  if (key.toLowerCase().includes('support')) return '/support'
  return '/'
}

function passagesFromBlocks(blocks: LegalBlock[], locale: BotLocale, href: string): BotPassage[] {
  let heading = ''
  const passages: BotPassage[] = []
  for (const block of blocks) {
    if (block.type === 'h') {
      heading = block.text
      continue
    }
    const body =
      block.type === 'p'
        ? block.text
        : block.type === 'ul'
          ? block.items.join(' ')
          : block.rows.map((row) => row.join(' ')).join(' ')
    const text = heading ? `${heading}. ${body}` : body
    if (text.trim().length >= 40) passages.push({ locale, href, text, rule: false })
  }
  return passages
}

function dictionaryPassages(locale: BotLocale): BotPassage[] {
  const entries = Object.entries(dictionaries[locale])
  return entries.flatMap(([key, value]) => {
    if (typeof value !== 'string' || value.trim().length < 40) return []
    return [{ locale, href: hrefForKey(key), text: value, rule: false }]
  })
}

function landingPassages(): BotPassage[] {
  return Object.entries(arabicCopy).flatMap(([english, arabic]) => {
    const passages: BotPassage[] = []
    if (english.trim().length >= 40) {
      passages.push({ locale: 'en', href: '/', text: english, rule: false })
    }
    if (arabic.trim().length >= 40) {
      passages.push({ locale: 'ar', href: '/', text: arabic, rule: false })
    }
    return passages
  })
}

export function raytmeBotCorpus(): BotPassage[] {
  const legal = LEGAL_DOCUMENTS.flatMap((doc) => [
    ...passagesFromBlocks(doc.blocks, 'en', `/${doc.slug}`),
    ...passagesFromBlocks(doc.blocksAr, 'ar', `/${doc.slug}`),
  ])
  return [...RULES, ...legal, ...dictionaryPassages('en'), ...dictionaryPassages('ar'), ...landingPassages()].filter(
    (passage) => !/vercel/i.test(passage.text),
  )
}

const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'you',
  'your',
  'does',
  'what',
  'how',
  'are',
  'this',
  'that',
  'with',
  'from',
  'can',
  'not',
])

function tokens(value: string) {
  const raw = value.toLowerCase().match(/[a-z0-9$]+|[\u0600-\u06FF]+/g) ?? []
  return raw.filter(
    (token) =>
      !STOPWORDS.has(token) &&
      (token.length >= 3 || /\d/.test(token) || (/[\u0600-\u06FF]/.test(token) && token.length >= 2)),
  )
}

function trimPassage(text: string, asked: Set<string>) {
  const parts = text.split(/(?<=[.!?؟])\s+/).filter(Boolean)
  const ranked = parts
    .map((part, index) => ({
      index,
      hits: new Set(tokens(part).filter((token) => asked.has(token))).size,
    }))
    .sort((left, right) => right.hits - left.hits || left.index - right.index)
  const chosen = new Set(ranked.filter((row) => row.hits > 0).slice(0, 3).map((row) => row.index))
  if (!chosen.size) chosen.add(0)
  return parts.filter((_, index) => chosen.has(index)).join(' ')
}

export function answerRaytmeBot(question: string, locale: BotLocale): BotAnswer {
  const asked = tokens(question)
  if (!asked.length) return FALLBACK[locale]
  const askedSet = new Set(asked)
  let best: { passage: BotPassage; score: number } | null = null
  for (const passage of raytmeBotCorpus()) {
    if (passage.locale !== locale) continue
    const overlap = tokens(passage.text).filter((token) => askedSet.has(token))
    const unique = new Set(overlap)
    if (!unique.size) continue
    const recall = unique.size / askedSet.size
    const score = recall + (passage.rule ? 1.5 : 0)
    if (!best || score > best.score) best = { passage, score }
  }
  if (!best || best.score < 0.45) return FALLBACK[locale]
  return { text: trimPassage(best.passage.text, askedSet), href: best.passage.href }
}
