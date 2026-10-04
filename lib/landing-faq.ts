/** Public FAQ copy — shared by landing UI and JSON-LD for search engines. */
export const LANDING_FAQ_ITEMS = [
  {
    q: 'What is RaytME?',
    a: 'RaytME is a verified professional reputation platform and virtual business card. It converts real professional interactions into a credibility-weighted reputation score, shareable via QR code, NFC, link, or email signature.',
  },
  {
    q: 'How is the reputation score calculated?',
    a: 'Every rating updates your score using a weighted formula that accounts for relationship type, rating category, and how established your score already is — so a single rating on a brand-new profile moves the score more than one additional rating on a well-established profile. This keeps the score responsive early on and stable over time.',
  },
  {
    q: 'Why does RaytME not use a normal average?',
    a: 'A simple average treats every rating the same. RaytME weights honest, contextual feedback so a thoughtful rating counts more than noise.',
  },
  {
    q: 'Who can rate me?',
    a: "Anyone you've had a real professional interaction with — managers, clients, collaborators, vendors, or peers. Ratings are weighted differently depending on the nature of that relationship.",
  },
  {
    q: 'Can ratings be anonymous?',
    a: "Yes. Raters can choose to submit feedback anonymously, and profile owners control what's shown publicly versus kept private, without losing the rating's contribution to the score.",
  },
  {
    q: 'How does RaytME prevent fake or manipulated ratings?',
    a: 'A built-in anti-manipulation engine detects patterns like rating rings, brigading, or low-context raters; relationship-type weighting naturally discounts unverified or low-trust inputs; and every account has a monthly cap on ratings given, so no one can flood the system with fake positive reviews.',
  },
  {
    q: 'Is RaytME only for certain industries or regions?',
    a: 'No. RaytME is built as a global platform for any professional, in any industry, anywhere in the world.',
  },
  {
    q: 'How do I share my RaytME profile?',
    a: 'Share it however fits the moment — QR code, NFC tap, a direct link, or an embedded email signature. No app download is required for the person viewing it.',
  },
  {
    q: 'Does RaytME sell my data?',
    a: 'No. RaytME does not sell user data or rating information.',
  },
  {
    q: 'What are the five rating categories?',
    a: 'Professionalism, Communication, Reliability, Knowledge, and Collaboration — giving a fuller picture than a single star rating.',
  },
  {
    q: 'How does my list work?',
    a: "You choose who to add — it's not automatic. Add anyone you meet with one tap, whether or not you rate them. Once added, they're organized by profession along with any rating you've given and where you met, so you can search your list anytime you need to find someone specific.",
  },
  {
    q: 'Can I hide my phone number?',
    a: 'Yes. Phone numbers stay private unless you choose to share them. Your virtual card can still be shared without exposing your number.',
  },
  {
    q: 'Can I dispute a rating?',
    a: 'Yes. Rated users can flag a rating for review and respond publicly.',
  },
  {
    q: 'What is Super Voter?',
    a: 'Super Voter is an earned standing for sustained credible rating behavior. It is never purchased.',
  },
  {
    q: 'Can I use RaytME without the app?',
    a: 'You can share and view a public card on the web. Rating, snapshots, and My List are available in the RaytME app.',
  },
  {
    q: 'Can businesses use RaytME?',
    a: 'Yes. Business plans give every employee a current virtual card and a reputation layer that travels with them.',
  },
] as const
