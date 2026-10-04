"use client";

import {
  AwardIcon,
  BriefcaseIcon,
  MapPinIcon,
  SearchIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  StarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILES = [
  {
    initials: "MK",
    name: "Maya K.",
    role: "Product & Design",
    score: "4.8",
    superVoter: true,
    tone: "from-violet-500/25 to-fuchsia-500/10",
  },
  {
    initials: "AR",
    name: "Ahmed R.",
    role: "Marketing & Brand",
    score: "4.6",
    superVoter: false,
    tone: "from-[#ad8547]/25 to-amber-500/5",
  },
  {
    initials: "SL",
    name: "Sara L.",
    role: "Strategy & Ops",
    score: "4.9",
    superVoter: true,
    tone: "from-cyan-500/20 to-teal-500/5",
  },
] as const;

/**
 * Marketing visual for #communities — app-style discovery (not the generic network art).
 */
export function CommunitiesSectionVisual({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Communities: search by location and profession, filter by Super Voter and rating"
      className={cn(
        "relative aspect-[5/4] overflow-hidden rounded-3xl border border-white/[0.08]",
        "bg-[#060a10] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(139,92,246,0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(173,133,71,0.18), transparent 50%), radial-gradient(circle at 50% 50%, rgba(15,23,42,0.9), #060a10)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="relative flex h-full flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/90">
              In the app
            </p>
            <p className="mt-1 font-serif text-lg leading-tight text-white sm:text-xl">
              Communities
            </p>
            <p className="mt-0.5 text-[11px] text-white/45">
              Country · profession · filters
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60">
            <SlidersHorizontalIcon className="size-4" aria-hidden />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 backdrop-blur-sm">
          <SearchIcon className="size-3.5 shrink-0 text-white/35" aria-hidden />
          <span className="truncate text-[11px] text-white/50">
            Marketing & Brand in Qatar…
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#ad8547]/35 bg-[#ad8547]/10 px-2 py-0.5 text-[10px] font-medium text-[#e8c98a]">
            <MapPinIcon className="size-3" aria-hidden />
            Qatar
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/70">
            <BriefcaseIcon className="size-3 text-white/45" aria-hidden />
            Marketing
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium text-violet-200">
            <AwardIcon className="size-3 text-[#ad8547]" aria-hidden />
            Super Voter
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/55">
            <StarIcon className="size-3 fill-[#ad8547] text-[#ad8547]" aria-hidden />
            4.5+
          </span>
        </div>

        <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-hidden">
          {PROFILES.map((person) => (
            <div
              key={person.initials}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-gradient-to-r px-2.5 py-2",
                person.tone,
              )}
            >
              <div
                className="grid size-9 shrink-0 place-items-center rounded-lg bg-black/35 text-[10px] font-semibold text-white ring-1 ring-white/10"
              >
                {person.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[11px] font-semibold text-white">
                    {person.name}
                  </p>
                  {person.superVoter ? (
                    <span
                      className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-[#ad8547]/20 px-1 py-px text-[8px] font-semibold uppercase tracking-wide text-[#e8c98a]"
                      title="Super Voter"
                    >
                      <AwardIcon className="size-2.5" aria-hidden />
                      SV
                    </span>
                  ) : (
                    <ShieldCheckIcon
                      className="size-3 shrink-0 text-emerald-400/80"
                      aria-label="Verified"
                    />
                  )}
                </div>
                <p className="truncate text-[10px] text-white/50">{person.role}</p>
              </div>
              <div className="shrink-0 text-end">
                <p className="text-[11px] font-semibold tabular-nums text-white">
                  {person.score}
                </p>
                <p className="text-[8px] text-white/35">score</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-2 text-center text-[9px] leading-relaxed text-white/30">
          Verified professionals · server-weighted reputation
        </p>
      </div>
    </div>
  );
}
