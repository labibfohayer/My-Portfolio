"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutValues from "@/components/about/AboutValues";
import AboutCapabilities from "@/components/about/AboutCapabilities";
import Link from "next/link";
import { initCTAButtons } from "@/lib/buttonAnimations";
import "./about.css";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleInit = () => {
      if (typeof (window as any).initLenis === "function") {
        (window as any).initLenis();
      }
      if ((window as any).lenis) {
        (window as any).lenis.resize();
      }
      if ((window as any).ScrollTrigger) {
        (window as any).ScrollTrigger.refresh();
      }
    };

    handleInit();
    const t = setTimeout(handleInit, 300);

    // Initialize CTA button animations (magnetic + arrow bounce)
    const cleanupCTA = initCTAButtons(containerRef.current);

    // Ensure ScrollTrigger & Lenis recalculate accurately once web fonts and images are ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(handleInit);
    }

    const imgs = document.querySelectorAll(".page img");
    imgs.forEach((img: Element) => {
      const htmlImg = img as HTMLImageElement;
      if (!htmlImg.complete) {
        htmlImg.addEventListener("load", handleInit, { once: true });
      }
    });

    return () => {
      clearTimeout(t);
      if (cleanupCTA) cleanupCTA();
    };
  }, []);

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="page lenis selection:bg-[#ff5400] selection:text-white relative">
        <main className="main">
          <AboutHero />

          {/* Replaced Behind The Work section with a sleek, perfectly centered button */}
          <section
            className="section-off-the-clock-cta"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "4.5em 1.5em",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "1.25em" }}>
              <span
                style={{
                  fontSize: "0.875rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "#ff5400",
                  fontFamily: "PP Neue Montreal, sans-serif",
                }}
              >
                Behind The Scenes
              </span>
            </div>
            <Link
              href="/off-the-clock"
              className="project-btn w-inline-block cursor-pointer"
              style={{
                width: "auto",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <div className="cta-text" style={{ marginRight: "0.5em" }}>☕ Off The Clock</div>
              <div className="cta-btn-arrow">
                <div className="svg-arrow-cta">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.46439 8.53621L8.53546 1.46515M3.05538 1.28837L8.53546 1.46515L8.71223 6.94522"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="cta-btn-fill-hover" />
            </Link>
          </section>

          <AboutValues />
          <AboutCapabilities />
          <Footer />
        </main>
      </div>
    </>
  );
}
