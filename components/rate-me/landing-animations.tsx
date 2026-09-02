"use client";

import { useEffect, useRef, type PropsWithChildren } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function AnimatedSection({
  children,
  className = "",
  id,
}: PropsWithChildren<{ className?: string; id?: string }>) {
  return (
    <section id={id} data-animated-section className={className}>
      {children}
    </section>
  );
}

export function useLandingAnimations() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const reduceMotion = prefersReducedMotion();
      const rtl =
        document.documentElement.dir === "rtl" ||
        window.localStorage.getItem("rate-me-locale") === "ar";
      const dx = rtl ? -1 : 1;
      if (reduceMotion) {
        gsap.set(root.querySelectorAll("[data-gsap-reveal]"), {
          clearProps: "all",
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        return;
      }

      const mobile = isMobile();
      const staggerFactor = mobile ? 0.5 : 1;
      const timeline = gsap.timeline({ defaults: { force3D: false } });

      timeline
        .fromTo(
          "[data-gsap-navbar]",
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        )
        .fromTo(
          "[data-gsap-nav-link]",
          { opacity: 0.4, y: -8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            stagger: 0.08 * staggerFactor,
          },
          "<0.12",
        )
        .fromTo(
          "[data-gsap-hero-card]",
          { x: (mobile ? -24 : -40) * dx, opacity: 1 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out",
          },
          "+=0.15",
        )
        .fromTo(
          "[data-gsap-title-line]",
          { y: 18, opacity: 0.92 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12 * staggerFactor,
          },
          0.2,
        )
        .fromTo(
          "[data-gsap-hero-subtitle]",
          { y: 12, opacity: 0.4 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          0.35,
        )
        // Declared as fromTo: a `from` tween infers its end value from the DOM,
        // which resolved to the already-applied start state and left the CTAs
        // permanently invisible.
        .fromTo(
          "[data-gsap-hero-cta]",
          { scale: 0.98, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.1 * staggerFactor,
          },
          0.45,
        )
        ;

      if (root.querySelector("[data-gsap-floating-enter]")) {
        timeline.from(
          "[data-gsap-floating-enter]",
          {
            x: (_index, element) =>
              Number((element as HTMLElement).dataset.floatX || 0),
            y: (_index, element) =>
              Number((element as HTMLElement).dataset.floatY || 0),
            opacity: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
            stagger: 0.08 * staggerFactor,
          },
          1.2,
        );
      }

      gsap.fromTo(
        "[data-gsap-hero-bg]",
        { scale: 1 },
        {
          scale: 1.08,
          duration: 12,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "80% 0%",
        },
      );

      root
        .querySelectorAll<HTMLElement>("[data-gsap-float]")
        .forEach((element) => {
          const duration = Number(element.dataset.floatDuration || 3);
          gsap.fromTo(
            element,
            { y: -12 },
            {
              y: 12,
              duration,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            },
          );
        });

      gsap.to("[data-gsap-verified-pulse]", {
        scale: 1.05,
        duration: 1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center",
      });
    },
    { scope },
  );

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;

      const rtl =
        document.documentElement.dir === "rtl" ||
        window.localStorage.getItem("rate-me-locale") === "ar";
      const dx = rtl ? -1 : 1;
      const cleanups: Array<() => void> = [];
      const primary = root.querySelector<HTMLElement>(
        "[data-gsap-primary-cta]",
      );
      if (primary) {
        const moveX = gsap.quickTo(primary, "x", {
          duration: 0.35,
          ease: "power3.out",
        });
        const moveY = gsap.quickTo(primary, "y", {
          duration: 0.35,
          ease: "power3.out",
        });
        const arrow = primary.querySelector("[data-gsap-cta-arrow]");
        const onMove = (event: PointerEvent) => {
          if (isMobile()) return;
          const rect = primary.getBoundingClientRect();
          moveX(
            gsap.utils.clamp(
              -20,
              20,
              event.clientX - (rect.left + rect.width / 2),
            ) * 0.35,
          );
          moveY(
            gsap.utils.clamp(
              -20,
              20,
              event.clientY - (rect.top + rect.height / 2),
            ) * 0.35,
          );
        };
        const onEnter = () => {
          gsap.to(primary, {
            scale: 1.03,
            boxShadow: "0 12px 32px rgba(255,255,255,0.18)",
            duration: 0.25,
          });
          gsap.to(arrow, { x: 4 * dx, duration: 0.25, ease: "power3.out" });
        };
        const onLeave = () => {
          moveX(0);
          moveY(0);
          gsap.to(primary, {
            scale: 1,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            duration: 0.3,
          });
          gsap.to(arrow, { x: 0, duration: 0.25, ease: "power3.out" });
        };
        primary.addEventListener("pointermove", onMove);
        primary.addEventListener("pointerenter", onEnter);
        primary.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          primary.removeEventListener("pointermove", onMove);
          primary.removeEventListener("pointerenter", onEnter);
          primary.removeEventListener("pointerleave", onLeave);
        });
      }

      const secondary = root.querySelector<HTMLElement>(
        "[data-gsap-secondary-cta]",
      );
      if (secondary) {
        const arrow = secondary.querySelector("[data-gsap-cta-arrow]");
        const onEnter = () => {
          gsap.to(secondary, {
            borderColor: "rgba(139,92,246,.55)",
            duration: 0.25,
          });
          gsap.fromTo(
            arrow,
            { y: 0 },
            {
              y: 3,
              duration: 0.18,
              repeat: 1,
              yoyo: true,
              ease: "power2.inOut",
            },
          );
        };
        secondary.addEventListener("pointerenter", onEnter);
        cleanups.push(() =>
          secondary.removeEventListener("pointerenter", onEnter),
        );
      }

      root
        .querySelectorAll<HTMLElement>("[data-gsap-nav-link]")
        .forEach((link) => {
          const underline = link.querySelector("[data-gsap-nav-underline]");
          const enter = () =>
            gsap.to(underline, {
              scaleX: 1,
              duration: 0.25,
              ease: "power3.out",
            });
          const leave = () =>
            gsap.to(underline, {
              scaleX: 0,
              duration: 0.25,
              ease: "power2.in",
            });
          link.addEventListener("pointerenter", enter);
          link.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            link.removeEventListener("pointerenter", enter);
            link.removeEventListener("pointerleave", leave);
          });
        });

      root
        .querySelectorAll<HTMLElement>("[data-gsap-profile-card]")
        .forEach((card) => {
          if (card.closest("[data-demo], .rate-hero-nested-stage")) return;
          const glare = card.querySelector<HTMLElement>("[data-gsap-card-glare]");
          const restX = Number(card.dataset.restX || 7);
          const restY = Number(card.dataset.restY || -16);
          const onMove = (event: PointerEvent) => {
            if (isMobile()) return;
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
              rotateY: px * 14,
              rotateX: py * -12,
              scale: 1.03,
              duration: 0.28,
              transformPerspective: 900,
            });
            if (glare) {
              gsap.to(glare, {
                xPercent: px * -45,
                yPercent: py * -45,
                opacity: 0.6,
                duration: 0.28,
              });
            }
          };
          const onLeave = () => {
            gsap.to(card, {
              rotateX: restX,
              rotateY: restY,
              scale: 1,
              duration: 0.5,
              ease: "power3.out",
            });
            if (glare) gsap.to(glare, { opacity: 0, duration: 0.3 });
          };
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope },
  );

  useEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    let cancelled = false;
    let scrollContext: gsap.Context | undefined;
    const rtl =
      document.documentElement.dir === "rtl" ||
      window.localStorage.getItem("rate-me-locale") === "ar";
    const dx = rtl ? -1 : 1;

    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      scrollContext = gsap.context(() => {
        const triggerDefaults = {
          start: "top 80%",
          toggleActions: "play none none none",
        };

        root
          .querySelectorAll<HTMLElement>("[data-gsap-trust]")
          .forEach((section) => {
            const timeline = gsap.timeline({
              scrollTrigger: { trigger: section, ...triggerDefaults },
            });
            timeline
              .from(section.querySelector("[data-gsap-trust-title]"), {
                x: -30 * dx,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
              })
              .from(
                section.querySelectorAll("[data-gsap-trust-item]"),
                {
                  y: 20,
                  opacity: 0,
                  duration: 0.6,
                  ease: "power3.out",
                  stagger: isMobile() ? 0.05 : 0.1,
                },
                "<0.1",
              )
              .fromTo(
                section.querySelectorAll("[data-gsap-check]"),
                {
                  strokeDasharray: 24,
                  strokeDashoffset: 24,
                },
                {
                  strokeDashoffset: 0,
                  duration: 0.4,
                  ease: "power2.out",
                  stagger: isMobile() ? 0.04 : 0.08,
                },
                "<",
              );
          });

        root
          .querySelectorAll<HTMLElement>("[data-animated-section]")
          .forEach((section) => {
            if (section.hasAttribute("data-gsap-trust")) return;
            const heads = section.querySelectorAll("[data-gsap-section-head]");
            const cards = section.querySelectorAll("[data-gsap-feature-card]");
            if (!heads.length && !cards.length) return;
            const timeline = gsap.timeline({
              scrollTrigger: { trigger: section, ...triggerDefaults },
            });
            timeline
              .from(heads, {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
              })
              .from(
                cards,
                {
                  y: 50,
                  opacity: 0,
                  duration: 0.7,
                  ease: "power3.out",
                  stagger: isMobile() ? 0.075 : 0.15,
                },
                "<0.15",
              );

            if (!isMobile()) {
              section
                .querySelectorAll<HTMLElement>("[data-gsap-parallax]")
                .forEach((image) => {
                  gsap.fromTo(
                    image,
                    { y: -30 },
                    {
                      y: 30,
                      ease: "none",
                      scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                      },
                    },
                  );
                });
            }
          });
      }, root);
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      scrollContext?.revert();
    };
  }, []);

  return scope;
}
