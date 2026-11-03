"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResumePage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile for optimized viewer
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

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
    const t = setTimeout(handleInit, 200);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", checkMobile);
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
      <div className="page lenis selection:bg-[#ff5400] selection:text-white relative bg-[#fae3e2] min-h-screen">
        <main
          className="main"
          style={{
            paddingTop: "7.5rem",
            paddingBottom: "4rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Breadcrumb & Page Header */}
          <div
            style={{
              maxWidth: "68rem",
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
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  transition: "color 0.2s ease",
                }}
                className="hover:text-[#ff5400] cursor-pointer"
              >
                <span>← Back to Home</span>
              </Link>
            </div>

            {/* Header Content */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: "1.5rem",
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                paddingBottom: "1.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#ff5400",
                    marginBottom: "0.5rem",
                  }}
                >
                  Official Document
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-primary, sans-serif)",
                    fontSize: "clamp(2rem, 5vw, 3.25rem)",
                    fontWeight: 800,
                    lineHeight: "1.05",
                    color: "#1a1a1a",
                    margin: "0 0 0.5rem 0",
                    letterSpacing: "-0.02em",
                  }}
                >
                  CURRICULUM VITAE
                </h1>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#555555",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Full-Stack Developer • AI Automation Engineer • Reverse Engineer
                </p>
              </div>

              {/* Action Toolbar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Download PDF Button */}
                <a
                  href="/Labib_Fohayer_Resume.pdf"
                  download="Labib_Fohayer_Resume.pdf"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    padding: "0.625rem 1.25rem",
                    borderRadius: "100px",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    transition: "all 0.25s ease",
                  }}
                  className="hover:bg-[#ff5400] hover:scale-105 active:scale-95 shadow-sm"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download PDF</span>
                </a>

                {/* Open Fullscreen Button */}
                <a
                  href="/Labib_Fohayer_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "transparent",
                    color: "#1a1a1a",
                    border: "1.5px solid rgba(0, 0, 0, 0.2)",
                    padding: "0.55rem 1.15rem",
                    borderRadius: "100px",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    transition: "all 0.25s ease",
                  }}
                  className="hover:border-[#ff5400] hover:text-[#ff5400] hover:scale-105 active:scale-95"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>Fullscreen</span>
                </a>
              </div>
            </div>
          </div>

          {/* Document Display Bento Frame */}
          <div
            style={{
              maxWidth: "68rem",
              margin: "0 auto",
              width: "100%",
              padding: "0 1.5rem",
              flex: "1 0 auto",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "1.25rem",
                boxShadow:
                  "0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.15)",
                overflow: "hidden",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Document Header Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1.25rem",
                  backgroundColor: "#f5ecea",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#ff5400",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "#333333",
                    }}
                  >
                    Labib_Fohayer_Resume.pdf
                  </span>
                </div>

                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#777777",
                    fontWeight: 500,
                  }}
                >
                  1 Page • Verified ATS-Ready
                </span>
              </div>

              {/* Main Embed / Preview Viewer */}
              <div
                style={{
                  width: "100%",
                  minHeight: isMobile ? "auto" : "900px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  backgroundColor: "#fafafa",
                }}
              >
                {isMobile ? (
                  // Mobile: Crisp high-resolution image rendering for flawless mobile viewing
                  <div style={{ width: "100%", padding: "0.5rem" }}>
                    <img
                      src="/images/resume-preview.png"
                      alt="Labib Fohayer Resume"
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </div>
                ) : (
                  // Desktop: Native interactive PDF object viewer with image fallback
                  <object
                    data="/Labib_Fohayer_Resume.pdf#toolbar=0&navpanes=0&scrollbar=1"
                    type="application/pdf"
                    style={{
                      width: "100%",
                      height: "960px",
                      border: "none",
                      display: "block",
                    }}
                  >
                    {/* Fallback image if browser has disabled PDF viewer */}
                    <div style={{ width: "100%", padding: "1rem" }}>
                      <img
                        src="/images/resume-preview.png"
                        alt="Labib Fohayer Resume"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          maxWidth: "850px",
                          margin: "0 auto",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </div>
                  </object>
                )}
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </>
  );
}
