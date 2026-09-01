"use client";

import {
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import Image from "next/image";
import {
  Building2Icon,
  CheckIcon,
  ChevronLeftIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  MonitorIcon,
  NfcIcon,
  PhoneIcon,
  SearchIcon,
  Settings2Icon,
  ShareIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

function WhatsAppMark({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.06 6.48 2.06 12c0 1.76.46 3.48 1.34 5L2 22l5.16-1.35A9.93 9.93 0 0 0 12.04 22c5.5 0 9.96-4.48 9.96-10 0-2.67-1.04-5.18-2.95-7.09ZM12.04 20.16c-1.5 0-2.97-.4-4.26-1.16l-.3-.18-3.06.8.82-2.98-.2-.31a8.17 8.17 0 0 1-1.26-4.33c0-4.52 3.69-8.2 8.22-8.2 2.2 0 4.26.85 5.81 2.4a8.16 8.16 0 0 1 2.41 5.8c0 4.53-3.7 8.16-8.18 8.16Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42l-.47-.01c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z"
      />
    </svg>
  );
}

export function QrFace() {
  return (
    <svg viewBox="0 0 29 29" className="size-full text-white" aria-hidden="true">
      <rect width="29" height="29" fill="black" />
      {[
        [2, 2, 7, 7],
        [20, 2, 7, 7],
        [2, 20, 7, 7],
      ].map(([x, y, w, h]) => (
        <g key={`${x}-${y}`}>
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill="none"
            stroke="white"
            strokeWidth="1.2"
          />
          <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} fill="white" />
        </g>
      ))}
      {[
        [12, 2],
        [16, 4],
        [12, 6],
        [18, 8],
        [12, 10],
        [14, 12],
        [20, 12],
        [24, 12],
        [12, 14],
        [16, 14],
        [22, 16],
        [18, 18],
        [24, 18],
        [12, 20],
        [16, 22],
        [20, 22],
        [24, 24],
        [16, 26],
        [22, 26],
        [10, 16],
        [8, 12],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" fill="white" />
      ))}
    </svg>
  );
}

function StatusGlyphs({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-[5px] text-white", className)}>
      <svg viewBox="0 0 16 10" className="h-[9px] w-[15px]" aria-hidden="true">
        <rect x="0" y="6" width="2.2" height="4" rx="0.4" fill="currentColor" />
        <rect x="3.6" y="4.2" width="2.2" height="5.8" rx="0.4" fill="currentColor" />
        <rect x="7.2" y="2.2" width="2.2" height="7.8" rx="0.4" fill="currentColor" />
        <rect
          x="10.8"
          y="0.4"
          width="2.2"
          height="9.6"
          rx="0.4"
          fill="currentColor"
          opacity="0.45"
        />
      </svg>
      <svg viewBox="0 0 14 10" className="h-[10px] w-[14px]" aria-hidden="true">
        <path
          d="M1.2 6.6c2.4-2.4 6.2-2.4 8.6 0M3.4 8.2c1.2-1.2 3-1.2 4.2 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle cx="5.5" cy="9.4" r="0.8" fill="currentColor" />
      </svg>
      <span className="relative h-[9px] w-[22px] rounded-[3px] border border-white/90">
        <span className="absolute inset-[1.5px] rounded-[1.5px] bg-white" />
        <span className="absolute -right-[2.5px] top-1/2 h-[4px] w-[1.5px] -translate-y-1/2 rounded-r-sm bg-white/80" />
      </span>
    </span>
  );
}

type ShowcasePerson = {
  name: string;
  role: string;
  specialty: string;
  photo: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  slug: string;
};

const PERSON_JAMES: ShowcasePerson = {
  name: "James Carter",
  role: "Marketing Director",
  specialty: "Brand Strategy · Digital Growth",
    photo: "/landing/james-carter.png",
  city: "Austin",
  country: "USA",
  email: "james@brightlane.co",
  phone: "+1 512 555 0142",
  slug: "james-carter",
};

const PERSON_AMELIA: ShowcasePerson = {
  name: "Amelia Hart",
  role: "Brand Lead",
  specialty: "Creative Direction · Growth",
  photo: "/landing/amelia-hart.png",
  city: "London",
  country: "United Kingdom",
  email: "amelia@hartstudio.co.uk",
  phone: "+44 7700 900184",
  slug: "amelia-hart",
};

const PERSON_MAYA: ShowcasePerson = {
  name: "Maya Brooks",
  role: "Product Director",
  specialty: "Product Strategy · Digital Growth",
  photo: "/landing/maya-brooks.png",
  city: "New York",
  country: "USA",
  email: "maya@northline.co",
  phone: "+1 212 555 0148",
  slug: "maya-brooks",
};

const CARD_REST = "rotateY(-7deg) rotateX(5deg)";

function useNestedCardTilt() {
  const cardRef = useRef<HTMLElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = CARD_REST;
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (
      window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }
    const card = cardRef.current;
    if (!card) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = Math.max(
      -0.5,
      Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5),
    );
    const py = Math.max(
      -0.5,
      Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5),
    );
    card.style.transform = `rotateY(${-7 + px * 14}deg) rotateX(${5 + py * -10}deg)`;
    const glare = glareRef.current;
    if (glare) {
      glare.style.opacity = "0.55";
      glare.style.transform = `translate(${px * -28}%, ${py * -28}%)`;
    }
  };

  return { cardRef, glareRef, onPointerMove, resetTilt };
}

function reducedMotionPreview() {
  return window.matchMedia(
    "(max-width: 767px), (prefers-reduced-motion: reduce)",
  ).matches;
}

function useDeviceHover() {
  const shellRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const resetTilt = () => {
    const shell = shellRef.current;
    if (shell) shell.style.transform = "";
    if (glareRef.current) glareRef.current.style.opacity = "";
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotionPreview()) return;
    const shell = shellRef.current;
    if (!shell) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = Math.max(
      -0.5,
      Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5),
    );
    const py = Math.max(
      -0.5,
      Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5),
    );
    shell.style.transform = `rotateY(${px * 12}deg) rotateX(${py * -8}deg)`;
    const glare = glareRef.current;
    if (glare) {
      glare.style.opacity = "0.72";
      glare.style.transform = `translate(${px * 34}%, ${py * 30}%)`;
    }
  };

  return { shellRef, glareRef, onPointerMove, resetTilt };
}

function ScreenGlass({ glareRef }: { glareRef: RefObject<HTMLDivElement | null> }) {
  return (
    <>
      <div aria-hidden="true" className="rate-device-glare" />
      <div
        ref={glareRef}
        aria-hidden="true"
        className="rate-device-glare-spot"
      />
    </>
  );
}

function DeviceHover({
  children,
  className,
}: {
  children: (glareRef: RefObject<HTMLDivElement | null>) => ReactNode;
  className?: string;
}) {
  const { shellRef, glareRef, onPointerMove, resetTilt } = useDeviceHover();
  return (
    <div
      className={cn("rate-device-stage", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
    >
      <div ref={shellRef} className="rate-device-tilt">
        {children(glareRef)}
      </div>
    </div>
  );
}

function NestedRaytCard({
  cardRef,
  glareRef,
  variant = "phone",
  nameAs = "h2",
  showQr = true,
  person = PERSON_JAMES,
  compact = false,
}: {
  cardRef: RefObject<HTMLElement | null>;
  glareRef: RefObject<HTMLDivElement | null>;
  variant?: "phone" | "tablet";
  nameAs?: "h2" | "p";
  showQr?: boolean;
  person?: ShowcasePerson;
  compact?: boolean;
}) {
  const tablet = variant === "tablet" && !compact;
  const NameTag = nameAs;
  return (
    <article
      ref={cardRef}
      className={cn(
        "rate-hero-nested-card relative w-full overflow-hidden bg-[#111114] ring-1 ring-white/14",
        tablet ? "rounded-[1.25rem]" : "rounded-[1.05rem]",
      )}
      style={{
        aspectRatio: "85.6 / 53.98",
        transform: CARD_REST,
      }}
    >
      <div className={cn("w-full bg-[#ad8547]", tablet ? "h-1" : "h-[3px]")} />
      <div
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-40%] opacity-0 [background:radial-gradient(circle_at_center,rgba(255,255,255,0.55),transparent_46%)]"
      />
      <div
        className={cn(
          "flex h-[calc(100%-3px)] flex-col justify-between",
          tablet ? "px-5 pb-4 pt-3.5" : "px-3.5 pb-3 pt-2.5",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className={cn("flex min-w-0 items-start", tablet ? "gap-3.5" : "gap-2.5")}>
            <Image
              src={person.photo}
              alt=""
              width={tablet ? 64 : 44}
              height={tablet ? 64 : 44}
              loading="eager"
              className={cn(
                "shrink-0 rounded-lg object-cover object-top ring-1 ring-white/15",
                tablet ? "size-16" : compact ? "size-9" : "size-11",
              )}
            />
            <div className="min-w-0">
              <NameTag
                data-no-translate
                className={cn(
                  "font-brand font-semibold leading-tight text-white",
                  tablet ? "text-[17px]" : "text-[12px]",
                  compact ? "line-clamp-2 text-[10px] leading-snug" : "truncate",
                )}
              >
                {person.name}
              </NameTag>
              <p
                className={cn(
                  "truncate text-white/55",
                  tablet ? "mt-1 text-xs" : "mt-0.5 text-[10px]",
                )}
              >
                {person.role}
              </p>
              {compact ? null : (
                <p
                  className={cn(
                    "truncate text-white/40",
                    tablet ? "text-[11px]" : "text-[9px]",
                  )}
                >
                  {person.specialty}
                </p>
              )}
            </div>
          </div>
          <div
            className={cn(
              "shrink-0 overflow-hidden rounded-md bg-black ring-1 ring-white/10",
              tablet ? "size-14" : "size-10",
              !showQr && "hidden",
            )}
          >
            <QrFace />
          </div>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div
            className={cn(
              "min-w-0 text-white/50",
              tablet ? "text-[11px] leading-5" : "text-[9px] leading-4",
            )}
          >
            <p className="inline-flex items-center gap-1">
              <MapPinIcon className={tablet ? "size-3" : "size-2.5"} />{" "}
              {`${person.city}, ${person.country}`}
            </p>
            <p dir="ltr" className="truncate">
              {person.email}
            </p>
            {compact ? null : (
              <p dir="ltr">{person.phone}</p>
            )}
          </div>
          <p
            className={cn(
              "font-brand font-semibold tracking-wide text-white/80",
              tablet ? "text-xs" : "text-[10px]",
            )}
          >
            RaytME
          </p>
        </div>
      </div>
    </article>
  );
}

function PhoneProfile() {
  const { cardRef, glareRef, onPointerMove, resetTilt } = useNestedCardTilt();

  return (
    <div className="relative w-[17.75rem] shrink-0">
      <span className="absolute -left-[3px] top-[5.35rem] h-7 w-[3px] rounded-l-[1px] bg-[#3a3a3c]" />
      <span className="absolute -left-[3px] top-[7.35rem] h-10 w-[3px] rounded-l-[1px] bg-[#3a3a3c]" />
      <span className="absolute -left-[3px] top-[10.1rem] h-10 w-[3px] rounded-l-[1px] bg-[#3a3a3c]" />
      <span className="absolute -right-[3px] top-[8.4rem] h-16 w-[3px] rounded-r-[1px] bg-[#3a3a3c]" />
      <div className="relative aspect-[9/19.4] overflow-hidden rounded-[2.65rem] bg-[#1a1a1c] p-[8px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/12">
        <div
          onPointerMove={onPointerMove}
          onPointerLeave={resetTilt}
          className="relative flex h-full flex-col overflow-hidden rounded-[2.1rem] bg-black"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-[11px]">
            <span className="h-[1.32rem] w-[5.7rem] rounded-full bg-black ring-1 ring-white/10" />
          </div>
          <div className="flex items-center justify-between px-6 pt-[14px] text-[11px] font-semibold text-white">
            <span>9:41</span>
            <StatusGlyphs />
          </div>
          <div className="flex items-center justify-between px-4 pt-5 text-white">
            <ChevronLeftIcon className="size-5" />
            <div className="flex items-center gap-3">
              <ShareIcon className="size-4" />
              <Settings2Icon className="size-4" />
            </div>
          </div>
          <p className="px-5 pt-4 text-[10px] font-medium tracking-[0.2em] text-white/40">
            YOUR RAYTME CARD
          </p>
          <div className="rate-hero-nested-stage flex min-h-[9.5rem] flex-1 items-center px-4 py-5">
            <NestedRaytCard cardRef={cardRef} glareRef={glareRef} />
          </div>
          <div className="flex items-center justify-center gap-3 px-6 pb-7">
            {[GlobeIcon, PhoneIcon, MailIcon].map((Icon, index) => (
              <span
                key={index}
                className="grid size-9 place-items-center rounded-full bg-white/[0.08] text-white/80"
              >
                <Icon className="size-3.5" />
              </span>
            ))}
            <span className="grid size-9 place-items-center rounded-full bg-white/[0.08] text-white/80">
              <WhatsAppMark />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WatchQr() {
  return (
    <div className="relative w-[8.6rem] shrink-0">
      <div className="absolute -right-1 top-[3.4rem] h-8 w-[5px] rounded-r-md bg-[#2a2a2a]" />
      <div className="absolute -left-1 top-[4.4rem] h-5 w-[4px] rounded-l-md bg-[#2a2a2a]" />
      <div className="overflow-hidden rounded-[1.85rem] bg-[#111] p-[6px] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.85)] ring-1 ring-white/12">
        <div className="rounded-[1.45rem] bg-black px-2.5 pb-2.5 pt-3">
          <p className="text-center font-brand text-[10px] font-semibold tracking-wide text-white">
            RaytME
          </p>
          <div className="mx-auto mt-1.5 aspect-square w-[5.8rem] overflow-hidden rounded-md">
            <QrFace />
          </div>
          <p className="mt-1.5 text-center text-[8px] tracking-[0.14em] text-white/45">
            Scan to Connect
          </p>
        </div>
      </div>
    </div>
  );
}

export function HeroDeviceStage() {
  return (
    <div className="relative mx-auto flex w-full min-w-0 max-w-[34rem] items-center justify-center lg:justify-end lg:pe-10">
      <div className="relative">
        <PhoneProfile />
        <div className="pointer-events-none absolute -end-[5.4rem] bottom-[4.2rem] z-20 hidden sm:block">
          <WatchQr />
        </div>
      </div>
    </div>
  );
}

export function IpadAppStage() {
  const { cardRef, glareRef, onPointerMove, resetTilt } = useNestedCardTilt();

  return (
    <div className="relative mx-auto w-full max-w-[32rem]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] -z-10 rounded-[40%] bg-[radial-gradient(circle,rgb(139_92_246_/_0.38),transparent_70%)] blur-3xl"
      />
      <div className="rate-ipad-stage">
        <div className="rate-ipad-frame relative">
          <span className="absolute -top-[3px] right-[18%] h-[3px] w-10 rounded-t-[1px] bg-[#3a3a3c]" />
          <span className="absolute -top-[3px] right-[32%] h-[3px] w-6 rounded-t-[1px] bg-[#3a3a3c]" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.85rem] bg-[#1c1c1e] p-[11px] shadow-[0_40px_90px_-24px_rgba(0,0,0,0.88)] ring-1 ring-white/12">
          <span className="pointer-events-none absolute left-1/2 top-[5px] z-20 size-1.5 -translate-x-1/2 rounded-full bg-[#2c2c2e] ring-1 ring-white/10" />
          <div
            onPointerMove={onPointerMove}
            onPointerLeave={resetTilt}
            className="relative flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-black"
          >
            <div className="flex items-center justify-between px-4 pt-3 text-[10px] font-semibold text-white">
              <span>9:41</span>
              <StatusGlyphs />
            </div>
            <div className="flex items-center justify-between gap-2 px-3 pt-2">
              <div className="flex min-w-0 items-center gap-2">
                <Button variant="ghost" size="icon-xs" type="button" tabIndex={-1}>
                  <ChevronLeftIcon />
                </Button>
                <p className="truncate font-brand text-[13px] font-semibold text-white">
                  RaytME
                </p>
                <Badge variant="secondary">Live card</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-xs" type="button" tabIndex={-1}>
                  <ShareIcon />
                </Button>
                <Button variant="ghost" size="icon-xs" type="button" tabIndex={-1}>
                  <Settings2Icon />
                </Button>
              </div>
            </div>
            <p className="px-4 pt-2 text-[9px] font-medium tracking-[0.2em] text-white/40">
              YOUR RAYTME CARD
            </p>
            <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-3 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_6.4rem]">
              <div className="rate-hero-nested-stage">
                <NestedRaytCard
                  cardRef={cardRef}
                  glareRef={glareRef}
                  variant="tablet"
                  nameAs="p"
                  showQr={false}
                />
              </div>
              <div className="hidden flex-col items-center gap-2 rounded-2xl bg-white/[0.04] px-2 py-2.5 ring-1 ring-white/10 sm:flex">
                <Badge variant="outline">
                  <NfcIcon data-icon="inline-start" />
                  NFC
                </Badge>
                <div className="aspect-square w-full overflow-hidden rounded-md bg-background">
                  <QrFace />
                </div>
                <p className="text-center text-[8px] leading-3 text-white/45">
                  Scan or tap to connect
                </p>
              </div>
            </div>
            <span className="pointer-events-none mx-auto mb-2 h-1 w-20 rounded-full bg-white/25" />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

type DirectoryTheme = "brand" | "copper" | "ivory";

const DIRECTORY = [
  {
    person: PERSON_AMELIA,
    score: "4.7",
    ratingsLabel: "/ 5 · 38 ratings",
    theme: "copper" as const,
    company: "Hart Studio",
  },
  {
    person: PERSON_JAMES,
    score: "4.8",
    ratingsLabel: "/ 5 · 62 ratings",
    theme: "brand" as const,
    company: "Brightlane",
  },
  {
    person: PERSON_MAYA,
    score: "4.7",
    ratingsLabel: "/ 5 · 38 ratings",
    theme: "ivory" as const,
    company: "Northline",
  },
];

const DIRECTORY_NAV = ["Directory", "Team", "Cards", "Admin"] as const;

const IPAD_RATINGS = [
  { label: "Reliability", value: 4.8 },
  { label: "Communication", value: 4.6 },
  { label: "Delivery", value: 4.9 },
] as const;

function DirectoryMiniCard({
  person,
  score,
  ratingsLabel,
  theme,
  company,
}: {
  person: ShowcasePerson;
  score: string;
  ratingsLabel: string;
  theme: DirectoryTheme;
  company: string;
}) {
  const ivory = theme === "ivory";
  const brand = theme === "brand";
  const bar = brand ? "#7C3AED" : ivory ? "#C4A574" : "#ad8547";
  const muted = ivory ? "text-[#6E7480]" : "text-white/45";
  return (
    <article
      className={cn(
        "relative w-full overflow-hidden rounded-[0.7rem] ring-1",
        ivory
          ? "bg-[#F4E9D3] text-[#11213D] ring-[#11213D]/12"
          : brand
            ? "bg-[#16121f] text-white ring-violet-500/25"
            : "bg-[#141418] text-white ring-white/10",
      )}
      style={{ aspectRatio: "85.6 / 53.98" }}
    >
      <div className="h-[3px] w-full" style={{ backgroundColor: bar }} />
      <div className="flex h-[calc(100%-3px)] flex-col justify-between px-2 pb-1.5 pt-1.5">
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex min-w-0 items-start gap-1.5">
            <Image
              src={person.photo}
              alt=""
              width={48}
              height={48}
              loading="eager"
              className="size-8 shrink-0 rounded-md object-cover object-top ring-1 ring-black/10"
            />
            <div className="min-w-0">
              <p
                data-no-translate
                className="line-clamp-2 font-brand text-[8px] font-semibold leading-tight"
              >
                {person.name}
              </p>
              <p className={cn("truncate text-[6px] leading-3", muted)}>
                {person.role}
              </p>
              <p data-no-translate className={cn("truncate text-[6px]", muted)}>
                {company}
              </p>
            </div>
          </div>
          <div className="size-7 shrink-0 overflow-hidden rounded-sm bg-black ring-1 ring-white/10">
            <QrFace />
          </div>
        </div>
        <div className="flex items-end justify-between gap-1">
          <div className={cn("min-w-0 text-[6px] leading-3", muted)}>
            <p className="inline-flex items-center gap-0.5">
              <MapPinIcon className="size-2" />
              {`${person.city}, ${person.country}`}
            </p>
            <p dir="ltr" className="truncate">
              {person.email}
            </p>
          </div>
          <div className="shrink-0 text-end">
            <p className="font-brand text-[11px] tabular-nums leading-none">
              {score}
            </p>
            <p className={cn("mt-0.5 text-[5px] leading-none", muted)}>
              {ratingsLabel}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between text-[7px] text-white/55">
        <span>{label}</span>
        <span className="tabular-nums text-white/80">{value.toFixed(1)}</span>
      </div>
      <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#ad8547]"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

function ShowcasePhone() {
  const person = PERSON_JAMES;
  return (
    <DeviceHover>
      {(glareRef) => (
        <div className="relative w-full">
          <span className="rate-iphone-btn absolute -left-[3px] top-[16%] z-20 h-[14px] w-[3px] rounded-l-[1px]" />
          <span className="rate-iphone-btn absolute -left-[3px] top-[24%] z-20 h-[34px] w-[3px] rounded-l-[1px]" />
          <span className="rate-iphone-btn absolute -left-[3px] top-[38%] z-20 h-[34px] w-[3px] rounded-l-[1px]" />
          <span className="rate-iphone-btn absolute -right-[3px] top-[28%] z-20 h-[52px] w-[3px] rounded-r-[1px]" />
          <div className="rate-iphone-frame relative overflow-hidden rounded-[2.15rem] p-[7px]">
            <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[1.7rem] bg-[#050506]">
              <div className="pointer-events-none absolute inset-x-0 top-[7px] z-20 flex justify-center">
                <span className="h-[13px] w-[58px] rounded-full bg-black ring-1 ring-white/14" />
              </div>
              <div className="flex items-center justify-between px-3.5 pt-[11px] text-[8px] font-semibold text-white">
                <span>9:41</span>
                <StatusGlyphs className="origin-end scale-[0.72]" />
              </div>
              <p className="px-3 pt-2 text-center text-[7px] font-medium tracking-[0.18em] text-white/40">
                YOUR RAYTME CARD
              </p>
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1.5 px-3">
                <Image
                  src={person.photo}
                  alt=""
                  width={72}
                  height={72}
                  loading="eager"
                  className="size-14 rounded-2xl object-cover object-top ring-1 ring-white/15"
                />
                <p
                  data-no-translate
                  className="text-center font-brand text-[11px] font-semibold leading-tight text-white"
                >
                  {person.name}
                </p>
                <p className="text-center text-[8px] leading-3 text-white/55">
                  {person.role}
                </p>
                <p className="inline-flex items-center gap-0.5 text-[7px] text-white/40">
                  <MapPinIcon className="size-2.5" />
                  {`${person.city}, ${person.country}`}
                </p>
                <p className="font-brand text-[17px] leading-none tabular-nums text-violet-200">
                  4.8
                </p>
                <p className="text-[7px] text-white/40">/ 5 · 62 ratings</p>
              </div>
              <div className="flex items-center justify-center gap-2 pb-1.5">
                {[GlobeIcon, PhoneIcon, MailIcon].map((Icon, index) => (
                  <span
                    key={index}
                    className="grid size-7 place-items-center rounded-full bg-white/[0.08] text-white/80"
                  >
                    <Icon className="size-3" />
                  </span>
                ))}
              </div>
              <span className="pointer-events-none mx-auto mb-1.5 h-[3px] w-10 rounded-full bg-white/30" />
              <ScreenGlass glareRef={glareRef} />
            </div>
          </div>
        </div>
      )}
    </DeviceHover>
  );
}

function ShowcaseIpad() {
  const person = PERSON_MAYA;
  return (
    <DeviceHover>
      {(glareRef) => (
        <div className="relative w-full">
          <span className="rate-iphone-btn absolute left-[8%] top-1/2 z-20 size-[8px] -translate-y-1/2 rounded-full ring-1 ring-white/20" />
          <div className="rate-ipad-metal relative overflow-hidden rounded-[1.65rem] p-[10px]">
            <div className="relative flex aspect-[4/3] flex-col overflow-hidden rounded-[1.15rem] bg-[#070709]">
              <div className="flex items-center justify-between px-4 pt-2 text-[8px] font-semibold text-white">
                <span>9:41</span>
                <span className="font-brand tracking-[0.14em] text-white/55">
                  iPad Pro
                </span>
                <StatusGlyphs className="origin-end scale-[0.78]" />
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-3 px-3 pb-2 pt-1.5">
                <div className="flex min-h-0 flex-col gap-2">
                  <div className="flex items-start gap-2.5">
                    <Image
                      src={person.photo}
                      alt=""
                      width={56}
                      height={56}
                      loading="eager"
                      className="size-12 shrink-0 rounded-xl object-cover object-top ring-1 ring-white/15"
                    />
                    <div className="min-w-0">
                      <p
                        data-no-translate
                        className="truncate font-brand text-[12px] font-semibold text-white"
                      >
                        {person.name}
                      </p>
                      <p className="truncate text-[8px] text-white/55">
                        {person.role}
                      </p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[7px] text-white/40">
                        <Building2Icon className="size-2.5" />
                        <span data-no-translate>Northline</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="h-4 px-1.5 text-[7px]">
                      <CheckIcon data-icon="inline-start" className="size-2.5" />
                      Verified
                    </Badge>
                    <Badge variant="secondary" className="h-4 px-1.5 text-[7px]">
                      Product
                    </Badge>
                    <Badge variant="outline" className="h-4 px-1.5 text-[7px]">
                      New York
                    </Badge>
                  </div>
                  <div className="mt-auto rounded-xl bg-white/[0.04] px-2.5 py-2 ring-1 ring-white/8">
                    <p className="text-[7px] font-medium tracking-[0.14em] text-white/40">
                      Company
                    </p>
                    <p data-no-translate className="mt-0.5 text-[9px] text-white">
                      Northline
                    </p>
                    <p className="text-[7px] leading-3 text-white/45">
                      {person.specialty}
                    </p>
                    <p className="mt-1 text-[7px] text-white/40">
                      {`${person.city}, ${person.country}`}
                    </p>
                  </div>
                </div>
                <div className="flex min-h-0 flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-brand text-[18px] leading-none tabular-nums text-violet-200">
                        4.7
                      </p>
                      <p className="mt-0.5 text-[7px] text-white/40">
                        / 5 · 38 ratings
                      </p>
                    </div>
                    <div className="size-12 overflow-hidden rounded-md bg-black ring-1 ring-white/10">
                      <QrFace />
                    </div>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col gap-1.5 rounded-xl bg-white/[0.04] px-2.5 py-2 ring-1 ring-white/8">
                    <p className="text-[7px] font-medium tracking-[0.14em] text-white/40">
                      Rating breakdown
                    </p>
                    <div className="flex flex-1 flex-col justify-evenly gap-1.5">
                      {IPAD_RATINGS.map((row) => (
                        <RatingBar
                          key={row.label}
                          label={row.label}
                          value={row.value}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <span className="pointer-events-none mx-auto mb-1.5 h-[4px] w-16 rounded-full bg-white/28" />
              <ScreenGlass glareRef={glareRef} />
            </div>
          </div>
        </div>
      )}
    </DeviceHover>
  );
}

function ShowcaseDesktop() {
  return (
    <DeviceHover>
      {(glareRef) => (
        <div className="relative w-full">
          <div className="rate-mac-lid relative rounded-t-[1.05rem] rounded-b-[0.35rem] p-[10px] pt-[12px]">
            <span className="absolute top-[5px] left-1/2 z-20 size-[7px] -translate-x-1/2 rounded-full bg-[#151517] ring-1 ring-black/50">
              <span className="absolute inset-[1.5px] rounded-full bg-[#5b6f8c]" />
            </span>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[0.45rem] bg-[#08080a]">
              <span className="pointer-events-none absolute top-0 left-1/2 z-10 h-[8px] w-[4.8rem] -translate-x-1/2 rounded-b-[7px] bg-[#3a3a3e]" />
              <div className="flex h-full min-h-0">
                <aside className="hidden h-full w-[18%] shrink-0 flex-col gap-1.5 border-e border-white/8 bg-[#101014] px-2 py-3 sm:flex">
                  <p className="font-brand text-[8px] font-semibold tracking-wide text-white">
                    RaytME
                  </p>
                  {DIRECTORY_NAV.map((item, index) => (
                    <p
                      key={item}
                      className={cn(
                        "rounded-md px-1.5 py-1 text-[7px]",
                        index === 0
                          ? "bg-white/10 text-white"
                          : "text-white/40",
                      )}
                    >
                      {item}
                    </p>
                  ))}
                </aside>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                  <div className="flex h-7 items-center justify-between gap-2 border-b border-white/8 bg-[#121216] px-3">
                    <p className="truncate text-[8px] font-medium text-white/80">
                      Corporate directory
                    </p>
                    <span className="hidden min-w-0 items-center gap-1 rounded-full bg-white/[0.05] px-2 py-0.5 text-[7px] text-white/40 ring-1 ring-white/8 sm:inline-flex">
                      <SearchIcon className="size-2.5" />
                      Search people
                    </span>
                  </div>
                  <div className="flex items-center gap-3 border-b border-white/6 px-3 py-1.5 text-[7px] text-white/45">
                    <span>
                      128 People
                    </span>
                    <span>4.7 Avg rating</span>
                    <span className="hidden sm:inline">3 Brands</span>
                  </div>
                  <div className="grid min-h-0 flex-1 grid-cols-3 content-start items-start gap-2 overflow-hidden p-2 sm:p-2.5">
                    {DIRECTORY.map((entry) => (
                      <DirectoryMiniCard key={entry.person.slug} {...entry} />
                    ))}
                  </div>
                </div>
              </div>
              <ScreenGlass glareRef={glareRef} />
            </div>
          </div>
          <div className="rate-mac-hinge relative mx-[4%] h-[8px]">
            <span className="absolute inset-x-[18%] top-0 h-px bg-white/25" />
            <span className="absolute inset-x-[22%] bottom-0 h-px bg-black/50" />
          </div>
          <div className="rate-mac-base relative mx-[-2%] overflow-hidden rounded-b-[0.9rem] px-[10%] pt-1.5 pb-2">
            <div className="mx-auto h-[22px] w-[32%] rounded-[5px] bg-black/25 ring-1 ring-white/12" />
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-black/55" />
          </div>
        </div>
      )}
    </DeviceHover>
  );
}

type DeviceFocus = "all" | "desktop" | "tablet" | "mobile";

const DEVICE_VIEWS = [
  { id: "desktop" as const, label: "Desktop View", Icon: MonitorIcon },
  { id: "tablet" as const, label: "Tablet View", Icon: TabletIcon },
  { id: "mobile" as const, label: "Mobile View", Icon: SmartphoneIcon },
];

export function CrossDeviceStage() {
  const [focus, setFocus] = useState<DeviceFocus>("all");

  return (
    <div className="flex flex-col gap-5">
      <ToggleGroup
        variant="outline"
        spacing={0}
        size="sm"
        value={focus === "all" ? [] : [focus]}
        onValueChange={(next) => {
          const selected = Array.isArray(next) ? next[0] : next;
          if (
            selected === "desktop" ||
            selected === "tablet" ||
            selected === "mobile"
          ) {
            setFocus((current) => (current === selected ? "all" : selected));
            return;
          }
          setFocus("all");
        }}
        aria-label="Preview layout"
        className="mx-auto flex-wrap justify-center rounded-full border border-white/10 bg-black/35 p-1 backdrop-blur-md"
      >
        {DEVICE_VIEWS.map(({ id, label, Icon }) => (
          <ToggleGroupItem
            key={id}
            value={id}
            className="rounded-full border-0 px-3 text-white/70 hover:bg-white/10 hover:text-white aria-pressed:bg-white aria-pressed:text-black data-[pressed]:bg-white data-[pressed]:text-black"
          >
            <Icon data-icon="inline-start" />
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div
        className={cn(
          "relative mx-auto w-full max-w-[50rem] transition-[height] duration-500 ease-out",
          focus === "all" && "h-[22rem] sm:h-[27rem] lg:h-[30rem]",
          focus === "desktop" && "h-[20rem] sm:h-[26rem] lg:h-[30rem]",
          focus === "tablet" && "h-[18rem] sm:h-[24rem] lg:h-[26rem]",
          focus === "mobile" && "h-[24rem] sm:h-[28rem] lg:h-[30rem]",
        )}
      >
        <div
          className={cn(
            "absolute z-10 transition-all duration-500 ease-out",
            focus === "all" &&
              "top-1 left-0 w-[min(88%,22rem)] sm:w-[min(70%,30rem)] lg:w-[min(68%,34rem)]",
            focus === "desktop" &&
              "top-0 left-1/2 w-[min(94%,38rem)] -translate-x-1/2",
            (focus === "tablet" || focus === "mobile") &&
              "pointer-events-none top-8 left-0 w-[70%] scale-90 opacity-0",
          )}
        >
          <ShowcaseDesktop />
        </div>
        <div
          className={cn(
            "absolute z-20 transition-all duration-500 ease-out",
            focus === "all" &&
              "bottom-[3.2rem] left-[22%] hidden w-[48%] sm:block lg:left-[28%] lg:w-[min(46%,22rem)]",
            focus === "tablet" &&
              "top-2 left-1/2 w-[min(88%,30rem)] -translate-x-1/2",
            (focus === "desktop" || focus === "mobile") &&
              "pointer-events-none hidden scale-90 opacity-0 sm:block",
          )}
        >
          <ShowcaseIpad />
        </div>
        <div
          className={cn(
            "absolute z-30 transition-all duration-500 ease-out",
            focus === "all" &&
              "right-1 bottom-0 w-[9.75rem] -translate-y-3 sm:right-4 sm:w-[11.25rem] lg:right-6 lg:w-[12.5rem]",
            focus === "mobile" &&
              "bottom-0 left-1/2 w-[11rem] -translate-x-1/2 sm:w-[12.5rem]",
            (focus === "desktop" || focus === "tablet") &&
              "pointer-events-none right-0 bottom-0 w-[9.75rem] translate-y-3 scale-90 opacity-0",
          )}
        >
          <ShowcasePhone />
        </div>
      </div>
    </div>
  );
}

export function HeroSkyline() {
  return (
    <div
      data-gsap-hero-bg
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute -top-[22%] right-0 -bottom-[18%] left-0 origin-[80%_0%] scale-[1.16] sm:-top-[26%] lg:-top-[30%]">
        <Image
          src="/landing/doha-skyline-bw.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_38%] blur-[2.5px] grayscale brightness-[1.45] contrast-[1.65] opacity-95"
        />
        <div className="rate-skyline-upper absolute inset-0">
          <Image
            src="/landing/doha-skyline-bw.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[78%_38%] blur-[0.25px] grayscale brightness-[2.15] contrast-[2.35] mix-blend-screen opacity-95"
          />
        </div>
        <div className="rate-skyline-inner-glow" />
        <div className="rate-skyline-windows" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#08060d] from-[0%] via-[#0c0912]/90 via-[18%] to-transparent to-[58%] rtl:bg-gradient-to-l lg:via-[#0c0912]/88 lg:via-[32%] lg:to-[68%]" />
      <div className="absolute inset-y-[8%] start-0 w-[min(40rem,70%)] bg-[radial-gradient(ellipse_at_center,rgb(8_6_13/0.9)_0%,rgb(12_9_18/0.62)_46%,transparent_76%)] rtl:start-auto rtl:end-0" />
      <div className="absolute inset-y-0 end-0 w-[8%] bg-gradient-to-l from-[#0c0912]/40 to-transparent rtl:bg-gradient-to-r" />
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#08060d] from-[24%] via-[#0c0912] via-[60%] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#08060d] to-transparent" />
    </div>
  );
}
