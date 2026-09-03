"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import Image from "next/image";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  Globe2Icon,
  LockIcon,
  MailIcon,
  MenuIcon,
  MinusIcon,
  NfcIcon,
  PlusIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  StarIcon,
  UserPlusIcon,
  UsersIcon,
  Link2Icon,
  AwardIcon,
  EyeOffIcon,
  MapPinIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CrossDeviceStage,
  HeroDeviceStage,
  HeroSkyline,
  IpadAppStage,
  QrFace,
} from "@/components/rate-me/hero-stage";
import {
  AnimatedSection,
  useLandingAnimations,
} from "@/components/rate-me/landing-animations";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { applyLandingCopy } from "@/components/rate-me/landing-copy";
import { RaytmeBot } from "@/components/rate-me/raytme-bot";
import { cardThemeBarColor } from "@/lib/card-theme";
import { WEB_SIGN_UP_DISABLED } from "@/lib/web-sign-in";
import { cn } from "@/lib/utils";

type LandingLocaleValue = {
  arabic: boolean;
  setArabic: (value: boolean) => void;
};

const LandingLocale = createContext<LandingLocaleValue>({
  arabic: false,
  setArabic: () => {},
});

function subscribeLocale(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("rate-me-locale-change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("rate-me-locale-change", onStoreChange);
  };
}

function getLocaleSnapshot() {
  return window.localStorage.getItem("rate-me-locale") === "ar";
}

function useLandingLocale() {
  return useContext(LandingLocale);
}

const USD_PER_EMPLOYEE_YEAR = 16;
const USD_PRO_YEAR = 27;

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const glass = cn(
  "rounded-3xl border border-white/[0.05] bg-slate-900/60 backdrop-blur-xl",
  "shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)] ring-0",
  "transition-all duration-300 ease-out",
  "hover:-translate-y-0.5 hover:border-white/[0.08] hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.28)]",
);

const glassStatic = cn(
  "rounded-3xl border border-white/[0.05] bg-slate-900/60 backdrop-blur-xl",
  "shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)] ring-0",
);

const ctaWhite = cn(
  "rounded-full bg-white px-7 text-sm font-medium text-black shadow-none",
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/90",
);

const ctaDark = cn(
  "rounded-full border border-white/25 bg-white/[0.04] px-7 text-sm font-medium text-white",
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10",
);

const ctaPrimary = ctaWhite;
const ctaGhost = ctaDark;

function SignUpCta({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"a">) {
  if (WEB_SIGN_UP_DISABLED) {
    return (
      <button
        type="button"
        disabled
        className={cn(className, "pointer-events-none cursor-not-allowed opacity-40")}
      >
        {children}
      </button>
    );
  }
  return (
    <a href="/sign-up" className={className} {...rest}>
      {children}
    </a>
  );
}

function LanguageToggle() {
  const { arabic, setArabic } = useLandingLocale();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-full border-white/15 bg-transparent text-white/80 hover:bg-white/5 hover:text-white"
      aria-label={arabic ? "Switch to English" : "التبديل إلى العربية"}
      onClick={() => setArabic(!arabic)}
    >
      <Globe2Icon data-icon="inline-start" />
      <span className="hidden sm:inline">{arabic ? "EN" : "العربية"}</span>
      <span className="sm:hidden">{arabic ? "EN" : "ع"}</span>
    </Button>
  );
}

const navLinks = [
  ["#how", "How it Works"],
  ["#profile", "For Professionals"],
  ["#business", "For Businesses"],
  ["#pricing", "Pricing"],
] as const;

const solutionItems = [
  {
    href: "#how",
    title: "A card that stays current",
    copy: "Update once. Your RaytME profile stays right when a title, number, or company changes.",
    image: "/landing/james-carter.png",
  },
  {
    href: "#how",
    title: "Ratings that carry weight",
    copy: "Honest feedback from people you've worked with — not everyone a five.",
    image: "/landing/maya-brooks.png",
  },
  {
    href: "#share",
    title: "Share anywhere you work",
    copy: "QR, WhatsApp, link, or email signature. Connect without a printed card.",
    image: "/landing/amelia-hart.png",
  },
  {
    href: "#business",
    title: "Built for teams",
    copy: "Give every employee a verified professional identity and a reputation that travels.",
    image: "/landing/avatar-2.png",
  },
  {
    href: "#how",
    title: "Never lose a contact",
    copy: "Save who you meet. Search your list later and reach out when it matters.",
    image: "/landing/avatar-3.png",
  },
] as const;

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
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/70">
        {eyebrow}
      </p>
      <h2 className="text-balance font-serif text-4xl font-semibold tracking-normal text-foreground sm:text-6xl sm:tracking-wide">
        {title}
      </h2>
      {copy ? (
        <p className="mt-6 max-w-xl text-lg leading-8 tracking-normal text-muted-foreground">
          {copy}
        </p>
      ) : null}
    </div>
  );
}

const CARD_THEME = "copper";

type ThemeCardSpec = {
  theme: string;
  themeLabel: string;
  tone: "brand" | "copper" | "ivory";
  name: string;
  nameAsHeading?: boolean;
  initials: string;
  photo?: string;
  role: string;
  location: string;
  score: string;
  ratingsLabel: string;
  email: string;
};

const THEME_CARDS: ThemeCardSpec[] = [
  {
    theme: "#7C3AED",
    themeLabel: "Theme · RaytME",
    tone: "brand",
    name: "James Carter",
    initials: "JC",
    photo: "/landing/james-carter.png",
    role: "Marketing Director",
    location: "Austin, USA",
    score: "4.8",
    ratingsLabel: "/ 5 · 62 ratings",
    email: "james@brightlane.co",
  },
  {
    theme: CARD_THEME,
    themeLabel: "Theme · Copper",
    tone: "copper",
    name: "Sofia Mendes",
    nameAsHeading: true,
    initials: "SM",
    role: "Product Designer · Helio Studio",
    location: "Lisbon · Digital Product",
    score: "4.6",
    ratingsLabel: "/ 5 · 41 ratings",
    email: "sofia@heliostudio.co",
  },
  {
    theme: "ivory",
    themeLabel: "Theme · Ivory",
    tone: "ivory",
    name: "Maya Brooks",
    initials: "MB",
    photo: "/landing/maya-brooks.png",
    role: "Product Director",
    location: "New York, USA",
    score: "4.7",
    ratingsLabel: "/ 5 · 38 ratings",
    email: "maya@northline.co",
  },
];

function ShowcaseThemeCard({
  spec,
  className,
}: {
  spec: ThemeCardSpec;
  className?: string;
}) {
  const accent = cardThemeBarColor(spec.theme);
  const ivory = spec.tone === "ivory";
  const brand = spec.tone === "brand";
  const NameTag = spec.nameAsHeading ? "h2" : "p";

  return (
    <article
      data-gsap-profile-card
      className={cn("relative w-full", className)}
    >
      <Card
        className={cn(
          "gap-0 overflow-hidden py-0 [--card-spacing:--spacing(4)]",
          ivory && "rate-theme-ivory",
          brand && "rate-theme-brand",
        )}
      >
        <div
          aria-hidden="true"
          className="h-1 w-full"
          style={{ backgroundColor: accent }}
        />
        <div
          data-gsap-card-glare
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-30%] opacity-0 [background:radial-gradient(circle_at_center,color-mix(in_oklab,var(--foreground)_40%,transparent),transparent_45%)]"
        />
        {brand ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(124,58,237,0.22),transparent_55%)]"
          />
        ) : null}
        <CardHeader className="relative pt-4">
          <Badge
            variant="outline"
            className={cn(
              "tracking-wide",
              ivory
                ? "border-[#11213D]/10 bg-white/70 text-[#11213D]"
                : "border-white/[0.08] bg-white/[0.03]",
            )}
          >
            {spec.themeLabel}
          </Badge>
          <CardAction>
            <span
              className={cn(
                "flex size-9 items-center justify-center overflow-hidden rounded-lg ring-1",
                ivory
                  ? "bg-white ring-[#11213D]/10"
                  : "bg-black/40 ring-white/10",
              )}
            >
              <span className="size-7">
                <QrFace />
              </span>
            </span>
          </CardAction>
          <div className="mt-3 flex items-start gap-3">
            <Avatar className="size-11 rounded-lg after:rounded-lg">
              {spec.photo ? (
                <AvatarImage
                  src={spec.photo}
                  alt=""
                  className="rounded-lg object-cover object-top"
                />
              ) : null}
              <AvatarFallback
                className={cn(
                  "rounded-lg font-brand text-sm",
                  ivory
                    ? "bg-[#F4E9D3] text-[#11213D]"
                    : brand
                      ? "bg-violet-500/20 text-violet-100"
                      : "bg-violet-500/15 text-violet-100",
                )}
              >
                {spec.initials}
              </AvatarFallback>
              <AvatarBadge>
                <CheckIcon data-gsap-verified-pulse />
              </AvatarBadge>
            </Avatar>
            <div className="min-w-0">
              <NameTag
                data-no-translate
                className={cn(
                  "truncate font-serif text-lg tracking-wide",
                  !spec.nameAsHeading && "font-semibold",
                  ivory && "text-[#11213D]",
                )}
              >
                {spec.name}
              </NameTag>
              <CardDescription
                className={ivory ? "text-[#6E7480]" : undefined}
              >
                {spec.role}
              </CardDescription>
              <p
                className={cn(
                  "mt-0.5 inline-flex items-center gap-1 text-[11px]",
                  ivory ? "text-[#6E7480]" : "text-muted-foreground",
                )}
              >
                <MapPinIcon className="size-3" />
                {spec.location}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative flex flex-col gap-3 pb-4">
          <Separator className={ivory ? "bg-[#11213D]/10" : undefined} />
          <div className="flex items-end justify-between gap-3">
            <div>
              <p
                className={cn(
                  "font-brand text-3xl font-medium tracking-wide tabular-nums",
                  ivory ? "text-[#11213D]" : "text-violet-200",
                )}
              >
                {spec.score}
              </p>
              <p
                className={cn(
                  "text-[11px]",
                  ivory ? "text-[#6E7480]" : "text-muted-foreground",
                )}
              >
                {spec.ratingsLabel}
              </p>
            </div>
            <p
              className={cn(
                "max-w-[9rem] text-end text-[11px] leading-4",
                ivory ? "text-[#6E7480]" : "text-muted-foreground",
              )}
            >
              {brand
                ? "Custom brand"
                : "Virtual business card. Always current."}
            </p>
          </div>
          <div
            className={cn(
              "flex items-center justify-between gap-3 text-[11px]",
              ivory ? "text-[#11213D]" : undefined,
            )}
          >
            <a
              dir="ltr"
              className={cn(
                "inline-flex items-center gap-1.5 truncate underline underline-offset-4 transition-colors duration-300 ease-out",
                ivory
                  ? "text-[#8C6B37] hover:text-[#11213D]"
                  : "hover:text-violet-200",
              )}
              href={`mailto:${spec.email}`}
            >
              <MailIcon />
              {spec.email}
            </a>
            <span
              className={cn(
                "inline-flex items-center gap-1",
                ivory ? "text-[#6E7480]" : "text-muted-foreground",
              )}
            >
              <LockIcon /> Private
            </span>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

function ThemedBusinessCard() {
  return (
    <div className="rate-id-stage w-full min-w-0">
      <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {THEME_CARDS.map((spec) => (
          <ShowcaseThemeCard key={spec.themeLabel} spec={spec} />
        ))}
      </div>
    </div>
  );
}

function SolutionsMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        data-gsap-nav-link
        className="inline-flex items-center gap-1 text-[13px] font-medium text-white/75 transition-colors duration-300 hover:text-white"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Solutions
        <ChevronDownIcon
          className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="fixed inset-x-4 top-[3.6rem] z-50 mx-auto max-w-7xl pt-2 lg:inset-x-8">
          <div className="rounded-2xl border border-white/10 bg-black/95 p-5 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {solutionItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group min-w-0 rounded-xl transition-colors duration-300 hover:bg-white/[0.04]"
                  onClick={() => setOpen(false)}
                >
                  <div className="relative aspect-[5/4] overflow-hidden rounded-xl bg-white/5">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="220px"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-3 text-[14px] font-semibold leading-5 text-white">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-[12px] leading-5 text-white/55">
                    {item.copy}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ResourcesMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 text-[13px] font-medium text-white/75 transition-colors duration-300 hover:text-white"
        aria-expanded={open}
      >
        Resources
        <ChevronDownIcon className="size-3.5" />
      </button>
      {open ? (
        <div className="absolute start-0 top-full z-50 min-w-40 rounded-2xl border border-white/10 bg-[#0c0912]/95 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          {["Help Center", "Guides", "Privacy", "Terms"].map((item) => (
            <a
              key={item}
              href="#footer"
              className="block rounded-xl px-3 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Navbar() {
  const { arabic } = useLandingLocale();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      data-gsap-navbar
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all duration-300 ease-out",
        solid
          ? "bg-[#110c1a]/45 backdrop-blur-2xl backdrop-saturate-150"
          : "bg-[#110c1a]/12 backdrop-blur-xl backdrop-saturate-150",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:px-8">
        <a
          href="#top"
          aria-label="RaytME home"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogoLockup tone="light" />
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.slice(0, 1).map(([href, label]) => (
            <a
              data-gsap-nav-link
              key={href}
              href={href}
              className="relative text-[13px] font-medium text-white/75 transition-colors duration-300 ease-out hover:text-white"
            >
              {label}
              <span
                data-gsap-nav-underline
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-px origin-center scale-x-0 bg-white"
              />
            </a>
          ))}
          <SolutionsMenu />
          {navLinks.slice(1).map(([href, label]) => (
            <a
              data-gsap-nav-link
              key={href}
              href={href}
              className="relative text-[13px] font-medium text-white/75 transition-colors duration-300 ease-out hover:text-white"
            >
              {label}
              <span
                data-gsap-nav-underline
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-px origin-center scale-x-0 bg-white"
              />
            </a>
          ))}
          <ResourcesMenu />
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <button
            type="button"
            disabled
            data-rate-me-copy
            className="cursor-not-allowed text-[13px] font-medium text-white/35"
          >
            Sign in
          </button>
          <SignUpCta className={buttonVariants({ size: "sm", className: ctaWhite })}>
            <span data-rate-me-copy>Get Started</span>
          </SignUpCta>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:hidden">
          <LanguageToggle />
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" />}
            >
              <MenuIcon />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent
              side={arabic ? "left" : "right"}
              className="border-white/[0.06] bg-[#020617]/90 backdrop-blur-xl duration-300 ease-out"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">RaytME</SheetTitle>
                <LogoLockup tone="light" size="sm" />
                <SheetDescription>Navigate the product.</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.slice(0, 1).map(([href, label]) => (
                  <SheetClose
                    key={href}
                    render={
                      <a
                        href={href}
                        className={buttonVariants({
                          variant: "ghost",
                          className: "justify-start",
                        })}
                      />
                    }
                    nativeButton={false}
                  >
                    {label}
                  </SheetClose>
                ))}
                <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  Solutions
                </p>
                {solutionItems.map((item) => (
                  <SheetClose
                    key={item.title}
                    render={
                      <a
                        href={item.href}
                        className={buttonVariants({
                          variant: "ghost",
                          className: "h-auto justify-start py-2 text-start whitespace-normal",
                        })}
                      />
                    }
                    nativeButton={false}
                  >
                    {item.title}
                  </SheetClose>
                ))}
                {navLinks.slice(1).map(([href, label]) => (
                  <SheetClose
                    key={href}
                    render={
                      <a
                        href={href}
                        className={buttonVariants({
                          variant: "ghost",
                          className: "justify-start",
                        })}
                      />
                    }
                    nativeButton={false}
                  >
                    {label}
                  </SheetClose>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  disabled
                  className="justify-start"
                >
                  <span data-rate-me-copy>Sign in</span>
                </Button>
              </nav>
              <SignUpCta className={buttonVariants({ className: cn("mx-4", ctaPrimary) })}>
                Get started
              </SignUpCta>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function TrustStrip() {
  const items = [
    {
      Icon: ShieldCheckIcon,
      key: "Always Up to Date",
      title: "Always Up to Date",
      copy: "Update once, and your card is always current.",
    },
    {
      Icon: StarIcon,
      key: "Ratings That Matter",
      title: "Ratings That Matter",
      copy: "Verified feedback that builds real reputation.",
    },
    {
      Icon: UsersIcon,
      key: "Work & Connect Anywhere",
      title: (
        <>
          Work & Connect
          <br />
          Anywhere
        </>
      ),
      copy: "Share with anyone, anywhere in the world.",
    },
    {
      Icon: LockIcon,
      key: "You're in Control",
      title: "You're in Control",
      copy: "Choose what to share. Keep what's private.",
    },
    {
      Icon: UserPlusIcon,
      key: "Never Lose a Contact",
      title: "Never Lose a Contact",
      copy: "Save connections and reach out anytime.",
    },
  ];
  return (
    <div className="mx-auto max-w-7xl px-5 pb-3 lg:px-8">
      <div className="rate-feature-bar grid w-full grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-white/[0.035] backdrop-blur-md md:grid-cols-5 md:divide-x md:divide-y-0">
        {items.map(({ Icon, key, title, copy }) => (
          <div key={key} className="flex gap-3 px-5 py-5">
            <Icon className="mt-0.5 size-5 shrink-0 text-white/85" />
            <div>
              <p className="text-[13px] font-semibold leading-5 text-white">
                {title}
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-white/48">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HowShareStage() {
  return (
    <div
      aria-hidden="true"
      className="relative isolate h-[38rem] w-full overflow-visible"
    >
      <div
        data-gsap-float
        data-float-duration="2.6"
        className="absolute end-0 top-0 z-20"
      >
        <Card
          size="sm"
          className={cn(glassStatic, "w-[13rem] rotate-6 overflow-visible")}
        >
          <CardContent className="pt-3">
            <div className="mx-auto aspect-square w-[8rem] overflow-hidden rounded-xl bg-background p-1.5 ring-1 ring-foreground/10">
              <QrFace />
            </div>
          </CardContent>
          <CardHeader>
            <Badge variant="outline">
              <QrCodeIcon data-icon="inline-start" />
              QR Code
            </Badge>
            <CardTitle>Scan to connect</CardTitle>
            <CardDescription>Open the camera. Instant profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div
        data-gsap-float
        data-float-duration="3.4"
        className="absolute start-0 top-[8.25rem] z-30"
      >
        <Card
          size="sm"
          className={cn(
            glassStatic,
            "w-[16.5rem] -rotate-3 overflow-visible rounded-[1.6rem]",
          )}
        >
          <CardHeader>
            <Badge variant="outline">
              <SmartphoneIcon data-icon="inline-start" />
              The app
            </Badge>
            <CardAction>
              <Badge variant="secondary">Soon</Badge>
            </CardAction>
            <CardTitle>RaytME on your phone</CardTitle>
            <CardDescription>
              NFC, QR, and your live card — in one app.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <div className="w-full rounded-[1.35rem] bg-background p-1.5 ring-1 ring-foreground/15">
              <div className="mx-auto h-1 w-8 rounded-full bg-foreground/25" />
              <div className="mt-1.5 overflow-hidden rounded-[1.05rem] bg-card">
                <div className="h-0.5 w-full bg-primary/40" />
                <div className="flex items-center gap-2 px-2.5 py-2.5">
                  <Avatar size="sm">
                    <AvatarImage src="/landing/james-carter.png" alt="" />
                    <AvatarFallback>JC</AvatarFallback>
                    <AvatarBadge>
                      <CheckIcon />
                    </AvatarBadge>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p data-no-translate className="truncate text-xs font-medium">
                      James Carter
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      Marketing Director
                    </p>
                  </div>
                  <div className="size-7 overflow-hidden rounded-sm bg-background">
                    <QrFace />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-muted-foreground">iOS & Android · Coming soon</p>
          </CardFooter>
        </Card>
      </div>

      <div
        data-gsap-float
        data-float-duration="2.9"
        className="absolute bottom-1 start-1 z-10"
      >
        <Card
          size="sm"
          className={cn(glassStatic, "w-[13rem] -rotate-6 overflow-visible")}
        >
          <CardHeader>
            <Badge variant="outline">
              <NfcIcon data-icon="inline-start" />
              NFC Tap
            </Badge>
            <CardTitle>Tap to share</CardTitle>
            <CardDescription>Hold phones together. Done.</CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="relative mx-auto grid size-20 place-items-center">
              <span className="rate-signal" />
              <span className="rate-signal" />
              <span className="rate-signal" />
              <Button
                variant="outline"
                size="icon-lg"
                type="button"
                tabIndex={-1}
                className="pointer-events-none"
              >
                <NfcIcon />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HowShareStrip() {
  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:hidden">
      <Card size="sm" className={glassStatic}>
        <CardHeader>
          <Badge variant="outline">
            <QrCodeIcon data-icon="inline-start" />
            QR Code
          </Badge>
          <CardTitle>Scan to connect</CardTitle>
          <CardDescription>Open the camera. Instant profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mx-auto aspect-square w-16 overflow-hidden rounded-lg bg-background p-1 ring-1 ring-foreground/10">
            <QrFace />
          </div>
        </CardContent>
      </Card>
      <Card size="sm" className={cn(glassStatic, "overflow-visible")}>
        <CardHeader>
          <Badge variant="outline">
            <NfcIcon data-icon="inline-start" />
            NFC Tap
          </Badge>
          <CardTitle>Tap to share</CardTitle>
          <CardDescription>Hold phones together. Done.</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="relative mx-auto grid size-14 place-items-center">
            <span className="rate-signal" />
            <span className="rate-signal" />
            <span className="rate-signal" />
            <Button
              variant="outline"
              size="icon"
              type="button"
              tabIndex={-1}
              className="pointer-events-none"
            >
              <NfcIcon />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card size="sm" className={glassStatic}>
        <CardHeader>
          <Badge variant="outline">
            <SmartphoneIcon data-icon="inline-start" />
            The app
          </Badge>
          <CardAction>
            <Badge variant="secondary">Soon</Badge>
          </CardAction>
          <CardTitle>RaytME on your phone</CardTitle>
          <CardDescription>NFC, QR, and your live card — in one app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-xl bg-background/40 px-3 py-2.5 ring-1 ring-foreground/10">
            <Avatar>
              <AvatarImage src="/landing/james-carter.png" alt="" />
              <AvatarFallback>JC</AvatarFallback>
              <AvatarBadge>
                <CheckIcon />
              </AvatarBadge>
            </Avatar>
            <div className="min-w-0">
              <p data-no-translate className="truncate font-medium">James Carter</p>
              <p className="truncate text-muted-foreground">Marketing Director</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SuperVoterStage() {
  return (
    <div
      aria-hidden="true"
      className="relative isolate h-[32rem] w-full overflow-visible"
    >
      <div
        data-gsap-float
        data-float-duration="2.7"
        className="absolute end-0 top-0 z-20"
      >
        <Card
          size="sm"
          className={cn(glassStatic, "w-[13.5rem] rotate-6 overflow-visible")}
        >
          <CardHeader>
            <Badge variant="outline">
              <AwardIcon data-icon="inline-start" />
              Super Voter
            </Badge>
            <CardTitle>Earned standing</CardTitle>
            <CardDescription>
              Credible, honest ratings over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="relative mx-auto grid size-20 place-items-center">
              <span className="rate-signal" />
              <span className="rate-signal" />
              <span className="rate-signal" />
              <Button
                variant="outline"
                size="icon-lg"
                type="button"
                tabIndex={-1}
                className="pointer-events-none"
              >
                <AwardIcon />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        data-gsap-float
        data-float-duration="3.3"
        className="absolute start-0 top-[7.5rem] z-30"
      >
        <Card
          size="sm"
          className={cn(
            glassStatic,
            "w-[16rem] -rotate-3 overflow-visible rounded-[1.6rem]",
          )}
        >
          <CardHeader>
            <Badge variant="outline">
              <ShieldCheckIcon data-icon="inline-start" />
              Earned
            </Badge>
            <CardAction>
              <Badge variant="secondary">Never sold</Badge>
            </CardAction>
            <CardTitle>You can&apos;t buy it</CardTitle>
            <CardDescription>
              Standing is earned. It can be suspended if behavior drops.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-xl bg-background/40 px-3 py-2.5 ring-1 ring-foreground/10">
              <Avatar>
                <AvatarFallback>SM</AvatarFallback>
                <AvatarBadge>
                  <AwardIcon />
                </AvatarBadge>
              </Avatar>
              <div className="min-w-0">
                <p data-no-translate className="truncate font-medium">Sofia Mendes</p>
                <p className="truncate text-muted-foreground">
                  Super Voter · Product Designer
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        data-gsap-float
        data-float-duration="2.8"
        className="absolute bottom-0 start-1 z-10"
      >
        <Card
          size="sm"
          className={cn(glassStatic, "w-[14rem] -rotate-6 overflow-visible")}
        >
          <CardHeader>
            <Badge variant="outline">
              <EyeOffIcon data-icon="inline-start" />
              Private rater
            </Badge>
            <CardTitle>Title shown. Name hidden.</CardTitle>
            <CardDescription>
              A Super Voter rating shows as CEO — not a name.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 rounded-xl bg-background/40 px-3 py-2.5 ring-1 ring-foreground/10">
              <p className="text-xs text-muted-foreground">Rated you</p>
              <p className="font-medium">CEO · Super Voter</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SuperVoterStrip() {
  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:hidden">
      <Card size="sm" className={cn(glassStatic, "overflow-visible")}>
        <CardHeader>
          <Badge variant="outline">
            <AwardIcon data-icon="inline-start" />
            Super Voter
          </Badge>
          <CardTitle>Earned standing</CardTitle>
          <CardDescription>
            Credible, honest ratings over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="relative mx-auto grid size-14 place-items-center">
            <span className="rate-signal" />
            <span className="rate-signal" />
            <span className="rate-signal" />
            <Button
              variant="outline"
              size="icon"
              type="button"
              tabIndex={-1}
              className="pointer-events-none"
            >
              <AwardIcon />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card size="sm" className={glassStatic}>
        <CardHeader>
          <Badge variant="outline">
            <ShieldCheckIcon data-icon="inline-start" />
            Earned
          </Badge>
          <CardAction>
            <Badge variant="secondary">Never sold</Badge>
          </CardAction>
          <CardTitle>You can&apos;t buy it</CardTitle>
          <CardDescription>
            Standing is earned. It can be suspended if behavior drops.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card size="sm" className={glassStatic}>
        <CardHeader>
          <Badge variant="outline">
            <EyeOffIcon data-icon="inline-start" />
            Private rater
          </Badge>
          <CardTitle>Title shown. Name hidden.</CardTitle>
          <CardDescription>
            A Super Voter rating shows as CEO — not a name.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function WhatsAppGlyph({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.06 6.48 2.06 12c0 1.76.46 3.48 1.34 5L2 22l5.16-1.35A9.93 9.93 0 0 0 12.04 22c5.5 0 9.96-4.48 9.96-10 0-2.67-1.04-5.18-2.95-7.09ZM12.04 20.16c-1.5 0-2.97-.4-4.26-1.16l-.3-.18-3.06.8.82-2.98-.2-.31a8.17 8.17 0 0 1-1.26-4.33c0-4.52 3.69-8.2 8.22-8.2 2.2 0 4.26.85 5.81 2.4a8.16 8.16 0 0 1 2.41 5.8c0 4.53-3.7 8.16-8.18 8.16Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42l-.47-.01c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z"
      />
    </svg>
  );
}

function WaysToShare() {
  const items = [
    [QrCodeIcon, "QR Code", "Scan and connect instantly."],
    [NfcIcon, "NFC Tap", "Tap and share in a moment."],
    [Link2Icon, "Custom Link", "Share via your unique link."],
    [WhatsAppGlyph, "WhatsApp", "One tap and it's on its way."],
    [MailIcon, "Email", "Send your card in seconds."],
    [UserPlusIcon, "Add to Contacts", "Save directly to someone's phone."],
  ] as const;
  return (
    <section id="share" className="mx-auto max-w-7xl px-5 pb-14 pt-6 lg:px-8">
      <h2 className="font-brand text-[2rem] font-semibold tracking-tight text-white sm:text-[2.35rem]">
        Ways to share your RaytME
      </h2>
      <p className="mt-2 text-sm text-white/50">
        Share your profile your way. Every time.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {items.map(([Icon, title, copy]) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 py-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20"
          >
            <Icon className="mt-0.5 size-5 shrink-0 text-white" />
            <div>
              <p className="text-[13px] font-semibold leading-5 text-white">
                {title}
              </p>
              <p className="mt-0.5 text-[12px] leading-5 text-white/50">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PreFooterCta() {
  return (
    <section className="px-5 pb-16 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] border border-white/10">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image
            src="/landing/doha-skyline-bw.png"
            alt=""
            fill
            sizes="(min-width: 1280px) 80rem, 100vw"
            className="object-cover object-[50%_35%] opacity-25 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0912] via-[#0c0912]/70 to-[#0c0912]/40" />
        </div>
        <div className="relative z-10 px-4 pt-8 sm:px-8 sm:pt-10 lg:px-10">
          <CrossDeviceStage />
        </div>
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 bg-[#0c0912] px-6 py-8 sm:flex-row sm:items-center lg:px-10">
          <div className="max-w-xl">
            <p className="font-brand text-[1.45rem] font-semibold tracking-tight text-white sm:text-[1.7rem]">
              Your card. Your reputation. Your future.
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
              Professionals in Doha, London, New York, and around the world
              use RaytME — on phone, iPad, and desktop.
            </p>
          </div>
          <SignUpCta
            className={buttonVariants({
              size: "lg",
              className: cn(ctaWhite, "relative z-10 h-12 shrink-0 px-8"),
            })}
          >
            Create Your RaytME Card
            <ArrowRightIcon data-icon="inline-end" />
          </SignUpCta>
        </div>
      </div>
    </section>
  );
}

function StoreBadges() {
  return (
    <div className="mt-4 flex flex-row flex-nowrap items-center gap-2">
      <a
        href="#top"
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-black px-2 ring-1 ring-white/20"
      >
        <svg viewBox="0 0 16 19" className="h-[18px] w-4 text-white" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.2 9.9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.3Zm-2-5.9c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z"
          />
        </svg>
        <span className="pe-1 leading-none text-white">
          <span className="block text-[8px] tracking-wide text-white/70">
            Download on the
          </span>
          <span className="whitespace-nowrap text-[13px] font-semibold">
            App Store
          </span>
        </span>
      </a>
      <a
        href="#top"
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-black px-2 ring-1 ring-white/20"
      >
        <svg viewBox="0 0 18 20" className="h-[18px] w-[16px]" aria-hidden="true">
          <path d="M1 1.2 10.4 10 1 18.8V1.2Z" fill="#34A853" />
          <path d="M1 18.8 10.4 10 13.7 13.2 3.3 19.6c-.8.5-1.8.3-2.3-.4Z" fill="#FBBC04" />
          <path d="M14.8 7.2 13.7 6.8 10.4 10l3.3 3.2 1.1-.4c1.1-.6 1.1-2.1 0-2.8Z" fill="#4285F4" />
          <path d="M1 1.2C1.5.5 2.5.3 3.3.8L13.7 6.8 10.4 10 1 1.2Z" fill="#EA4335" />
        </svg>
        <span className="pe-1 leading-none text-white">
          <span className="block text-[8px] tracking-[0.12em] text-white/70">
            GET IT ON
          </span>
          <span className="whitespace-nowrap text-[13px] font-semibold">
            Google Play
          </span>
        </span>
      </a>
    </div>
  );
}

const pillars = [
  {
    num: "01",
    eyebrow: "RETIRE THE PAPER CARD",
    title: "Paper cards lock you into a title you've already outgrown.",
    copy: "Companies and individuals pay for business cards in bulk. When a role or title changes mid-year, the cards don't — reprinting isn't worth the cost, so people keep handing out cards that are already wrong. RaytME replaces printed cards with a digital business card that can be updated anytime, at no reprint cost. Companies get custom, on-brand themes they can roll out and edit across the whole team instantly, so a title change is a two-second edit instead of a reorder.",
  },
  {
    num: "02",
    eyebrow: "TURN CONTACTS INTO A NETWORK",
    title: "A drawer full of business cards is a dead end, not a network.",
    copy: "Offices end up stacked with business cards from people you met once — most get thrown out, and the ones you keep are useless the moment you need to remember who was good at what. There's no way to search a pile of paper. Add anyone you meet to your list with one tap — you choose who to save, it's not automatic, and you don't need to rate someone to keep them. Organized by profession, your list turns every card you'd normally lose into something searchable: need a reliable accountant, a contractor, a designer you worked with last year? Search by profession and RaytME surfaces exactly who you saved, any rating you gave them, and where you met.",
  },
  {
    num: "03",
    eyebrow: "TRACK GROWTH, NOT GUESSWORK",
    title: "HR can't see who's actually improving.",
    copy: "Performance reviews rely on self-reported updates and manager memory. HR has no ongoing, independent signal of how someone is actually developing — with colleagues, or on work delivered to outside clients. HR and managers can track a staff member's credible score over time, built from real ratings by colleagues and by the third parties they work with. It's a running, verifiable view of growth — not a once-a-year snapshot based on what someone chose to report.",
  },
  {
    num: "04",
    eyebrow: "BUILD TRUST ACROSS ANY BORDER",
    title: "Working across borders, credibility doesn't travel with you.",
    copy: "Work is global now — you can be based in one country and collaborating with companies in several others. But there's no simple way to establish and confirm mutual credibility with someone you may only ever meet through a screen. Share your RaytME code the moment you connect — through an email signature, or a link sent once the work is done. The other side checks your card, saves you to their list, and once the engagement wraps, you rate each other on the work itself. Distance stops being a barrier to trust.",
  },
  {
    num: "05",
    eyebrow: "BE CREDIBLE THE MOMENT IT COUNTS",
    title: "Credibility doesn't show up when it counts.",
    copy: "By the time someone checks you out — searching your name, scrolling a profile, asking around — the meeting, the pitch, or the handshake is already over. Credibility arrives too late to change the outcome. Every RaytME profile is instantly shareable via QR code, NFC tap, direct link, or embedded email signature — no app download required for the person viewing it. Update your information once and every card, link, and signature reflects it immediately, so your credibility is visible at the exact moment of the interaction.",
  },
  {
    num: "06",
    eyebrow: "SEE THE FULL PICTURE, NOT ONE SCORE",
    title: "A single star rating hides more than it reveals.",
    copy: "A great communicator who's unreliable and a reliable person who under-communicates look identical under one generic score. Viewers can't tell what kind of trust they're actually getting. RaytME breaks every score into five distinct categories — Professionalism, Communication, Reliability, Knowledge, and Collaboration — so viewers see the shape of someone's reputation, not just a headline number, and professionals know exactly where to improve.",
  },
  {
    num: "07",
    eyebrow: "GET HONEST FEEDBACK, WITHOUT THE FEAR",
    title: "Honest feedback and public exposure are in tension.",
    copy: "People soften or withhold honest feedback when their name is permanently attached to it — which means the ratings that do get left are often the polite version, not the true one. Raters can submit feedback anonymously, while profile owners control what's shown publicly versus kept private or aggregate-only. Anonymity protects the rater; the rating still counts toward the score.",
  },
  {
    num: "08",
    eyebrow: "RATINGS YOU CAN ACTUALLY TRUST",
    title: "Reputation systems are easy to game.",
    copy: "Star ratings, review platforms, and endorsement systems are routinely manipulated — rating rings, reciprocal reviews, fake accounts — which erodes trust in the score itself. A built-in anti-manipulation engine flags patterns consistent with brigading or coordinated rating rings, relationship-type weighting naturally discounts low-context or unverified raters, and a monthly cap on ratings given makes it impossible to flood the system with fake positive reviews. The system is monitored on an ongoing basis as manipulation tactics evolve.",
  },
  {
    num: "09",
    eyebrow: "MAKE EVERY RATING COUNT",
    title: "Real ratings drive real performance, not just perception.",
    copy: "On most platforms, endorsements and appraisals are easy to hand out and hold little weight — so they don't influence day-to-day behavior. Nobody works harder because of a one-click endorsement. When a company puts its RaytME code in every email signature, the rating becomes real and visible — colleagues know they'll be rated by the people they work with, and employees know third-party clients will rate the service they deliver. That single shift quietly drives better collaboration internally and better service externally, improving how the company performs without anyone having to mandate it.",
  },
  {
    num: "10",
    eyebrow: "ONE REPUTATION, EVERYWHERE YOU GO",
    title: "Reputation is fragmented by platform, role, and geography.",
    copy: "Your credibility gets rebuilt from scratch every time you change companies, roles, or countries — nothing portable carries forward what you've actually earned. RaytME is a single global platform, not tied to one region, industry, or job type. Relationship-type weighting adapts to how you actually work — manager, client, collaborator, vendor, peer — and your score and profile travel with you across roles, companies, and countries.",
  },
] as const;

const relationships = [
  "Worked with",
  "Client",
  "Supplier",
  "Manager",
  "Employee",
  "Met professionally",
  "Event / networking",
];

const ratingLabels = [
  "Professionalism",
  "Communication",
  "Reliability",
  "Knowledge",
  "Collaboration",
];

function sliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? Number(value[0]) : Number(value);
}

function RatingDemo() {
  const { arabic } = useLandingLocale();
  const [relationship, setRelationship] = useState("Worked with");
  const [values, setValues] = useState([4.5, 4, 4.5, 4, 4.5]);
  const [submitted, setSubmitted] = useState(false);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  return (
    <Card className={cn(glass, "[--card-spacing:--spacing(8)]")}>
      <div className="grid gap-10 lg:grid-cols-2">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/70">
            Your context matters
          </p>
          <CardTitle className="font-serif text-3xl tracking-wide">
            How do you know this person?
          </CardTitle>
          <ToggleGroup
            variant="outline"
            spacing={2}
            value={[relationship]}
            onValueChange={(next) => {
              const selected = Array.isArray(next) ? next[0] : next;
              if (selected) setRelationship(String(selected));
            }}
            className="mt-4 flex-wrap"
          >
            {relationships.map((item) => (
              <ToggleGroupItem
                key={item}
                value={item}
                className="rounded-xl border-white/[0.08] transition-all duration-300 ease-out"
              >
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <CardDescription className="mt-4">
            Your relationship with this person affects the credibility of your
            rating.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Structured feedback
              </p>
              <p className="mt-1 font-brand text-4xl font-semibold tracking-wide text-violet-200">
                {avg}
                <span className="ms-1 text-base text-muted-foreground">
                  / 5
                </span>
              </p>
            </div>
          </div>
          <FieldGroup>
            {ratingLabels.map((label, index) => (
              <Field key={label}>
                <div className="flex items-center justify-between">
                  <FieldLabel>{label}</FieldLabel>
                  <span className="text-sm font-semibold tabular-nums">
                    {values[index].toFixed(1)}
                  </span>
                </div>
                <Slider
                  aria-label={label}
                  min={1}
                  max={5}
                  step={0.5}
                  value={values[index]}
                  onValueChange={(next) => {
                    const nextValue = sliderValue(next);
                    setSubmitted(false);
                    setValues(
                      values.map((item, j) => (j === index ? nextValue : item)),
                    );
                  }}
                />
              </Field>
            ))}
          </FieldGroup>
          <Button
            className={ctaPrimary}
            onClick={() => setSubmitted(true)}
          >
            {submitted ? (
              <>
                <CheckIcon data-icon="inline-start" />
                {arabic ? "تم إرسال التقييم" : "Rating submitted"}
              </>
            ) : arabic ? (
              "إرسال التقييم"
            ) : (
              "Submit rating"
            )}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}

const faqItems = [
  {
    q: "What is RaytME?",
    a: "RaytME is a verified professional reputation platform and virtual business card. It converts real professional interactions into a credibility-weighted reputation score, shareable via QR code, NFC, link, or email signature.",
  },
  {
    q: "How is the reputation score calculated?",
    a: "Every rating updates your score using a weighted formula that accounts for relationship type, rating category, and how established your score already is — so a single rating on a brand-new profile moves the score more than one additional rating on a well-established profile. This keeps the score responsive early on and stable over time.",
  },
  {
    q: "Why does RaytME not use a normal average?",
    a: "A simple average treats every rating the same. RaytME weights honest, contextual feedback so a thoughtful rating counts more than noise.",
  },
  {
    q: "Who can rate me?",
    a: "Anyone you've had a real professional interaction with — managers, clients, collaborators, vendors, or peers. Ratings are weighted differently depending on the nature of that relationship.",
  },
  {
    q: "Can ratings be anonymous?",
    a: "Yes. Raters can choose to submit feedback anonymously, and profile owners control what's shown publicly versus kept private, without losing the rating's contribution to the score.",
  },
  {
    q: "How does RaytME prevent fake or manipulated ratings?",
    a: "A built-in anti-manipulation engine detects patterns like rating rings, brigading, or low-context raters; relationship-type weighting naturally discounts unverified or low-trust inputs; and every account has a monthly cap on ratings given, so no one can flood the system with fake positive reviews.",
  },
  {
    q: "Is RaytME only for certain industries or regions?",
    a: "No. RaytME is built as a global platform for any professional, in any industry, anywhere in the world.",
  },
  {
    q: "How do I share my RaytME profile?",
    a: "Share it however fits the moment — QR code, NFC tap, a direct link, or an embedded email signature. No app download is required for the person viewing it.",
  },
  {
    q: "Does RaytME sell my data?",
    a: "No. RaytME does not sell user data or rating information.",
  },
  {
    q: "What are the five rating categories?",
    a: "Professionalism, Communication, Reliability, Knowledge, and Collaboration — giving a fuller picture than a single star rating.",
  },
  {
    q: "How does my list work?",
    a: "You choose who to add — it's not automatic. Add anyone you meet with one tap, whether or not you rate them. Once added, they're organized by profession along with any rating you've given and where you met, so you can search your list anytime you need to find someone specific.",
  },
  {
    q: "Can I hide my phone number?",
    a: "Yes. Phone numbers stay private unless you choose to share them. Your virtual card can still be shared without exposing your number.",
  },
  {
    q: "Can I dispute a rating?",
    a: "Yes. Rated users can flag a rating for review and respond publicly.",
  },
  {
    q: "What is Super Voter?",
    a: "Super Voter is an earned standing for sustained credible rating behavior. It is never purchased.",
  },
  {
    q: "Can I use RaytME without the app?",
    a: "You can share and view a public card on the web. Rating, snapshots, and My List are available in the RaytME app.",
  },
  {
    q: "Can businesses use RaytME?",
    a: "Yes. Business plans give every employee a current virtual card and a reputation layer that travels with them.",
  },
];

function Pricing() {
  const { arabic } = useLandingLocale();
  const [employees, setEmployees] = useState(10);
  const seats = Math.max(1, Math.min(10000, employees));
  const total = USD_PER_EMPLOYEE_YEAR * seats;

  return (
    <div className="flex flex-col gap-6">
      <Card className={glass}>
        <CardHeader>
          <CardDescription className="tracking-[0.22em]">
            USD
          </CardDescription>
          <CardTitle className="font-brand text-2xl font-medium tracking-wide">
            Priced in USD
          </CardTitle>
          <CardDescription>
            Scan the QR to create your RaytME card.
          </CardDescription>
          <CardAction>
            <SignUpCta
              className="flex flex-col items-center gap-1"
              aria-label="Scan to create your RaytME card"
            >
              <span className="size-16 overflow-hidden rounded-md bg-background ring-1 ring-white/10">
                <QrFace />
              </span>
              <span className="text-[10px] tracking-wide text-muted-foreground">
                Scan
              </span>
            </SignUpCta>
          </CardAction>
        </CardHeader>
      </Card>
    <div className="grid items-stretch gap-4 lg:grid-cols-3">
      {(
        [
          {
            id: "basic",
            name: "BASIC",
            price: formatUsd(0),
            period: "/ forever",
            recommended: false,
            highlight: false,
            blurb: "For individuals getting started.",
            features: [
              "Unlimited ratings received",
              "25 ratings given / month",
              "5 card themes",
              "Public virtual card",
            ],
            href: "/sign-up",
            cta: "Get started",
            ctaClassName: buttonVariants({
              variant: "outline",
              className: cn(ctaGhost, "h-11 w-full"),
            }),
          },
          {
            id: "pro",
            name: "PRO",
            price: formatUsd(USD_PRO_YEAR),
            period: "/ year",
            recommended: true,
            highlight: true,
            blurb: "For professionals who share often.",
            features: [
              "Unlimited ratings received",
              "60 ratings given / month",
              "Many themes",
              "Custom theme",
            ],
            href: "/sign-up",
            cta: "Go Pro",
            ctaClassName: buttonVariants({
              className: cn(ctaPrimary, "h-11 w-full"),
            }),
          },
          {
            id: "business",
            name: "BUSINESS",
            price: formatUsd(USD_PER_EMPLOYEE_YEAR),
            period: "/ employee / year",
            recommended: false,
            highlight: false,
            blurb: null,
            features: [
              "Unlimited ratings received",
              "50 ratings given / employee",
              "Company-branded theme",
              "Team admin controls",
            ],
            href: "#footer",
            cta: "Talk to us",
            ctaClassName: buttonVariants({
              variant: "outline",
              className: cn(ctaGhost, "h-11 w-full"),
            }),
          },
        ] as const
      ).map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            glass,
            "h-full",
            plan.highlight &&
              "border-violet-500/25 shadow-[0_0_50px_-12px_rgba(139,92,246,0.4)]",
          )}
        >
          <CardHeader>
            <div className="flex h-5 items-center">
              {plan.recommended ? (
                <Badge className="bg-violet-500 text-white shadow-[0_0_24px_-6px_rgba(139,92,246,0.7)]">
                  Recommended
                </Badge>
              ) : (
                <span className="h-5" />
              )}
            </div>
            <CardDescription className="tracking-[0.22em]">
              {plan.name}
            </CardDescription>
            <CardTitle className="flex min-h-[4.75rem] flex-col gap-1 font-brand text-4xl font-medium tracking-wide">
              <span>{plan.price}</span>
              <span className="text-base font-normal text-muted-foreground">
                {plan.period}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-6">
            <div className="min-h-[7.25rem]">
              {plan.id === "business" ? (
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="employees">Employees</FieldLabel>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-white/[0.08] bg-white/[0.03] transition-all duration-300 ease-out"
                        aria-label="Decrease employees"
                        onClick={() =>
                          setEmployees((value) => Math.max(1, value - 1))
                        }
                      >
                        <MinusIcon />
                      </Button>
                      <Input
                        id="employees"
                        type="number"
                        min={1}
                        max={10000}
                        value={seats}
                        onChange={(event) =>
                          setEmployees(Number(event.target.value) || 1)
                        }
                        className="rounded-xl border-white/[0.08] bg-white/[0.04] text-center font-brand text-lg tabular-nums"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-white/[0.08] bg-white/[0.03] transition-all duration-300 ease-out"
                        aria-label="Increase employees"
                        onClick={() =>
                          setEmployees((value) => Math.min(10000, value + 1))
                        }
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                    <FieldDescription>
                      {arabic
                        ? `الإجمالي ${formatUsd(total)} / سنوياً · الفوترة بالدولار`
                        : `Total ${formatUsd(total)} / year · billed in USD`}
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  {plan.blurb}
                </p>
              )}
            </div>
            <ul className="flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 size-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto">
            {plan.href === "/sign-up" ? (
              <SignUpCta className={plan.ctaClassName}>{plan.cta}</SignUpCta>
            ) : (
              <a href={plan.href} className={plan.ctaClassName}>
                {plan.cta}
              </a>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
    </div>
  );
}

export default function RateMeLanding() {
  const animationScope = useLandingAnimations();
  const [localeOverride, setLocaleOverride] = useState<boolean | null>(null);
  const storedArabic = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    () => false,
  );
  const arabic = localeOverride ?? storedArabic;
  const setArabic = (value: boolean) => {
    setLocaleOverride(value);
    window.dispatchEvent(new Event("rate-me-locale-change"));
  };

  useEffect(() => {
    document.documentElement.lang = arabic ? "ar" : "en";
    document.documentElement.dir = arabic ? "rtl" : "ltr";
    document.body.classList.toggle("arabic-mode", arabic);
    window.localStorage.setItem("rate-me-locale", arabic ? "ar" : "en");
    applyLandingCopy(arabic);
    const retry = window.setTimeout(() => applyLandingCopy(arabic), 80);
    return () => window.clearTimeout(retry);
  }, [arabic]);

  useEffect(() => {
    const scrollToFooter = () => {
      if (window.location.hash !== "#footer") return;
      document.getElementById("footer")?.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest(
        'a[href="#footer"]',
      );
      if (!link) return;
      event.preventDefault();
      window.history.pushState(null, "", "#footer");
      scrollToFooter();
    };

    const frame = window.requestAnimationFrame(scrollToFooter);
    window.addEventListener("hashchange", scrollToFooter);
    document.addEventListener("click", onClick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToFooter);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <LandingLocale.Provider value={{ arabic, setArabic }}>
    <div
      ref={animationScope}
      id="top"
      className="rate-landing dark min-h-screen text-foreground"
    >
      <Navbar />
      <main>
        <section className="rate-premium-hero relative isolate overflow-hidden bg-black">
          <HeroSkyline />
          <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 items-center gap-6 overflow-x-hidden px-5 pb-8 pt-[5.5rem] sm:overflow-x-visible lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-2 lg:px-8 lg:pb-10 lg:pt-[5.75rem]">
            <div data-gsap-hero-card className="relative min-w-0 w-full max-w-[21rem] sm:max-w-xl">
              <div
                aria-hidden="true"
                className="rate-hero-copy-scrim pointer-events-none absolute -inset-x-5 -inset-y-6 -z-10 sm:-inset-x-10 sm:-inset-y-10 lg:-inset-x-12"
              />
              <h1 className="w-full font-brand text-[2.15rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                <span data-gsap-title-line className="block w-full will-change-transform">
                  The Professional
                  <br />
                  Identity Platform
                </span>
                <span
                  data-gsap-title-line
                  className="mt-4 block w-full font-serif text-[1.45rem] font-normal italic leading-[1.18] tracking-normal text-white/78 sm:text-[2.1rem] lg:text-[2.45rem]"
                >
                  Built on Verified Reputation.
                </span>
              </h1>
              <p
                data-gsap-hero-subtitle
                className="mt-6 w-full text-[15px] leading-7 text-white/55"
              >
                Every interaction you have — a meeting, a call, an introduction
                — builds your reputation somewhere. RaytME turns it into one
                verified score and card you carry everywhere.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <SignUpCta
                  data-gsap-hero-cta
                  data-gsap-primary-cta
                  className={buttonVariants({
                    size: "lg",
                    className: cn(ctaWhite, "h-12"),
                  })}
                >
                  Create Your Card
                  <ArrowRightIcon data-icon="inline-end" data-gsap-cta-arrow />
                </SignUpCta>
                <a
                  data-gsap-hero-cta
                  data-gsap-secondary-cta
                  href="#business"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: cn(ctaDark, "h-12"),
                  })}
                >
                  For Teams & Businesses
                </a>
              </div>
              <div className="mt-8 flex min-w-0 flex-wrap items-center gap-3">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {["/landing/james-carter.png", "/landing/avatar-2.png", "/landing/avatar-3.png"].map(
                    (src) => (
                      <Image
                        key={src}
                        src={src}
                        alt=""
                        width={36}
                        height={36}
                        className="size-9 rounded-full object-cover ring-2 ring-[#0c0912]"
                      />
                    ),
                  )}
                </div>
                <span className="flex items-center gap-0.5 text-white">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="size-4 fill-white" />
                  ))}
                </span>
                <p className="min-w-0 basis-full text-[13px] text-white/55 sm:basis-auto">
                  Trusted by professionals worldwide
                </p>
              </div>
            </div>
            <div className="min-w-0 max-w-full overflow-hidden lg:overflow-visible">
              <HeroDeviceStage />
            </div>
          </div>
          <TrustStrip />
          <div
            id="about"
            className="rate-about-mix relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-4 lg:px-8 lg:pb-24"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/70">
              About RaytME
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 tracking-normal text-white/70">
              RaytME is a verified professional identity platform. Share your
              profile, collect authentic ratings, and build trust with every
              connection, anywhere in the world.
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-8 tracking-normal text-white/55">
              RaytME is built for a simple idea: a reputation you can prove, not
              just claim.
            </p>
          </div>
        </section>
        <AnimatedSection id="how" className="px-5 py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <SectionHead
              eyebrow="How it works"
              title="Your reputation, proven when it matters."
              copy="Professional reputation today lives in scattered, unverifiable places — a recommendation written as a favor, a testimonial from a screenshot, a “trust me” during a pitch. RaytME is a portable, tamper-resistant way to demonstrate real-world credibility at the exact moment it matters."
            />
            <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
              <div className="flex min-w-0 flex-col">
                {pillars.map((item) => (
                  <div key={item.num} data-gsap-feature-card>
                    <Separator />
                    <div className="grid gap-6 py-16 md:grid-cols-[7rem_1fr] md:gap-14">
                      <p className="font-brand text-5xl font-medium tracking-wide text-violet-500/25">
                        {item.num}
                      </p>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/70">
                          {item.eyebrow}
                        </p>
                        <h3 className="mt-4 max-w-3xl font-serif text-3xl font-semibold tracking-normal sm:text-4xl sm:tracking-wide">
                          {item.title}
                        </h3>
                        <p className="mt-6 max-w-3xl text-base leading-8 tracking-normal text-muted-foreground">
                          {item.copy}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Separator />
              </div>
              <aside className="relative hidden min-h-0 self-stretch lg:block">
                <div className="sticky top-28 pt-4">
                  <HowShareStage />
                </div>
              </aside>
            </div>
            <HowShareStrip />
          </div>
        </AnimatedSection>
        <section
          id="profile"
          className="mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-36"
        >
          <div className="grid items-start gap-12 lg:grid-cols-1 lg:gap-14">
            <SectionHead
              eyebrow="Your professional card"
              title={
                <>
                  One profile.
                  <br />
                  <span className="text-muted-foreground">
                    Your card, your contacts, your reputation.
                  </span>
                </>
              }
              copy="Share RaytME like a business card — on WhatsApp, in an email signature, or as a QR. The card stays current. The ratings travel with you."
            />
            <ThemedBusinessCard />
          </div>
        </section>
        <section className="px-5 py-28 lg:px-8 lg:py-36">
          <Separator />
          <div className="mx-auto max-w-7xl py-28 lg:py-36">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
              <div>
                <SectionHead
                  eyebrow="A card that outlasts the job"
                  title="Your reputation shouldn't disappear when you change jobs."
                  copy="Your RaytME card is yours. The company on it can change. The reputation attached to you does not."
                />
                <div className="mt-20 grid gap-4 sm:grid-cols-2">
                  <Card className={glass}>
                    <CardHeader>
                      <CardDescription className="tracking-[0.22em] text-violet-300/70">
                        You
                      </CardDescription>
                      <CardTitle data-no-translate className="font-serif text-xl tracking-wide">
                        Sofia Mendes
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  {["Helio Studio", "Northstar", "Your next chapter"].map((x) => (
                    <Card key={x} className={glass}>
                      <CardHeader>
                        <CardDescription className="tracking-[0.22em]">
                          Company
                        </CardDescription>
                        <CardTitle className="font-serif text-xl tracking-wide">
                          {x}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
              <aside className="relative hidden min-h-0 self-stretch lg:block">
                <div className="sticky top-28 pt-4">
                  <SuperVoterStage />
                </div>
              </aside>
            </div>
            <SuperVoterStrip />
          </div>
          <Separator />
        </section>
        <section className="mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-36">
          <SectionHead
            eyebrow="Credible feedback"
            title={
              <>
                Not five stars.
                <br />
                <span className="text-muted-foreground">
                  Five dimensions of professional trust.
                </span>
              </>
            }
          />
          <div className="mt-14">
            <RatingDemo />
          </div>
        </section>
        <section id="business" className="px-5 py-28 lg:py-36">
          <Separator />
          <div className="mx-auto grid max-w-7xl gap-12 py-28 lg:grid-cols-2 lg:items-center lg:py-36">
            <SectionHead
              eyebrow="For business"
              title="Build trust across your organization."
              copy="Give every employee a current virtual business card — and a reputation layer that travels with them."
            />
            <Card className={glass}>
              <CardHeader>
                <CardTitle className="tracking-wide">Company network</CardTitle>
                <CardDescription>Live overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                  {[
                    ["Employees", "248"],
                    ["Reputation", "4.6"],
                    ["Themes", "12"],
                    ["Usage", "84%"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-1">
                      <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
                        {label}
                      </p>
                      <p className="font-brand text-3xl font-medium tracking-wide tabular-nums text-violet-100">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Separator />
        </section>
        <section
          id="pricing"
          className="mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-36"
        >
          <SectionHead
            eyebrow="Pricing"
            title="Start building your reputation."
          />
          <div className="mt-14">
            <Pricing />
          </div>
          <p className="mt-7 text-center text-sm text-muted-foreground">
            The cap only applies to ratings you GIVE. There is no limit to
            ratings your profile can RECEIVE.
          </p>
        </section>
        <section className="px-5 py-28 lg:px-8 lg:py-36">
          <Separator />
          <div className="mx-auto max-w-7xl py-28 lg:py-36">
            <SectionHead
              eyebrow="Questions"
              title="Everything worth knowing."
            />
            <div className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-14">
              <Accordion
                defaultValue={["item-0"]}
                className="rounded-3xl border border-white/[0.05] bg-slate-900/40 px-6 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(139,92,246,0.12)]"
              >
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={item.q}
                    value={`item-${index}`}
                    className="border-white/[0.05]"
                  >
                    <AccordionTrigger className="text-base tracking-wide hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground tracking-normal leading-7">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <aside className="relative mx-auto w-full max-w-[28rem] lg:max-w-none">
                <div className="lg:sticky lg:top-28">
                  <IpadAppStage />
                </div>
              </aside>
            </div>
          </div>
        </section>
        <WaysToShare />
        <PreFooterCta />
      </main>
      <footer
        id="footer"
        className="border-t border-white/10 bg-[#0c0912] px-5 py-14 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1fr_1.75fr]">
          <div>
            <a className="inline-flex items-center" href="#top">
              <LogoLockup tone="light" showTagline size="md" />
            </a>
            <p className="mt-5 max-w-[16rem] text-sm leading-6 text-white/45">
              Your digital business card. Share your profile, grow your
              reputation.
            </p>
          </div>
          {[
            ["Product", "How it Works", "Features", "Pricing", "For Teams"],
            ["Company", "About Us", "Blog", "Careers", "Contact"],
            ["Resources", "Help Center", "Guides", "Privacy", "Terms"],
          ].map(([head, ...links]) => (
            <div key={head}>
              <p className="text-[13px] font-semibold text-white">{head}</p>
              <div className="mt-4 flex flex-col gap-2.5 text-[13px] text-white/50">
                {links.map((item) => (
                  <a
                    key={item}
                    href={item === "About Us" ? "#about" : "#top"}
                    className="transition-colors duration-300 ease-out hover:text-white"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div>
            <p className="text-[13px] font-semibold text-white">Download the app</p>
            <p className="mt-4 text-[12px] text-white/40">Coming soon</p>
            <StoreBadges />
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-5 text-[12px] text-white/40">
          <p dir="ltr">Copyright © 2026 RaytME LLC. All rights reserved.</p>
        </div>
      </footer>
      <RaytmeBot arabic={arabic} />
    </div>
    </LandingLocale.Provider>
  );
}

export { RateMeLanding };
