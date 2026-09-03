"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Building2Icon,
  CheckIcon,
  ChevronLeftIcon,
  MapPinIcon,
  MonitorIcon,
  NfcIcon,
  QrCodeIcon,
  SearchIcon,
  Settings2Icon,
  ShareIcon,
  SmartphoneIcon,
  StarIcon,
  TabletIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

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

const PERSON_SOFIA: ShowcasePerson = {
  name: "Sofia Mendes",
  role: "Product Designer",
  specialty: "Digital Product",
  photo: "/landing/avatar-2.png",
  city: "Lisbon",
  country: "Portugal",
  email: "sofia@heliostudio.co",
  phone: "+351 910 555 014",
  slug: "sofia-mendes",
};

const LIST_CONTACTS = [
  PERSON_JAMES,
  PERSON_MAYA,
  PERSON_AMELIA,
  PERSON_SOFIA,
] as const;

function useDemoActions(handlers: Record<string, () => void>) {
  const handlersRef = useRef(handlers);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!root) return;
    const onClick = (event: Event) => {
      const target = event.target;
      const el =
        target instanceof Element
          ? target
          : target instanceof Node
            ? target.parentElement
            : null;
      const node = el?.closest("[data-action]");
      if (!(node instanceof HTMLElement) || !root.contains(node)) return;
      const action = node.dataset.action;
      if (!action) return;
      handlersRef.current[action]?.();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [root]);

  return setRoot;
}

function NestedRaytCard({
  variant = "phone",
  nameAs = "h2",
  showQr = true,
  person = PERSON_JAMES,
  compact = false,
}: {
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
      className={cn(
        "rate-hero-nested-card relative w-full overflow-hidden bg-[#111114] ring-1 ring-white/14",
        tablet ? "rounded-[1.25rem]" : "rounded-[1.05rem]",
      )}
      style={{ aspectRatio: "85.6 / 53.98" }}
    >
      <div className={cn("w-full bg-[#ad8547]", tablet ? "h-1" : "h-[3px]")} />
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

const JAMES_SNAPSHOT = {
  headline: "Brand Strategy Lead",
  sections: [
    {
      label: "Previous employment",
      values: ["Northline — Brand Manager", "Helio Studio — Growth Lead"],
    },
    {
      label: "Education",
      values: ["MBA — UT Austin", "B.A. Marketing — NYU"],
    },
    {
      label: "Skills",
      chips: ["Brand Strategy", "Digital Growth", "Campaigns"],
    },
    {
      label: "Languages",
      chips: ["English", "Spanish"],
    },
    {
      label: "Certifications",
      values: ["Google Ads", "Meta Blueprint"],
    },
    {
      label: "Professional memberships",
      values: ["American Marketing Association"],
    },
  ],
} as const;

const MAYA_SNAPSHOT = {
  headline: "Product Director",
  sections: [
    {
      label: "Previous employment",
      values: ["Brightlane — Product Lead", "Helio Studio — Product Manager"],
    },
    {
      label: "Education",
      values: ["M.S. HCI — NYU", "B.S. Computer Science — Columbia"],
    },
    {
      label: "Skills",
      chips: ["Product Strategy", "Digital Growth", "Roadmaps"],
    },
    {
      label: "Languages",
      chips: ["English", "French"],
    },
  ],
} as const;

const AMELIA_SNAPSHOT = {
  headline: "Brand Lead",
  sections: [
    {
      label: "Previous employment",
      values: ["Hart Studio — Brand Lead", "Northstar — Designer"],
    },
    {
      label: "Education",
      values: ["MA Design — RCA", "BA Visual Arts — Goldsmiths"],
    },
    {
      label: "Skills",
      chips: ["Creative Direction", "Growth", "Brand"],
    },
    {
      label: "Languages",
      chips: ["English"],
    },
  ],
} as const;

type SnapshotData =
  | typeof JAMES_SNAPSHOT
  | typeof MAYA_SNAPSHOT
  | typeof AMELIA_SNAPSHOT;

function SnapshotBody({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/10">
      <p className="font-serif text-[13px] font-semibold text-white">
        {snapshot.headline}
      </p>
      {snapshot.sections.map((section) => (
        <div key={section.label} className="mt-2">
          <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-white/40">
            {section.label}
          </p>
          {"values" in section ? (
            <ul className="mt-0.5 text-[9px] leading-[14px] text-white/80">
              {section.values.map((value) => (
                <li key={value}>• {value}</li>
              ))}
            </ul>
          ) : (
            <div className="mt-1 flex flex-wrap gap-1">
              {section.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/8 px-1.5 py-0.5 text-[7px] text-white/80 ring-1 ring-white/12"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AppListPane({
  mini = false,
}: {
  mini?: boolean;
}) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto", mini ? "px-2 pt-1.5" : "px-3.5 pt-3")}>
      <p className={cn("font-semibold text-white", mini ? "text-[8px]" : "text-[12px]")}>
        My list
      </p>
      <p className={cn("text-white/40", mini ? "mt-0.5 text-[7px]" : "mt-0.5 text-[9px]")}>
        {LIST_CONTACTS.length} contacts
      </p>
      <div className={cn("flex flex-col", mini ? "mt-1.5 gap-1" : "mt-2.5 gap-1.5")}>
        {LIST_CONTACTS.map((person) => (
          <div
            key={person.slug}
            className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-2 py-1.5 ring-1 ring-white/10"
          >
            <Image
              src={person.photo}
              alt=""
              width={40}
              height={40}
              className={cn(
                "shrink-0 rounded-md object-cover object-top",
                mini ? "size-7" : "size-9",
              )}
            />
            <div className="min-w-0 flex-1">
              <p
                data-no-translate
                className={cn(
                  "truncate font-semibold text-white",
                  mini ? "text-[8px]" : "text-[11px]",
                )}
              >
                {person.name}
              </p>
              <p
                className={cn(
                  "truncate text-white/50",
                  mini ? "text-[7px] leading-3" : "text-[9px] leading-4",
                )}
              >
                {person.role}
              </p>
              <p
                className={cn(
                  "truncate text-white/35",
                  mini ? "text-[6px]" : "text-[8px]",
                )}
              >
                {`${person.city}, ${person.country}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppSettingsPane({ mini = false }: { mini?: boolean }) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto", mini ? "px-2 pt-1.5" : "px-3 pt-2")}>
      <p className={cn("font-semibold text-white", mini ? "text-[8px]" : "text-[11px]")}>
        Settings
      </p>
      <div className="mt-2 overflow-hidden rounded-xl ring-1 ring-white/10">
        {["Account", "Notifications", "Privacy"].map((row) => (
          <p
            key={row}
            className="border-b border-white/8 px-3 py-2 text-[9px] text-white/70 last:border-0"
          >
            {row}
          </p>
        ))}
      </div>
    </div>
  );
}

function PhoneTabBar({
  active,
  onSelect,
  wide = false,
}: {
  active: "browse" | "list" | "settings";
  onSelect: (tab: "browse" | "list" | "settings") => void;
  wide?: boolean;
}) {
  const tabs = [
    { id: "browse" as const, label: "Browse", Icon: QrCodeIcon },
    { id: "list" as const, label: "My list", Icon: UsersIcon },
    { id: "settings" as const, label: "Settings", Icon: Settings2Icon },
  ];
  return (
    <div
      className={cn(
        "mt-auto grid shrink-0 grid-cols-3 border-t border-white/10 bg-black",
        wide ? "gap-1 px-2 pb-1.5 pt-1" : "gap-1 px-2 pb-3 pt-1.5",
      )}
    >
      {tabs.map(({ id, label, Icon }) => {
        const on = active === id;
        return (
          <button
            key={id}
            type="button"
            data-action={`tab-${id}`}
            onClick={() => onSelect(id)}
            className={cn(
              "flex min-w-0 items-center justify-center gap-1 font-medium transition-colors",
              wide
                ? "rounded-md py-1.5 text-[7px]"
                : "flex-col rounded-lg px-1 py-1.5 text-[8px]",
              on ? "bg-white/10 text-white" : "text-white/40",
            )}
          >
            <Icon className={wide ? "size-3" : "size-3.5"} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function PhoneRateScreen({
  onBack,
  onSubmitted,
  mini = false,
}: {
  onBack: () => void;
  onSubmitted: () => void;
  mini?: boolean;
}) {
  const scores = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;
  const [score, setScore] = useState<(typeof scores)[number]>(5);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  return (
    <>
      <div className={cn("grid grid-cols-[2.2rem_1fr_2.2rem] items-center text-white", mini ? "px-2 pt-2" : "px-3 pt-3")}>
        <button
          type="button"
          data-action="card"
          onClick={onBack}
          className="inline-flex size-8 items-center justify-start text-white/80"
          aria-label="Back to card"
        >
          <ChevronLeftIcon className={mini ? "size-4" : "size-5"} />
        </button>
        <p className={cn("text-center font-semibold tracking-wide", mini ? "text-[10px]" : "text-[13px]")}>
          Rate
        </p>
        <span />
      </div>
      <div className={cn("min-h-0 flex-1 overflow-y-auto", mini ? "px-2 pb-2 pt-1.5" : "px-3.5 pb-3 pt-2")}>
        <div className={cn("rounded-2xl bg-white/[0.04] ring-1 ring-white/10", mini ? "px-2.5 py-2.5" : "px-3 py-3")}>
          <p className={cn("font-medium text-white/50", mini ? "text-[8px]" : "text-[10px]")}>
            Score
          </p>
          <div className={cn("grid grid-cols-3", mini ? "mt-1.5 gap-1" : "mt-2 gap-1.5")}>
            {scores.map((value) => {
              const on = score === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScore(value)}
                  className={cn(
                    "rounded-full font-semibold tabular-nums ring-1 transition-colors",
                    mini ? "h-7 text-[9px]" : "h-9 text-[11px]",
                    on
                      ? "bg-[#ad8547] text-[#1a1208] ring-[#ad8547]"
                      : "bg-white/[0.04] text-white/70 ring-white/12",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
          <p className={cn("font-medium text-white/50", mini ? "mt-2.5 text-[8px]" : "mt-3.5 text-[10px]")}>
            Comment (optional)
          </p>
          <textarea
            rows={mini ? 2 : 3}
            maxLength={150}
            value={comment}
            onChange={(event) => setComment(event.target.value.slice(0, 150))}
            placeholder="Optional, short comment"
            className={cn(
              "mt-1 w-full resize-none bg-white/[0.04] text-white placeholder:text-white/30 ring-1 ring-white/10 outline-none",
              mini
                ? "rounded-xl px-2 py-1.5 text-[8px] leading-3"
                : "rounded-2xl px-3 py-2.5 text-[11px] leading-4",
            )}
          />
          <p className={cn("text-end text-white/35", mini ? "mt-0.5 text-[7px]" : "mt-1 text-[8px]")}>
            {comment.length}/150
          </p>
          <p className={cn("font-medium text-white/50", mini ? "mt-2.5 text-[8px]" : "mt-3.5 text-[10px]")}>
            How you appear on this rating
          </p>
          <div className={cn("flex flex-col", mini ? "mt-1.5 gap-1" : "mt-2 gap-1.5")}>
            <button
              type="button"
              onClick={() => setAnonymous(true)}
              className={cn(
                "w-full rounded-2xl text-start font-semibold",
                mini ? "px-2.5 py-2 text-[8px] leading-3" : "px-3 py-2.5 text-[11px] leading-4",
                anonymous
                  ? "bg-white text-black"
                  : "bg-white/[0.04] text-white/70 ring-1 ring-white/12",
              )}
            >
              Anonymous
            </button>
            <button
              type="button"
              onClick={() => setAnonymous(false)}
              className={cn(
                "w-full rounded-2xl text-start font-semibold",
                mini ? "px-2.5 py-2 text-[8px] leading-3" : "px-3 py-2.5 text-[11px] leading-4",
                !anonymous
                  ? "bg-white text-black"
                  : "bg-white/[0.04] text-white/70 ring-1 ring-white/12",
              )}
            >
              Show my professional title
            </button>
          </div>
          <button
            type="button"
            data-action="rate-submit"
            onClick={onSubmitted}
            className={cn(
              "w-full rounded-2xl bg-white font-semibold text-black",
              mini ? "mt-2.5 py-2 text-[10px]" : "mt-3.5 py-2.5 text-[12px]",
            )}
          >
            Submit rating
          </button>
        </div>
      </div>
    </>
  );
}

function PhoneAppInterior({
  mini = false,
  demo = "hero-phone",
}: {
  mini?: boolean;
  demo?: string;
}) {
  const [screen, setScreen] = useState<"card" | "snapshot" | "rate">("card");
  const [saved, setSaved] = useState(false);
  const [rated, setRated] = useState(false);
  const [tab, setTab] = useState<"browse" | "list" | "settings">("browse");

  const onTab = (next: "browse" | "list" | "settings") => {
    setTab(next);
    if (next === "browse") setScreen("card");
  };

  const view = tab === "list" || tab === "settings" ? tab : screen;
  const rootRef = useDemoActions({
    rate: () => setScreen("rate"),
    snapshot: () => setScreen("snapshot"),
    card: () => setScreen("card"),
    "list-toggle": () => setSaved((value) => !value),
    "tab-browse": () => onTab("browse"),
    "tab-list": () => onTab("list"),
    "tab-settings": () => onTab("settings"),
    "rate-submit": () => {
      setRated(true);
      setScreen("card");
    },
  });

  return (
    <div
      ref={rootRef}
      data-demo={demo}
      data-screen={view}
      className="flex min-h-0 flex-1 flex-col"
    >
      {tab === "list" ? (
        <AppListPane mini={mini} />
      ) : tab === "settings" ? (
        <AppSettingsPane mini={mini} />
      ) : screen === "card" ? (
        <>
          <div
            className={cn(
              "flex items-center justify-between text-white",
              mini ? "px-2 pt-1.5" : "px-4 pt-4",
            )}
          >
            <ChevronLeftIcon className={mini ? "size-3.5" : "size-5"} />
            <p className={cn("font-semibold tracking-wide", mini ? "text-[8px]" : "text-[11px]")}>
              Professional card
            </p>
            <div className={cn("flex items-center", mini ? "gap-1.5" : "gap-3")}>
              <ShareIcon className={mini ? "size-3" : "size-4"} />
              <Settings2Icon className={mini ? "size-3" : "size-4"} />
            </div>
          </div>
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col overflow-y-auto",
              mini ? "px-2 pb-1 pt-1.5" : "px-3.5 pb-2 pt-3",
            )}
          >
            <p
              className={cn(
                "text-center font-medium tracking-[0.22em] text-white/40",
                mini ? "text-[6px]" : "text-[9px]",
              )}
            >
              YOUR RAYTME CARD
            </p>
            <div className="rate-hero-nested-stage mt-1.5">
              <NestedRaytCard compact />
            </div>
            <div className={cn("flex items-center justify-end", mini ? "mt-1.5 px-0.5" : "mt-3 px-1")}>
              <span
                className={cn(
                  "grid place-items-center rounded-full font-semibold text-[#f4e9d3] ring-[#ad8547]",
                  mini
                    ? "size-6 text-[8px] ring-[1.5px]"
                    : "size-10 text-[11px] ring-[2.5px]",
                )}
              >
                4.8
              </span>
            </div>
            <div className={cn("relative z-10 flex items-stretch", mini ? "mt-1.5 gap-1" : "mt-3 gap-2")}>
              <button
                type="button"
                data-action="rate"
                onClick={() => setScreen("rate")}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10",
                  mini ? "py-1.5" : "py-3",
                )}
              >
                <StarIcon
                  className={cn(
                    "fill-[#ad8547] text-[#ad8547]",
                    mini ? "size-6" : "size-10",
                  )}
                />
                <span
                  className={cn(
                    "absolute font-bold text-[#1a1208]",
                    mini ? "top-[0.7rem] text-[5px]" : "top-[1.35rem] text-[8px]",
                  )}
                >
                  Rate
                </span>
                {rated ? (
                  <span className={cn("font-medium text-[#ad8547]", mini ? "mt-0.5 text-[6px]" : "mt-1 text-[8px]")}>
                    Saved
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                data-action="list-toggle"
                className="flex flex-1 items-center justify-center rounded-2xl px-1"
              >
                <span
                  className={cn(
                    "inline-flex items-center rounded-full font-semibold text-white",
                    mini ? "gap-0.5 px-1.5 py-1 text-[6px]" : "gap-1 px-3 py-2 text-[10px]",
                    saved ? "bg-[#255840]" : "bg-[#2E6B4C]",
                  )}
                >
                  <UserPlusIcon className={mini ? "size-2" : "size-3"} />
                  {saved ? "On my list" : "Add to my List"}
                </span>
              </button>
            </div>
            <button
              type="button"
              data-action="snapshot"
              onClick={() => setScreen("snapshot")}
              className={cn(
                "relative z-10 w-full rounded-2xl bg-white/[0.04] text-center font-semibold text-[#e4d3b0] ring-1 ring-white/10",
                mini ? "mt-1.5 px-1.5 py-1.5 text-[7px]" : "mt-3 px-3 py-3 text-[11px]",
              )}
            >
              View professional snapshot
            </button>
          </div>
        </>
      ) : screen === "rate" ? (
        <PhoneRateScreen
          mini={mini}
          onBack={() => setScreen("card")}
          onSubmitted={() => {
            setRated(true);
            setScreen("card");
          }}
        />
      ) : (
        <>
          <div className={cn("flex items-center justify-between text-white", mini ? "px-2 pt-1.5" : "px-3 pt-4")}>
            <button
              type="button"
              data-action="card"
              onClick={() => setScreen("card")}
              className={cn(
                "inline-flex items-center gap-0.5 font-medium text-white/80",
                mini ? "text-[7px]" : "text-[10px]",
              )}
            >
              <ChevronLeftIcon className={mini ? "size-3" : "size-4"} />
              Back to card
            </button>
            <p className={cn("font-semibold tracking-[0.12em] text-white/35", mini ? "text-[6px]" : "text-[9px]")}>
              THIS PERSON&apos;S CODE
            </p>
          </div>
          <div className={cn("min-h-0 flex-1 overflow-y-auto", mini ? "px-2 pb-1 pt-1.5" : "px-3.5 pb-2 pt-3")}>
            <div className="rounded-2xl bg-white/[0.04] px-2.5 py-2 ring-1 ring-white/10">
              <p className={cn("font-serif font-semibold text-white", mini ? "text-[11px]" : "text-[15px]")}>
                {JAMES_SNAPSHOT.headline}
              </p>
              {JAMES_SNAPSHOT.sections.map((section) => (
                <div key={section.label} className={mini ? "mt-1.5" : "mt-3"}>
                  <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    {section.label}
                  </p>
                  {"values" in section ? (
                    <ul className="mt-0.5 space-y-0.5 text-[9px] leading-[14px] text-white/80">
                      {section.values.map((value) => (
                        <li key={value}>• {value}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {section.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full bg-white/8 px-1.5 py-0.5 text-[7px] text-white/80 ring-1 ring-white/12"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                className={cn(
                  "w-full rounded-xl bg-[#ad8547]/15 text-center font-semibold text-[#e4d3b0]",
                  mini ? "mt-1.5 py-1.5 text-[8px]" : "mt-3 py-2.5 text-[11px]",
                )}
              >
                View CV (supplementary)
              </button>
            </div>
          </div>
        </>
      )}
      {tab === "browse" && (screen === "rate" || screen === "snapshot") ? null : (
        <PhoneTabBar active={tab} onSelect={onTab} />
      )}
    </div>
  );
}

function PhoneProfile() {
  return (
    <div className="relative w-[17.75rem] shrink-0">
      <span className="absolute -left-[3px] top-[5.35rem] h-7 w-[3px] rounded-l-[1px] bg-[#3a3a3c]" />
      <span className="absolute -left-[3px] top-[7.35rem] h-10 w-[3px] rounded-l-[1px] bg-[#3a3a3c]" />
      <span className="absolute -left-[3px] top-[10.1rem] h-10 w-[3px] rounded-l-[1px] bg-[#3a3a3c]" />
      <span className="absolute -right-[3px] top-[8.4rem] h-16 w-[3px] rounded-r-[1px] bg-[#3a3a3c]" />
      <div className="relative aspect-[9/19.4] overflow-hidden rounded-[2.65rem] bg-[#1a1a1c] p-[8px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/12">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2.1rem] bg-black">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-[11px]">
            <span className="h-[1.32rem] w-[5.7rem] rounded-full bg-black ring-1 ring-white/10" />
          </div>
          <div className="flex items-center justify-between px-6 pt-[14px] text-[11px] font-semibold text-white">
            <span>9:41</span>
            <StatusGlyphs />
          </div>
          <PhoneAppInterior />
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
        <div className="pointer-events-none absolute -end-[5.8rem] bottom-[0.6rem] z-20 hidden sm:block">
          <WatchQr />
        </div>
      </div>
    </div>
  );
}

export function IpadAppStage() {
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
          <div className="relative flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-black">
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
    snapshot: AMELIA_SNAPSHOT,
    badge: "Brand",
  },
  {
    person: PERSON_JAMES,
    score: "4.8",
    ratingsLabel: "/ 5 · 62 ratings",
    theme: "brand" as const,
    company: "Brightlane",
    snapshot: JAMES_SNAPSHOT,
    badge: "Marketing",
  },
  {
    person: PERSON_MAYA,
    score: "4.7",
    ratingsLabel: "/ 5 · 38 ratings",
    theme: "ivory" as const,
    company: "Northline",
    snapshot: MAYA_SNAPSHOT,
    badge: "Product",
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
  onOpen,
}: {
  person: ShowcasePerson;
  score: string;
  ratingsLabel: string;
  theme: DirectoryTheme;
  company: string;
  onOpen?: () => void;
}) {
  const ivory = theme === "ivory";
  const brand = theme === "brand";
  const bar = brand ? "#7C3AED" : ivory ? "#C4A574" : "#ad8547";
  const muted = ivory ? "text-[#6E7480]" : "text-white/45";
  return (
    <button
      type="button"
      data-action={`open-${person.slug}`}
      onClick={onOpen}
      className={cn(
        "relative w-full overflow-hidden rounded-[0.7rem] text-start ring-1 transition-transform hover:-translate-y-0.5",
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
    </button>
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

function PersonWorkspace({
  person,
  company,
  score,
  ratingsLabel,
  snapshot,
  badge,
  onBack,
  demo,
}: {
  person: ShowcasePerson;
  company: string;
  score: string;
  ratingsLabel: string;
  snapshot: SnapshotData;
  badge: string;
  onBack?: () => void;
  demo?: string;
}) {
  const [screen, setScreen] = useState<"card" | "snapshot" | "rate">("card");
  const [saved, setSaved] = useState(false);
  const [rated, setRated] = useState(false);
  const [tab, setTab] = useState<"browse" | "list" | "settings">("browse");

  const onTab = (next: "browse" | "list" | "settings") => {
    setTab(next);
    if (next === "browse") setScreen("card");
  };

  const view = tab === "list" || tab === "settings" ? tab : screen;
  const rootRef = useDemoActions({
    rate: () => setScreen("rate"),
    snapshot: () => setScreen("snapshot"),
    card: () => setScreen("card"),
    directory: () => onBack?.(),
    "list-toggle": () => setSaved((value) => !value),
    "tab-browse": () => onTab("browse"),
    "tab-list": () => onTab("list"),
    "tab-settings": () => onTab("settings"),
    "rate-submit": () => {
      setRated(true);
      setScreen("card");
    },
  });

  return (
    <div
      ref={rootRef}
      data-demo={demo}
      data-screen={view}
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      {tab === "list" ? (
        <AppListPane />
      ) : tab === "settings" ? (
        <AppSettingsPane />
      ) : screen === "card" ? (
        <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden px-3", onBack ? "pt-3" : "pt-2")}>
          {onBack ? (
            <button
              type="button"
              data-action="directory"
              onClick={onBack}
              className="mb-2 inline-flex items-center gap-0.5 text-[8px] font-medium text-white/70"
            >
              <ChevronLeftIcon className="size-3.5" />
              Directory
            </button>
          ) : null}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2.5">
                <Image
                  src={person.photo}
                  alt=""
                  width={56}
                  height={56}
                  loading="eager"
                  className="size-11 shrink-0 rounded-xl object-cover object-top ring-1 ring-white/15"
                />
                <div className="min-w-0">
                  <p
                    data-no-translate
                    className="truncate font-brand text-[12px] font-semibold text-white"
                  >
                    {person.name}
                  </p>
                  <p className="truncate text-[8px] text-white/55">{person.role}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[7px] text-white/40">
                    <Building2Icon className="size-2.5" />
                    <span data-no-translate>{company}</span>
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="outline" className="h-4 px-1.5 text-[7px]">
                  <CheckIcon data-icon="inline-start" className="size-2.5" />
                  Verified
                </Badge>
                <Badge variant="secondary" className="h-4 px-1.5 text-[7px]">
                  {badge}
                </Badge>
                <Badge variant="outline" className="h-4 px-1.5 text-[7px]">
                  {person.city}
                </Badge>
              </div>
            </div>
            <div className="flex shrink-0 items-start gap-2.5">
              <div className="text-end">
                <p className="font-brand text-[18px] leading-none tabular-nums text-violet-200">
                  {score}
                </p>
                <p className="mt-0.5 text-[7px] text-white/40">{ratingsLabel}</p>
              </div>
              <div className="size-11 overflow-hidden rounded-md bg-black ring-1 ring-white/10">
                <QrFace />
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 items-stretch gap-2">
            <div className="rounded-xl bg-white/[0.04] px-2.5 py-2 ring-1 ring-white/8">
              <p className="text-[7px] font-medium tracking-[0.14em] text-white/40">
                Company
              </p>
              <p data-no-translate className="mt-1 text-[10px] text-white">
                {company}
              </p>
              <p className="mt-0.5 text-[7px] leading-3 text-white/45">{person.specialty}</p>
              <p className="mt-1 text-[7px] text-white/40">
                {`${person.city}, ${person.country}`}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 rounded-xl bg-white/[0.04] px-2.5 py-2 ring-1 ring-white/8">
              <p className="text-[7px] font-medium tracking-[0.14em] text-white/40">
                Rating breakdown
              </p>
              <div className="flex flex-col justify-center gap-1.5">
                {IPAD_RATINGS.map((row) => (
                  <RatingBar key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-auto flex shrink-0 items-center gap-2 py-2">
            <button
              type="button"
              data-action="rate"
              onClick={() => setScreen("rate")}
              className="relative grid size-8 shrink-0 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-white/10"
            >
              <StarIcon className="size-6 fill-[#ad8547] text-[#ad8547]" />
              <span className="absolute text-[5px] font-bold text-[#1a1208]">Rate</span>
              {rated ? <span className="sr-only">Saved</span> : null}
            </button>
            <button
              type="button"
              data-action="list-toggle"
              className={cn(
                "rounded-full px-3 py-1.5 text-[8px] font-semibold text-white",
                saved ? "bg-[#255840]" : "bg-[#2E6B4C]",
              )}
            >
              {saved ? "On my list" : "Add to my List"}
            </button>
            <button
              type="button"
              data-action="snapshot"
              onClick={() => setScreen("snapshot")}
              className="ms-auto rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[8px] font-semibold text-[#e4d3b0] ring-1 ring-white/10"
            >
              View professional snapshot
            </button>
          </div>
        </div>
      ) : screen === "rate" ? (
        <PhoneRateScreen
          onBack={() => setScreen("card")}
          onSubmitted={() => {
            setRated(true);
            setScreen("card");
          }}
        />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-1 pt-1">
          <button
            type="button"
            data-action="card"
            onClick={() => setScreen("card")}
            className="inline-flex items-center gap-0.5 text-[8px] font-medium text-white/80"
          >
            <ChevronLeftIcon className="size-3.5" />
            Back to card
          </button>
          <div className="mt-1.5">
            <SnapshotBody snapshot={snapshot} />
          </div>
        </div>
      )}
      {tab === "browse" && (screen === "rate" || screen === "snapshot") ? null : (
        <PhoneTabBar wide active={tab} onSelect={onTab} />
      )}
    </div>
  );
}

function ShowcasePhone() {
  return (
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
          <PhoneAppInterior mini demo="cluster-phone" />
        </div>
      </div>
    </div>
  );
}

function ShowcaseIpad() {
  return (
    <div className="relative w-full">
      <span className="rate-iphone-btn absolute left-[8%] top-1/2 z-20 size-[8px] -translate-y-1/2 rounded-full ring-1 ring-white/20" />
      <div className="rate-ipad-metal relative overflow-hidden rounded-[1.65rem] p-[10px]">
        <div className="relative flex aspect-[4/3] flex-col overflow-hidden rounded-[1.15rem] bg-[#070709]">
          <div className="relative z-10 flex h-7 shrink-0 items-center justify-between border-b border-white/10 bg-[#070709] px-4 text-[8px] font-semibold text-white">
            <span>9:41</span>
            <span className="font-brand tracking-[0.14em] text-white/45">
              iPad Pro
            </span>
            <StatusGlyphs className="origin-end scale-[0.78]" />
          </div>
          <PersonWorkspace
            person={PERSON_MAYA}
            company="Northline"
            score="4.7"
            ratingsLabel="/ 5 · 38 ratings"
            snapshot={MAYA_SNAPSHOT}
            badge="Product"
            demo="cluster-tablet"
          />
        </div>
      </div>
    </div>
  );
}

function ShowcaseDesktop() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const entry = DIRECTORY.find((item) => item.person.slug === openSlug);
  const rootRef = useDemoActions({
    "open-amelia-hart": () => setOpenSlug("amelia-hart"),
    "open-james-carter": () => setOpenSlug("james-carter"),
    "open-maya-brooks": () => setOpenSlug("maya-brooks"),
    "close-directory": () => setOpenSlug(null),
  });

  return (
    <div className="relative w-full">
      <div className="rate-mac-lid relative rounded-t-[1.05rem] rounded-b-[0.35rem] p-[10px] pt-[12px]">
        <span className="absolute top-[5px] left-1/2 z-20 size-[7px] -translate-x-1/2 rounded-full bg-[#151517] ring-1 ring-black/50">
          <span className="absolute inset-[1.5px] rounded-full bg-[#5b6f8c]" />
        </span>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.45rem] bg-[#08080a]">
          <span className="pointer-events-none absolute top-0 left-1/2 z-20 h-[10px] w-[4.8rem] -translate-x-1/2 rounded-b-[7px] bg-[#3a3a3e]" />
          <div ref={rootRef} className="flex h-full min-h-0 pt-3">
            <aside className="hidden h-full w-[18%] shrink-0 flex-col gap-1.5 border-e border-white/8 bg-[#101014] px-2 pt-2 pb-3 sm:flex">
              <p className="font-brand text-[8px] font-semibold tracking-wide text-white">
                RaytME
              </p>
              {DIRECTORY_NAV.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  data-action="close-directory"
                  onClick={() => setOpenSlug(null)}
                  className={cn(
                    "rounded-md px-1.5 py-1 text-start text-[7px]",
                    index === 0 ? "bg-white/10 text-white" : "text-white/40",
                  )}
                >
                  {item}
                </button>
              ))}
            </aside>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {entry ? (
                <PersonWorkspace
                  person={entry.person}
                  company={entry.company}
                  score={entry.score}
                  ratingsLabel={entry.ratingsLabel}
                  snapshot={entry.snapshot}
                  badge={entry.badge}
                  onBack={() => setOpenSlug(null)}
                  demo="cluster-desktop"
                />
              ) : (
                <>
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
                    <span>128 People</span>
                    <span>4.7 Avg rating</span>
                    <span className="hidden sm:inline">3 Brands</span>
                  </div>
                  <div className="grid min-h-0 flex-1 grid-cols-3 content-start items-start gap-2 overflow-hidden p-2 sm:p-2.5">
                    {DIRECTORY.map((item) => (
                      <DirectoryMiniCard
                        key={item.person.slug}
                        person={item.person}
                        score={item.score}
                        ratingsLabel={item.ratingsLabel}
                        theme={item.theme}
                        company={item.company}
                        onOpen={() => setOpenSlug(item.person.slug)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
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
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black"
      aria-hidden="true"
    >
      <div className="absolute -top-[18%] right-0 bottom-0 left-0 origin-[80%_0%] scale-[1.12] sm:-top-[22%] lg:-top-[26%]">
        <div className="absolute inset-0 mix-blend-lighten">
          <Image
            src="/landing/doha-skyline-bw.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[78%_42%] grayscale contrast-[1.45] brightness-[0.68] opacity-90"
          />
          <div className="rate-skyline-upper absolute inset-0">
            <Image
              src="/landing/doha-skyline-bw.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[78%_42%] grayscale brightness-[1.15] contrast-[1.9] mix-blend-screen opacity-80"
            />
          </div>
        </div>
        <div className="rate-skyline-inner-glow" />
        <div className="rate-skyline-windows" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black from-[0%] via-black/75 via-[24%] to-transparent to-[68%] rtl:bg-gradient-to-l lg:via-black/70 lg:via-[30%] lg:to-[72%]" />
      <div className="absolute inset-y-[8%] start-0 w-[min(42rem,72%)] bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.88)_0%,rgb(0_0_0/0.45)_50%,transparent_76%)] rtl:start-auto rtl:end-0" />
      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black from-[12%] via-black/70 via-[42%] to-transparent" />
    </div>
  );
}
