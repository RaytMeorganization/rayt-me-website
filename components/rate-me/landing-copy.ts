const originalText = new WeakMap<Text, string>();
const originalAttr = new WeakMap<Element, string>();

export function normalizeCopy(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/[’‘`]/g, "'").replace(/\s+/g, " ").trim();
}

export const arabicCopy: Record<string, string> = {
  // Nav + chrome
  "How it Works": "كيف تعمل",
  "How it works": "كيف تعمل",
  Solutions: "الحلول",
  "A card that stays current": "بطاقة تبقى محدّثة",
  "Update once. Your RaytME profile stays right when a title, number, or company changes.":
    "حدّث مرة واحدة. يبقى ملف RaytME صحيحاً عندما يتغيّر المسمى أو الرقم أو الشركة.",
  "Ratings that carry weight": "تقييمات ذات وزن",
  "Honest feedback from people you've worked with — not everyone a five.":
    "ملاحظات صادقة من أشخاص عملت معهم — ليس الجميع خمس نجوم.",
  "Share anywhere you work": "شارك أينما تعمل",
  "QR, WhatsApp, link, or email signature. Connect without a printed card.":
    "رمز QR أو واتساب أو رابط أو توقيع البريد. تواصل دون بطاقة مطبوعة.",
  "Built for teams": "مصمّم للفرق",
  "Give every employee a verified professional identity and a reputation that travels.":
    "امنح كل موظف هوية مهنية موثّقة وسمعة تنتقل معه.",
  "Never lose a contact": "لا تفقد أي جهة اتصال",
  "Save who you meet. Search your list later and reach out when it matters.":
    "احفظ من تقابلهم. ابحث في قائمتك لاحقاً وتواصل عندما تحتاج.",
  "For Professionals": "للمهنيين",
  "For Businesses": "للشركات",
  "For Business": "للشركات",
  "For business": "للشركات",
  Pricing: "الأسعار",
  Resources: "المصادر",
  "Help Center": "مركز المساعدة",
  Guides: "الأدلة",
  Privacy: "الخصوصية",
  Terms: "الشروط",
  "Sign in": "تسجيل الدخول",
  "Get Started": "ابدأ الآن",
  "Get started": "ابدأ الآن",
  "Open menu": "فتح القائمة",
  "Navigate the product.": "تصفّح المنتج.",
  "RaytME home": "الصفحة الرئيسية لـ RaytME",
  Product: "المنتج",
  Features: "المزايا",
  "For Teams": "للفرق",
  Company: "الشركة",
  "About Us": "من نحن",
  Blog: "المدونة",
  Careers: "الوظائف",
  Contact: "تواصل معنا",
  "Download the app": "حمّل التطبيق",
  "Coming soon": "قريباً",
  Soon: "قريباً",
  "Download on the": "حمّل من",
  "App Store": "App Store",
  "GET IT ON": "حمّله من",
  "Google Play": "Google Play",
  "© 2026 RaytME. All rights reserved.": "حقوق النشر © 2026 RaytME LLC. جميع الحقوق محفوظة.",
  "Copyright © 2026 RaytME LLC. All rights reserved.":
    "حقوق النشر © 2026 RaytME LLC. جميع الحقوق محفوظة.",

  // Hero
  "The Professional": "منصة الهوية",
  "Identity Platform": "المهنية",
  "Built on Verified Reputation.": "مبنية على سمعة موثّقة.",
  "All rights reserved.": "جميع الحقوق محفوظة.",
  "Every interaction you have — a meeting, a call, an introduction — builds your reputation somewhere. RaytME turns it into one verified score and card you carry everywhere.":
    "كل تفاعل تقوم به — اجتماع، مكالمة، تعريف — يبني سمعتك في مكان ما. RaytME يحوّله إلى درجة موثّقة وبطاقة تحملها في كل مكان.",
  "Doha, Qatar": "الدوحة، قطر",
  "Austin, USA": "أوستن، الولايات المتحدة",
  Austin: "أوستن",
  "London, United Kingdom": "لندن، المملكة المتحدة",
  "New York, USA": "نيويورك، الولايات المتحدة",
  "Create Your Card": "أنشئ بطاقتك",
  "For Teams & Businesses": "للفرق والشركات",
  "Trusted by professionals worldwide": "يثق به مهنيون حول العالم",
  "About RaytME": "عن RaytME",
  "RaytME is a verified professional identity platform. Share your profile, collect authentic ratings, and build trust with every connection, anywhere in the world.":
    "RaytME منصة هوية مهنية موثّقة. شارك ملفك، واجمع تقييمات أصيلة، وابنِ الثقة مع كل تواصل، في أي مكان في العالم.",
  "RaytME is built for a simple idea: a reputation you can prove, not just claim.":
    "بُني RaytME على فكرة بسيطة: سمعة تستطيع إثباتها، لا مجرد ادّعائها.",

  // Hero / device chrome
  "YOUR RAYTME CARD": "بطاقة RAYTME",
  "Professional card": "البطاقة المهنية",
  Rate: "قيّم",
  "Comment (optional)": "تعليق (اختياري)",
  "Optional, short comment": "تعليق قصير اختياري",
  "How you appear on this rating": "كيف تظهر على هذا التقييم",
  Anonymous: "مجهول",
  "Show my professional title": "أظهر مسماي المهني",
  "Submit rating": "إرسال التقييم",
  Saved: "محفوظ",
  "Add to my List": "أضف إلى قائمتي",
  "On my list": "في قائمتي",
  "View professional snapshot": "عرض الملخص المهني",
  "Back to card": "العودة إلى البطاقة",
  "THIS PERSON'S CODE": "رمز هذا الشخص",
  "Brand Strategy Lead": "قائد استراتيجية العلامة",
  "Previous employment": "العمل السابق",
  Education: "التعليم",
  Skills: "المهارات",
  Languages: "اللغات",
  Certifications: "الشهادات",
  "Professional memberships": "العضويات المهنية",
  "View CV (supplementary)": "عرض السيرة (تكميلي)",
  Browse: "تصفّح",
  "My list": "قائمتي",
  Settings: "الإعدادات",
  RAYTME: "RAYTME",
  "Scan to Connect": "امسح للتواصل",
  "Scan to connect": "امسح للتواصل",
  "Scan or tap to connect": "امسح أو اضغط للتواصل",
  Scan: "امسح",
  "Live card": "بطاقة مباشرة",
  Desktop: "سطح المكتب",
  "Desktop View": "عرض سطح المكتب",
  "Tablet View": "عرض الجهاز اللوحي",
  "Mobile View": "عرض الجوال",
  "Preview layout": "معاينة التخطيط",
  Directory: "الدليل",
  Team: "الفريق",
  Cards: "البطاقات",
  Admin: "الإدارة",
  "Corporate directory": "الدليل المؤسسي",
  "Search people": "ابحث عن أشخاص",
  "128 People": "128 شخصاً",
  "4.7 Avg rating": "متوسط التقييم 4.7",
  "3 Brands": "3 علامات",
  "Rating breakdown": "تفصيل التقييم",
  Delivery: "الإنجاز",
  Verified: "موثّق",
  London: "لندن",
  "New York": "نيويورك",
  Doha: "الدوحة",
  Qatar: "قطر",
  Lisbon: "لشبونة",
  "United Kingdom": "المملكة المتحدة",
  USA: "الولايات المتحدة",
  "Marketing Director": "مدير التسويق",
  "Brand Strategy · Digital Growth": "استراتيجية العلامة · النمو الرقمي",
  "Brand Lead": "رئيس العلامة",
  "Creative Direction · Growth": "الإخراج الإبداعي · النمو",
  "Product Director": "مدير المنتج",
  "Product Strategy · Digital Growth": "استراتيجية المنتج · النمو الرقمي",
  "Product Designer · Helio Studio": "مصممة منتجات · Helio Studio",
  "Lisbon · Digital Product": "لشبونة · منتج رقمي",
  "Theme · Copper": "ثيم · نحاسي",
  "Theme · RaytME": "ثيم · RaytME",
  "Theme · Ivory": "ثيم · عاجي",
  "Custom brand": "هوية مخصصة",
  "Virtual business card. Always current.": "بطاقة عمل رقمية. دائماً محدّثة.",
  "/ 5 · 41 ratings": "41 تقييمًا من 5",
  "/ 5 · 62 ratings": "62 تقييمًا من 5",
  "/ 5 · 38 ratings": "38 تقييمًا من 5",
  Private: "خاص",

  // Feature bar
  "Always Up to Date": "دائماً محدّثة",
  "Update once, and your card is always current.":
    "حدّث مرة واحدة، وتبقى بطاقتك محدّثة دائماً.",
  "Ratings That Matter": "تقييمات ذات قيمة",
  "Verified feedback that builds real reputation.":
    "ملاحظات موثّقة تبني سمعة حقيقية.",
  "Work & Connect Anywhere": "اعمل وتواصل من أي مكان",
  "Work & Connect": "اعمل وتواصل",
  Anywhere: "من أي مكان",
  "Share with anyone, anywhere in the world.":
    "شارك مع أي شخص، في أي مكان بالعالم.",
  "You're in Control": "التحكم بيدك",
  "Choose what to share. Keep what's private.":
    "اختر ما تشاركه. وأبقِ ما هو خاص.",
  "Never Lose a Contact": "لا تفقد أي جهة اتصال",
  "Save connections and reach out anytime.":
    "احفظ معارفك وتواصل معهم في أي وقت.",

  // How it works
  "Your reputation, proven when it matters.": "سمعتك، مُثبتة عندما تهم.",
  "Professional reputation today lives in scattered, unverifiable places — a recommendation written as a favor, a testimonial from a screenshot, a “trust me” during a pitch. RaytME is a portable, tamper-resistant way to demonstrate real-world credibility at the exact moment it matters.":
    "السمعة المهنية اليوم تعيش في أماكن متفرقة وغير قابلة للتحقق — توصية كُتبت مجاملة، أو شهادة من لقطة شاشة، أو «ثق بي» أثناء عرض. RaytME طريقة محمولة ومقاومة للتلاعب لإثبات المصداقية الحقيقية في اللحظة التي تهم.",
  "RETIRE THE PAPER CARD": "تقاعد البطاقة الورقية",
  "Titles change. Printed cards don't.": "المسميات تتغيّر. البطاقات المطبوعة لا.",
  "Your RaytME card updates instantly — no reprints, ever.":
    "بطاقتك على RaytME تتحدّث فوراً — بلا إعادة طباعة أبداً.",
  "TURN CONTACTS INTO A NETWORK": "حوّل جهات الاتصال إلى شبكة",
  "Stop losing business cards.": "توقّف عن فقدان بطاقات العمل.",
  "Save everyone you meet, searchable by profession, whenever you need them.":
    "احفظ كل من تقابلهم، قابلين للبحث حسب المهنة، متى احتجتهم.",
  "TRACK GROWTH, NOT GUESSWORK": "تتبّع النمو لا التخمين",
  "Reviews rely on memory.": "المراجعات تعتمد على الذاكرة.",
  "RaytME gives HR a real, running score built from real ratings.":
    "يمنح RaytME الموارد البشرية درجة حقيقية ومستمرة مبنية على تقييمات فعلية.",
  "BUILD TRUST ACROSS ANY BORDER": "ابنِ الثقة عبر أي حدود",
  "Never met in person?": "لم تلتقيا وجهاً لوجه؟",
  "Share your code, rate the work, build trust with zero distance.":
    "شارك رمزك، قيّم العمل، وابنِ الثقة بلا مسافة.",
  "BE CREDIBLE THE MOMENT IT COUNTS": "كن موثوقاً في اللحظة التي تهم",
  "Credibility that shows up late is useless.":
    "المصداقية التي تظهر متأخّرة بلا فائدة.",
  "RaytME makes yours visible the moment it matters.":
    "يجعل RaytME مصداقيتك مرئية في اللحظة التي تهم.",
  "SEE THE FULL PICTURE, NOT ONE SCORE": "انظر الصورة كاملة لا درجة واحدة",
  "One star hides everything.": "نجمة واحدة تخفي كل شيء.",
  "RaytME scores five categories — so your real strengths actually show.":
    "يقيم RaytME خمس فئات — فتظهر قوّتك الحقيقية فعلاً.",
  "GET HONEST FEEDBACK, WITHOUT THE FEAR": "احصل على ملاحظات صادقة دون الخوف",
  "Named feedback gets softened.": "الملاحظات بالاسم تُلطَّف.",
  "Anonymous ratings on RaytME stay honest — and still count.":
    "التقييمات المجهولة على RaytME تبقى صادقة — وتُحتسب أيضاً.",
  "RATINGS YOU CAN ACTUALLY TRUST": "تقييمات يمكن الوثوق بها",
  "Rating systems get gamed.": "أنظمة التقييم تُتلاعب بها.",
  "RaytME blocks rings, fake reviews, and flood attempts — automatically.":
    "يحظر RaytME الحلقات والمراجعات المزيفة ومحاولات الإغراق — تلقائياً.",
  "MAKE EVERY RATING COUNT": "اجعل كل تقييم يُحتسب",
  "Endorsements don't change behavior.": "التزكيات لا تغيّر السلوك.",
  "Real, visible ratings do — every time, everywhere.":
    "التقييمات الحقيقية المرئية تفعل — في كل مرة، وفي كل مكان.",
  "ONE REPUTATION, EVERYWHERE YOU GO": "سمعة واحدة أينما ذهبت",
  "New job. New country.": "وظيفة جديدة. بلد جديد.",
  "Reputation reset to zero — except on RaytME. One score, everywhere.":
    "السمعة تُصفَّر — إلا على RaytME. درجة واحدة، في كل مكان.",

  // Share stage
  "QR Code": "رمز QR",
  "NFC Tap": "لمسة NFC",
  "The app": "التطبيق",
  "Open the camera. Instant profile.": "افتح الكاميرا. الملف يظهر فوراً.",
  "RaytME on your phone": "RaytME على هاتفك",
  "NFC, QR, and your live card — in one app.":
    "NFC وQR وبطاقتك المباشرة — في تطبيق واحد.",
  "iOS & Android · Coming soon": "iOS وAndroid · قريباً",
  "Tap to share": "المس للمشاركة",
  "Hold phones together. Done.": "قرّب الهاتفين. تم.",
  "Scan and connect instantly.": "امسح وتواصل فوراً.",
  "Tap and share in a moment.": "المس وشارك في لحظة.",
  "Custom Link": "رابط خاص",
  "Share via your unique link.": "شارك عبر رابطك الخاص.",
  WhatsApp: "واتساب",
  "One tap and it's on its way.": "ضغطة واحدة ويصل في طريقه.",
  Email: "البريد",
  "Send your card in seconds.": "أرسل بطاقتك في ثوانٍ.",
  "Add to Contacts": "أضف إلى جهات الاتصال",
  "Save directly to someone's phone.": "احفظ مباشرة في هاتف الشخص.",
  "Ways to share your RaytME": "طرق مشاركة RaytME",
  "Share your profile your way. Every time.":
    "شارك ملفك بطريقتك. في كل مرة.",

  // Profile / Super Voter
  "Your professional card": "بطاقتك المهنية",
  "One profile.": "ملف واحد.",
  "Your card, your contacts, your reputation.":
    "بطاقتك، جهات اتصالك، سمعتك.",
  "Share RaytME like a business card — on WhatsApp, in an email signature, or as a QR. The card stays current. The ratings travel with you.":
    "شارك RaytME كبطاقة عمل — عبر واتساب، أو توقيع البريد، أو رمز QR. البطاقة تبقى محدّثة. والتقييمات ترافقك.",
  "A card that outlasts the job": "بطاقة تبقى بعد الوظيفة",
  "Your reputation shouldn't disappear when you change jobs.":
    "سمعتك يجب ألا تختفي عندما تغيّر وظيفتك.",
  "Your RaytME card is yours. The company on it can change. The reputation attached to you does not.":
    "بطاقة RaytME ملكك. الشركة عليها قد تتغير. السمعة المرتبطة بك لا تتغير.",
  You: "أنت",
  "Your next chapter": "فصلك التالي",
  "Super Voter": "Super Voter",
  "Earned standing": "مكانة مكتسبة",
  "Credible, honest ratings over time.":
    "تقييمات موثوقة وصادقة على مدى الوقت.",
  Earned: "مكتسبة",
  "Never sold": "لا تُباع",
  "You can't buy it": "لا يمكن شراؤها",
  "Standing is earned. It can be suspended if behavior drops.":
    "المكانة تُكتسب. ويمكن تعليقها إذا تراجع السلوك.",
  "Super Voter · Product Designer": "Super Voter · مصممة منتجات",
  "Private rater": "مقيّم بهوية خاصة",
  "Title shown. Name hidden.": "المسمى يظهر. الاسم يبقى مخفياً.",
  "A Super Voter rating shows as CEO — not a name.":
    "تقييم Super Voter يظهر كالرئيس التنفيذي — دون اسم.",
  "Rated you": "قيّمك",
  "CEO · Super Voter": "الرئيس التنفيذي · Super Voter",

  // Ratings demo
  "Credible feedback": "ملاحظات موثوقة",
  "Not five stars.": "ليست خمس نجوم.",
  "Five dimensions of professional trust.": "خمسة أبعاد للثقة المهنية.",
  "Your context matters": "سياقك مهم",
  "How do you know this person?": "كيف تعرف هذا الشخص؟",
  "Worked with": "عملت معه",
  Client: "عميل",
  Supplier: "مورّد",
  Manager: "مدير",
  Employee: "موظف",
  "Met professionally": "التقيت به مهنياً",
  "Event / networking": "فعالية / تواصل",
  "Your relationship with this person affects the credibility of your rating.":
    "علاقتك بهذا الشخص تؤثر في مصداقية تقييمك.",
  "Structured feedback": "ملاحظات منظّمة",
  Professionalism: "الاحترافية",
  Communication: "التواصل",
  Reliability: "الموثوقية",
  Knowledge: "المعرفة",
  Collaboration: "التعاون",
  "Rating submitted": "تم إرسال التقييم",

  // Business
  "Build trust across your organization.": "ابنِ الثقة داخل مؤسستك.",
  "Give every employee a current virtual business card — and a reputation layer that travels with them.":
    "امنح كل موظف بطاقة عمل رقمية محدّثة — وطبقة سمعة ترافقه.",
  "Company network": "شبكة الشركة",
  "Live overview": "نظرة مباشرة",
  Employees: "الموظفون",
  Reputation: "السمعة",
  Themes: "الثيمات",
  Usage: "الاستخدام",

  // Pricing
  "Start building your reputation.": "ابدأ ببناء سمعتك.",
  USD: "USD",
  "Priced in USD": "الأسعار بالدولار الأمريكي",
  "Scan the QR to create your RaytME card.": "امسح رمز QR لإنشاء بطاقة RaytME.",
  "Scan to create your RaytME card": "امسح لإنشاء بطاقة RaytME",
  BASIC: "أساسي",
  PRO: "احترافي",
  BUSINESS: "أعمال",
  "/ forever": "/ مدى الحياة",
  "/ year": "/ سنوياً",
  "/ employee / year": "/ موظف / سنوياً",
  Recommended: "موصى به",
  "For individuals getting started.": "للأفراد في البداية.",
  "For professionals who share often.": "للمهنيين الذين يشاركون كثيراً.",
  "Unlimited ratings received": "تقييمات مستلمة بلا حد",
  "25 ratings given / month": "25 تقييماً تمنحه / شهرياً",
  "60 ratings given / month": "60 تقييماً تمنحه / شهرياً",
  "50 ratings given / employee": "50 تقييماً يمنحه الموظف",
  "5 card themes": "5 ثيمات للبطاقة",
  "Many themes": "ثيمات متعددة",
  "Custom theme": "ثيم مخصص",
  "Public virtual card": "بطاقة رقمية عامة",
  "Company-branded theme": "ثيم بهوية الشركة",
  "Team admin controls": "أدوات إدارة الفريق",
  "Go Pro": "انتقل إلى Pro",
  "Talk to us": "تواصل معنا",
  "Decrease employees": "إنقاص عدد الموظفين",
  "Increase employees": "زيادة عدد الموظفين",
  "The cap only applies to ratings you GIVE. There is no limit to ratings your profile can RECEIVE.":
    "الحد ينطبق فقط على التقييمات التي تَمنحها. لا يوجد حد للتقييمات التي يمكن أن يستقبلها ملفك.",

  // FAQ
  Questions: "أسئلة",
  "Everything worth knowing.": "كل ما يستحق أن تعرفه.",
  "What is RaytME?": "ما هو RaytME؟",
  "RaytME is a verified professional reputation platform and virtual business card. It converts real professional interactions into a credibility-weighted reputation score, shareable via QR code, NFC, link, or email signature.":
    "RaytME منصة سمعة مهنية موثّقة وبطاقة عمل رقمية. تحوّل التفاعلات المهنية الحقيقية إلى درجة سمعة مرجّحة بالمصداقية، يمكن مشاركتها عبر رمز QR أو NFC أو رابط أو توقيع البريد.",
  "How is the reputation score calculated?": "كيف تُحسب درجة السمعة؟",
  "Every rating updates your score using a weighted formula that accounts for relationship type, rating category, and how established your score already is — so a single rating on a brand-new profile moves the score more than one additional rating on a well-established profile. This keeps the score responsive early on and stable over time.":
    "كل تقييم يحدّث درجتك بمعادلة مرجّحة تراعي نوع العلاقة وفئة التقييم ومدى استقرار درجتك الحالية — لذا يحرّك تقييم واحد ملفاً جديداً أكثر مما يحرّك تقييماً إضافياً على ملف راسخ. فتبقى الدرجة مستجيبة في البداية ومستقرة مع الوقت.",
  "Why does RaytME not use a normal average?": "لماذا لا يستخدم RaytME متوسطاً عادياً؟",
  "A simple average treats every rating the same. RaytME weights honest, contextual feedback so a thoughtful rating counts more than noise.":
    "المتوسط البسيط يعامل كل تقييم بالمثل. RaytME يرجّح الملاحظات الصادقة المرتبطة بسياق، فيحسب التقييم المتأنّي أكثر من الضجيج.",
  "Who can rate me?": "من يمكنه تقييمي؟",
  "Anyone you've had a real professional interaction with — managers, clients, collaborators, vendors, or peers. Ratings are weighted differently depending on the nature of that relationship.":
    "أي شخص كانت لك معه علاقة مهنية حقيقية — مدير أو عميل أو متعاون أو مورّد أو زميل. وتُرجَّح التقييمات بحسب طبيعة تلك العلاقة.",
  "Can ratings be anonymous?": "هل يمكن أن تكون التقييمات مجهولة؟",
  "Yes. Raters can choose to submit feedback anonymously, and profile owners control what's shown publicly versus kept private, without losing the rating's contribution to the score.":
    "نعم. يمكن للمقيّمين إرسال الملاحظات دون الكشف عن هويتهم، ويتحكم صاحب الملف بما يظهر علناً وما يبقى خاصاً، دون أن يفقد التقييم أثره في الدرجة.",
  "How does RaytME prevent fake or manipulated ratings?": "كيف يمنع RaytME التقييمات المزيفة أو المتلاعب بها؟",
  "A built-in anti-manipulation engine detects patterns like rating rings, brigading, or low-context raters; relationship-type weighting naturally discounts unverified or low-trust inputs; and every account has a monthly cap on ratings given, so no one can flood the system with fake positive reviews.":
    "محرك مدمج لمكافحة التلاعب يرصد أنماطاً مثل حلقات التقييم أو الهجوم المنسّق أو المقيّمين منخفضي السياق؛ وترجيح نوع العلاقة يخفّض تلقائياً المدخلات غير الموثّقة أو منخفضة الثقة؛ ولكل حساب سقف شهري للتقييمات الممنوحة، فلا يمكن إغراق النظام بتقييمات إيجابية مزيفة.",
  "Is RaytME only for certain industries or regions?": "هل RaytME مخصص لقطاعات أو مناطق معيّنة فقط؟",
  "No. RaytME is built as a global platform for any professional, in any industry, anywhere in the world.":
    "لا. RaytME منصة عالمية لأي مهني، في أي قطاع، وفي أي مكان بالعالم.",
  "How do I share my RaytME profile?": "كيف أشارِك ملف RaytME؟",
  "Share it however fits the moment — QR code, NFC tap, a direct link, or an embedded email signature. No app download is required for the person viewing it.":
    "شاركه بما يناسب اللحظة — رمز QR، أو لمسة NFC، أو رابط مباشر، أو توقيع بريد مضمّن. ولا يحتاج من يشاهده إلى تحميل التطبيق.",
  "Does RaytME sell my data?": "هل يبيع RaytME بياناتي؟",
  "No. RaytME does not sell user data or rating information.":
    "لا. RaytME لا يبيع بيانات المستخدمين ولا معلومات التقييم.",
  "What are the five rating categories?": "ما هي فئات التقييم الخمس؟",
  "Professionalism, Communication, Reliability, Knowledge, and Collaboration — giving a fuller picture than a single star rating.":
    "الاحترافية، والتواصل، والموثوقية، والمعرفة، والتعاون — لتعطيك صورة أوضح من نجمة واحدة.",
  "How does my list work?": "كيف تعمل قائمتي؟",
  "You choose who to add — it's not automatic. Add anyone you meet with one tap, whether or not you rate them. Once added, they're organized by profession along with any rating you've given and where you met, so you can search your list anytime you need to find someone specific.":
    "أنت من يختار من تضيفه — ليست تلقائية. أضف أي شخص تقابله بنقرة واحدة، سواء قيّمته أم لا. وبعد الإضافة يُرتَّبون حسب المهنة مع أي تقييم منحته ومكان اللقاء، لتبحث في قائمتك متى احتجت شخصاً محدداً.",
  "Can I hide my phone number?": "هل يمكنني إخفاء رقم هاتفي؟",
  "Yes. Phone numbers stay private unless you choose to share them. Your virtual card can still be shared without exposing your number.":
    "نعم. تبقى أرقام الهواتف خاصة ما لم تختر مشاركتها. ويمكن مشاركة بطاقتك الرقمية دون كشف رقمك.",
  "Can I dispute a rating?": "هل يمكنني الاعتراض على تقييم؟",
  "Yes. Rated users can flag a rating for review and respond publicly.":
    "نعم. يمكن لصاحب التقييم الإبلاغ عنه للمراجعة والرد علناً.",
  "What is Super Voter?": "ما هو Super Voter؟",
  "Super Voter is an earned standing for sustained credible rating behavior. It is never purchased.":
    "Super Voter مكانة مكتسبة لسلوك تقييم موثوق ومستمر. ولا تُشترى أبداً.",
  "Can I use RaytME without the app?": "هل يمكنني استخدام RaytME دون التطبيق؟",
  "You can share and view a public card on the web. Rating, snapshots, and My List are available in the RaytME app.":
    "يمكنك مشاركة بطاقة عامة وعرضها على الويب. التقييم واللقطات وقائمتي متاحة في تطبيق RaytME.",
  "Can businesses use RaytME?": "هل يمكن للشركات استخدام RaytME؟",
  "Yes. Business plans give every employee a current virtual card and a reputation layer that travels with them.":
    "نعم. خطط الأعمال تمنح كل موظف بطاقة رقمية محدّثة وطبقة سمعة ترافقه.",

  // Pre-footer
  "Your card. Your reputation. Your future.": "بطاقتك. سمعتك. مستقبلك.",
  "Professionals in Doha, London, New York, and around the world use RaytME — on phone, iPad, and desktop.":
    "مهنيون في الدوحة ولندن ونيويورك وحول العالم يستخدمون RaytME — على الهاتف والآيباد وسطح المكتب.",
  "Create Your RaytME Card": "أنشئ بطاقة RaytME",
  "Your digital business card. Share your profile, grow your reputation.":
    "بطاقة عملك الرقمية. شارك ملفك، وابنِ سمعتك.",
  "Create your RaytME profile": "أنشئ ملفك على RaytME.",
  "Create your profile": "أنشئ ملفك المهني",
  "See how it works": "اكتشف كيف تعمل",
  "Virtual business card": "بطاقة عمل رقمية",
  "Always current": "دائماً محدّثة",
  "Portable reputation": "سمعة متنقلة",
  "Privacy by default": "الخصوصية افتراضية",
  "Your reputation travels with you.": "سمعتك ترافقك أينما ذهبت.",

  // Bot
  "RaytME Bot": "RaytME Bot",
  "Frontend preview": "معاينة الواجهة",
  "Not connected": "غير متصل",
  "Type a message": "اكتب رسالة",
  "Message RaytME Bot": "رسالة إلى RaytME Bot",
  "Send message": "إرسال الرسالة",
  "Open RaytME Bot": "فتح RaytME Bot",
  "Close RaytME Bot": "إغلاق RaytME Bot",
  "Hi — I'm RaytME Bot. This is a frontend preview only.":
    "مرحباً — أنا RaytME Bot. هذه معاينة للواجهة فقط.",
  "Configure your OpenAI API setup to use this chatbot.":
    "اضبط إعدادات OpenAI API لاستخدام هذا المحادث.",
};

function shouldSkipText(node: Text) {
  const el = node.parentElement;
  if (!el) return true;
  if (el.closest("[data-no-translate], code, pre, script, style, kbd, textarea, input")) {
    return true;
  }
  const text = normalizeCopy(node.textContent || "");
  if (!text) return true;
  if (/^[\d./%·:,+\-\s]+$/.test(text)) return true;
  if (/@/.test(text) || /^\+\d/.test(text)) return true;
  if (/^rayt\.me\//i.test(text)) return true;
  return false;
}

function applyMappedAttribute(
  selector: string,
  attribute: string,
  arabic: boolean,
) {
  document.querySelectorAll<HTMLElement>(selector).forEach((node) => {
    const stored = originalAttr.get(node);
    const original = stored ?? node.getAttribute(attribute) ?? "";
    if (!stored) originalAttr.set(node, original);
    const translated = arabicCopy[normalizeCopy(original)];
    if (!translated) return;
    node.setAttribute(attribute, arabic ? translated : original);
  });
}

export function applyLandingCopy(arabic: boolean) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) nodes.push(current as Text);
  nodes.forEach((node) => {
    if (shouldSkipText(node)) return;
    const source = originalText.get(node) ?? node.textContent ?? "";
    originalText.set(node, source);
    const translated = arabicCopy[normalizeCopy(source)];
    if (!translated) return;
    node.textContent = arabic ? translated : source;
  });

  document.querySelectorAll<HTMLElement>("[data-rate-me-copy]").forEach((node) => {
    const original =
      node.getAttribute("data-rate-me-original") || node.textContent || "";
    if (!node.getAttribute("data-rate-me-original")) {
      node.setAttribute("data-rate-me-original", original);
    }
    const translated = arabicCopy[normalizeCopy(original)];
    node.textContent = arabic ? translated || original : original;
  });

  applyMappedAttribute("[aria-label]", "aria-label", arabic);
  applyMappedAttribute("input[placeholder], textarea[placeholder]", "placeholder", arabic);
}

export const botCopy = {
  welcomeEn: "Hi — I'm RaytME Bot. This is a frontend preview only.",
  welcomeAr: "مرحباً — أنا RaytME Bot. هذه معاينة للواجهة فقط.",
  setupEn: "Configure your OpenAI API setup to use this chatbot.",
  setupAr: "اضبط إعدادات OpenAI API لاستخدام هذا المحادث.",
  placeholderEn: "Type a message",
  placeholderAr: "اكتب رسالة",
};
