"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Globe2,
  Lock,
  Menu,
  QrCode,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatedNumber } from "@/components/product/premium-motion";
import {
  AnimatedSection,
  useLandingAnimations,
} from "@/components/rate-me/landing-animations";

const arabicCopy: Record<string, string> = {
  "A CV tells people what you say about yourself.":
    "السيرة الذاتية تخبر الناس بما تقوله عن نفسك.",
  "Rayt Me shows what others can credibly say about you.":
    "أما Rayt Me فتُظهر ما يمكن للآخرين قوله عنك بموثوقية.",
  "CVs and LinkedIn profiles are claims. Rayt Me turns professional interactions into portable reputation evidence.":
    "السير الذاتية وملفات LinkedIn ادعاءات. يحوّل Rayt Me التفاعلات المهنية إلى أدلة سمعة قابلة للنقل.",
  "Your reputation shouldn't disappear when you change jobs.":
    "يجب ألا تختفي سمعتك عندما تغيّر عملك.",
  "Your reputation is built through the people you work with. Rayt Me makes that reputation portable.":
    "تُبنى سمعتك من خلال الأشخاص الذين تعمل معهم. يجعل Rayt Me هذه السمعة قابلة للنقل.",
  "More than a score.": "أكثر من مجرد نتيجة.",
  "Less than a CV.": "وأقل من سيرة ذاتية.",
  "Four steps to a reputation that travels.": "أربع خطوات لسمعة ترافقك.",
  "Not five stars.": "ليست خمس نجوم.",
  "Five dimensions of professional trust.": "بل خمسة أبعاد للثقة المهنية.",
  "A reputation score that has to be earned.": "نتيجة سمعة يجب اكتسابها.",
  "A rating's influence is earned, not assumed.":
    "تأثير التقييم يُكتسب ولا يُفترض.",
  "Build trust across your organization.": "ابنِ الثقة داخل مؤسستك.",
  "Everything worth knowing.": "كل ما يستحق معرفته.",
  "Create your Rayt Me profile": "أنشئ ملفك على Rayt Me.",

  "How it works": "كيف تعمل",
  Trust: "الثقة",
  "For Professionals": "للمهنيين",
  "For Business": "للشركات",
  Pricing: "الأسعار",
  "Sign in": "تسجيل الدخول",
  "Get started": "ابدأ الآن",
  "PROFESSIONAL REPUTATION, VERIFIED": "سمعة مهنية موثّقة",
  "Your professional reputation.": "سمعتك المهنية.",
  "Verified wherever you go.": "موثّقة أينما ذهبت.",
  "Build a reputation from real professional interactions — verified, portable, and backed by credible evidence.":
    "ابنِ سمعة من تفاعلات مهنية حقيقية — موثّقة وقابلة للنقل ومدعومة بأدلة موثوقة.",
  "Create your profile": "أنشئ ملفك المهني",
  "See how it works": "اكتشف كيف تعمل",
  "Rayt Me does not count stars. It measures credible evidence.":
    "Rayt Me لا تعدّ النجوم، بل تقيس الأدلة الموثوقة.",
  "Built around verified identity and credible professional interactions.":
    "مبنية على هوية موثّقة وتفاعلات مهنية موثوقة.",
  "Verified identity": "هوية موثّقة",
  "Relationship-based": "تقييمات قائمة على العلاقة",
  "Privacy by default": "الخصوصية افتراضية",
  "Anti-manipulation": "مقاومة التلاعب",
  "THE PROBLEM": "المشكلة",
  "The problem": "المشكلة",
  "HOW IT WORKS": "كيف تعمل",
  "FOR BUSINESS": "للشركات",
  "Start building your reputation.": "ابدأ ببناء سمعتك.",
  "Your reputation travels with you.": "سمعتك ترافقك أينما ذهبت.",
  "Explore Business": "استكشف حلول الشركات",
  "Talk to us": "تواصل معنا",
  "Go Pro": "انتقل إلى Pro",
  Recommended: "موصى به",
  FAQ: "الأسئلة الشائعة",
  "What is Rayt Me?": "ما هو Rayt Me؟",
  "Can I hide my phone number?": "هل يمكنني إخفاء رقم هاتفي؟",
  "Can I dispute a rating?": "هل يمكنني الاعتراض على تقييم؟",
};

const originalText = new WeakMap<Text, string>();
function LanguageToggle() {
  const [arabic, setArabic] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem("rate-me-locale");
    const id = window.setTimeout(() => setArabic(saved === "ar"), 0);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    document.documentElement.lang = arabic ? "ar" : "en";
    document.documentElement.dir = arabic ? "rtl" : "ltr";
    document.body.classList.toggle("arabic-mode", arabic);
    window.localStorage.setItem("rate-me-locale", arabic ? "ar" : "en");
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    const nodes: Text[] = [];
    let current: Node | null;
    while ((current = walker.nextNode())) nodes.push(current as Text);
    nodes.forEach((node) => {
      const source = originalText.get(node) || node.textContent || "";
      originalText.set(node, source);
      const clean = source.trim();
      const translated = arabicCopy[clean];
      if (translated)
        node.textContent = source.replace(clean, arabic ? translated : clean);
    });
    document.querySelectorAll("[data-rate-me-copy]").forEach((node) => {
      const original =
        node.getAttribute("data-rate-me-original") || node.textContent || "";
      if (!node.getAttribute("data-rate-me-original"))
        node.setAttribute("data-rate-me-original", original);
      node.textContent = arabic ? arabicCopy[original] || original : original;
    });
  }, [arabic]);
  return (
    <button
      type="button"
      aria-label={arabic ? "Switch to English" : "التبديل إلى العربية"}
      onClick={() => setArabic(!arabic)}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#c9d0ca] bg-white px-3 text-xs font-semibold text-[#17201e] transition hover:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
    >
      <Globe2 className="size-4" />
      {arabic ? "EN" : "عربي"}
    </button>
  );
}

function MotionIllustration({
  kind,
}: {
  kind: "evidence" | "network" | "share";
}) {
  const right = kind === "share";
  return (
    <div
      aria-hidden="true"
      className={`rate-illustration rate-illustration-${kind}`}
    >
      <svg viewBox="0 0 240 150" role="presentation">
        <path
          className="illustration-path"
          d={
            right
              ? "M34 105 C82 64 124 64 164 88"
              : "M30 100 C78 52 128 52 196 94"
          }
        />
        <circle
          className="illustration-head"
          cx={right ? 190 : 40}
          cy="36"
          r="14"
        />
        <path
          className="illustration-body"
          d={
            right
              ? "M178 54c-8 15-12 34-12 52m12-42 24 18m-28 0-20 22m20 0 18 25"
              : "M52 54c8 15 12 34 12 52M52 64 28 82m28-2 20 22M48 106 30 132m18-26 22 22"
          }
        />
        <rect
          className="illustration-phone"
          x={right ? 145 : 67}
          y="63"
          width="18"
          height="31"
          rx="3"
        />
        <circle
          className="illustration-accent"
          cx={right ? 154 : 76}
          cy="72"
          r="3"
        />
        <path
          className="illustration-signal"
          d={
            right
              ? "M169 64q14-14 28 0M173 57q10-10 20 0"
              : "M88 64q14-14 28 0M92 57q10-10 20 0"
          }
        />
      </svg>
      <span className="illustration-caption">
        {right ? "SHARE YOUR PROFILE" : "VERIFIED EVIDENCE"}
      </span>
    </div>
  );
}

function Button({
  children,
  dark = false,
  onClick,
  href,
}: {
  children: React.ReactNode;
  dark?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${dark ? "bg-[#17201e] text-white hover:bg-[#26332f]" : "border border-[#c9d0ca] bg-white text-[#17201e] hover:border-[#87958d]"}`;
  const target = href || (!onClick ? "/sign-up" : undefined);
  return target ? (
    <a href={target} className={classes}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

function Mark() {
  return (
    <span className="relative block size-9 shrink-0 overflow-hidden rounded-[10px] bg-white">
      <Image
        src="/rayt-me-logo.png"
        alt=""
        aria-hidden="true"
        width={110}
        height={73}
        priority
        className="absolute left-[-6px] top-[-14px] w-[110px] max-w-none"
      />
    </span>
  );
}
function LogoLockup({ onDark = false }: { onDark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-2xl transition-all duration-500 ${onDark ? "border border-white/25 bg-white/92 py-1.5 pl-2 pr-3 shadow-[0_14px_36px_-18px_rgba(3,15,12,.9)] backdrop-blur-sm sm:pr-4" : ""}`}
    >
      <span className="relative block size-9 shrink-0 overflow-hidden sm:size-10">
        <Image
          src="/rayt-me-logo.png"
          alt=""
          aria-hidden="true"
          width={120}
          height={80}
          priority
          className="absolute left-[-4px] top-[-13px] w-[108px] max-w-none sm:left-[-5px] sm:top-[-15px] sm:w-[120px]"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[-.03em] text-[#12352a] sm:text-[17px]">
          Rayt Me
        </span>
        <span className="mt-1 hidden text-[8px] font-bold tracking-[.16em] text-[#2f7a5c] sm:block">
          RATE. TRUST. GROW.
        </span>
      </span>
    </span>
  );
}
function Badge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-emerald-800">
      <ShieldCheck className="size-3" /> Verified
    </span>
  );
}
function SectionHead({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
}) {
  return (
    <div data-gsap-section-head className="max-w-3xl">
      <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="text-balance text-4xl font-semibold tracking-[-.05em] text-[#17201e] sm:text-6xl">
        {title}
      </h2>
      {copy && (
        <p className="mt-6 max-w-xl text-lg leading-8 text-[#63706a]">{copy}</p>
      )}
    </div>
  );
}

function ProfileCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      data-gsap-profile-card
      data-gsap-feature-card
      className={`relative overflow-hidden rounded-[28px] border border-[#d9dfd9] bg-white p-5 shadow-[0_24px_80px_-35px_rgba(23,32,30,.38)] [transform-style:preserve-3d] will-change-transform ${compact ? "" : "sm:p-7"}`}
    >
      <div
        data-gsap-card-glare
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-30%] z-10 opacity-0 [background:radial-gradient(circle_at_center,rgba(255,255,255,.8),transparent_45%)]"
      />
      <div
        data-gsap-float
        data-float-duration="2.8"
        className="absolute right-5 top-5 flex size-12 items-center justify-center rounded-2xl bg-[#edf2ed] text-emerald-700 will-change-transform"
      >
        <QrCode className="size-7" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-[#cad5cd] text-xl font-semibold text-[#17201e]">
          OA
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-[#17201e]">
              Omar Al-Kuwari
            </h3>
            <span
              data-gsap-verified-pulse
              className="flex size-5 items-center justify-center rounded-full bg-emerald-700 text-white will-change-transform"
            >
              <Check className="size-3" />
            </span>
          </div>
          <p className="text-sm text-[#63706a]">Lawyer · Al Noor Legal Group</p>
          <p className="mt-1 text-xs text-[#87958d]">
            Doha, Qatar · Legal Services
          </p>
        </div>
      </div>
      <div className="mt-8 flex items-end justify-between border-y border-[#edf0ec] py-5">
        <div>
          <div className="flex items-baseline gap-2">
            <AnimatedNumber
              value={4.3}
              decimals={1}
              className="text-5xl font-semibold tabular-nums tracking-[-.08em] text-[#17201e]"
            />
            <span className="text-sm text-[#87958d]">/ 5</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-emerald-700">
            <ShieldCheck className="size-3.5" /> Verified reputation
          </div>
        </div>
        <div className="text-right text-xs text-[#87958d]">
          <p>Based on</p>
          <p className="font-semibold tabular-nums text-[#17201e]">
            <AnimatedNumber value={28} /> credible ratings
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 py-5 text-sm">
        <a
          className="text-[#17201e] underline decoration-[#b7c2ba] underline-offset-4"
          href="mailto:omar.alkuwari@alnoorlegal.qa"
        >
          omar.alkuwari@alnoorlegal.qa
        </a>
        <span className="flex items-center gap-2 text-[#87958d]">
          <Lock className="size-3.5" /> Phone number — private
        </span>
      </div>
      <div className="flex gap-3">
        <Button dark href="/p/demo-omar-al-kuwari">
          Open card preview
        </Button>
        <span className="self-center text-xs text-[#87958d]">
          App-only actions shown illustratively
        </span>
      </div>
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["#how", "How it works"],
    ["#trust", "Trust"],
    ["#profile", "For Professionals"],
    ["#business", "For Business"],
    ["#pricing", "Pricing"],
  ];
  return (
    <header
      data-gsap-navbar
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 will-change-transform ${solid ? "border-b border-[#dfe4de]/70 bg-[#f7f8f4]/90 backdrop-blur-xl" : "bg-gradient-to-b from-[#05130f]/75 via-[#05130f]/40 to-transparent"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <a
          href="#top"
          aria-label="Rayt Me home"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <LogoLockup onDark={!solid} />
        </a>
        <nav
          className={`hidden items-center gap-5 text-sm transition-colors lg:flex xl:gap-7 ${solid ? "text-[#63706a]" : "text-white/90 drop-shadow-[0_1px_12px_rgba(3,15,12,.65)]"}`}
        >
          {links.map(([href, label]) => (
            <a
              data-gsap-nav-link
              key={href}
              href={href}
              className={`relative transition-colors ${solid ? "hover:text-[#17201e]" : "hover:text-white"}`}
            >
              {label}
              <span
                data-gsap-nav-underline
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-px origin-center scale-x-0 bg-current"
              />
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          <a
            className={`text-sm font-medium transition-colors ${solid ? "text-[#17201e]" : "text-white drop-shadow-[0_1px_12px_rgba(3,15,12,.65)]"}`}
            href="/sign-in"
            data-rate-me-copy
          >
            Sign in
          </a>
          <LanguageToggle />
          {solid ? (
            <Button dark href="/sign-up">
              <span data-rate-me-copy>Get started</span>
            </Button>
          ) : (
            <a
              href="/sign-up"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#10221d] shadow-[0_10px_30px_-14px_rgba(3,15,12,.8)] transition hover:-translate-y-0.5 hover:bg-[#edf8f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#10221d]"
            >
              <span data-rate-me-copy>Get started</span>
            </a>
          )}
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          <a
            className={`text-sm font-semibold transition-colors ${solid ? "text-[#17201e]" : "text-white"}`}
            href="/sign-in"
            data-rate-me-copy
          >
            Sign in
          </a>
          <LanguageToggle />
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className={`rounded-full border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${solid ? "border-[#c9d0ca] text-[#17201e]" : "border-white/35 bg-white/10 text-white"}`}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-5 border-t border-[#dfe4de] bg-[#f7f8f4] px-5 py-6 text-sm font-medium text-[#17201e] lg:hidden">
          {links.map(([href, label]) => (
            <a key={href} onClick={() => setOpen(false)} href={href}>
              {label}
            </a>
          ))}
          <Button dark href="/sign-up">
            Get started
          </Button>
        </nav>
      )}
    </header>
  );
}

function TrustStrip() {
  return (
    <AnimatedSection id="trust" className="border-y border-[#dfe4de] bg-white">
      <div
        data-gsap-trust
        className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8"
      >
        <p
          data-gsap-trust-title
          className="max-w-xs text-sm font-semibold text-[#17201e]"
        >
          Built around verified identity and credible professional interactions.
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs font-medium text-[#63706a] sm:grid-cols-4">
          {[
            "Verified identity",
            "Relationship-based",
            "Privacy by default",
            "Anti-manipulation",
          ].map((item) => (
            <span data-gsap-trust-item key={item}>
              <Check
                data-gsap-check
                className="mr-2 inline size-4 text-emerald-700"
              />
              {item}
            </span>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function RatingDemo() {
  const [relationship, setRelationship] = useState("Worked with");
  const [values, setValues] = useState([4.5, 4, 4.5, 4, 4.5]);
  const [submitted, setSubmitted] = useState(false);
  const labels = [
    "Professionalism",
    "Communication",
    "Reliability",
    "Knowledge",
    "Collaboration",
  ];
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  return (
    <div className="grid gap-10 rounded-[28px] border border-[#d9dfd9] bg-white p-6 sm:p-8 lg:grid-cols-[.9fr_1.1fr] lg:p-12">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-700">
          Your context matters
        </p>
        <h3 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-[#17201e]">
          How do you know this person?
        </h3>
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            "Worked with",
            "Client",
            "Supplier",
            "Manager",
            "Employee",
            "Met professionally",
            "Event / networking",
          ].map((x) => (
            <button
              key={x}
              onClick={() => setRelationship(x)}
              className={`rounded-full border px-3 py-2 text-xs transition ${relationship === x ? "border-[#17201e] bg-[#17201e] text-white" : "border-[#d9dfd9] text-[#63706a] hover:border-[#87958d]"}`}
            >
              {x}
            </button>
          ))}
        </div>
        <p className="mt-8 text-sm leading-6 text-[#63706a]">
          Your relationship with this person affects the credibility of your
          rating.
        </p>
      </div>
      <div>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm text-[#63706a]">Structured feedback</p>
            <p className="mt-1 text-4xl font-semibold tracking-[-.06em] text-[#17201e]">
              {avg}
              <span className="ml-1 text-base text-[#87958d]">/ 5</span>
            </p>
          </div>
          <Badge />
        </div>
        <div className="flex flex-col gap-5">
          {labels.map((label, i) => (
            <label
              key={label}
              className="grid grid-cols-[1fr_auto] gap-4 text-sm"
            >
              <span className="text-[#63706a]">{label}</span>
              <span className="font-semibold text-[#17201e]">
                {values[i].toFixed(1)}
              </span>
              <input
                aria-label={label}
                className="col-span-2 accent-[#187052]"
                type="range"
                min="1"
                max="5"
                step=".5"
                value={values[i]}
                onChange={(e) => {
                  setSubmitted(false);
                  setValues(
                    values.map((v, j) =>
                      j === i ? Number(e.target.value) : v,
                    ),
                  );
                }}
              />
            </label>
          ))}
        </div>
        <Button dark onClick={() => setSubmitted(true)}>
          {submitted ? (
            <>
              <Check className="size-4" /> Rating submitted
            </>
          ) : (
            "Submit rating"
          )}
        </Button>
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const qs = [
    "What is Rayt Me?",
    "How is the reputation score calculated?",
    "Why does Rayt Me not use a normal average?",
    "Who can rate me?",
    "Can I hide my phone number?",
    "Can I dispute a rating?",
    "What is Super Voter?",
    "Can I use Rayt Me without the app?",
    "Can businesses use Rayt Me?",
  ];
  return (
    <div className="mx-auto max-w-3xl divide-y divide-[#dfe4de] border-y border-[#dfe4de]">
      {qs.map((q, i) => (
        <div key={q}>
          <button
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left text-base font-semibold text-[#17201e]"
          >
            {q}
            <ChevronDown
              className={`size-5 transition ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <p className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-[#63706a]">
              Rayt Me is a portable professional reputation profile built from
              verified identity and credible, real-world interactions. It
              measures evidence, not popularity, so context and rater
              credibility matter.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Pricing() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-[24px] border border-[#d9dfd9] bg-white p-7">
        <p className="text-xs font-bold tracking-[.15em] text-[#63706a]">
          BASIC
        </p>
        <p className="mt-5 text-4xl font-semibold tracking-[-.06em] text-[#17201e]">
          QAR 0
        </p>
        <ul className="mt-8 flex flex-col gap-4 text-sm text-[#63706a]">
          <li>
            <Check className="mr-2 inline size-4 text-emerald-700" />
            Unlimited ratings received
          </li>
          <li>
            <Check className="mr-2 inline size-4 text-emerald-700" />
            25 ratings given / month
          </li>
          <li>
            <Check className="mr-2 inline size-4 text-emerald-700" />5 card
            themes
          </li>
        </ul>
        <div className="mt-8">
          <Button>Get started</Button>
        </div>
      </div>
      <div className="relative rounded-[24px] border-2 border-emerald-700 bg-[#edf3ed] p-7">
        <span className="absolute right-6 top-6 rounded-full bg-emerald-700 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-white">
          Recommended
        </span>
        <p className="text-xs font-bold tracking-[.15em] text-emerald-800">
          PRO
        </p>
        <p className="mt-5 text-4xl font-semibold tracking-[-.06em] text-[#17201e]">
          ~QAR 99<span className="text-base text-[#63706a]"> / year</span>
        </p>
        <ul className="mt-8 flex flex-col gap-4 text-sm text-[#405149]">
          <li>
            <Check className="mr-2 inline size-4" />
            Unlimited ratings received
          </li>
          <li>
            <Check className="mr-2 inline size-4" />
            60 ratings given / month
          </li>
          <li>
            <Check className="mr-2 inline size-4" />
            Many themes
          </li>
          <li>
            <Check className="mr-2 inline size-4" />
            Custom theme
          </li>
        </ul>
        <div className="mt-8">
          <Button dark>Go Pro</Button>
        </div>
      </div>
      <div className="rounded-[24px] border border-[#d9dfd9] bg-white p-7">
        <p className="text-xs font-bold tracking-[.15em] text-[#63706a]">
          BUSINESS
        </p>
        <p className="mt-5 text-4xl font-semibold tracking-[-.06em] text-[#17201e]">
          QAR 20–30
          <span className="text-base text-[#63706a]"> / employee / month</span>
        </p>
        <ul className="mt-8 flex flex-col gap-4 text-sm text-[#63706a]">
          <li>
            <Check className="mr-2 inline size-4 text-emerald-700" />
            Unlimited ratings received
          </li>
          <li>
            <Check className="mr-2 inline size-4 text-emerald-700" />
            50 ratings given / employee
          </li>
          <li>
            <Check className="mr-2 inline size-4 text-emerald-700" />
            Company-branded theme
          </li>
        </ul>
        <div className="mt-8">
          <Button>Talk to us</Button>
        </div>
      </div>
    </div>
  );
}

export default function RateMeLanding() {
  const animationScope = useLandingAnimations();

  return (
    <div
      ref={animationScope}
      id="top"
      className="rate-landing min-h-screen bg-[#f7f8f4] text-[#17201e]"
    >
      <Navbar />
      <main>
        <section className="rate-premium-hero relative isolate flex min-h-[600px] items-end overflow-hidden pt-24 sm:min-h-[700px] lg:min-h-[820px] lg:items-center">
          <div
            data-gsap-hero-bg
            className="rate-hero-photo absolute inset-0 -z-10"
            aria-hidden="true"
          />
          <div
            className="rate-hero-overlay absolute inset-0 -z-10"
            aria-hidden="true"
          />
          <div className="mx-auto flex w-full max-w-7xl px-5 pb-12 lg:px-8 lg:pb-0">
            <div
              data-gsap-hero-card
              className="glass-shimmer rate-hero-copy w-full max-w-[470px] rounded-[26px] border border-white/15 bg-[#0d1f1a]/55 p-6 text-white shadow-[0_28px_80px_-40px_rgba(3,15,12,.85)] backdrop-blur-[3px] will-change-transform sm:p-7 lg:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <span
                  data-gsap-floating-enter
                  data-gsap-float
                  data-float-x="-30"
                  data-float-duration="3.5"
                  className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-white/10 will-change-transform"
                >
                  <ShieldCheck className="size-4 text-[#bce5d1]" />
                </span>
                <p className="text-[10px] font-bold tracking-[.2em] text-[#d7f1e4]">
                  PROFESSIONAL REPUTATION, VERIFIED
                </p>
              </div>
              <h1 className="text-balance text-[1.75rem] font-semibold leading-[1.05] sm:leading-[1.02] tracking-[-.05em] text-white drop-shadow-[0_2px_20px_rgba(3,15,12,.5)] sm:text-5xl">
                <span
                  data-gsap-title-line
                  className="block will-change-transform"
                >
                  Your professional reputation.
                </span>
                <br />
                <span
                  data-gsap-title-line
                  className="block text-[#9ed9bd] will-change-transform"
                >
                  Verified wherever you go.
                </span>
              </h1>
              <p
                data-gsap-hero-subtitle
                className="mt-5 max-w-sm text-sm leading-7 text-white/80 will-change-transform sm:text-base"
              >
                Build a reputation from real professional interactions —
                verified, portable, and backed by credible evidence.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  data-gsap-hero-cta
                  data-gsap-primary-cta
                  href="/sign-up"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#10221d] shadow-lg transition hover:bg-[#edf8f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#10221d] will-change-transform"
                >
                  Create your profile{" "}
                  <ArrowRight data-gsap-cta-arrow className="size-4" />
                </a>
                <a
                  data-gsap-hero-cta
                  data-gsap-secondary-cta
                  href="#how"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white will-change-transform"
                >
                  See how it works{" "}
                  <ArrowDown data-gsap-cta-arrow className="size-4" />
                </a>
              </div>
              <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-5 text-xs text-white/65">
                <span className="size-2 rounded-full bg-[#7dd4aa]" />
                Rayt Me measures credible evidence, not popularity.
              </div>
            </div>
          </div>
        </section>
        <TrustStrip />
        <section className="mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-40">
          <SectionHead
            eyebrow="The problem"
            title={
              <>
                A CV tells people what you say about yourself.
                <br />
                <span className="text-[#87958d]">
                  Rayt Me shows what others can credibly say about you.
                </span>
              </>
            }
            copy="CVs and LinkedIn profiles are claims. Rayt Me turns professional interactions into portable reputation evidence."
          />
          <div className="mt-16 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[24px] border border-[#d9dfd9] p-7">
              <p className="text-xs font-bold tracking-[.15em] text-[#87958d]">
                TRADITIONAL CV
              </p>
              <div className="mt-9 grid grid-cols-2 gap-4 text-sm text-[#87958d]">
                <span>Claims</span>
                <span>Self-written</span>
                <span>Experience</span>
                <span>References</span>
                <span>Skills</span>
                <span>Static</span>
              </div>
            </div>
            <div className="rounded-[24px] border-2 border-emerald-700 bg-[#edf3ed] p-7">
              <p className="text-xs font-bold tracking-[.15em] text-emerald-800">
                RATE ME
              </p>
              <div className="mt-9 grid grid-cols-2 gap-4 text-sm font-medium text-[#405149]">
                <span>Verified identity</span>
                <span>Credible ratings</span>
                <span>Relationship context</span>
                <span>Portable reputation</span>
                <span>Professional evidence</span>
                <span>Living profile</span>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-[#17201e] px-5 py-28 text-white lg:py-40">
          <div className="mx-auto max-w-7xl">
            <SectionHead
              eyebrow="A new professional identity"
              title={
                <>
                  Your reputation shouldn&apos;t disappear when you change jobs.
                </>
              }
              copy="Your reputation is built through the people you work with. Rayt Me makes that reputation portable."
            />
            <div className="mt-20 grid gap-5 md:grid-cols-4">
              <div className="rounded-2xl border border-white/15 p-5">
                <p className="text-xs uppercase tracking-widest text-white/50">
                  You
                </p>
                <p className="mt-10 text-xl">Omar Al-Kuwari</p>
              </div>
              {["Al Noor Legal Group", "XYZ Partners", "Your next chapter"].map(
                (x, i) => (
                  <div
                    key={x}
                    className="relative rounded-2xl border border-white/15 p-5 md:mt-12"
                  >
                    <ArrowRight className="absolute -left-4 top-1/2 hidden size-7 -translate-y-1/2 text-emerald-400 md:block" />
                    <p className="text-xs uppercase tracking-widest text-white/50">
                      Company {String.fromCharCode(65 + i)}
                    </p>
                    <p className="mt-10 text-xl">{x}</p>
                  </div>
                ),
              )}
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-emerald-300">
              <ShieldCheck className="size-5" /> Reputation remains attached to
              the professional.
            </div>
          </div>
        </section>
        <section
          id="profile"
          className="mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-40"
        >
          <SectionHead
            eyebrow="Your professional card"
            title={
              <>
                More than a score.
                <br />
                <span className="text-[#87958d]">Less than a CV.</span>
              </>
            }
          />
          <div className="mt-14 grid items-start gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <ProfileCard />
            <div className="rounded-[28px] border border-[#d9dfd9] bg-white p-7 sm:p-10">
              <p className="text-xs font-bold tracking-[.15em] text-[#87958d]">
                PROFESSIONAL SNAPSHOT
              </p>
              <h3 className="mt-5 text-3xl font-semibold tracking-[-.04em]">
                Commercial Law Specialist
              </h3>
              <div className="mt-8 grid gap-7 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold tracking-[.15em] text-emerald-700">
                    PREVIOUS EMPLOYMENT
                  </p>
                  <p className="mt-2 text-[#63706a]">
                    XYZ Law Firm — Senior Associate
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[.15em] text-emerald-700">
                    EDUCATION
                  </p>
                  <p className="mt-2 text-[#63706a]">
                    LL.M. — Harvard
                    <br />
                    LL.B. — Qatar University
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[.15em] text-emerald-700">
                    SKILLS
                  </p>
                  <p className="mt-2 text-[#63706a]">
                    Corporate Law · M&A · Contracts
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[.15em] text-emerald-700">
                    LANGUAGES
                  </p>
                  <p className="mt-2 text-[#63706a]">
                    Arabic · English · French
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[.15em] text-emerald-700">
                    LICENSES
                  </p>
                  <p className="mt-2 text-[#63706a]">Qatar Lawyer License</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[.15em] text-emerald-700">
                    MEMBERSHIPS
                  </p>
                  <p className="mt-2 text-[#63706a]">Bar Association</p>
                </div>
              </div>
              <button className="mt-10 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                View professional snapshot <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative h-16">
            <MotionIllustration kind="network" />
            <MotionIllustration kind="share" />
          </div>
        </div>
        <AnimatedSection
          id="how"
          className="border-y border-[#dfe4de] bg-white px-5 py-28 lg:py-40"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHead
              eyebrow="How it works"
              title="Four steps to a reputation that travels."
            />
            <div className="mt-16 grid gap-4 md:grid-cols-4">
              {[
                ["01", "Create", "Build your professional profile."],
                [
                  "02",
                  "Verify",
                  "Verify identity, contact information and employment or university.",
                ],
                [
                  "03",
                  "Get rated",
                  "People you&apos;ve actually interacted with provide structured feedback.",
                ],
                [
                  "04",
                  "Build reputation",
                  "Your reputation becomes a portable professional asset.",
                ],
              ].map(([num, title, copy]) => (
                <div
                  data-gsap-feature-card
                  key={num}
                  className="border-t-2 border-[#17201e] pt-5 will-change-transform"
                >
                  <p className="text-xs font-bold text-emerald-700">{num}</p>
                  <h3 className="mt-8 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#63706a]">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        <section className="mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-40">
          <SectionHead
            eyebrow="Credible feedback"
            title={
              <>
                Not five stars.
                <br />
                <span className="text-[#87958d]">
                  Five dimensions of professional trust.
                </span>
              </>
            }
          />
          <div className="mt-14">
            <RatingDemo />
          </div>
        </section>
        <section className="bg-[#e9efe9] px-5 py-28 lg:py-40">
          <div className="mx-auto max-w-7xl">
            <SectionHead
              eyebrow="The differentiator"
              title="A reputation score that has to be earned."
              copy="Every profile starts at 3.00. Credible ratings move the score. As evidence accumulates, the score becomes more stable. 5.0 is effectively unreachable."
            />
            <div className="mt-16 grid gap-4 md:grid-cols-5">
              {["3.00", "3.50", "4.00", "4.50", "5.00"].map((x, i) => (
                <div
                  key={x}
                  className="rounded-2xl border border-[#cbd7cc] bg-white/60 p-5"
                >
                  <p className="text-3xl font-semibold tracking-[-.05em]">
                    {x}
                  </p>
                  <div className="mt-8 h-1 rounded-full bg-[#d4ddd5]">
                    <div
                      className="h-1 rounded-full bg-emerald-700"
                      style={{ width: `${20 + i * 18}%` }}
                    />
                  </div>
                  <p className="mt-4 text-xs text-[#63706a]">
                    {i === 4
                      ? "Effectively unreachable"
                      : `${[0, 12, 48, 152][i] ?? 480} credible ratings`}
                  </p>
                </div>
              ))}
            </div>
            <details className="mt-10 rounded-2xl border border-[#cbd7cc] bg-white/50 p-5">
              <summary className="cursor-pointer font-semibold">
                How the score works
              </summary>
              <div className="mt-5 grid gap-4 text-sm text-[#63706a] sm:grid-cols-2">
                <code className="rounded-xl bg-[#17201e] p-5 text-base text-emerald-200">
                  Snew = Sold + α(n) × W × (R − Sold)
                  <br />
                  α(n) = 0.045 / √(n + 10)
                </code>
                <p>
                  S is the reputation score. R is the incoming rating. n is
                  credible rating history. W is credibility weight. α(n) is the
                  adjustment rate.
                </p>
              </div>
            </details>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-40">
          <SectionHead
            eyebrow="Trust"
            title="A rating's influence is earned, not assumed."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              [
                "Rater credibility",
                "0.3×–1.5×",
                "Differentiated, credible ratings carry more influence.",
              ],
              [
                "Relationship credibility",
                "Context matters",
                "A manager, client, colleague or event contact carries different weight.",
              ],
              [
                "Super Voter",
                "Earned, never bought",
                "Sustained credible behavior unlocks a private badge.",
              ],
            ].map(([t, v, c]) => (
              <div
                key={t}
                className="rounded-[24px] border border-[#d9dfd9] bg-white p-7"
              >
                <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-700">
                  {t}
                </p>
                <p className="mt-8 text-3xl font-semibold tracking-[-.05em]">
                  {v}
                </p>
                <p className="mt-4 text-sm leading-6 text-[#63706a]">{c}</p>
              </div>
            ))}
          </div>
        </section>
        <section
          id="business"
          className="bg-[#17201e] px-5 py-28 text-white lg:py-40"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <SectionHead
              eyebrow="For business"
              title="Build trust across your organization."
              copy="Give your people a reputation layer that travels with them — while building stronger professional trust inside your organization."
            />
            <div className="rounded-[24px] border border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <p className="font-semibold">Company network</p>
                <span className="text-xs text-emerald-300">Live overview</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {["Employees", "Reputation", "Themes", "Usage"].map((x) => (
                  <div
                    key={x}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <p className="text-xs text-white/50">{x}</p>
                    <p className="mt-3 text-2xl font-semibold">
                      {x === "Reputation"
                        ? "4.6"
                        : x === "Employees"
                          ? "248"
                          : x === "Themes"
                            ? "12"
                            : "84%"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 h-32 rounded-xl border border-white/10 p-4">
                <div className="flex h-full items-end gap-2">
                  {[32, 48, 44, 62, 58, 77, 68, 90, 82].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-emerald-400/70"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="pricing"
          className="mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-40"
        >
          <SectionHead
            eyebrow="Pricing"
            title="Start building your reputation."
          />
          <div className="mt-14">
            <Pricing />
          </div>
          <p className="mt-7 text-center text-sm text-[#63706a]">
            The cap only applies to ratings you GIVE. There is no limit to
            ratings your profile can RECEIVE.
          </p>
        </section>
        <section className="border-t border-[#dfe4de] bg-white px-5 py-28 lg:py-40">
          <div className="mx-auto max-w-7xl">
            <SectionHead
              eyebrow="Questions"
              title="Everything worth knowing."
            />
            <div className="mt-14">
              <FAQ />
            </div>
          </div>
        </section>
        <section className="px-5 py-28 lg:py-40">
          <div className="mx-auto max-w-5xl rounded-[32px] bg-[#dce8dd] px-6 py-16 text-center sm:px-12">
            <Mark />
            <h2 className="mx-auto mt-8 max-w-3xl text-balance text-5xl font-semibold tracking-[-.07em] text-[#17201e] sm:text-7xl">
              Your reputation travels with you.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#63706a]">
              Build a verified professional reputation that isn&apos;t tied to
              one employer, one CV, or one platform.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button dark>Create your Rayt Me profile</Button>
              <Button>See how it works</Button>
            </div>
            <div className="mx-auto mt-12 flex max-w-md items-center justify-center gap-3 text-xs font-semibold text-[#63706a]">
              <span className="rounded-lg bg-white px-3 py-2">Profile</span>
              <ArrowRight className="size-4" />
              <QrCode className="size-8" />
              <ArrowRight className="size-4" />
              <span className="rounded-lg bg-white px-3 py-2">Phone</span>
              <ArrowRight className="size-4" />
              <span className="rounded-lg bg-white px-3 py-2">Network</span>
            </div>
          </div>
        </section>
      </main>
      <footer
        id="footer"
        className="border-t border-[#dfe4de] bg-white px-5 py-14 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <a className="flex items-center gap-3 font-semibold" href="#top">
              <Mark />
              Rayt Me
            </a>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#63706a]">
              Verified professional reputation, wherever you go.
            </p>
          </div>
          {[
            [
              "Product",
              "How it works",
              "Profiles",
              "Ratings",
              "Trust",
              "Business",
              "Pricing",
            ],
            ["Company", "About", "Contact", "Careers"],
            ["Legal", "Privacy", "Terms", "Disputes", "Data protection"],
            ["App", "iOS", "Google Play"],
          ].map(([head, ...links]) => (
            <div key={head}>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#17201e]">
                {head}
              </p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-[#63706a]">
                {links.map((x) => (
                  <a key={x} href="#top">
                    {x}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-7xl border-t border-[#dfe4de] pt-5 text-xs text-[#87958d]">
          © 2026 Rayt Me. Built for credible professional relationships.
        </div>
      </footer>
    </div>
  );
}

export { RateMeLanding };
