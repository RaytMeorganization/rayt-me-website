const originalText = new WeakMap<Text, string>();
const originalAttr = new WeakMap<Element, string>();

export function normalizeCopy(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/[’‘`]/g, "'").replace(/\s+/g, " ").trim();
}

export const arabicCopy: Record<string, string> = {
  // Nav + chrome
  "How it Works": "كيف تعمل",
  "How it works": "كيف تعمل",
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
  "© 2026 RaytME. All rights reserved.": "© 2026 RaytME. جميع الحقوق محفوظة.",
  "Made in Qatar. For the world.": "صُنع في قطر. للعالم.",

  // Hero
  "VIRTUAL BUSINESS CARD": "بطاقة عمل رقمية",
  "Your virtual": "بطاقتك المهنية",
  "business card.": "الرقمية.",
  "Share it. Connect instantly.": "شاركها. تواصل فوراً.",
  "Grow your reputation.": "ابنِ سمعتك.",
  "All rights reserved.": "جميع الحقوق محفوظة.",
  "RaytME is your digital business card and reputation platform. Share your profile, collect authentic ratings, and build trust with every connection — anywhere in the world.":
    "منصة RaytME هي بطاقة عملك الرقمية وسمعتك المهنية. شارك ملفك، واجمع تقييمات موثوقة، وابنِ الثقة مع كل تواصل — في أي مكان بالعالم.",
  "Doha, Qatar": "الدوحة، قطر",
  "London, United Kingdom": "لندن، المملكة المتحدة",
  "New York, USA": "نيويورك، الولايات المتحدة",
  "Create Your Card": "أنشئ بطاقتك",
  "For Teams & Businesses": "للفرق والشركات",
  "Trusted by professionals worldwide": "يثق به مهنيون حول العالم",

  // Hero / device chrome
  "YOUR RAYTME CARD": "بطاقة RAYTME",
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
  "Your RaytME profile is your business card": "ملف RaytME هو بطاقة عملك",
  "A virtual card you share. A reputation that follows.":
    "بطاقة رقمية تشاركها. وسمعة ترافقك.",
  "THE OLD WAY": "الطريقة القديمة",
  "A business card is wrong the moment something changes.":
    "بطاقة العمل الورقية تصبح خاطئة في اللحظة التي يتغير فيها شيء.",
  "Printed cards get reordered and reprinted every time a title, a number, or a company changes — most of them thrown away within a year. Your RaytME profile is your business card. Share it, connect instantly, and it's always current.":
    "البطاقات المطبوعة يُعاد طلبها وطباعتها كلما تغيّر المسمى أو الرقم أو الشركة — ومعظمها يُرمى خلال عام. ملف RaytME هو بطاقة عملك. شاركها، تواصل فوراً، وتبقى محدّثة دائماً.",
  "WHY IT WORKS": "لماذا ينجح",
  "You can't rate everyone a 5. That's the point.":
    "لا يمكنك تقييم الجميع بـ 5. وهذا هو المقصود.",
  "Every account has a limited number of ratings to give each month. Rate everyone the same and your ratings carry less weight — rate honestly, and your feedback actually moves someone's reputation.":
    "لكل حساب عدد محدود من التقييمات يمنحها شهرياً. إذا قيّمت الجميع بالتساوي يقل وزن تقييمك — قيّم بصدق، وملاحظتك تحرّك سمعة الشخص فعلاً.",
  "WORK TOGETHER, RATE EACH OTHER": "اعملوا معاً، وقيّموا بعضكم",
  "You don't need to meet someone to build a reputation with them.":
    "لا تحتاج إلى مقابلة شخص لبناء سمعة معه.",
  "Add your RaytME link to your email signature, or just share it directly on WhatsApp. Colleagues, clients, and vendors you've only ever worked with remotely can still rate you — and you can rate them back.":
    "أضف رابط RaytME إلى توقيع بريدك، أو شاركه مباشرة عبر واتساب. الزملاء والعملاء والموردون الذين عملت معهم عن بُعد فقط يمكنهم تقييمك — ويمكنك تقييمهم أيضاً.",
  "THE RESULT": "النتيجة",
  "When your reputation is on the line, you show up differently.":
    "عندما تكون سمعتك على المحك، تظهر بشكل مختلف.",
  "Ratings that follow you and reflect real feedback from real colleagues give people a reason to bring their best. The outcome: more professional conduct, better service, day to day.":
    "تقييمات ترافقك وتعكس ملاحظات حقيقية من زملاء حقيقيين تعطي الناس سبباً ليقدّموا أفضل ما لديهم. النتيجة: سلوك أكثر احترافية، وخدمة أفضل، يوماً بعد يوم.",
  "NEVER LOSE A CONTACT AGAIN": "لا تفقد أي جهة اتصال مجدداً",
  "Met someone? Add them to your list.": "قابلت أحداً؟ أضفه إلى قائمتك.",
  "No more digging through a stack of business cards you'll never look at again. Your list keeps everyone you've met — search it later to find that sales agent from three months ago and reach out when you need them.":
    "لا مزيد من البحث في كومة بطاقات لن تعود إليها. قائمتك تحفظ كل من التقيت به — ابحث لاحقاً عن مندوب المبيعات الذي قابلته قبل ثلاثة أشهر وتواصل معه عندما تحتاجه.",

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
  "Submit rating": "إرسال التقييم",
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
  CURRENCY: "العملة",
  "Pay in QAR, USD, or Euro": "ادفع بالريال أو الدولار أو اليورو",
  "Prices convert from QAR. Scan the QR to create your RaytME card.":
    "الأسعار تُحوَّل من الريال القطري. امسح رمز QR لإنشاء بطاقة RaytME.",
  "Scan to create your RaytME card": "امسح لإنشاء بطاقة RaytME",
  "Choose currency": "اختر العملة",
  Euro: "يورو",
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
  "RaytME is your virtual business card and portable professional reputation. Share one profile — by link, QR, or email signature — and keep your details and ratings current.":
    "RaytME بطاقة عملك الرقمية وسمعتك المهنية المتنقلة. شارك ملفاً واحداً — برابط أو QR أو توقيع البريد — وأبقِ بياناتك وتقييماتك محدّثة.",
  "How is the reputation score calculated?": "كيف تُحسب درجة السمعة؟",
  "Your score moves with credible ratings from people you have actually worked with. Context and rater credibility matter more than volume.":
    "درجتك تتحرك مع تقييمات موثوقة من أشخاص عملت معهم فعلاً. السياق ومصداقية المقيّم أهم من العدد.",
  "Why does RaytME not use a normal average?": "لماذا لا يستخدم RaytME متوسطاً عادياً؟",
  "A simple average treats every rating the same. RaytME weights honest, contextual feedback so a thoughtful rating counts more than noise.":
    "المتوسط البسيط يعامل كل تقييم بالمثل. RaytME يرجّح الملاحظات الصادقة المرتبطة بسياق، فيحسب التقييم المتأنّي أكثر من الضجيج.",
  "Who can rate me?": "من يمكنه تقييمي؟",
  "People you have a professional relationship with — colleagues, clients, vendors, and others you have actually worked with, including remotely.":
    "من تربطك بهم علاقة مهنية — زملاء وعملاء وموردون ومن عملت معهم فعلاً، بما في ذلك عن بُعد.",
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
