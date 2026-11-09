"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutMoodboard from "@/components/about/AboutMoodboard";
import Link from "next/link";
import "../about/about.css";

export default function OffTheClockPage() {
  const router = useRouter();

  const handleBackToAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof (window as any).triggerPageTransition === "function") {
      (window as any).triggerPageTransition("/about", () => {
        router.push("/about");
      });
    } else {
      router.push("/about");
    }
  };

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

    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Navbar />
      <div className="page lenis selection:bg-[#ff5400] selection:text-white relative">
        <main className="main" style={{ paddingTop: "7rem" }}>
          {/* Back Navigation Bar */}
          <div
            style={{
              maxWidth: "80rem",
              margin: "0 auto",
              padding: "0 2rem",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Link
              href="/about"
              onClick={handleBackToAboutClick}
              className="navbar-link-btn group cursor-pointer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: 500,
                color: "#1a1a1a",
              }}
            >
              <span>← Back to About</span>
            </Link>
          </div>

          {/* Behind the work / Off the clock continuous photo marquee */}
          <AboutMoodboard />

          <Footer />
        </main>
      </div>
    </>
  );
}
