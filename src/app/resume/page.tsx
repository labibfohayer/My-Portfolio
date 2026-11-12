"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initCTAButtons, initNavbarBtns } from "@/lib/buttonAnimations";

export default function ResumePage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

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

    const cleanupNavBtns = initNavbarBtns(pageRef.current);
    const cleanupCTA = initCTAButtons(pageRef.current);

    return () => {
      clearTimeout(t);
      if (cleanupNavBtns) cleanupNavBtns();
      if (cleanupCTA) cleanupCTA();
    };
  }, []);

  const handleBackHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof (window as any).triggerPageTransition === "function") {
      (window as any).triggerPageTransition("/", () => {
        router.push("/");
      });
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Navbar />
      <div
        ref={pageRef}
        className="page lenis selection:bg-[#ff5400] selection:text-white relative bg-[#fae3e2] min-h-screen text-[#1a1a1a]"
      >
        <main
          className="main"
          style={{
            paddingTop: "7.5rem",
            paddingBottom: "5rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header & Actions Container */}
          <div
            style={{
              maxWidth: "58rem",
              margin: "0 auto",
              width: "100%",
              padding: "0 1.5rem",
              marginBottom: "2rem",
            }}
          >
            {/* Back to Home Link */}
            <div style={{ marginBottom: "1.25rem" }}>
              <Link
                href="/"
                onClick={handleBackHome}
                className="navbar-link-btn group cursor-pointer"
              >
                <span className="navlink-text flex items-center gap-1.5">
                  <span className="inline-block transform -translate-y-[0.5px]">←</span>
                  <span>Back to Home</span>
                </span>
                <div className="stroke-fill">
                  <div className="stroke-fill-code">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 75 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="overflow-visible w-full h-full"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 21.5571C0 21.5571 6.56744 2.8501 15.4762 4.44988C25.7691 6.2982 5.66141 21.3471 12.5002 29.1915C22.9246 41.1486 29.3907 -7.93025 42.4603 1.12139C53.3211 8.6432 27.1823 26.7575 37.6982 34.7461C50.754 44.6641 58.0718 -7.92618 67.2619 5.59531C72.4564 13.2381 57.9637 30.3713 67.2619 30.3713C70.8333 30.3713 75 19.753 75 19.753"
                        stroke="#FF5400"
                        strokeWidth="24"
                        strokeLinecap="round"
                        className="draw-svg-path"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Title & Download Action Bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: "1.5rem",
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                paddingBottom: "1.5rem",
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-primary, 'MDNichrome', Arial, sans-serif)",
                    fontSize: "clamp(2rem, 5vw, 3.25rem)",
                    fontWeight: 800,
                    lineHeight: "1.05",
                    color: "#1a1a1a",
                    margin: "0 0 0.5rem 0",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Curriculum Vitae
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-secondary, 'NeueMontreal', sans-serif)",
                    fontSize: "1rem",
                    color: "#555555",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Full-Stack Developer • AI Automation Engineer • Reverse Engineer
                </p>
              </div>

              {/* On-brand Download PDF Button */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <a
                  href="/Labib_Fohayer_Resume.pdf?v=4.0"
                  download="Labib_Fohayer_Resume.pdf"
                  className="cta-btn cursor-pointer"
                  style={{ minWidth: "9.5em", height: "2.5em" }}
                >
                  <span className="cta-text" style={{ fontSize: "0.85em" }}>
                    Download PDF
                  </span>
                  <div className="cta-btn-arrow" style={{ width: "2.1em", height: "2.1em" }}>
                    <div className="svg-arrow-cta">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 1V7M5 7L2.2 4.2M5 7L7.8 4.2M1.5 8.8H8.5"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="cta-btn-fill-hover" />
                </a>
              </div>
            </div>
          </div>

          {/* Seamless Vertical CV Container - Zero Internal Scrollbar */}
          <div
            style={{
              maxWidth: "54rem", // ~864px
              margin: "0 auto",
              width: "100%",
              padding: "0 1.5rem",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "850px",
                margin: "0 auto",
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.15)",
                overflow: "hidden",
                border: "none",
              }}
            >
              {/* Mobile View: High-res crisp graphic image for natural mobile touch scroll */}
              <div className="block md:hidden w-full">
                <img
                  src="/images/resume-preview.png?v=4.0"
                  alt="Labib Fohayer - Curriculum Vitae"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>

              {/* Desktop View: Fully expanded A4 height iframe - NO nested scrollbar */}
              <div className="hidden md:block w-full">
                <iframe
                  src="/Labib_Fohayer_Resume.pdf?v=4.0#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
                  title="Labib Fohayer Curriculum Vitae"
                  scrolling="no"
                  style={{
                    width: "100%",
                    height: "1175px",
                    border: "none",
                    display: "block",
                    overflow: "hidden",
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
