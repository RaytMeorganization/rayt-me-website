import type { Metadata } from 'next'
import { COMPANY, STORE_URLS } from '@/lib/company'
import {
  acceptableUseAr,
  privacyNoticeAr,
  termsOfServiceAr,
} from '@/lib/legal-docs-ar'

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }

export type LegalDocument = {
  slug: string
  title: string
  titleAr: string
  lastUpdated: string
  lastUpdatedAr: string
  description: string
  descriptionAr: string
  canonical: string
  blocks: LegalBlock[]
  blocksAr: LegalBlock[]
}

export function legalMetadata(doc: Pick<LegalDocument, 'title' | 'description' | 'canonical'>): Metadata {
  return {
    title: `${doc.title} — ${COMPANY.brand}`,
    description: doc.description,
    alternates: { canonical: doc.canonical },
    openGraph: {
      title: `${doc.title} — ${COMPANY.brand}`,
      description: doc.description,
      url: doc.canonical,
      siteName: COMPANY.brand,
      type: 'website',
    },
  }
}

const LAST_UPDATED = 'September 28, 2026'
const LAST_UPDATED_AR = '٢٨ سبتمبر ٢٠٢٦'

export const privacyNotice: LegalDocument = {
  slug: 'privacy',
  title: 'Privacy Notice',
  titleAr: 'إشعار الخصوصية',
  lastUpdated: LAST_UPDATED,
  lastUpdatedAr: LAST_UPDATED_AR,
  description: 'How RAYTME LLC collects, uses, and shares personal data for the RaytME website, API, and mobile apps.',
  descriptionAr: 'كيف تجمع شركة RAYTME LLC البيانات الشخصية وتستخدمها وتشاركها لموقع RaytME وتطبيقاته.',
  canonical: STORE_URLS.privacy,
  blocks: [
    {
      type: 'p',
      text: `This Privacy Notice describes how ${COMPANY.displayName}, a ${COMPANY.entityType} ("RaytME," "we," "us," or "our"), collects, uses, and shares personal data when you use the RaytME website, mobile application, and related services (together, the "Platform").`,
    },
    { type: 'h', text: '1. Who we are' },
    {
      type: 'p',
      text: `${COMPANY.displayName} provides a verified professional reputation profile and digital business card. The legal entity responsible for this processing is ${COMPANY.legalName}, ${COMPANY.address}. Privacy requests: ${COMPANY.emails.privacy}. Security reports: ${COMPANY.emails.security}. General inquiries: ${COMPANY.emails.info}.`,
    },
    { type: 'h', text: '2. Data we process' },
    {
      type: 'p',
      text: 'We process the professional identity details you provide (name, account type, role, organisation or university, city, country), contact channels used for verification (personal email, work or university email, phone), credentials and verification status, credibility-weighted ratings and optional comments, saved profiles (My List), phone access requests, sessions, push tokens when you enable alerts, billing records when you purchase a plan, and security audit events. Private contacts are never embedded in QR or NFC payloads.',
    },
    {
      type: 'p',
      text: 'If you have been rated but have not created an account, a limited profile reflecting your aggregate score may exist. You may claim that profile or request removal as described in Section 9.',
    },
    { type: 'h', text: '3. How we use data' },
    {
      type: 'p',
      text: 'We use this data to operate your account, verify identity, compute reputation on the server, show the public card preview you choose to publish, send verification and transactional messages, moderate safety reports, process paid plans, and provide features you switch on (notifications, AI drafting). We do not sell personal data or rating information, and we do not share personal information for cross-context behavioral advertising.',
    },
    { type: 'h', text: '4. Processors we use' },
    {
      type: 'p',
      text: `We share the minimum data needed with the hosting, database, and notification providers that operate the Platform. Optional AI drafting is sent to OpenAI only after you consent in the app. Each provider is required to protect that data under their terms with us. For questions, contact ${COMPANY.emails.privacy}.`,
    },
    { type: 'h', text: '5. Artificial intelligence' },
    {
      type: 'p',
      text: 'AI drafting is optional. When you confirm consent and tap Generate or Suggest, RaytME sends only the notes or mood text you typed to OpenAI to return a draft. We do not use those notes to train RaytME models. You review and edit any draft before it is saved to your profile.',
    },
    { type: 'h', text: '6. Public preview' },
    {
      type: 'p',
      text: 'Public web profiles show only the card preview you choose to publish. Ratings, snapshots, and My List are available in the RaytME app only.',
    },
    { type: 'h', text: '7. Legal bases' },
    {
      type: 'p',
      text: 'Where data-protection law requires a legal basis, we process data to perform our contract with you, to comply with law, to pursue legitimate interests in operating a safe reputation platform (including anti-manipulation and score integrity), and with your consent where we ask for it (for example, optional AI drafting and push notifications).',
    },
    { type: 'h', text: '8. Retention' },
    {
      type: 'p',
      text: 'We keep personal data only as long as needed to operate the Platform and for legitimate business or legal purposes, after which it is deleted or anonymized.',
    },
    {
      type: 'ul',
      items: [
        'Account and profile data is deleted or anonymized within 30 days after you close your account.',
        'Ratings are retained in de-identified or aggregate form as described in Section 4 of our Terms of Service.',
        'Sessions and verification tokens are deleted within 30 days.',
        'Security and audit logs are kept for up to 6 months.',
        'Block and safety-report records are kept as needed to handle abuse, up to 2 years.',
        'Billing records are kept for 2 years where tax or accounting law requires.',
      ],
    },
    { type: 'h', text: '9. Your rights' },
    {
      type: 'p',
      text: `Depending on your location, you may have the right to access, correct, delete, restrict, or object to our processing of your data, and to receive a copy of it in a portable format. Profile subjects who have not registered an account may also request access to, correction of, or removal of ratings data about them, subject to identity verification and to our legitimate interest in preserving the integrity of scores already calculated. To exercise these rights, contact ${COMPANY.emails.privacy}. You can also export your data or delete your account in the app (Settings → Account) or on the website. We will respond within 30 days, or any shorter period the applicable law requires. You may also lodge a complaint with the data protection authority in your country.`,
    },
    {
      type: 'p',
      text: 'If you are located in a GCC member state, you have corresponding rights of access, correction, and deletion under that state’s data protection law, which we honor in the same way, subject to the identity-verification and score-integrity considerations described above.',
    },
    { type: 'h', text: '10. Children’s privacy' },
    {
      type: 'p',
      text: 'The Platform is intended for professional use by adults and is not directed at children. The Platform is not intended for use by anyone under 18 years of age.',
    },
    { type: 'h', text: '11. Security' },
    {
      type: 'p',
      text: `We use administrative, technical, and physical safeguards designed to protect personal data. No system is completely secure. If a personal data breach is likely to affect you, we will notify you and the relevant authorities as applicable law requires. If you believe you have discovered a security vulnerability affecting the Platform, contact ${COMPANY.emails.security}.`,
    },
    { type: 'h', text: '12. United States privacy rights' },
    {
      type: 'p',
      text: `If you are a California resident, the CCPA/CPRA gives you the right to know the categories of personal information we collect and why (see Sections 2 and 3), to delete your personal information (see Section 9), to correct inaccurate personal information, and to opt out of the “sale” or “sharing” of personal information. We do not sell personal information for money, and we do not “share” personal information for cross-context behavioral advertising. You will not be discriminated against for exercising these rights. Residents of other U.S. states with comprehensive privacy laws have similar rights, which we honor in the same way. Contact ${COMPANY.emails.privacy}.`,
    },
    { type: 'h', text: '13. Cookies and similar technologies' },
    {
      type: 'p',
      text: 'Our website uses cookies and similar technologies that are strictly necessary for sign-in, security, and remembering your language preference. We do not use third-party website analytics. In the mobile app, we use device identifiers and a push token only after you enable notifications, as described in Section 2.',
    },
    { type: 'h', text: '14. Changes' },
    {
      type: 'p',
      text: 'We will post material changes to this page with an updated “Last Updated” date and, where required by law, provide additional notice.',
    },
    { type: 'h', text: '15. Contact us' },
    {
      type: 'p',
      text: `${COMPANY.displayName}\n${COMPANY.address}\nPrivacy: ${COMPANY.emails.privacy}\nSecurity: ${COMPANY.emails.security}\nSupport: ${COMPANY.emails.support}`,
    },
  ],
  blocksAr: privacyNoticeAr,
}

export const termsOfService: LegalDocument = {
  slug: 'terms',
  title: 'Terms of Service',
  titleAr: 'شروط الخدمة',
  lastUpdated: LAST_UPDATED,
  lastUpdatedAr: LAST_UPDATED_AR,
  description: 'Terms that govern access to the RaytME website, mobile application, and related services operated by RAYTME LLC.',
  descriptionAr: 'الشروط التي تنظّم الوصول إلى موقع RaytME والتطبيق والخدمات ذات الصلة التي تديرها RAYTME LLC.',
  canonical: STORE_URLS.terms,
  blocks: [
    {
      type: 'p',
      text: `These Terms of Service ("Terms") govern access to and use of the RaytME website, mobile application, and related services (together, the "Platform"), provided by ${COMPANY.displayName}, a ${COMPANY.entityType} ("RaytME," "we," "us," or "our"). By creating an account or otherwise using the Platform, you agree to these Terms. If you do not agree, do not use the Platform.`,
    },
    { type: 'h', text: '1. Eligibility' },
    {
      type: 'p',
      text: 'You must be at least 18 years old and able to form a binding contract to use the Platform. The Platform is intended for professional use.',
    },
    { type: 'h', text: '2. Your account' },
    {
      type: 'p',
      text: `You are responsible for the accuracy of the information you provide and for safeguarding your login credentials. Notify us promptly at ${COMPANY.emails.security} of any suspected unauthorized use of your account.`,
    },
    { type: 'h', text: '3. The reputation score — what it is and isn’t' },
    {
      type: 'p',
      text: 'Reputation scores reflect the subjective, aggregated input of other Platform users, weighted by our proprietary algorithm. They are opinions, not verified facts, and are not a certification, background check, or guarantee of any individual’s character, competence, or conduct. Scores may change over time and can be affected by the number, recency, and category of ratings received.',
    },
    {
      type: 'p',
      text: 'We apply anti-manipulation safeguards, but we do not guarantee that every rating reflects a genuine interaction, and we are not liable for decisions made in reliance on a score. Neither RaytME nor the Platform should be treated as the sole basis for an employment, lending, tenancy, or similarly consequential decision about an individual.',
    },
    { type: 'h', text: '4. Ratings you submit' },
    {
      type: 'p',
      text: `By submitting a rating, you confirm it is based on an actual professional interaction, reflects your honest assessment, and complies with our Acceptable Use Policy (${STORE_URLS.acceptableUse}). You grant RaytME a license to display, aggregate, and otherwise use your rating as part of the Platform, including after you close your account, to the extent needed to preserve the integrity of scores already calculated. Ratings you have given or received generally remain part of the Platform’s historical scoring record after your account is closed, in de-identified or aggregate form where feasible, unless applicable law requires deletion.`,
    },
    {
      type: 'p',
      text: 'If you submit a rating anonymously, we will not show your identity to the person rated, but we may disclose it where required by law, court order, or a competent authority. Super Voter status is granted at RaytME’s discretion based on a user’s rating history and conduct. It cannot be bought, sold, or transferred, and we may suspend or withdraw it at any time, including where we suspect misuse.',
    },
    { type: 'h', text: '5. Profile subjects who have not registered' },
    {
      type: 'p',
      text: `If you have been rated but have not created an account, a limited profile reflecting your aggregate score may exist. You may claim that profile by verifying your identity using your professional work email address or another method, or request its removal as described in Section 9 of our Privacy Notice (${STORE_URLS.privacy}).`,
    },
    { type: 'h', text: '6. Acceptable use' },
    {
      type: 'p',
      text: `Your use of the Platform is also governed by our Acceptable Use Policy, which is incorporated into these Terms by reference.`,
    },
    { type: 'h', text: '7. Company and enterprise accounts' },
    {
      type: 'p',
      text: 'If your organization uses RaytME for staff visibility or HR-related performance tracking, additional terms in a separate order form or company agreement may apply, and your employer administrator may have visibility into ratings connected to your role on the Platform. As between RaytME and the Company, the Company is solely responsible for any employment, disciplinary, promotion, hiring, or other decision it makes about an individual using ratings, scores, or other data obtained through the Platform, and for ensuring that decision complies with applicable employment, labor, and anti-discrimination law. RaytME provides the Platform as a tool and does not make, recommend, or participate in any such decision.',
    },
    { type: 'h', text: '8. Fees' },
    {
      type: 'p',
      text: 'Basic accounts are free. Paid plans are billed in advance, in US dollars, for the term shown at purchase, and renew automatically at the end of each term unless you cancel before the renewal date. You can cancel at any time in your account settings; cancellation takes effect at the end of the current term, and paid features remain available until then. Fees are non-refundable except within 14 days of your first purchase or where applicable law requires a refund. We will give at least 30 days’ notice of any price change, which will apply from your next renewal. Fees exclude taxes, which you are responsible for where applicable. Purchases made through the Apple App Store or Google Play are billed, renewed, and refunded under that store’s terms.',
    },
    { type: 'h', text: '9. Intellectual property' },
    {
      type: 'p',
      text: 'The Platform — including the RaytME name, logo, reputation algorithm, and underlying software — is owned by RaytME or its licensors and protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable license to use the Platform for its intended purpose. You retain ownership of the content you submit, subject to the license granted in Section 4.',
    },
    { type: 'h', text: '10. Third-party services' },
    {
      type: 'p',
      text: 'The Platform may integrate with third-party services (for example, calendar, email, or contact tools). Your use of those services is governed by their own terms.',
    },
    { type: 'h', text: '11. Suspension and termination' },
    {
      type: 'p',
      text: 'We may suspend or terminate your account for violating these Terms or the Acceptable Use Policy, or where we reasonably believe it is necessary to prevent harm, fraud, or legal exposure to RaytME, other users, or third parties. You may close your account at any time; certain data may be retained as described in our Privacy Notice.',
    },
    { type: 'h', text: '12. Disclaimers' },
    {
      type: 'p',
      text: 'THE PLATFORM IS PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT REPUTATION SCORES ARE ACCURATE, COMPLETE, OR FREE FROM MANIPULATION. WHEN YOU SHARE YOUR CARD OR CONTACT DETAILS WITH ANOTHER USER, OR RECEIVE THEIRS, WHAT THAT USER DOES WITH THE INFORMATION AFTERWARDS IS THEIR RESPONSIBILITY, NOT RAYTME’S.',
    },
    { type: 'h', text: '13. Limitation of liability' },
    {
      type: 'p',
      text: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, RAYTME WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY DECISION MADE IN RELIANCE ON A REPUTATION SCORE. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE PLATFORM WILL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM.',
    },
    { type: 'h', text: '14. Indemnification' },
    {
      type: 'p',
      text: 'You agree to indemnify and hold RaytME harmless from claims arising out of your content, your violation of these Terms, or your violation of any third party’s rights. If you are a Company or a company administrator, this also includes any claim arising out of your use of the Platform to make an employment or other decision about an individual, as described in Section 7.',
    },
    { type: 'h', text: '15. Governing law and disputes' },
    {
      type: 'p',
      text: 'These Terms are governed by the laws of the State of Wyoming, USA, without regard to conflict-of-law principles. Nothing in this Section limits any right you may have under the mandatory consumer-protection or data-protection law of your country of residence, including Qatar, the United Arab Emirates, the European Economic Area, the United Kingdom, or any other jurisdiction where such rights cannot be waived by contract — including, where applicable, a right to bring a claim before a court rather than in arbitration.',
    },
    {
      type: 'p',
      text: `Except as set out in this Section 15, you and RaytME agree that any dispute arising out of or relating to these Terms or the Platform will be resolved exclusively by binding arbitration on an individual basis, rather than in court. This does not prevent either party from bringing an individual claim in small claims court, or from filing a complaint with a government agency. You and RaytME each waive any right to a jury trial and any class, collective, or representative proceeding. Before filing an arbitration, send written notice to ${COMPANY.emails.legal} (or to the contact address on file for a user) and negotiate in good faith for at least 60 days.`,
    },
    {
      type: 'p',
      text: 'An arbitration with an individual user will be administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules; an arbitration with a Company will be administered by the AAA under its Commercial Arbitration Rules unless an order form provides otherwise. The arbitration will be conducted in English before a single arbitrator, with the seat in Sheridan, Wyoming, USA; hearings may be remote where AAA rules permit. Either party may also seek injunctive relief in court to protect intellectual property or confidential information.',
    },
    { type: 'h', text: '16. Changes' },
    {
      type: 'p',
      text: 'We may update these Terms from time to time. We will give at least 14 days’ notice of material changes in the app or by email before they take effect. Continued use of the Platform after changes take effect constitutes acceptance of the updated Terms.',
    },
    { type: 'h', text: '17. General' },
    {
      type: 'p',
      text: 'These Terms, together with the Acceptable Use Policy and Privacy Notice, constitute the entire agreement between you and RaytME regarding the Platform. If any provision is found unenforceable, the remaining provisions remain in effect. These Terms may be made available in English and Arabic; if the two versions conflict, the English version prevails.',
    },
    { type: 'h', text: '18. Notices' },
    {
      type: 'p',
      text: `Formal legal notices to ${COMPANY.displayName} should be sent to ${COMPANY.emails.legal}. This is in addition to, and does not replace, service of process on our registered agent as required by law.\n\n${COMPANY.displayName}\n${COMPANY.address}\n${COMPANY.emails.info} · ${COMPANY.emails.security} · ${COMPANY.emails.legal}`,
    },
  ],
  blocksAr: termsOfServiceAr,
}

export const acceptableUse: LegalDocument = {
  slug: 'acceptable-use',
  title: 'Acceptable Use Policy',
  titleAr: 'سياسة الاستخدام المقبول',
  lastUpdated: LAST_UPDATED,
  lastUpdatedAr: LAST_UPDATED_AR,
  description: 'Rules for using RaytME, including ratings integrity, content standards, and enforcement.',
  descriptionAr: 'قواعد استخدام RaytME، بما في ذلك نزاهة التقييمات ومعايير المحتوى والإنفاذ.',
  canonical: STORE_URLS.acceptableUse,
  blocks: [
    {
      type: 'p',
      text: `This Acceptable Use Policy ("Policy") sets out the rules that apply whenever you access or use the RaytME website, mobile application, digital business card tools, or any related service (together, the "Platform"), operated by ${COMPANY.displayName}. Because RaytME is built around real people rating real professional interactions, misuse can cause direct harm to someone else’s professional reputation — so we enforce this Policy actively.`,
    },
    { type: 'h', text: '1. Who this policy applies to' },
    {
      type: 'p',
      text: 'This Policy applies to every person who uses the Platform in any way — including registered users, anyone submitting a rating or comment, and anyone whose professional profile appears on the Platform, whether or not they have created an account.',
    },
    { type: 'h', text: '2. Content you may not submit' },
    {
      type: 'ul',
      items: [
        'Unlawful content, or content that promotes or facilitates unlawful activity',
        'Knowingly false, defamatory, or misleading content',
        'Sexually explicit, hateful, or discriminatory content',
        'Content that threatens, incites, or glorifies violence',
        'Malicious code, exploits, or unauthorized tracking technology',
        'Content that infringes another party’s intellectual property',
        'Another person’s sensitive personal data (such as government ID numbers, financial account details, or health information) without their consent',
      ],
    },
    { type: 'h', text: '3. Rating and reputation integrity' },
    {
      type: 'ul',
      items: [
        'Do not submit a rating unless it is based on an actual professional interaction you personally had with that person.',
        'Do not create, request, purchase, exchange, or otherwise incentivize fake, duplicate, or reciprocal ratings.',
        'Do not use multiple accounts, automated tools, or coordinated groups to inflate or deflate any score.',
        'Do not rate yourself, an alias of yourself, or a business you own or control.',
        'Do not attempt to unmask a rater who submitted an anonymous rating, or retaliate against someone you suspect submitted one.',
        'Do not offer or accept payment, discounts, or favors in exchange for a specific rating or category score.',
      ],
    },
    { type: 'h', text: '4. Respecting other people’s information' },
    {
      type: 'p',
      text: 'Do not upload another person’s contact or professional information for a purpose they have not agreed to. Do not use contact-search, directory, or export features to build lists for resale, recruiting, or unsolicited outreach outside the Platform’s intended purpose. Do not scrape, crawl, harvest, or bulk-export data from the Platform by automated means.',
    },
    { type: 'h', text: '5. Conduct toward others' },
    {
      type: 'p',
      text: 'No harassment, threats, hate speech, or abuse directed at other users, rated individuals, or our staff. No unsolicited bulk messages, spam invitations, or excessive automated digital-card share requests. No impersonation of any person, business, or RaytME representative.',
    },
    { type: 'h', text: '6. System and account security' },
    {
      type: 'p',
      text: `No attempts to bypass authentication, rate limits, or anti-manipulation safeguards. No probing, scanning, or testing the security of our systems without prior written authorization. No introducing bots, scripts, or code designed to disrupt or gain unauthorized access. To request authorization for security testing, or to report a vulnerability, contact ${COMPANY.emails.security}.`,
    },
    { type: 'h', text: '7. Sharing and messaging limits' },
    {
      type: 'p',
      text: 'To prevent spam and protect deliverability, we may apply reasonable limits on the number of digital-card invitations, QR/NFC shares, or emails sent through RaytME within a given period. Limits may vary by plan.',
    },
    { type: 'h', text: '8. Enforcement' },
    {
      type: 'p',
      text: 'If we believe this Policy has been violated, we may investigate, remove or hide content, adjust or freeze a score suspected of manipulation, restrict features, suspend, or terminate the account involved. We will generally try to notify affected users, but may act immediately and without notice where we believe there is a risk of harm, fraud, or ongoing abuse.',
    },
    { type: 'h', text: '9. Reporting a violation' },
    {
      type: 'p',
      text: `If you believe someone has violated this Policy — including submitting a manipulated, fake, or retaliatory rating about you — contact ${COMPANY.emails.support}. For formal legal notices, including claims of defamation or intellectual property infringement, contact ${COMPANY.emails.legal}. We aim to acknowledge reports within 2 business days and complete our review within 10 business days. We will remove content where a competent court or authority orders us to.`,
    },
    { type: 'h', text: '10. Applicable regardless of location' },
    {
      type: 'p',
      text: 'This Policy applies regardless of the country or region from which you access the Platform. Nothing in this Policy limits any right you may have under the mandatory law of your country of residence, including Qatar, the United Arab Emirates, the European Economic Area, the United Kingdom, or the United States.',
    },
    { type: 'h', text: '11. Changes' },
    {
      type: 'p',
      text: `We may update this Policy from time to time. Material changes will be posted on this page with a new “Last Updated” date.\n\n${COMPANY.displayName}\n${COMPANY.address}\n${COMPANY.emails.support} · ${COMPANY.emails.legal}`,
    },
  ],
  blocksAr: acceptableUseAr,
}

export const LEGAL_DOCUMENTS = [privacyNotice, termsOfService, acceptableUse] as const
