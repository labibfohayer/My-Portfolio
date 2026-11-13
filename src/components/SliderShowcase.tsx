"use client";

import React, { useEffect, useRef } from "react";

const MARQUEE_VIDEOS = [
  {
    file: "CONTINUITY:_This_is_the_second_057fcb3d.mp4",
    clean: "video-1.mp4",
  },
  {
    file: "Commercial_for_ATREEZ_parfum_94e63a01_1080p.mp4",
    clean: "video-2.mp4",
  },
  {
    file: "Create_a_10-second,_ultra-photorealistic,_cinematic_300f6d32.mp4",
    clean: "video-3.mp4",
  },
  {
    file: "Xiaomi_smartphone_levitates_in_s…_c5d07a54_1080p.mp4",
    clean: "video-4.mp4",
  },
  {
    file: "_ad__no_sound__animation__unboxing_57d12869_1080p.mp4",
    clean: "video-5.mp4",
  },
  {
    file: "_cokearound_fo_ad__colours_of_0b78dbf3_1080p.mp4",
    clean: "video-6.mp4",
  },
  {
    file: "_cokearound_fo_ad__colours_of_feef6522_1080p.mp4",
    clean: "video-7.mp4",
  },
];

export default function SliderShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tickFn: any = null;
    let scrollTriggerInstance: any = null;
    let resizeHandler: any = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let videoObserver: IntersectionObserver | null = null;
    let sectionObserver: IntersectionObserver | null = null;
    let resizeRaf: number | null = null;
    let visibilityHandler: any = null;

    const setupMarquee = () => {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;

      if (!gsap) {
        timeoutId = setTimeout(setupMarquee, 50);
        return;
      }

      if (ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) return;

      const initialSlides = Array.from(
        track.querySelectorAll(".showcase-slide:not(.is-marquee-clone)")
      ) as HTMLElement[];
      if (!initialSlides.length) return;

      wrapper.setAttribute("data-marquee-initialized", "true");
      wrapper.style.overflow = "hidden";
      wrapper.style.position = "relative";
      wrapper.style.width = "100%";

      track.style.display = "flex";
      track.style.flexDirection = "row";
      track.style.willChange = "transform";
      track.style.width = "max-content";
      track.style.backfaceVisibility = "hidden";
      (track.style as any).transformStyle = "preserve-3d";

      initialSlides.forEach((slide) => {
        slide.style.flexShrink = "0";
        slide.style.willChange = "transform";
        slide.style.transformOrigin = "center center";
        slide.style.backfaceVisibility = "hidden";
        slide.style.transform = "scale(1) translateZ(0)";
      });

      const numInitial = initialSlides.length;

      // Remove any existing clones to prevent duplicates on re-init
      track.querySelectorAll(".is-marquee-clone").forEach((c) => c.remove());

      // Smart clone sets: 2 sets (14 slides) for typical screens, 3 sets (21 slides) for ultrawide
      const oneSetWidth =
        (initialSlides[0].offsetWidth || 500) * numInitial || 3500;
      const setsNeeded = Math.min(
        3,
        Math.max(2, Math.ceil((window.innerWidth * 1.5) / oneSetWidth) + 1)
      );

      for (let s = 1; s < setsNeeded; s++) {
        initialSlides.forEach((slide) => {
          const clone = slide.cloneNode(true) as HTMLElement;
          clone.classList.add("is-marquee-clone");
          clone.style.flexShrink = "0";
          clone.style.willChange = "transform";
          clone.style.transformOrigin = "center center";
          clone.style.backfaceVisibility = "hidden";
          clone.style.transform = "scale(1) translateZ(0)";
          track.appendChild(clone);
        });
      }

      // Virtualized video decoding: ONLY videos visible on screen (plus small buffer) decode & play!
      if (typeof IntersectionObserver !== "undefined") {
        videoObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const vid = entry.target as HTMLVideoElement;
              if (entry.isIntersecting) {
                if (vid.paused) {
                  vid.play().catch(() => {});
                }
              } else {
                if (!vid.paused) {
                  vid.pause();
                }
              }
            });
          },
          { root: null, rootMargin: "300px", threshold: 0.01 }
        );

        track.querySelectorAll("video").forEach((vid) => {
          vid.muted = true;
          vid.setAttribute("playsinline", "");
          vid.setAttribute("preload", "metadata");
          videoObserver?.observe(vid);
        });
      } else {
        track.querySelectorAll("video").forEach((vid) => {
          vid.muted = true;
          vid.setAttribute("playsinline", "");
          vid.play().catch(() => {});
        });
      }

      visibilityHandler = () => {
        if (document.hidden) {
          track.querySelectorAll("video").forEach((vid) => {
            if (!vid.paused) vid.pause();
          });
        }
      };
      document.addEventListener("visibilitychange", visibilityHandler);

      const allSlides = Array.from(
        track.querySelectorAll(".showcase-slide")
      ) as HTMLElement[];

      let setWidth = 0;
      let wrapperRectLeft = 0;
      let wrapperCenter = 0;
      let halfWidth = 400;
      let slideOffsets: number[] = [];
      let slideHalfWidth = 150;
      let currentX = -2000;
      const currentScales: number[] = new Array(allSlides.length).fill(1);

      function measureAll() {
        if (!wrapper || !track) return;
        if (allSlides.length > numInitial) {
          const firstSlide = allSlides[0];
          const firstClone = allSlides[numInitial];
          if (firstSlide && firstClone) {
            const exactDistance = firstClone.offsetLeft - firstSlide.offsetLeft;
            if (exactDistance > 0) {
              setWidth = exactDistance;
            }
          }
        }

        if (setWidth <= 0) {
          const trackStyle = window.getComputedStyle(track);
          const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
          let total = 0;
          initialSlides.forEach((slide) => {
            const style = window.getComputedStyle(slide);
            const margin =
              parseFloat(style.marginLeft || "0") +
              parseFloat(style.marginRight || "0");
            total +=
              (slide.offsetWidth || slide.getBoundingClientRect().width) +
              margin +
              gap;
          });
          if (total > 0) setWidth = total;
        }

        const rect = wrapper.getBoundingClientRect();
        wrapperRectLeft = rect.left;
        wrapperCenter = rect.left + rect.width / 2;
        halfWidth = rect.width * 0.45 || 400;

        slideOffsets = allSlides.map((slide) => slide.offsetLeft);
        if (initialSlides[0]) {
          slideHalfWidth = (initialSlides[0].offsetWidth || 300) / 2;
        }
        if (setWidth > 0 && currentX === -2000) {
          currentX = -setWidth;
        }
      }

      measureAll();

      const slideVideos = track.querySelectorAll("video");
      slideVideos.forEach((vid) => {
        if (vid.readyState >= 1) {
          measureAll();
        } else {
          vid.addEventListener("loadedmetadata", measureAll, { once: true });
        }
      });

      const slideImages = track.querySelectorAll("img");
      slideImages.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", measureAll, { once: true });
        }
      });

      resizeHandler = () => {
        if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          measureAll();
        });
      };
      window.addEventListener("resize", resizeHandler);

      // Viewport-aware visibility observer: saves CPU by pausing slide computations when offscreen
      let isSectionVisible = true;
      if (typeof IntersectionObserver !== "undefined" && sectionRef.current) {
        sectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isSectionVisible = entry.isIntersecting;
            });
          },
          { rootMargin: "200px" }
        );
        sectionObserver.observe(sectionRef.current);
      }

      // Speed Level 3 = 1.60x (+60% / 2.400 px/frame)
      const speedMultiplier = 1.6;
      const BASE_SPEED = 1.5 * speedMultiplier;

      // Base direction is +1 (LEFT TO RIGHT: "bam theke dane")
      let targetDirection = 1;
      let currentDirection = 1;
      let scrollVelocityBoost = 0;

      if (setWidth > 0) {
        currentX = -setWidth;
      }

      const scrollerEl = document.querySelector(".page") || window;

      if (ScrollTrigger) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: document.body,
          scroller: scrollerEl,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self: any) => {
            // dir is +1 when scrolling down, -1 when scrolling up
            const dir = self.direction === 1 ? 1 : -1;
            targetDirection = 1; // base idle direction remains left-to-right

            const vel = Math.abs(self.getVelocity() || 0);
            scrollVelocityBoost =
              Math.min(vel / 200, 12 * speedMultiplier) * dir;
          },
        });
      }

      tickFn = () => {
        if (!isSectionVisible) return;
        currentDirection += (targetDirection - currentDirection) * 0.06;
        scrollVelocityBoost *= 0.92;

        const delta = BASE_SPEED * currentDirection + scrollVelocityBoost;
        currentX += delta;

        // Continuous seamless wrapping for left-to-right motion
        if (setWidth > 0) {
          while (currentX > 0) {
            currentX -= setWidth;
          }
          while (currentX < -setWidth) {
            currentX += setWidth;
          }
        }

        // 120 FPS direct GPU transform without reflow
        track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0px, 0px)`;

        // Zero-reflow proximity inverse scaling:
        // Pure arithmetic using pre-measured offsets
        const currentScreenX = wrapperRectLeft + currentX;

        for (let i = 0; i < allSlides.length; i++) {
          const slide = allSlides[i];
          const slideCenter = currentScreenX + slideOffsets[i] + slideHalfWidth;
          const distFromCenter = Math.abs(slideCenter - wrapperCenter);

          if (distFromCenter < halfWidth) {
            const normDist = distFromCenter / halfWidth;
            const targetScale = 0.95 + 0.05 * normDist;
            if (Math.abs(currentScales[i] - targetScale) > 0.001) {
              currentScales[i] = targetScale;
              slide.style.transform = `scale(${targetScale.toFixed(4)}) translateZ(0)`;
            }
          } else if (currentScales[i] !== 1) {
            currentScales[i] = 1;
            slide.style.transform = "scale(1) translateZ(0)";
          }
        }
      };

      gsap.ticker.add(tickFn);
    };

    timeoutId = setTimeout(setupMarquee, 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
      if (visibilityHandler) {
        document.removeEventListener("visibilitychange", visibilityHandler);
      }
      if (sectionObserver) {
        sectionObserver.disconnect();
      }
      if (videoObserver) {
        videoObserver.disconnect();
      }
      const gsap = (window as any).gsap;
      if (gsap && tickFn) {
        gsap.ticker.remove(tickFn);
      }
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-marquee-speed="3"
      className="section-slider-showcase"
    >
      <div
        ref={wrapperRef}
        className="section-slider-wrapper"
        style={{
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          ref={trackRef}
          className="showcase-slider"
          style={{
            display: "flex",
            flexDirection: "row",
            width: "max-content",
            willChange: "transform",
          }}
        >
          {MARQUEE_VIDEOS.map((item, idx) => (
            <div key={idx} className="showcase-slide" style={{ flexShrink: 0 }}>
              <video
                muted
                loop
                playsInline
                preload="metadata"
                poster={`/videos/marquee/${item.clean.replace(".mp4", "-poster.jpg")}`}
                className="showcase-slide-img"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              >
                <source
                  src={`/videos/marquee/${item.clean}`}
                  type="video/mp4"
                />
                <source
                  src={`/videos/marquee/${item.file}`}
                  type="video/mp4"
                />
                <source
                  src={`/home/labib-fohayer/Videos/${item.file}`}
                  type="video/mp4"
                />
              </video>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
