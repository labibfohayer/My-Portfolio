/* Labib Fohayer Production Animation Engine */

window.__two26LoaderDone = true;


/* === SCRIPT 1 === */
!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);

/* === SCRIPT 2 === */
(function () {
    function initMagneticHeading() {
      if (typeof gsap === "undefined") return;

      // Find all unique heading wrappers
      const headingWrappers = Array.from(
        document.querySelectorAll(".section-heading-wrapper"),
      );

      if (!headingWrappers.length) {
        const headers = document.querySelectorAll(".section-projects-header");
        headers.forEach((h) => {
          const hw = h.querySelector(".section-heading-wrapper") || h;
          headingWrappers.push(hw);
        });
      }

      if (!headingWrappers.length) return;

      headingWrappers.forEach((headingWrapper) => {
        const headings = headingWrapper.querySelectorAll(".section-heading");
        if (headings.length < 2) return;

        const primaryHeading = headings[0];
        const orangeHeading =
          headingWrapper.querySelector(
            ".section-heading.orange, .section-heading.is-orange, .section-heading[class*='orange']",
          ) || headings[1];

        if (!orangeHeading || orangeHeading === primaryHeading) return;

        // 1. Ensure absolute layering so orange heading sits directly behind black heading
        headingWrapper.style.position = "relative";

        primaryHeading.style.position = "relative";
        primaryHeading.style.zIndex = "2";
        primaryHeading.style.pointerEvents = "none";

        orangeHeading.style.position = "absolute";
        orangeHeading.style.top = "0";
        orangeHeading.style.left = "0";
        orangeHeading.style.width = "100%";
        orangeHeading.style.height = "100%";
        orangeHeading.style.zIndex = "1";
        orangeHeading.style.pointerEvents = "none";
        orangeHeading.style.margin = "0";
        orangeHeading.style.willChange = "transform";

        // 2. Continuous Directional Tracking (1-4px offset)
        const hoverZone =
          headingWrapper.closest(".section-projects-header") ||
          headingWrapper.parentElement ||
          headingWrapper;

        const MAX_OFFSET = 4;

        const handlePointerMove = (e) => {
          const rect = headingWrapper.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dx = e.clientX - centerX;
          const dy = e.clientY - centerY;

          const distance = Math.hypot(dx, dy);
          const maxRadius = Math.max(rect.width, rect.height) / 2 || 100;

          // Normalized intensity based on distance from center (1px to 4px)
          const intensity = Math.min(1, Math.max(0.25, distance / maxRadius));
          const angle = Math.atan2(dy, dx);

          const targetX = Math.cos(angle) * (intensity * MAX_OFFSET);
          const targetY = Math.sin(angle) * (intensity * MAX_OFFSET);

          gsap.to(orangeHeading, {
            x: targetX,
            y: targetY,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto",
          });
        };

        const handlePointerLeave = () => {
          gsap.to(orangeHeading, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });
        };

        hoverZone.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        hoverZone.addEventListener("pointerleave", handlePointerLeave);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initMagneticHeading);
    } else {
      initMagneticHeading();
    }
  })();

/* === SCRIPT 3 === */
(function () {
    // -------------------------------------------------------------
    // Universal Hook: Allows Hero / Page scripts to sync with Loader
    // -------------------------------------------------------------
    window.onTwo26Ready = function (callback) {
      if (typeof callback !== "function") return;
      if (window.__two26LoaderDone) {
        callback();
      } else {
        document.addEventListener("two26:loaderComplete", callback, {
          once: true,
        });
      }
    };

    function notifyLoaderComplete() {
      window.__two26LoaderDone = true;
      // Expose completion via a data attribute for easier downstream checks
      document.body.setAttribute("data-two26-loader-done", "true");
      document.dispatchEvent(new CustomEvent("two26:loaderComplete"));
    }

    function initTwo26PageLoader() {
      // Hard safety check: If GSAP fails to load (CDN issue / adblocker / script order), never lock user out
      if (typeof gsap === "undefined") {
        const fallbackLoader = document.querySelector(
          ".loader, [data-loader='two26']",
        );
        if (fallbackLoader) {
          fallbackLoader.style.display = "none";
          fallbackLoader.style.pointerEvents = "none";
        }
        const fallbackElements = document.querySelectorAll(
          ".logo-animation, .loader-inner svg, .two26-logo-svg",
        );
        fallbackElements.forEach((el) => {
          el.style.visibility = "visible";
        });
        document.body.style.overflow = "";
        notifyLoaderComplete();
        return;
      }

      if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }
      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const hasDrawSVG = typeof DrawSVGPlugin !== "undefined";

      // -------------------------------------------------------------
      // 0. Session Navigation & Accessibility Checks
      // -------------------------------------------------------------
      const loader = document.querySelector(".loader, [data-loader='two26']");
      if (!loader) {
        notifyLoaderComplete();
        return;
      }

      // Accessibility: Skip animation immediately if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) {
        loader.style.display = "none";
        loader.style.pointerEvents = "none";
        notifyLoaderComplete();
        return;
      }

      // Determine if this is a hard refresh using modern Navigation Timing API
      const navEntries = performance.getEntriesByType("navigation");
      const navigationEntry = navEntries.length > 0 ? navEntries[0] : null;
      const isReload = navigationEntry && navigationEntry.type === "reload";
      // Fallback for older browsers using deprecated performance.navigation.type
      const isReloadLegacy =
        typeof performance.navigation !== "undefined" &&
        performance.navigation.type === 1;
      const wasNavigated = sessionStorage.getItem("two26_navigated") === "true";

      // Always register click handler so every page marks the NEXT navigation,
      // regardless of whether the loader played or was skipped on THIS page.
      document.addEventListener("click", (e) => {
        const link = e.target.closest("a[href]");
        if (!link) return;
        const href = link.getAttribute("href");
        if (
          href &&
          !href.startsWith("#") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:") &&
          link.target !== "_blank" &&
          !link.hasAttribute("download") &&
          link.origin === window.location.origin
        ) {
          sessionStorage.setItem("two26_navigated", "true");
        }
      });

      // If user navigated internally from another page AND it is NOT a hard reload -> SKIP LOADER
      if (wasNavigated && !(isReload || isReloadLegacy)) {
        sessionStorage.removeItem("two26_navigated");
        loader.style.display = "none";
        loader.style.pointerEvents = "none";
        notifyLoaderComplete();
        return;
      }

      // Clear flag so next reload on this page plays the loader

      // -------------------------------------------------------------
      // 1. Elements Selection
      // -------------------------------------------------------------

      const bgStrokeContainer = loader.querySelector(
        ".svg-bg-stroke, .loader-bg-svg, .loader-bg",
      );
      const bgSvg = bgStrokeContainer
        ? bgStrokeContainer.querySelector("svg")
        : null;
      const bgPaths = bgSvg ? Array.from(bgSvg.querySelectorAll("path")) : [];

      // Path 0: Orange (#FF5400) | Path 1: Light Pink (#F9E2E1)
      const pathOrangeBg = bgPaths[0] || null;
      const pathPinkBg = bgPaths[1] || null;

      const logoContainer = loader.querySelector(
        ".loader-inner, .logo-animation",
      );
      const logoSvg = loader.querySelector(
        ".two26-logo-svg, .logo-reveal-svg, svg[data-logo='two26'], .logo-animation svg, .loader-inner svg",
      );

      // Lock scrolling during loader
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // -------------------------------------------------------------
      // 2. Initial Setup for Background Strokes
      // -------------------------------------------------------------
      // Start with stroke-width 3000px so both paths solidly cover screen
      const BG_STROKE_WIDTH_START = 3000;
      const BG_STROKE_WIDTH_END = 1000;

      if (pathOrangeBg) {
        pathOrangeBg.style.strokeLinecap = "round";
        pathOrangeBg.setAttribute("stroke-linecap", "round");
        if (hasDrawSVG) {
          gsap.set(pathOrangeBg, {
            x: 0,
            y: 0,
            drawSVG: "0% 100%",
            strokeWidth: BG_STROKE_WIDTH_START,
          });
        } else {
          const len0 = pathOrangeBg.getTotalLength
            ? pathOrangeBg.getTotalLength()
            : 3000;
          pathOrangeBg.style.strokeDasharray = len0;
          pathOrangeBg.style.strokeDashoffset = 0;
          gsap.set(pathOrangeBg, {
            x: 0,
            y: 0,
            strokeWidth: BG_STROKE_WIDTH_START,
          });
        }
      }

      if (pathPinkBg) {
        pathPinkBg.style.strokeLinecap = "round";
        pathPinkBg.setAttribute("stroke-linecap", "round");
        if (hasDrawSVG) {
          gsap.set(pathPinkBg, {
            x: 0,
            y: 0,
            drawSVG: "0% 100%",
            strokeWidth: BG_STROKE_WIDTH_START,
          });
        } else {
          const len1 = pathPinkBg.getTotalLength
            ? pathPinkBg.getTotalLength()
            : 3000;
          pathPinkBg.style.strokeDasharray = len1;
          pathPinkBg.style.strokeDashoffset = 0;
          gsap.set(pathPinkBg, {
            x: 0,
            y: 0,
            strokeWidth: BG_STROKE_WIDTH_START,
          });
        }
      }

      // -------------------------------------------------------------
      // 3. Initial Setup for Logo SVG Paths
      // -------------------------------------------------------------
      let logoTimeline = null;

      if (logoSvg) {
        const paths = Array.from(logoSvg.querySelectorAll("path"));
        if (paths.length >= 6) {
          const pathRibbon = paths[0]; // Ribbon tracer
          const letter2 = paths[1]; // 2 (bottom)
          const letter6 = paths[2]; // 6 (bottom)
          const pathW = paths[3]; // W stroke
          const letterT = paths[4]; // T
          const letterO = paths[5]; // O

          const letters = [letterT, letterO, letter2, letter6];

          // Ribbon setup
          if (pathRibbon) {
            pathRibbon.style.strokeLinecap = "round";
            pathRibbon.style.strokeLinejoin = "round";
            if (hasDrawSVG) {
              gsap.set(pathRibbon, { drawSVG: "0% 0%", strokeWidth: 0 });
            } else {
              const len = pathRibbon.getTotalLength
                ? pathRibbon.getTotalLength()
                : 2500;
              pathRibbon.style.strokeDasharray = `${len * 0.05} ${len}`;
              pathRibbon.style.strokeDashoffset = len;
              gsap.set(pathRibbon, { strokeWidth: 0 });
            }
          }

          // W stroke setup
          if (pathW) {
            pathW.style.strokeLinecap = "butt";
            pathW.style.strokeLinejoin = "miter";
            pathW.setAttribute("stroke-linecap", "butt");
            pathW.setAttribute("stroke-linejoin", "miter");
            if (hasDrawSVG) {
              gsap.set(pathW, { drawSVG: "0%", strokeWidth: 19 });
            } else {
              const lenW = pathW.getTotalLength ? pathW.getTotalLength() : 800;
              pathW.style.strokeDasharray = lenW;
              pathW.style.strokeDashoffset = lenW;
              gsap.set(pathW, { strokeWidth: 19 });
            }
          }

          // Letters setup with GSAP svgOrigin
          letters.forEach((letter) => {
            if (!letter) return;
            const randomAngle = gsap.utils.random(-25, 25);
            letter.setAttribute("stroke", "#FF5400");
            letter.setAttribute("stroke-linejoin", "round");
            const bbox = letter.getBBox();
            const cx = bbox.x + bbox.width / 2;
            const cy = bbox.y + bbox.height / 2;
            gsap.set(letter, {
              scale: 0,
              rotation: randomAngle,
              strokeWidth: 6,
              svgOrigin: `${cx} ${cy}`,
            });
          });

          // Reveal SVG / logo now that all initial zeroed states are applied (prevents FOUC)
          if (logoSvg) {
            logoSvg.style.visibility = "visible";
          }
          const logoWrappers = loader.querySelectorAll(
            ".logo-animation, .two26-logo-svg",
          );
          logoWrappers.forEach((el) => {
            el.style.visibility = "visible";
          });

          // Build the Kinetic Logo Reveal Timeline (1.25x speed / 25% faster)
          logoTimeline = gsap.timeline({ delay: 0.25 }).timeScale(1.25);

          // Step A: Ribbon stroke growth and travel to W
          if (pathRibbon) {
            if (hasDrawSVG) {
              logoTimeline
                .to(
                  pathRibbon,
                  {
                    strokeWidth: 19,
                    duration: 1,
                    ease: "power2.in",
                  },
                  0,
                )
                .to(
                  pathRibbon,
                  {
                    drawSVG: "0% 7%",
                    duration: 0.7,
                    ease: "power2.in",
                  },
                  0,
                )
                .to(
                  pathRibbon,
                  {
                    drawSVG: "40% 47%",
                    duration: 1.2,
                    ease: "none",
                  },
                  0.7,
                );
            } else {
              const len = pathRibbon.getTotalLength
                ? pathRibbon.getTotalLength()
                : 2500;
              logoTimeline
                .to(
                  pathRibbon,
                  {
                    strokeWidth: 19,
                    duration: 1,
                    ease: "power2.in",
                  },
                  0,
                )
                .to(
                  pathRibbon,
                  {
                    strokeDashoffset: len * 0.6,
                    duration: 1.9,
                    ease: "power1.inOut",
                  },
                  0,
                );
            }
          }

          // Step B: Standalone W stroke draws
          if (pathW) {
            if (hasDrawSVG) {
              logoTimeline.to(
                pathW,
                {
                  drawSVG: "100%",
                  duration: 1.1,
                  ease: "power2.out",
                },
                "-=0.4",
              );
            } else {
              logoTimeline.to(
                pathW,
                {
                  strokeDashoffset: 0,
                  duration: 1.1,
                  ease: "power2.out",
                },
                "-=0.4",
              );
            }
          }

          // Step C: Ribbon departs and strokeWidth drops
          if (pathRibbon) {
            if (hasDrawSVG) {
              logoTimeline.to(
                pathRibbon,
                {
                  drawSVG: "100% 100%",
                  duration: 1.1,
                  ease: "power2.inOut",
                },
                "-=0.5",
              );
              logoTimeline.to(
                pathRibbon,
                {
                  strokeWidth: 0,
                  duration: 0.5,
                  ease: "power2.in",
                },
                "-=0.55",
              );
            } else {
              const len = pathRibbon.getTotalLength
                ? pathRibbon.getTotalLength()
                : 2500;
              logoTimeline.to(
                pathRibbon,
                {
                  strokeDashoffset: -len * 0.05,
                  duration: 1.1,
                  ease: "power2.inOut",
                },
                "-=0.5",
              );
              logoTimeline.to(
                pathRibbon,
                {
                  strokeWidth: 0,
                  duration: 0.5,
                  ease: "power2.in",
                },
                "-=0.55",
              );
            }
          }

          // Step D: Shift entire SVG upward to center the full logo
          const allContentPaths = [pathW, letterT, letterO, letter2, letter6];
          let minY = Infinity,
            maxY = -Infinity;
          allContentPaths.forEach((p) => {
            if (!p) return;
            const b = p.getBBox();
            if (b.y < minY) minY = b.y;
            if (b.y + b.height > maxY) maxY = b.y + b.height;
          });
          const viewBoxHeight = 1004;
          const contentCenterY = (minY + maxY) / 2;
          const viewBoxCenterY = viewBoxHeight / 2;
          const offsetSVGUnits = contentCenterY - viewBoxCenterY;
          const svgRect = logoSvg.getBoundingClientRect();
          const scaleRatio =
            svgRect.height > 0 ? svgRect.height / viewBoxHeight : 1;
          const offsetPx = offsetSVGUnits * scaleRatio;

          logoTimeline.to(
            logoSvg,
            {
              y: -offsetPx,
              duration: 0.8,
              ease: "power2.inOut",
            },
            "+=0.1",
          );

          // Step E: Staggered bouncy pop-in for letters T, O, 2, 6
          logoTimeline.to(
            letters,
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "back.out(3)",
            },
            "-=0.2",
          );
          logoTimeline.to(
            letters,
            {
              strokeWidth: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power1.in",
            },
            "<",
          );
        }
      }

      // -------------------------------------------------------------
      // 4. Loading State & Exit Animation Handler
      // -------------------------------------------------------------
      let isWindowLoaded = document.readyState === "complete";
      let isLogoDone = false;

      if (!isWindowLoaded) {
        window.addEventListener("load", () => {
          isWindowLoaded = true;
          checkAndTriggerExit();
        });
      }

      if (logoTimeline) {
        logoTimeline.eventCallback("onComplete", () => {
          isLogoDone = true;
          checkAndTriggerExit();
        });
      } else {
        // Fallback timer if no logo animation found
        setTimeout(() => {
          isLogoDone = true;
          checkAndTriggerExit();
        }, 2000);
      }

      let exitTriggered = false;

      // Hard safety timeout: if window.load or any third-party script hangs, force exit after 6s
      setTimeout(() => {
        if (!exitTriggered) {
          isWindowLoaded = true;
          isLogoDone = true;
          checkAndTriggerExit();
        }
      }, 6000);

      function checkAndTriggerExit() {
        // Only trigger exit when BOTH minimum animation duration is met AND page is loaded
        if (isLogoDone && isWindowLoaded && !exitTriggered) {
          exitTriggered = true;
          runLoaderExitSequence();
        }
      }

      // -------------------------------------------------------------
      // 5. Exit Sequence (Pink Wipe -> Orange Wipe -> Page Reveal)
      // -------------------------------------------------------------
      function runLoaderExitSequence() {
        const exitTl = gsap.timeline({
          onComplete: () => {
            // Restore scrolling
            document.body.style.overflow = originalOverflow;
            loader.style.display = "none";
            loader.style.pointerEvents = "none";

            // Refresh ScrollTrigger so all page animations sync accurately
            if (typeof ScrollTrigger !== "undefined") {
              ScrollTrigger.refresh();
            }

            // Notify all hero / page entrance animations that loader is finished
            notifyLoaderComplete();
          },
        });

        // Small hold so user enjoys the complete logo for a moment
        exitTl.to({}, { duration: 0.2 });

        // Phase 1: Light Pink Stroke (#F9E2E1, Path 1) slithers down & right out of viewport (doubled speed)
        const SWEEP_DURATION = 0.65;

        if (pathPinkBg) {
          if (hasDrawSVG) {
            exitTl.to(
              pathPinkBg,
              {
                drawSVG: "50% 100%",
                strokeWidth: BG_STROKE_WIDTH_END,
                y: 1800,
                x: 900,
                duration: SWEEP_DURATION,
                ease: "power2.inOut",
              },
              "pinkStart",
            );
          } else {
            const len1 = pathPinkBg.getTotalLength
              ? pathPinkBg.getTotalLength()
              : 3000;
            exitTl.to(
              pathPinkBg,
              {
                strokeDashoffset: -len1 * 0.5,
                strokeWidth: BG_STROKE_WIDTH_END,
                y: 1800,
                x: 900,
                duration: SWEEP_DURATION,
                ease: "power2.inOut",
              },
              "pinkStart",
            );
          }
        }

        // Logo fades seamlessly into the Orange layer as Pink sweeps past 25%
        if (logoContainer || logoSvg) {
          exitTl.to(
            logoContainer || logoSvg,
            {
              opacity: 0,
              duration: 0.15,
              ease: "power1.out",
            },
            "pinkStart+=" + SWEEP_DURATION * 0.2,
          );
        }

        // Phase 2: Orange Stroke (#FF5400, Path 0) slithers down & left out of viewport (starts at 25% of pink)
        if (pathOrangeBg) {
          if (hasDrawSVG) {
            exitTl.to(
              pathOrangeBg,
              {
                drawSVG: "50% 100%",
                strokeWidth: BG_STROKE_WIDTH_END,
                y: 1800,
                x: -900,
                duration: SWEEP_DURATION,
                ease: "power2.inOut",
              },
              "pinkStart+=" + SWEEP_DURATION * 0.25, // Exactly 25% into the pink animation
            );
          } else {
            const len0 = pathOrangeBg.getTotalLength
              ? pathOrangeBg.getTotalLength()
              : 3000;
            exitTl.to(
              pathOrangeBg,
              {
                strokeDashoffset: -len0 * 0.5,
                strokeWidth: BG_STROKE_WIDTH_END,
                y: 1800,
                x: -900,
                duration: SWEEP_DURATION,
                ease: "power2.inOut",
              },
              "pinkStart+=" + SWEEP_DURATION * 0.25,
            );
          }
        }
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initTwo26PageLoader);
    } else {
      initTwo26PageLoader();
    }
  })();

/* === SCRIPT 4 === */
(function () {
    function initNavbarBtns() {
      if (typeof gsap === 'undefined') return;

      if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const buttons = document.querySelectorAll('.navbar-link-btn');

      buttons.forEach((btn) => {
        const svgs = btn.querySelectorAll('svg');
        svgs.forEach((svg) => {
          svg.style.overflow = 'visible';
          svg.style.width = '100%';
          svg.style.height = '100%';
        });

        const paths = btn.querySelectorAll('.stroke-fill path, .stroke-fill-code path, svg path');
        if (!paths.length) return;

        const strokeFill = btn.querySelector('.stroke-fill');
        if (strokeFill) strokeFill.style.pointerEvents = 'none';

        paths.forEach((path) => {
          path.style.strokeLinecap = 'round';
          path.style.strokeLinejoin = 'round';

          const targetStrokeWidth = parseFloat(path.getAttribute('stroke-width')) || 36;

          gsap.set(path, {
            drawSVG: '0%',
            strokeWidth: 0,
          });

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power1.inOut' },
          });

          tl.to(path, {
            drawSVG: '100%',
            strokeWidth: targetStrokeWidth,
            duration: 0.5,
          });

          btn.addEventListener('mouseenter', () => tl.timeScale(1).play());
          btn.addEventListener('mouseleave', () => tl.timeScale(1.4).reverse());
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavbarBtns);
    } else {
      initNavbarBtns();
    }
  })();

/* === SCRIPT 5 === */
(function () {
    function initNavbarBtns() {
      if (typeof gsap === 'undefined') return;

      if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const buttons = document.querySelectorAll('.navbar-link-btn');

      buttons.forEach((btn) => {
        const svgs = btn.querySelectorAll('svg');
        svgs.forEach((svg) => {
          svg.style.overflow = 'visible';
          svg.style.width = '100%';
          svg.style.height = '100%';
        });

        const paths = btn.querySelectorAll('.stroke-fill path, .stroke-fill-code path, svg path');
        if (!paths.length) return;

        const strokeFill = btn.querySelector('.stroke-fill');
        if (strokeFill) strokeFill.style.pointerEvents = 'none';

        paths.forEach((path) => {
          path.style.strokeLinecap = 'round';
          path.style.strokeLinejoin = 'round';

          const targetStrokeWidth = parseFloat(path.getAttribute('stroke-width')) || 36;

          gsap.set(path, {
            drawSVG: '0%',
            strokeWidth: 0,
          });

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power1.inOut' },
          });

          tl.to(path, {
            drawSVG: '100%',
            strokeWidth: targetStrokeWidth,
            duration: 0.5,
          });

          btn.addEventListener('mouseenter', () => tl.timeScale(1).play());
          btn.addEventListener('mouseleave', () => tl.timeScale(1.4).reverse());
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavbarBtns);
    } else {
      initNavbarBtns();
    }
  })();

/* === SCRIPT 6 === */
(function () {
    function initCTAButtons() {
      if (typeof gsap === "undefined") return;

      const buttons = document.querySelectorAll(".cta-btn");

      buttons.forEach((btn) => {
        const text = btn.querySelector(".cta-text");
        const arrow = btn.querySelector(".cta-btn-arrow, .svg-arrow-cta");
        const fillHover = btn.querySelector(".cta-btn-fill-hover");

        let arrowLoop = null;

        // 1. Mouse Enter: Scale 10x Fill + Looping Arrow Rotation Bounce
        btn.addEventListener("mouseenter", () => {
          if (fillHover) {
            gsap.to(fillHover, {
              scale: 10,
              duration: 0.55,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (arrow) {
            gsap.set(arrow, { transformOrigin: "center center" });
            if (arrowLoop) arrowLoop.kill();

            arrowLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
            arrowLoop
              .to(arrow, {
                rotation: -25,
                duration: 0.22,
                ease: "power2.out",
              })
              .to(arrow, {
                rotation: 0,
                duration: 0.4,
                ease: "back.out(2.5)",
              });
          }
        });

        // 2. Magnetic Movement (Jitter-Free: Uses true static origin)
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const currentX = gsap.getProperty(btn, "x") || 0;
          const currentY = gsap.getProperty(btn, "y") || 0;

          // True center of button before any transform offset
          const originCenterX = rect.left - currentX + rect.width / 2;
          const originCenterY = rect.top - currentY + rect.height / 2;

          const deltaX = e.clientX - originCenterX;
          const deltaY = e.clientY - originCenterY;

          // Button magnetic translation
          gsap.to(btn, {
            x: deltaX * 0.35,
            y: deltaY * 0.35,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });

          // Inner elements parallax
          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: deltaX * 0.15,
              y: deltaY * 0.15,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });

        // 3. Mouse Leave: Snap back with spring elasticity & reset
        btn.addEventListener("mouseleave", () => {
          if (arrowLoop) {
            arrowLoop.kill();
            arrowLoop = null;
          }
          if (arrow) {
            gsap.to(arrow, {
              rotation: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });

          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: "elastic.out(1.1, 0.4)",
              overwrite: "auto",
            });
          }

          if (fillHover) {
            gsap.to(fillHover, {
              scale: 1,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCTAButtons);
    } else {
      initCTAButtons();
    }
  })();

/* === SCRIPT 7 === */
(function () {
    function initTwo26MobileSystem() {
      if (typeof gsap === "undefined") return;

      const hamNavbar = document.querySelector(".ham-navbar");
      const toggleButtons = Array.from(
        document.querySelectorAll(
          ".two26-nav-toggle-btn, .two26-toggle-btn, .menu-btn, .nav-toggle, [data-menu-toggle]",
        ),
      );

      let isMenuOpen = false;
      let navTimeline = null;
      let iconTimeline = null;

      // -------------------------------------------------------------
      // 1. Setup Toggle SVG Morphing Timeline (Horseshoe <-> 45deg Cross)
      // -------------------------------------------------------------
      const svgEls = Array.from(
        document.querySelectorAll(".two26-toggle-svg, .target-svg"),
      );

      let orangePath = null;
      let crossPath = null;
      let orangeTotalLen = 0;
      let crossTotalLen = 20;
      let horseshoeLen = 0;
      let stemLen = 20.0;
      let finalOffset = 0;
      let dashObj = null;

      if (svgEls.length) {
        const primarySvg = svgEls[0];
        orangePath =
          primarySvg.querySelector(".orange-path") ||
          primarySvg.querySelectorAll("path")[0];
        crossPath =
          primarySvg.querySelector(".cross-path") ||
          primarySvg.querySelectorAll("path")[1];

        if (orangePath && crossPath) {
          orangeTotalLen = orangePath.getTotalLength();
          crossTotalLen = crossPath.getTotalLength() || 20;

          horseshoeLen = orangeTotalLen * 0.44;
          for (let len = 0; len < orangeTotalLen; len += 0.2) {
            const pt = orangePath.getPointAtLength(len);
            if (len > 30 && pt.x <= 9.05 && Math.abs(pt.y - 16.02) < 0.3) {
              horseshoeLen = len;
              break;
            }
          }

          finalOffset = -(orangeTotalLen - stemLen);

          // Initial SVG state
          svgEls.forEach((svg) => {
            const op =
              svg.querySelector(".orange-path") ||
              svg.querySelectorAll("path")[0];
            const cp =
              svg.querySelector(".cross-path") ||
              svg.querySelectorAll("path")[1];
            if (op) {
              op.style.strokeDasharray = `${horseshoeLen} ${orangeTotalLen}`;
              op.style.strokeDashoffset = "0";
            }
            if (cp) {
              cp.style.strokeDasharray = `${crossTotalLen} ${crossTotalLen}`;
              cp.style.strokeDashoffset = `${crossTotalLen}`;
              gsap.set(cp, { strokeWidth: 0 });
            }
            gsap.set(svg, { rotation: 0, transformOrigin: "center center" });
          });

          iconTimeline = gsap.timeline({ paused: true });
          dashObj = { len: horseshoeLen, offset: 0 };

          iconTimeline
            .to(
              dashObj,
              {
                len: stemLen,
                offset: finalOffset,
                duration: 0.85,
                ease: "power2.inOut",
                onUpdate: () => {
                  svgEls.forEach((svg) => {
                    const op =
                      svg.querySelector(".orange-path") ||
                      svg.querySelectorAll("path")[0];
                    if (op) {
                      op.style.strokeDasharray = `${dashObj.len} ${orangeTotalLen}`;
                      op.style.strokeDashoffset = `${dashObj.offset}`;
                    }
                  });
                },
              },
              0,
            )
            .to(
              svgEls
                .map(
                  (svg) =>
                    svg.querySelector(".cross-path") ||
                    svg.querySelectorAll("path")[1],
                )
                .filter(Boolean),
              {
                strokeWidth: 4,
                duration: 0.12,
                ease: "back.out(2)",
              },
              0.1,
            )
            .to(
              svgEls
                .map(
                  (svg) =>
                    svg.querySelector(".cross-path") ||
                    svg.querySelectorAll("path")[1],
                )
                .filter(Boolean),
              {
                strokeDashoffset: 0,
                duration: 0.6,
                ease: "power2.out",
              },
              0.2,
            )
            .to(
              svgEls,
              {
                rotation: 45,
                duration: 0.85,
                ease: "power3.inOut",
              },
              0,
            );
        }
      }

      // -------------------------------------------------------------
      // 2. Setup Fullscreen Menu Entrance & Stagger Links
      // -------------------------------------------------------------
      const linksContainer = hamNavbar
        ? hamNavbar.querySelector(".hamburger-links")
        : null;
      const linkItems = linksContainer
        ? Array.from(linksContainer.children)
        : [];

      function openMenu() {
        if (isMenuOpen) return;
        isMenuOpen = true;

        // Play Icon Morph
        if (iconTimeline) iconTimeline.play();

        if (hamNavbar) {
          document.body.style.overflow = "hidden";
          hamNavbar.classList.add("is-open");
          hamNavbar.style.display = "flex";
          hamNavbar.style.pointerEvents = "auto";

          if (navTimeline) navTimeline.kill();
          navTimeline = gsap.timeline();

          navTimeline.fromTo(
            hamNavbar,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: "power2.out" },
            0,
          );

          if (linkItems.length) {
            linkItems.forEach((item, index) => {
              const randomTilt = gsap.utils.random(-10, 10);
              navTimeline.fromTo(
                item,
                {
                  opacity: 0,
                  x: -35,
                  y: 50,
                  scale: 0.4,
                  rotation: randomTilt,
                },
                {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotation: 0,
                  duration: 0.75,
                  ease: "back.out(2.2)", // Signature TWO 26 spring bounce
                },
                0.15 + index * 0.09,
              );
            });
          }
        }
      }

      function closeMenu() {
        if (!isMenuOpen) return;

        // Reverse Icon Morph
        if (iconTimeline) iconTimeline.reverse();

        if (hamNavbar) {
          if (navTimeline) navTimeline.kill();
          navTimeline = gsap.timeline({
            onComplete: () => {
              hamNavbar.classList.remove("is-open");
              hamNavbar.style.display = "none";
              hamNavbar.style.pointerEvents = "none";
              document.body.style.overflow = "";
              isMenuOpen = false;
            },
          });

          if (linkItems.length) {
            navTimeline.to(
              linkItems,
              {
                opacity: 0,
                y: 20,
                scale: 0.8,
                duration: 0.25,
                stagger: 0.04,
                ease: "power2.in",
              },
              0,
            );
          }

          navTimeline.to(
            hamNavbar,
            { opacity: 0, duration: 0.3, ease: "power2.inOut" },
            0.1,
          );
        } else {
          isMenuOpen = false;
        }
      }

      function toggleMenu(e) {
        if (e) e.stopPropagation();
        if (isMenuOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      }

      // -------------------------------------------------------------
      // 3. Event Listeners
      // -------------------------------------------------------------
      toggleButtons.forEach((btn) => {
        if (!btn.__two26Bound) {
          btn.__two26Bound = true;
          btn.addEventListener("click", toggleMenu);
        }
      });

      // Close when clicking on any link inside the menu
      linkItems.forEach((item) => {
        const clickable =
          item.tagName.toLowerCase() === "a" ? item : item.querySelector("a");
        if (clickable) {
          clickable.addEventListener("click", () => {
            closeMenu();
          });
        }
      });

      // Global API
      window.__two26MobileMenu = {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu,
        isOpen: () => isMenuOpen,
      };
    }

    // Defensive loading with GSAP polling
    function safeInit() {
      if (typeof gsap !== "undefined") {
        initTwo26MobileSystem();
      } else {
        let count = 0;
        const checkGsap = setInterval(() => {
          count++;
          if (typeof gsap !== "undefined") {
            clearInterval(checkGsap);
            initTwo26MobileSystem();
          } else if (count > 40) {
            clearInterval(checkGsap);
          }
        }, 80);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", safeInit);
    } else {
      safeInit();
    }

    window.addEventListener("load", safeInit);

    if (window.Webflow) {
      window.Webflow.push(function () {
        safeInit();
      });
    }
  })();

/* === SCRIPT 8 === */
(function () {
    function initNavbarBtns() {
      if (typeof gsap === 'undefined') return;

      if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const buttons = document.querySelectorAll('.navbar-link-btn');

      buttons.forEach((btn) => {
        const svgs = btn.querySelectorAll('svg');
        svgs.forEach((svg) => {
          svg.style.overflow = 'visible';
          svg.style.width = '100%';
          svg.style.height = '100%';
        });

        const paths = btn.querySelectorAll('.stroke-fill path, .stroke-fill-code path, svg path');
        if (!paths.length) return;

        const strokeFill = btn.querySelector('.stroke-fill');
        if (strokeFill) strokeFill.style.pointerEvents = 'none';

        paths.forEach((path) => {
          path.style.strokeLinecap = 'round';
          path.style.strokeLinejoin = 'round';

          const targetStrokeWidth = parseFloat(path.getAttribute('stroke-width')) || 36;

          gsap.set(path, {
            drawSVG: '0%',
            strokeWidth: 0,
          });

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power1.inOut' },
          });

          tl.to(path, {
            drawSVG: '100%',
            strokeWidth: targetStrokeWidth,
            duration: 0.5,
          });

          btn.addEventListener('mouseenter', () => tl.timeScale(1).play());
          btn.addEventListener('mouseleave', () => tl.timeScale(1.4).reverse());
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavbarBtns);
    } else {
      initNavbarBtns();
    }
  })();

/* === SCRIPT 9 === */
(function () {
    function initNavbarBtns() {
      if (typeof gsap === 'undefined') return;

      if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const buttons = document.querySelectorAll('.navbar-link-btn');

      buttons.forEach((btn) => {
        const svgs = btn.querySelectorAll('svg');
        svgs.forEach((svg) => {
          svg.style.overflow = 'visible';
          svg.style.width = '100%';
          svg.style.height = '100%';
        });

        const paths = btn.querySelectorAll('.stroke-fill path, .stroke-fill-code path, svg path');
        if (!paths.length) return;

        const strokeFill = btn.querySelector('.stroke-fill');
        if (strokeFill) strokeFill.style.pointerEvents = 'none';

        paths.forEach((path) => {
          path.style.strokeLinecap = 'round';
          path.style.strokeLinejoin = 'round';

          const targetStrokeWidth = parseFloat(path.getAttribute('stroke-width')) || 36;

          gsap.set(path, {
            drawSVG: '0%',
            strokeWidth: 0,
          });

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power1.inOut' },
          });

          tl.to(path, {
            drawSVG: '100%',
            strokeWidth: targetStrokeWidth,
            duration: 0.5,
          });

          btn.addEventListener('mouseenter', () => tl.timeScale(1).play());
          btn.addEventListener('mouseleave', () => tl.timeScale(1.4).reverse());
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavbarBtns);
    } else {
      initNavbarBtns();
    }
  })();

/* === SCRIPT 10 === */
(function () {
    function initCTAButtons() {
      if (typeof gsap === "undefined") return;

      const buttons = document.querySelectorAll(".cta-btn");

      buttons.forEach((btn) => {
        const text = btn.querySelector(".cta-text");
        const arrow = btn.querySelector(".cta-btn-arrow, .svg-arrow-cta");
        const fillHover = btn.querySelector(".cta-btn-fill-hover");

        let arrowLoop = null;

        // 1. Mouse Enter: Scale 10x Fill + Looping Arrow Rotation Bounce
        btn.addEventListener("mouseenter", () => {
          if (fillHover) {
            gsap.to(fillHover, {
              scale: 10,
              duration: 0.55,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (arrow) {
            gsap.set(arrow, { transformOrigin: "center center" });
            if (arrowLoop) arrowLoop.kill();

            arrowLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
            arrowLoop
              .to(arrow, {
                rotation: -25,
                duration: 0.22,
                ease: "power2.out",
              })
              .to(arrow, {
                rotation: 0,
                duration: 0.4,
                ease: "back.out(2.5)",
              });
          }
        });

        // 2. Magnetic Movement (Jitter-Free: Uses true static origin)
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const currentX = gsap.getProperty(btn, "x") || 0;
          const currentY = gsap.getProperty(btn, "y") || 0;

          // True center of button before any transform offset
          const originCenterX = rect.left - currentX + rect.width / 2;
          const originCenterY = rect.top - currentY + rect.height / 2;

          const deltaX = e.clientX - originCenterX;
          const deltaY = e.clientY - originCenterY;

          // Button magnetic translation
          gsap.to(btn, {
            x: deltaX * 0.35,
            y: deltaY * 0.35,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });

          // Inner elements parallax
          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: deltaX * 0.15,
              y: deltaY * 0.15,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });

        // 3. Mouse Leave: Snap back with spring elasticity & reset
        btn.addEventListener("mouseleave", () => {
          if (arrowLoop) {
            arrowLoop.kill();
            arrowLoop = null;
          }
          if (arrow) {
            gsap.to(arrow, {
              rotation: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });

          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: "elastic.out(1.1, 0.4)",
              overwrite: "auto",
            });
          }

          if (fillHover) {
            gsap.to(fillHover, {
              scale: 1,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCTAButtons);
    } else {
      initCTAButtons();
    }
  })();

/* === SCRIPT 11 === */
(function () {
    function initTwo26ContactModal() {
      // Standalone contact page guard: never hijack or reset the dedicated /contact route
      if (
        (typeof window !== "undefined" &&
          (window.location.pathname.replace(/\/+$/, "").endsWith("/contact") ||
           window.location.pathname.includes("/contact"))) ||
        document.querySelector(".standalone-contact-page")
      ) {
        return;
      }

      // 1. Defensive verification for GSAP & DrawSVG / SplitText
      if (typeof gsap === "undefined") return;

      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);
      }
      if (typeof SplitText !== "undefined") {
        gsap.registerPlugin(SplitText);
      }

      const contactPage = document.querySelector(
        ".contact-page, [data-contact-page]",
      );
      if (!contactPage) return;

      const closeBtn = document.querySelector(
        ".close-btn, .close-btn-wrapper a, [data-contact-close]",
      );
      const openTriggers = Array.from(
        document.querySelectorAll(
          "[data-contact-trigger], .cta-btn, .nav-btn, a[href='#contact'], a[href*='contact']",
        ),
      ).filter(
        (btn) =>
          !btn.closest(".contact-page") &&
          !btn.classList.contains("close-btn") &&
          !btn.hasAttribute("data-contact-close"),
      );

      // Elements inside contact-page
      const contactNavbar = contactPage.querySelector(".contact-navbar");
      const contactContent = contactPage.querySelector(".contact-content");
      const contactHeadings = Array.from(
        contactPage.querySelectorAll(".contact-heading, .contact-left h2"),
      );
      const contactParas = Array.from(
        contactPage.querySelectorAll(".contact-para, .contact-left p"),
      );
      const emailHeadings = Array.from(
        contactPage.querySelectorAll(
          ".email-heading, .contact-right .email-heading",
        ),
      );
      const emailLinks = Array.from(
        contactPage.querySelectorAll(".email-link, a[href^='mailto:']"),
      );
      const contactSocials = Array.from(
        contactPage.querySelectorAll(".contact-social"),
      );
      const contactImg = contactPage.querySelector(
        ".contact-img, .contact-img-wrap img, .contact-img-wrap",
      );
      const transitionPaths = Array.from(
        contactPage.querySelectorAll(
          ".contact-transition svg path, .svg-tcontact svg path, .contact-transition path, .svg-tcontact path",
        ),
      );

      let isOpen = false;
      let openTl = null;

      // -----------------------------------------------------------------
      // 2. Prepare SplitText Masks & Initial States
      // -----------------------------------------------------------------

      // A. Contact Left Headings (Reduced-playfulness kinetic pop)
      let headingChars = [];
      contactHeadings.forEach((heading) => {
        if (typeof SplitText !== "undefined") {
          const split = new SplitText(heading, {
            type: "chars,words",
            charsClass: "contact-heading-char",
          });
          headingChars = headingChars.concat(split.chars);
        } else {
          const words = heading.textContent.trim().split(" ");
          heading.innerHTML = words
            .map(
              (w) =>
                `<span style="display:inline-block;">` +
                w
                  .split("")
                  .map((c) => `<span class="contact-heading-char">${c}</span>`)
                  .join("") +
                `</span>`,
            )
            .join(" ");
          headingChars = headingChars.concat(
            Array.from(heading.querySelectorAll(".contact-heading-char")),
          );
        }
      });

      // B. Contact Left Paragraph Lines
      let paraLines = [];
      contactParas.forEach((para) => {
        if (typeof SplitText !== "undefined") {
          const split = new SplitText(para, {
            type: "lines",
            linesClass: "contact-para-line",
          });
          split.lines.forEach((line) => {
            const mask = document.createElement("span");
            mask.className = "contact-para-line-mask";
            line.parentNode.insertBefore(mask, line);
            mask.appendChild(line);
          });
          paraLines = paraLines.concat(split.lines);
        } else {
          const raw = para.innerHTML.trim();
          para.innerHTML = `<span class="contact-para-line-mask"><span class="contact-para-line">${raw}</span></span>`;
          paraLines = paraLines.concat(
            Array.from(para.querySelectorAll(".contact-para-line")),
          );
        }
      });

      // C. Contact Right Email Headings (Single-line word slide up with overflow hidden)
      let emailHeadingWords = [];
      emailHeadings.forEach((eh) => {
        if (typeof SplitText !== "undefined") {
          const split = new SplitText(eh, {
            type: "words",
            wordsClass: "contact-word",
          });
          split.words.forEach((word) => {
            const mask = document.createElement("span");
            mask.className = "contact-word-mask";
            mask.style.display = "inline-block";
            word.parentNode.insertBefore(mask, word);
            mask.appendChild(word);
          });
          emailHeadingWords = emailHeadingWords.concat(split.words);
        } else {
          const raw = eh.textContent.trim().split(" ");
          eh.innerHTML = raw
            .map(
              (w) =>
                `<span class="contact-word-mask" style="display:inline-block; margin-right:0.25em;"><span class="contact-word">${w}</span></span>`,
            )
            .join("");
          emailHeadingWords = emailHeadingWords.concat(
            Array.from(eh.querySelectorAll(".contact-word")),
          );
        }
      });

      // D. Contact Right Email Links (Letter-by-Letter Split + Kinetic Hover, NO overflow hidden)
      emailLinks.forEach((el) => {
        // Split text nodes into characters for kinetic hover
        Array.from(el.childNodes).forEach((node) => {
          if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim().length > 0
          ) {
            const span = document.createElement("span");
            span.className = "contact-email-text-wrap";
            span.style.display = "inline-block";

            const raw = node.textContent;
            span.innerHTML = raw
              .split("")
              .map((c) => {
                if (c === " ") return "&nbsp;";
                return `<span class="contact-email-char">${c}</span>`;
              })
              .join("");

            node.parentNode.replaceChild(span, node);
          }
        });

        const chars = Array.from(el.querySelectorAll(".contact-email-char"));
        if (!chars.length) return;

        // Hover In: Kinetic letter pop with random tilt, scale & bold shadow
        el.addEventListener("mouseenter", () => {
          chars.forEach((char, idx) => {
            const randomTilt = gsap.utils.random(-7, 7);
            const charDelay = idx * 0.035;

            // Phase 1: Letter pop
            gsap.to(char, {
              scale: 1.14,
              rotation: randomTilt,
              textShadow:
                "0.4px 0.4px 0 currentColor, -0.4px -0.4px 0 currentColor, 0.4px -0.4px 0 currentColor, -0.4px 0.4px 0 currentColor",
              duration: 0.38,
              delay: charDelay,
              ease: "back.out(1.8)",
              overwrite: "auto",
              onComplete: () => {
                // Phase 2: Gentle settle
                gsap.to(char, {
                  scale: 1,
                  rotation: 0,
                  textShadow: "0px 0px 0px rgba(0,0,0,0)",
                  duration: 0.5,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              },
            });
          });
        });

        // Hover Out: Smooth return
        el.addEventListener("mouseleave", () => {
          gsap.to(chars, {
            scale: 1,
            rotation: 0,
            textShadow: "0px 0px 0px rgba(0,0,0,0)",
            duration: 0.35,
            stagger: 0.018,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      });

      // Navbar Logo & Close Button
      const contactLogo = contactNavbar
        ? contactNavbar.querySelector(
            ".navbar-logo-contact, .logo-svg, a[class*='logo'], .navbar-logo-cont",
          )
        : null;

      const closeBtnText = closeBtn
        ? closeBtn.querySelector(
            ".back-btn-txt, [class*='txt'], [class*='text'], span",
          )
        : null;

      // -----------------------------------------------------------------
      // 3. Reset All Elements to Fresh Initial State
      // -----------------------------------------------------------------
      function resetModalElements() {
        if (
          (typeof window !== "undefined" &&
            (window.location.pathname.replace(/\/+$/, "").endsWith("/contact") ||
             window.location.pathname.includes("/contact"))) ||
          document.querySelector(".standalone-contact-page")
        ) {
          return;
        }

        if (openTl) openTl.kill();

        // Ensure parent wrappers are fully visible and clean
        if (contactContent) {
          gsap.set(contactContent, { opacity: 1, y: 0 });
        }
        if (contactNavbar) {
          gsap.set(contactNavbar, { opacity: 1, y: 0 });
        }
        if (contactLogo) {
          gsap.set(contactLogo, {
            scale: 0,
            opacity: 0,
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            transformOrigin: "center center",
          });
        }
        if (closeBtn) {
          gsap.set(closeBtn, {
            opacity: 0,
            scale: 0.4,
            y: 20,
            transformOrigin: "center center",
          });
          if (closeBtnText) {
            gsap.set(closeBtnText, {
              opacity: 0,
              y: 15,
              display: "inline-block",
            });
          }
        }

        if (transitionPaths.length) {
          transitionPaths.forEach((path) => {
            const totalLen = path.getTotalLength ? path.getTotalLength() : 3000;
            gsap.set(path, {
              strokeDasharray: totalLen,
              strokeDashoffset: totalLen,
              strokeWidth: "0px",
            });
          });
        }

        if (headingChars.length) {
          gsap.set(headingChars, {
            opacity: 0,
            scale: 0.5,
            rotation: 0,
            textShadow: "0px 0px 0px rgba(0,0,0,0)",
          });
        }

        if (paraLines.length) {
          gsap.set(paraLines, { y: "115%", opacity: 0 });
        }

        if (emailHeadingWords.length) {
          gsap.set(emailHeadingWords, { y: "105%", opacity: 0 });
        }

        if (emailLinks.length) {
          gsap.set(emailLinks, { opacity: 0, y: 15 });
        }

        const emailChars = contactPage.querySelectorAll(".contact-email-char");
        if (emailChars.length) {
          gsap.set(emailChars, {
            scale: 1,
            rotation: 0,
            textShadow: "0px 0px 0px rgba(0,0,0,0)",
          });
        }

        if (contactSocials.length) {
          gsap.set(contactSocials, {
            opacity: 0,
            scale: 0.4,
            y: 20,
            transformOrigin: "center center",
          });
          contactSocials.forEach((pill) => {
            const pillText = pill.querySelector(
              ".contact-social-link, [class*='link'], [class*='text'], span",
            );
            if (pillText) {
              gsap.set(pillText, {
                opacity: 0,
                y: 15,
                display: "inline-block",
              });
            }
          });
        }

        if (contactImg) {
          gsap.set(contactImg, {
            opacity: 0,
            scale: 0.8,
            x: 0,
            y: 0,
            yPercent: 0,
            xPercent: 0,
            rotation: gsap.utils.random(-3, 3),
            transformOrigin: "bottom center",
          });
        }
      }

      resetModalElements();

      // -----------------------------------------------------------------
      // 4. Open Timeline Execution (Slow, Silky Pace + 1600px strokeWidth)
      // -----------------------------------------------------------------
      function openContactModal() {
        if (isOpen) return;
        isOpen = true;

        // Display modal overlay
        contactPage.classList.add("is-active");
        contactPage.style.display = "flex";
        contactPage.style.visibility = "visible";
        contactPage.style.pointerEvents = "auto";

        resetModalElements();

        openTl = gsap.timeline();

        // Step 1: Transition SVG Draw & Stroke Expansion (0 to 1600px)
        if (transitionPaths.length) {
          transitionPaths.forEach((path, i) => {
            const totalLen = path.getTotalLength ? path.getTotalLength() : 3000;
            openTl.fromTo(
              path,
              { strokeDashoffset: totalLen, strokeWidth: "0px" },
              {
                strokeDashoffset: 0,
                strokeWidth: "1600px",
                duration: 0.9,
                ease: "power2.inOut",
              },
              i * 0.1,
            );
          });
        }

        const contentStart = transitionPaths.length ? 0.45 : 0;

        // Step 2: Navbar Logo (Bounce Scale 0 -> 1) & Close Button (Pill Pop + Text Slide)
        if (contactLogo) {
          openTl.to(
            contactLogo,
            {
              scale: 1,
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.65,
              ease: "back.out(2.2)",
            },
            contentStart,
          );
        }

        if (closeBtn) {
          openTl.to(
            closeBtn,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.7,
              ease: "back.out(2.5)",
            },
            contentStart + 0.1,
          );

          if (closeBtnText) {
            openTl.to(
              closeBtnText,
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.6)",
              },
              contentStart + 0.22,
            );
          }
        }

        // Step 3: Contact Left Heading (Kinetic Letter Pop)
        if (headingChars.length) {
          headingChars.forEach((char, idx) => {
            const randomTilt = gsap.utils.random(-6, 6);
            const charStart = contentStart + 0.15 + idx * 0.022;

            // Pop
            openTl.to(
              char,
              {
                opacity: 1,
                scale: 1.1,
                rotation: randomTilt,
                textShadow:
                  "0.4px 0.4px 0 currentColor, -0.4px -0.4px 0 currentColor, 0.4px -0.4px 0 currentColor, -0.4px 0.4px 0 currentColor",
                duration: 0.45,
                ease: "back.out(2)",
              },
              charStart,
            );

            // Settle
            openTl.to(
              char,
              {
                scale: 1,
                rotation: 0,
                textShadow: "0px 0px 0px rgba(0,0,0,0)",
                duration: 0.6,
                ease: "power2.out",
              },
              charStart + 0.45,
            );
          });
        }

        // Step 4: Contact Left Paragraph Lines
        if (paraLines.length) {
          openTl.to(
            paraLines,
            {
              y: "0%",
              opacity: 1,
              duration: 0.85,
              stagger: 0.1,
              ease: "back.out(1.4)",
            },
            contentStart + 0.3,
          );
        }

        // Step 5: Contact Right Email Headings (Word Slide Up with overflow hidden) & Email Links (Slide Up NO overflow hidden)
        if (emailHeadingWords.length) {
          openTl.to(
            emailHeadingWords,
            {
              y: "0%",
              opacity: 1,
              duration: 0.7,
              stagger: 0.06,
              ease: "back.out(1.5)",
            },
            contentStart + 0.25,
          );
        }

        if (emailLinks.length) {
          openTl.to(
            emailLinks,
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "back.out(1.5)",
            },
            contentStart + 0.35,
          );
        }

        // Step 6: Contact Social Pills (Shell pop + inner text slide without overflow hidden)
        if (contactSocials.length) {
          contactSocials.forEach((pill, i) => {
            const pillStart = contentStart + 0.45 + i * 0.12;
            const pillText = pill.querySelector(
              ".contact-social-link, [class*='link'], [class*='text'], span",
            );

            openTl.to(
              pill,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.7,
                ease: "back.out(2.5)",
              },
              pillStart,
            );

            if (pillText) {
              openTl.to(
                pillText,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "back.out(1.6)",
                },
                pillStart + 0.15,
              );
            }
          });
        }

        // Step 7: Contact Image Pop (Locked to bottom: 0)
        if (contactImg) {
          openTl.to(
            contactImg,
            {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.75,
              ease: "back.out(1.8)",
            },
            contentStart + 0.4,
          );
        }
      }

      // -----------------------------------------------------------------
      // 5. Close Timeline Execution
      // -----------------------------------------------------------------
      function closeContactModal() {
        if (!isOpen) return;

        if (openTl) openTl.kill();

        const closeTl = gsap.timeline({
          onComplete: () => {
            contactPage.classList.remove("is-active");
            contactPage.style.display = "none";
            contactPage.style.visibility = "hidden";
            contactPage.style.pointerEvents = "none";
            isOpen = false;
            resetModalElements();
          },
        });

        // Clean fade out of text, pills & navbar items
        closeTl.to(
          [closeBtn, contactContent, contactSocials].filter(Boolean),
          {
            opacity: 0,
            y: -15,
            duration: 0.3,
            ease: "power2.in",
          },
          0,
        );

        // Fade logo out in place without any y translation
        if (contactLogo) {
          closeTl.to(
            contactLogo,
            {
              opacity: 0,
              scale: 0.85,
              duration: 0.3,
              ease: "power2.in",
            },
            0,
          );
        }

        // Fade image without changing its y bottom-position
        if (contactImg) {
          closeTl.to(
            contactImg,
            {
              opacity: 0,
              scale: 0.85,
              duration: 0.3,
              ease: "power2.in",
            },
            0,
          );
        }

        // Reverse SVG transition wipe
        if (transitionPaths.length) {
          transitionPaths.forEach((path) => {
            const totalLen = path.getTotalLength ? path.getTotalLength() : 3000;
            closeTl.to(
              path,
              {
                strokeDashoffset: totalLen,
                strokeWidth: "0px",
                duration: 0.45,
                ease: "power2.in",
              },
              0.1,
            );
          });
        }
      }

      // -----------------------------------------------------------------
      // 6. Event Listeners (Direct Listeners + Document Delegation + ESC key)
      // -----------------------------------------------------------------
      openTriggers.forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          if (window.location.pathname.replace(/\/+$/, "") === "/contact") return;
          if (typeof window.triggerPageTransition === "function") {
            window.triggerPageTransition("/contact", function () {
              window.location.href = "/contact";
            });
          } else {
            window.location.href = "/contact";
          }
        });
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const targetUrl =
            typeof document !== "undefined" &&
            document.referrer &&
            document.referrer.includes(window.location.host) &&
            !document.referrer.endsWith("/contact")
              ? document.referrer
              : "/";
          if (typeof window.triggerPageTransition === "function") {
            window.triggerPageTransition(targetUrl, function () {
              window.location.href = targetUrl;
            });
          } else {
            window.location.href = targetUrl;
          }
        });
      }

      // Document-level click delegation (catches any .cta-btn clicked anywhere)
      document.addEventListener("click", (e) => {
        const ctaTarget = e.target.closest(".cta-btn, [data-contact-trigger]");
        if (ctaTarget && !ctaTarget.closest(".contact-page")) {
          e.preventDefault();
          if (window.location.pathname.replace(/\/+$/, "") === "/contact") return;
          if (typeof window.triggerPageTransition === "function") {
            window.triggerPageTransition("/contact", function () {
              window.location.href = "/contact";
            });
          } else {
            window.location.href = "/contact";
          }
          return;
        }

        const aboutTarget = e.target.closest(
          "a[href='/about'], a[href='/about/'], a[href*='about']",
        );
        if (
          aboutTarget &&
          (aboutTarget.classList.contains("navbar-link-btn") ||
            aboutTarget.classList.contains("two26-mobile-nav-link") ||
            aboutTarget.closest(".navbar-links") ||
            aboutTarget.closest(".navbar-wrap"))
        ) {
          if (window.location.pathname.replace(/\/+$/, "") === "/about") {
            e.preventDefault();
            return;
          }
          if (typeof window.triggerPageTransition === "function") {
            e.preventDefault();
            window.triggerPageTransition("/about");
            return;
          }
        }

        const workTarget = e.target.closest(
          "a[href='/work'], a[href='/work/'], a[href*='work'], a[href='/#work']",
        );
        if (
          workTarget &&
          (workTarget.classList.contains("navbar-link-btn") ||
            workTarget.classList.contains("two26-mobile-nav-link") ||
            workTarget.closest(".navbar-links") ||
            workTarget.closest(".navbar-wrap"))
        ) {
          if (window.location.pathname.replace(/\/+$/, "") === "/work") {
            e.preventDefault();
            return;
          }
          if (typeof window.triggerPageTransition === "function") {
            e.preventDefault();
            window.triggerPageTransition("/work");
            return;
          }
        }

        const offTheClockTarget = e.target.closest(
          "a[href='/off-the-clock'], a[href='/off-the-clock/'], a[href*='off-the-clock']",
        );
        if (offTheClockTarget) {
          if (window.location.pathname.replace(/\/+$/, "") === "/off-the-clock") {
            e.preventDefault();
            return;
          }
          if (typeof window.triggerPageTransition === "function") {
            e.preventDefault();
            window.triggerPageTransition("/off-the-clock", function () {
              window.location.href = "/off-the-clock";
            });
            return;
          }
        }

        const exploreTarget = e.target.closest(
          ".projects-end .project-btn, a[href='/work'].project-btn, a[href*='work'].project-btn",
        );
        if (exploreTarget && !exploreTarget.closest("a[href*='off-the-clock']")) {
          if (window.location.pathname.replace(/\/+$/, "") === "/work") {
            e.preventDefault();
            return;
          }
          if (typeof window.triggerPageTransition === "function") {
            e.preventDefault();
            window.triggerPageTransition("/work", function () {
              window.location.href = "/work";
            });
            return;
          }
        }

        const closeTarget = e.target.closest(
          ".close-btn, [data-contact-close]",
        );
        if (closeTarget) {
          e.preventDefault();
          const targetUrl =
            typeof document !== "undefined" &&
            document.referrer &&
            document.referrer.includes(window.location.host) &&
            !document.referrer.endsWith("/contact")
              ? document.referrer
              : "/";
          if (typeof window.triggerPageTransition === "function") {
            window.triggerPageTransition(targetUrl, function () {
              window.location.href = targetUrl;
            });
          } else {
            window.location.href = targetUrl;
          }
          return;
        }
      });

      // Escape key closes modal
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) {
          closeContactModal();
        }
      });
    }

    function safeInitTwo26ContactModal() {
      if (
        (typeof window !== "undefined" &&
          (window.location.pathname.replace(/\/+$/, "").endsWith("/contact") ||
           window.location.pathname.includes("/contact"))) ||
        document.querySelector(".standalone-contact-page")
      ) {
        return;
      }
      initTwo26ContactModal();
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", safeInitTwo26ContactModal);
    } else {
      safeInitTwo26ContactModal();
    }
  })();

/* === SCRIPT 12 === */
(function () {
    function initTwo26HeroAnimation() {
      // Controlled by React component Hero.tsx
      return;
      const heroSection = document.querySelector(
        ".section-hero, section.hero, [data-section='hero']",
      );
      if (!heroSection) return;

      // -------------------------------------------------------------
      // 1. Elements Selection
      // -------------------------------------------------------------
      const headings = Array.from(
        heroSection.querySelectorAll(
          ".hero-text h1, .hero-text .heading, h1, [data-hero-heading]",
        ),
      );
      const pills = Array.from(heroSection.querySelectorAll(".hero-pill"));
      const allSvgPaths = Array.from(
        heroSection.querySelectorAll(
          ".hero-path-svg-left svg path, .hero-path-svg-right svg path, .hero-path-svg-left path, .hero-path-svg-right path",
        ),
      );

      // GSAP Fallback: If GSAP fails to load, make everything visible immediately
      if (typeof gsap === "undefined") {
        headings.forEach((h) => (h.style.opacity = "1"));
        pills.forEach((p) => {
          p.style.opacity = "1";
          p.style.transform = "none";
        });
        return;
      }

      if (typeof SplitText !== "undefined") {
        gsap.registerPlugin(SplitText);
      }
      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);
      }
      const hasDrawSVG = typeof DrawSVGPlugin !== "undefined";

      // -------------------------------------------------------------
      // 2. Line-by-Line Heading Splitting (Exact projects-end Style)
      // -------------------------------------------------------------
      let linesList = [];

      headings.forEach((heading) => {
        let lines = [];
        if (typeof SplitText !== "undefined") {
          const split = new SplitText(heading, {
            type: "lines",
            linesClass: "hero-line",
          });
          split.lines.forEach((line) => {
            const mask = document.createElement("span");
            mask.className = "hero-line-mask";
            mask.style.display = "block";
            mask.style.overflow = "hidden";
            line.parentNode.insertBefore(mask, line);
            mask.appendChild(line);
          });
          lines = split.lines;
        } else {
          const rawText = heading.textContent.trim();
          heading.innerHTML = `<span class="hero-line-mask"><span class="hero-line">${rawText}</span></span>`;
          lines = Array.from(heading.querySelectorAll(".hero-line"));
        }

        gsap.set(heading, { opacity: 1 });
        gsap.set(lines, {
          y: "115%",
          opacity: 0,
          display: "block",
        });

        linesList = linesList.concat(lines);
      });

      // -------------------------------------------------------------
      // 3. Initial Setup for Pills (Preserves Designer's Custom Rotation)
      // -------------------------------------------------------------
      if (pills.length) {
        gsap.set(pills, {
          opacity: 0,
          scale: 0.4,
          y: 20,
          transformOrigin: "center center",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
        });
      }

      // -------------------------------------------------------------
      // 4. Initial Setup for Hero SVG Paths (Draw 0 & Stroke 0)
      // -------------------------------------------------------------
      const pathData = [];
      if (allSvgPaths.length) {
        allSvgPaths.forEach((path) => {
          path.style.strokeLinecap = "round";
          path.style.strokeLinejoin = "round";

          const originalStrokeWidth =
            parseFloat(
              path.getAttribute("stroke-width") ||
                window.getComputedStyle(path).strokeWidth,
            ) || 12;

          pathData.push({ path, originalStrokeWidth });

          if (hasDrawSVG) {
            gsap.set(path, {
              drawSVG: "0%",
              strokeWidth: 0,
            });
          } else {
            const len = path.getTotalLength ? path.getTotalLength() : 1500;
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
            gsap.set(path, { strokeWidth: 0 });
          }
        });
      }

      // -------------------------------------------------------------
      // 5. Build Master Hero Timeline (PAUSED - 0.75x Speed)
      // -------------------------------------------------------------
      const heroTl = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power2.out" },
        })
        .timeScale(0.75);

      // A. Line-by-Line Heading Entrance (Exact projects-end parameters)
      if (linesList.length) {
        heroTl.to(
          linesList,
          {
            y: "0%",
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "back.out(1.4)",
          },
          0,
        );
      }

      const totalLinesTime = linesList.length
        ? linesList.length * 0.12 + 0.5
        : 1.2;

      // B. Animate Pills – shell pops in, inner text slides up from mask
      pills.forEach((pill, i) => {
        const pillStart =
          0.2 + (i / Math.max(1, pills.length)) * totalLinesTime * 0.7;

        // Find inner text element (supports multiple naming conventions)
        const pillTextEl = pill.querySelector(
          ".hero-pill-text, [class*='pill-text'], [class*='pill-label'], span, div",
        );

        // Wrap text in overflow-hidden mask if not already wrapped
        if (pillTextEl && !pillTextEl.closest(".hero-pill-text-mask")) {
          const mask = document.createElement("span");
          mask.className = "hero-pill-text-mask";
          mask.style.overflow = "hidden";
          mask.style.display = "block";
          pillTextEl.parentNode.insertBefore(mask, pillTextEl);
          mask.appendChild(pillTextEl);

          // Set initial text state: start 105% below mask
          gsap.set(pillTextEl, { y: "105%", opacity: 0 });
        }

        // Phase 1: Pill shell appears (scale + y)
        heroTl.to(
          pill,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            ease: "back.out(2.5)",
          },
          pillStart,
        );

        // Phase 2: Inner text slides up from behind mask
        if (pillTextEl) {
          heroTl.to(
            pillTextEl,
            {
              y: "0%",
              opacity: 1,
              duration: 0.5,
              ease: "back.out(1.6)",
            },
            pillStart + 0.15,
          );
        }
      });

      // C. Animate Hero SVG Paths (drawSVG 0% -> 100% & strokeWidth 0 -> original)
      if (pathData.length) {
        pathData.forEach((item, pIdx) => {
          const startTime = totalLinesTime * 0.4 + pIdx * 0.15;

          if (hasDrawSVG) {
            heroTl
              .to(
                item.path,
                {
                  drawSVG: "100%",
                  duration: 0.9,
                  ease: "power2.out",
                },
                startTime,
              )
              .to(
                item.path,
                {
                  strokeWidth: item.originalStrokeWidth,
                  duration: 0.9,
                  ease: "power2.out",
                },
                startTime,
              );
          } else {
            heroTl
              .to(
                item.path,
                {
                  strokeDashoffset: 0,
                  duration: 0.9,
                  ease: "power2.out",
                },
                startTime,
              )
              .to(
                item.path,
                {
                  strokeWidth: item.originalStrokeWidth,
                  duration: 0.9,
                  ease: "power2.out",
                },
                startTime,
              );
          }
        });
      }

      // -------------------------------------------------------------
      // 6. Play Hero – Always fires (loader OR no loader, hard refresh OR nav)
      // -------------------------------------------------------------
      let heroPlayed = false;
      function playHero() {
        if (heroPlayed) return;
        heroPlayed = true;
        heroTl.play();
      }

      // If loader already completed before this script ran (e.g. internal navigation
      // where loader skips itself and fires notifyLoaderComplete instantly)
      if (window.__two26LoaderDone) {
        playHero();
      } else {
        // Wait for loader to fire (hard refresh path) or skip-fire (any nav path)
        document.addEventListener("two26:loaderComplete", playHero, {
          once: true,
        });
        // Double-check: loader may have fired between the flag check and listener registration
        if (window.__two26LoaderDone) playHero();
        // Safety: only fires if the event genuinely never arrives (broken state)
        setTimeout(playHero, 8000);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initTwo26HeroAnimation);
    } else {
      initTwo26HeroAnimation();
    }
  })();

/* === SCRIPT 13 === */
(function () {
    function initHeroMarquee() {
      // Controlled by React component HeroMarquee.tsx
      return;
      if (typeof gsap === "undefined") return;

      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);
      }
      if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }

      const bgPath = document.querySelector(".hero-marquee-bg");
      const maskPath = document.querySelector(".hero-marquee-mask-path");
      const textPath = document.querySelector(".hero-marquee-tp");
      const textGroup = document.querySelector(".hero-marquee-text-group");
      const unit = document.querySelector(".marquee-unit");
      const container =
        document.querySelector(".hero-marquee") ||
        (bgPath ? bgPath.closest("svg") : null);

      if (!bgPath || !maskPath || !textPath) return;

      // 1. Initial State: Start at 100% 100% (hidden on right end)
      gsap.set([bgPath, maskPath], { drawSVG: "100% 100%" });

      // 2. Start Seamless Infinite Marquee Loop
      const startInfiniteMarquee = () => {
        const unitLength = unit ? unit.getComputedTextLength() : 1600;
        const speedDuration = unitLength / 75; // Smooth slow reading pace

        gsap.to(textPath, {
          attr: { startOffset: -unitLength },
          duration: speedDuration,
          ease: "none",
          repeat: -1,
        });
      };

      startInfiniteMarquee();

      const scrollerEl = document.querySelector(".page") || window;

      // 3. ScrollTrigger: Draw Ribbon + Reveal Text simultaneously from Right to Left
      // On reveal complete: remove mask to release Safari CPU rasterizer for silky 60fps scrolling
      gsap.to([bgPath, maskPath], {
        drawSVG: "0% 100%",
        delay: window.innerWidth < 991 ? 0.3 : 0,
        duration: 1.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          scroller: scrollerEl,
          start: "top 85%",
          once: true,
        },
        onComplete: () => {
          if (textGroup) {
            textGroup.removeAttribute("mask");
          }
        },
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initHeroMarquee);
    } else {
      initHeroMarquee();
    }
  })();

/* === SCRIPT 14 === */
(function () {
    function initAboutPinned() {
      if (typeof gsap === 'undefined') return;

      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }
      if (typeof SplitText !== 'undefined') {
        gsap.registerPlugin(SplitText);
      }

      const sections = document.querySelectorAll('.section-about');
      if (!sections.length) return;

      const scrollerEl = document.querySelector('.page') || window;

      // Responsive scroll distance calculation
      const getPinDistance = () => {
        const width = window.innerWidth;
        if (width < 480) return 1150; // Mobile (< 480px): 1100-1200px
        if (width < 992) return 1550; // Tablet (< 992px): 1500-1600px
        return 2200; // Desktop: 2200px
      };

      sections.forEach((section) => {
        const aboutPara = section.querySelector('.about-para');
        const pills = section.querySelectorAll('.about-pill');

        if (!aboutPara) return;

        // 1. Hardware acceleration & anti-blur on pinned container
        gsap.set(section, {
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          force3D: true,
        });

        // 2. Split Text into individual characters
        let chars = [];
        if (typeof SplitText !== 'undefined') {
          const split = new SplitText(aboutPara, {
            type: 'chars, words',
            charsClass: 'about-char',
          });
          chars = split.chars;
        } else {
          const text = aboutPara.textContent;
          aboutPara.innerHTML = text
            .split('')
            .map((c) => `<span class="about-char" style="display:inline-block;">${c === ' ' ? '&nbsp;' : c}</span>`)
            .join('');
          chars = aboutPara.querySelectorAll('.about-char');
        }

        if (!chars.length) return;

        // 3. Set Initial State
        gsap.set(chars, {
          color: 'rgba(255, 84, 0, 0.45)',
          scale: 1,
          rotation: 0,
          display: 'inline-block',
          transformOrigin: 'center center',
          textShadow: '0px 0px 0px rgba(255,84,0,0)',
          willChange: 'transform, color',
          backfaceVisibility: 'hidden',
        });

        // Pills: Hidden & scaled down
        if (pills.length) {
          gsap.set(pills, {
            opacity: 0,
            scale: 0.6,
            y: 24,
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
          });
        }

        // 4. Create Responsive Scrubbed Pinned Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller: scrollerEl,
            start: 'top top',
            end: () => `+=${getPinDistance()}`, // Dynamically scales per device screen
            pin: section,
            pinSpacing: true,
            scrub: window.innerWidth < 992 ? 0.6 : 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        });

        const totalChars = chars.length;
        const letterAnimSpan = 85;

        chars.forEach((char, i) => {
          const startTime = (i / totalChars) * letterAnimSpan;

          // Stage 1: Scale 1.12, Random ±3-4 deg tilt, Thick glowing #FF5400
          tl.to(
            char,
            {
              color: '#FF5400',
              scale: 1.12,
              rotation: () => gsap.utils.random(-4, 4),
              textShadow: '0.6px 0.6px 0 #FF5400, -0.6px -0.6px 0 #FF5400, 0.6px -0.6px 0 #FF5400, -0.6px 0.6px 0 #FF5400',
              duration: 3.5,
              ease: 'power1.out',
            },
            startTime,
          );

          // Stage 2: Settle to normal scale 1, 0 deg, clean black #000000
          tl.to(
            char,
            {
              color: '#000000',
              scale: 1,
              rotation: 0,
              textShadow: '0px 0px 0px rgba(0,0,0,0)',
              duration: 3.5,
              ease: 'power1.inOut',
            },
            startTime + 3.5,
          );
        });

        // 5. Pop-in Pills at milestones
        if (pills[0]) {
          tl.to(
            pills[0],
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 6,
              ease: 'back.out(2)',
            },
            35, // 35% scroll progress
          );
        }

        if (pills[1]) {
          tl.to(
            pills[1],
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 6,
              ease: 'back.out(2)',
            },
            72, // 72% scroll progress
          );
        }

        if (pills[2]) {
          tl.to(
            pills[2],
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 6,
              ease: 'back.out(2)',
            },
            96, // 96-100% scroll progress
          );
        }
      });
    }

    window.initAboutPinned = initAboutPinned;
  })();

/* === SCRIPT 15: 3D CYLINDRICAL CAROUSEL WHEEL (REVERSE ENGINEERED THREE.JS WEBGL ENGINE) === */
(function() {
  function ensureThree(callback) {
    if (typeof window.THREE !== "undefined") {
      callback();
      return;
    }
    var script = document.createElement("script");
    script.src = "/js/three.min.js";
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function init3DCylindricalCarousel() {
    var container = document.getElementById("three-carousel-container") || document.querySelector(".section-slider-wrapper");
    if (!container) return;
    if (container.dataset.carouselInited === "true") return;

    if (typeof window.THREE === "undefined") {
      ensureThree(init3DCylindricalCarousel);
      return;
    }

    container.dataset.carouselInited = "true";

    var videoData = [
      { poster: '/videos/marquee/video-1-poster.jpg', video: '/videos/marquee/video-1.mp4' },
      { poster: '/videos/marquee/video-6-poster.jpg', video: '/videos/marquee/video-6.mp4' },
      { poster: '/videos/marquee/video-4-poster.jpg', video: '/videos/marquee/video-4.mp4' },
      { poster: '/videos/marquee/video-2-poster.jpg', video: '/videos/marquee/video-2.mp4' },
      { poster: '/videos/marquee/video-5-poster.jpg', video: '/videos/marquee/video-5.mp4' },
      { poster: '/videos/marquee/video-7-poster.jpg', video: '/videos/marquee/video-7.mp4' },
      { poster: '/videos/marquee/video-3-poster.jpg', video: '/videos/marquee/video-3.mp4' }
    ];

    var items = [].concat(videoData, videoData);

    var vertexShader = [
      "uniform float uBend;",
      "uniform vec2 uSize;",
      "varying vec2 vUv;",
      "void main() {",
      "  vUv = uv;",
      "  vec3 p = position;",
      "  float halfW = uSize.x * 0.5;",
      "  float distX = clamp(abs(p.x) / halfW, 0.0, 1.0);",
      "  p.z -= uBend * distX * distX;",
      "  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);",
      "}"
    ].join("\n");

    var fragmentShader = [
      "precision highp float;",
      "uniform sampler2D uMap;",
      "uniform float uHasMap;",
      "uniform vec3 uColor;",
      "uniform vec2 uSize;",
      "uniform float uRadius;",
      "uniform float uOpacity;",
      "uniform float uImageAspect;",
      "varying vec2 vUv;",
      "vec3 linearToSRGB(vec3 c) {",
      "  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));",
      "}",
      "float sdRoundedBox(vec2 p, vec2 b, float r) {",
      "  vec2 q = abs(p) - b + vec2(r);",
      "  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;",
      "}",
      "vec2 coverUv(vec2 uv, float imgAspect, float planeAspect) {",
      "  vec2 scale = vec2(1.0);",
      "  if (imgAspect > planeAspect) {",
      "    scale.x = planeAspect / imgAspect;",
      "  } else {",
      "    scale.y = imgAspect / planeAspect;",
      "  }",
      "  return (uv - 0.5) * scale + 0.5;",
      "}",
      "void main() {",
      "  vec2 uv = coverUv(vUv, uImageAspect, uSize.x / uSize.y);",
      "  vec3 col = uHasMap > 0.5 ? texture2D(uMap, uv).rgb : uColor;",
      "  vec2 p = (vUv - 0.5) * uSize;",
      "  float d = sdRoundedBox(p, uSize * 0.5, uRadius);",
      "  float aa = fwidth(d);",
      "  float maskAlpha = 1.0 - smoothstep(-aa, aa, d);",
      "  float alpha = maskAlpha * uOpacity;",
      "  if (alpha <= 0.001) discard;",
      "  gl_FragColor = vec4(col, alpha);",
      "}"
    ].join("\n");

    var shadowVertexShader = vertexShader;

    var shadowFragmentShader = [
      "precision highp float;",
      "uniform vec2 uCardSize;",
      "uniform vec2 uShadowSize;",
      "uniform float uRadius;",
      "uniform float uOpacity;",
      "varying vec2 vUv;",
      "float sdRoundedBox(vec2 p, vec2 b, float r) {",
      "  vec2 q = abs(p) - b + vec2(r);",
      "  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;",
      "}",
      "void main() {",
      "  vec2 p = (vUv - 0.5) * uShadowSize;",
      "  vec2 shadowP = p - vec2(0.0, -0.05);",
      "  float d = sdRoundedBox(shadowP, uCardSize * 0.5, uRadius);",
      "  float s1 = exp(-max(d, 0.0) * 18.0) * 0.20;",
      "  float s2 = exp(-max(d, 0.0) * 6.5) * 0.12;",
      "  float s3 = exp(-max(d, 0.0) * 2.5) * 0.06;",
      "  float shadowAlpha = (s1 * 0.12 + s2 * 0.06 + s3 * 0.02) * uOpacity;",
      "  if (shadowAlpha <= 0.001) discard;",
      "  gl_FragColor = vec4(vec3(0.0), shadowAlpha);",
      "}"
    ].join("\n");

    var pool = document.getElementById("carouselVideoPool");
    if (!pool) {
      pool = document.createElement("div");
      pool.id = "carouselVideoPool";
      pool.className = "carousel-video-pool";
      document.body.appendChild(pool);
    }

    var videoTextures = [];
    videoData.forEach(function(vd) {
      var vid = document.createElement("video");
      vid.src = vd.video;
      vid.poster = vd.poster;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.setAttribute("playsinline", "");
      vid.setAttribute("webkit-playsinline", "");
      vid.setAttribute("muted", "");
      vid.setAttribute("loop", "");
      vid.autoplay = true;
      vid.preload = "auto";
      pool.appendChild(vid);
      vid.play().catch(function() {});

      var vTex = new THREE.VideoTexture(vid);
      vTex.minFilter = THREE.LinearFilter;
      vTex.magFilter = THREE.LinearFilter;
      if (THREE.SRGBColorSpace) vTex.colorSpace = THREE.SRGBColorSpace;
      videoTextures.push({ video: vid, texture: vTex });
    });

    var width = container.clientWidth || window.innerWidth;
    var height = container.clientHeight || 680;
    var isMobile = width < 768;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(24, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 11.5 : 8.6);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    var carousel = new THREE.Group();
    scene.add(carousel);

    var g = 4.3;
    var scaleFactor = isMobile ? 0.72 : 1.0;
    carousel.scale.setScalar(scaleFactor);

    var tiltRad = THREE.MathUtils.degToRad(-13);
    carousel.rotation.x = tiltRad;
    carousel.position.y = g * scaleFactor * Math.sin(tiltRad);

    var textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";

    var N = items.length;
    var M = 1.30;
    var U = 1.66;
    var I = 0.10;
    var P = 0.12;
    var O = M + 0.35;
    var E = U + 0.35;

    var cardGeo = new THREE.PlaneGeometry(M, U, 24, 1);
    var shadowGeo = new THREE.PlaneGeometry(O, E, 24, 1);

    var state = {
      rotation: 0,
      spinVelocity: isMobile ? -0.075 : -0.04,
      dragInfluence: isMobile ? 0.0065 : 0.0035,
      isDragging: false,
      lastPointerX: 0,
      lastPointerTime: 0,
      planes: []
    };

    items.forEach(function(item, i) {
      var angle = (i / N) * Math.PI * 2;
      var vIdx = i % videoData.length;
      var vObj = videoTextures[vIdx];

      var uniforms = {
        uMap: { value: null },
        uHasMap: { value: 0 },
        uColor: { value: new THREE.Color(0xf0eee9) },
        uSize: { value: new THREE.Vector2(M, U) },
        uRadius: { value: I },
        uBend: { value: P },
        uOpacity: { value: 1.0 },
        uImageAspect: { value: 406 / 720 }
      };

      var cardMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        transparent: true,
        side: THREE.FrontSide
      });

      var shadowUniforms = {
        uCardSize: { value: new THREE.Vector2(M, U) },
        uShadowSize: { value: new THREE.Vector2(O, E) },
        uRadius: { value: I },
        uBend: { value: P },
        uOpacity: { value: 1.0 }
      };

      var shadowMat = new THREE.ShaderMaterial({
        vertexShader: shadowVertexShader,
        fragmentShader: shadowFragmentShader,
        uniforms: shadowUniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      textureLoader.load(item.poster, function(tex) {
        if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
        if (!uniforms.uMap.value || uniforms.uMap.value === tex) {
          uniforms.uMap.value = tex;
          uniforms.uHasMap.value = 1.0;
          cardMat.needsUpdate = true;
        }
      });

      var checkVideo = function() {
        if (vObj.video.readyState >= 2) {
          uniforms.uMap.value = vObj.texture;
          uniforms.uHasMap.value = 1.0;
          cardMat.needsUpdate = true;
        } else {
          vObj.video.addEventListener("playing", function() {
            uniforms.uMap.value = vObj.texture;
            uniforms.uHasMap.value = 1.0;
            cardMat.needsUpdate = true;
          }, { once: true });
        }
      };
      checkVideo();

      var cardMesh = new THREE.Mesh(cardGeo, cardMat);
      cardMesh.renderOrder = 2;

      var shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(0, -0.08, -0.04);
      shadowMesh.renderOrder = 1;
      cardMesh.add(shadowMesh);

      cardMesh.position.set(Math.sin(angle) * g, 0, Math.cos(angle) * g);
      cardMesh.rotation.y = angle;
      cardMesh.userData = {
        baseAngle: angle,
        item: item,
        material: cardMat,
        shadowMaterial: shadowMat
      };

      carousel.add(cardMesh);
      state.planes.push(cardMesh);
    });

    var onPointerDown = function(e) {
      state.isDragging = true;
      state.lastPointerX = e.clientX;
      state.lastPointerTime = performance.now();
      state.spinVelocity = 0;
    };

    var onPointerMove = function(e) {
      if (!state.isDragging) return;
      var dx = e.clientX - state.lastPointerX;
      state.lastPointerX = e.clientX;
      state.rotation += dx * state.dragInfluence;
      var now = performance.now();
      var dt = Math.max((now - state.lastPointerTime) / 1000, 0.001);
      state.lastPointerTime = now;
      var instVel = (dx * state.dragInfluence) / dt;
      state.spinVelocity = state.spinVelocity * 0.7 + instVel * 0.3;
    };

    var onPointerUp = function() {
      if (!state.isDragging) return;
      state.isDragging = false;
      var maxVel = isMobile ? 4.0 : 2.5;
      state.spinVelocity = Math.max(Math.min(state.spinVelocity, maxVel), -maxVel);
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    var thresholdCos = Math.cos(Math.PI / 3);
    var lastTime = performance.now();

    function animate() {
      requestAnimationFrame(animate);
      var now = performance.now();
      var dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      var baseSpin = isMobile ? -0.075 : -0.04;
      if (!state.isDragging) {
        state.spinVelocity += (baseSpin - state.spinVelocity) * Math.min(dt * 3.2, 1);
        state.rotation += state.spinVelocity * dt;
      }
      carousel.rotation.y = state.rotation;

      state.planes.forEach(function(plane) {
        var rad = plane.userData.baseAngle + state.rotation;
        var cosVal = Math.cos(rad);
        var opacity = 1.0;
        if (cosVal < thresholdCos) {
          var factor = (cosVal + 1.0) / (thresholdCos + 1.0);
          opacity = Math.max(0.22, factor);
        }
        plane.userData.material.uniforms.uOpacity.value = opacity;
        if (plane.userData.shadowMaterial) {
          plane.userData.shadowMaterial.uniforms.uOpacity.value = opacity;
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", function() {
      var w = container.clientWidth || window.innerWidth;
      var h = container.clientHeight || 680;
      var mob = w < 768;
      camera.aspect = w / h;
      camera.position.z = mob ? 11.5 : 8.6;
      camera.updateProjectionMatrix();
      carousel.scale.setScalar(mob ? 0.72 : 1.0);
      carousel.position.y = g * (mob ? 0.72 : 1.0) * Math.sin(tiltRad);
      state.dragInfluence = mob ? 0.0065 : 0.0035;
      renderer.setSize(w, h);
    });
  }

  window.init3DCylindricalCarousel = init3DCylindricalCarousel;
  window.initShowcase3DCarousel = init3DCylindricalCarousel;
  window.initShowcaseMarquee = init3DCylindricalCarousel;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init3DCylindricalCarousel);
  } else {
    init3DCylindricalCarousel();
  }
})();

/* === SCRIPT 17: ROUTE TRANSITION & 120 FPS RE-BIND OBSERVER === */
(function() {
  function onRouteMount() {
    var resumeGrid = document.querySelector(".resume-2col-grid");
    if (resumeGrid) {
      if (typeof window.initCTAButtons === "function") {
        window.initCTAButtons(resumeGrid);
      }
      window.dispatchEvent(new Event("resize"));
    }
  }

  if (typeof MutationObserver !== "undefined") {
    var timeout = null;
    var observer = new MutationObserver(function(mutations) {
      var shouldCheck = false;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes && mutations[i].addedNodes.length > 0) {
          shouldCheck = true;
          break;
        }
      }
      if (shouldCheck) {
        clearTimeout(timeout);
        timeout = setTimeout(onRouteMount, 40);
      }
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener("DOMContentLoaded", function() {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  }

  window.addEventListener("popstate", function() {
    setTimeout(onRouteMount, 50);
  });
})();
