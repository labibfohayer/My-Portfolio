"use client";

import { useEffect } from "react";

export default function ResumePage() {
  useEffect(() => {
    // Disable external smooth scroll on full-screen PDF viewer page
    if ((window as any).lenis) {
      try {
        (window as any).lenis.stop();
      } catch (e) {}
    }
    return () => {
      if ((window as any).lenis) {
        try {
          (window as any).lenis.start();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <>
      {/* Strict Page-Specific Reset for Distraction-Free Full-Screen PDF */}
      <style dangerouslySetInnerHTML={{
        __html: `
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            height: 100vh !important;
            width: 100vw !important;
            background-color: #f5f5f5 !important;
          }
          .resume-floating-download {
            position: fixed;
            top: 30px;
            right: 30px;
            z-index: 9999;
            background-color: #000000;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 100px;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.875rem;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
            transition: all 0.25s ease;
            font-family: var(--font-secondary, sans-serif);
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.15);
          }
          .resume-floating-download:hover {
            background-color: #ff5400 !important;
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 6px 20px rgba(255, 84, 0, 0.35) !important;
          }
          .resume-floating-download:active {
            transform: translateY(0) scale(0.98);
          }
          @media (max-width: 768px) {
            .resume-floating-download {
              top: 15px;
              right: 15px;
              padding: 8px 16px;
              font-size: 0.8125rem;
            }
          }
        `,
      }} />

      {/* Floating Download PDF Button */}
      <a
        href="/Labib_Fohayer_Resume.pdf"
        download="Labib_Fohayer_Resume.pdf"
        className="resume-floating-download"
        aria-label="Download PDF"
      >
        <svg
          width="15"
          height="15"
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

      {/* 100% Full-Screen Distraction-Free PDF Viewer */}
      <iframe
        src="/Labib_Fohayer_Resume.pdf#toolbar=1&navpanes=0&scrollbar=1"
        title="Labib Fohayer Curriculum Vitae"
        style={{
          width: "100vw",
          height: "100vh",
          border: "none",
          display: "block",
          margin: 0,
          padding: 0,
          backgroundColor: "#f5f5f5",
        }}
      />
    </>
  );
}
