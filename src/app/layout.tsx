import type { Metadata, Viewport } from "next";
import Script from "next/script";
import PageTransitionOverlay from "@/components/PageTransitionOverlay";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://labibfohayer.pages.dev"),
  title: "Labib Fohayer | Web Designer & AI Automation Engineer",
  description:
    "Portfolio of Labib Fohayer. Blending creative web design with intelligent AI automation to build scalable business systems.",
  openGraph: {
    title: "Labib Fohayer | Web Designer & AI Automation Engineer",
    description:
      "Portfolio of Labib Fohayer. Blending creative web design with intelligent AI automation to build scalable business systems.",
    url: "https://labibfohayer.pages.dev",
    siteName: "Labib Fohayer",
    images: [
      {
        url: "https://labibfohayer.pages.dev/images/labib-fohayer-full.png?v=2",
        secureUrl: "https://labibfohayer.pages.dev/images/labib-fohayer-full.png?v=2",
        width: 682,
        height: 1024,
        type: "image/png",
        alt: "Labib Fohayer | Web Designer & AI Automation Engineer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Labib Fohayer | Web Designer & AI Automation Engineer",
    description:
      "Portfolio of Labib Fohayer. Blending creative web design with intelligent AI automation to build scalable business systems.",
    images: ["https://labibfohayer.pages.dev/images/labib-fohayer-full.png?v=2"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="image_src" href="https://labibfohayer.pages.dev/images/labib-fohayer-full.png?v=2" />
        <meta property="og:image" content="https://labibfohayer.pages.dev/images/labib-fohayer-full.png?v=2" />
        <meta property="og:image:secure_url" content="https://labibfohayer.pages.dev/images/labib-fohayer-full.png?v=2" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="682" />
        <meta property="og:image:height" content="1024" />
        <meta name="twitter:image" content="https://labibfohayer.pages.dev/images/labib-fohayer-full.png?v=2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Labib Fohayer",
              alternateName: ["Labib Fohayer Portfolio", "Fohayer"],
              url: "https://labibfohayer.pages.dev",
              description:
                "Portfolio of Labib Fohayer. Blending creative web design with intelligent AI automation to build scalable business systems.",
              image: "https://labibfohayer.pages.dev/images/labib-fohayer-full.png?v=2",
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof sessionStorage!=='undefined'&&sessionStorage.getItem('two26_transition_active')==='true'){document.documentElement.classList.add('page-transitioning');setTimeout(function(){sessionStorage.removeItem('two26_transition_active');document.documentElement.classList.remove('page-transitioning');var o=document.querySelector('.page-transition-overlay');if(o){o.style.display='none';o.style.visibility='hidden';o.style.pointerEvents='none';}},1000);}window.addEventListener('pageshow',function(e){if(e.persisted||(typeof sessionStorage!=='undefined'&&sessionStorage.getItem('two26_transition_active')!=='true')){document.documentElement.classList.remove('page-transitioning');var o=document.querySelector('.page-transition-overlay');if(o){o.style.display='none';o.style.visibility='hidden';o.style.pointerEvents='none';}}});window.addEventListener('popstate',function(){document.documentElement.classList.remove('page-transitioning');var o=document.querySelector('.page-transition-overlay');if(o){o.style.display='none';o.style.visibility='hidden';o.style.pointerEvents='none';}});})();`,
          }}
        />
      </head>
      <body className="body antialiased">
        <PageTransitionOverlay />
        {/* Core GSAP Suite & jQuery with Cache-Busting Versioning */}
        <Script src="/js/jquery-3.5.1.min.dc5e7f18c8.js?v=2.0" strategy="beforeInteractive" />
        <Script src="/js/gsap.min.js?v=2.0" strategy="beforeInteractive" />
        <Script src="/js/ScrollTrigger.min.js?v=2.0" strategy="beforeInteractive" />
        <Script src="/js/SplitText.min.js?v=2.0" strategy="beforeInteractive" />
        <Script src="/js/DrawSVGPlugin.min.js?v=2.0" strategy="beforeInteractive" />
        <Script src="/js/MotionPathPlugin.min.js?v=2.0" strategy="beforeInteractive" />
        <Script src="/js/CustomEase.min.js?v=2.0" strategy="beforeInteractive" />
        <Script src="/js/CustomBounce.min.js?v=2.0" strategy="beforeInteractive" />
        <Script src="/js/lenis.min.js?v=2.0" strategy="beforeInteractive" />
        <Script src="/js/labibfohayer-bundle.js?v=2.0" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
