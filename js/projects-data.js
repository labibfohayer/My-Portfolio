/**
 * Labib Fohayer Portfolio - Unified Projects Single Source of Truth (SSOT)
 * Both the Home page (Featured: slice(0, 6)) and Work page use this canonical dataset.
 */
(function () {
  const PORTFOLIO_PROJECTS = [
    {
      id: "webpulse-automation",
      name: "Webpulse Automation",
      detail: "OFFICIAL AGENCY WEBSITE",
      href: "https://webpulseautomation.pages.dev/",
      mainImg: "/projects/webpulse-automation-cover.jpg",
      hoverImg: "/projects/webpulse-automation-hover.jpg",
      logo: "/projects/webpulse-bot-logo.jpg",
      bgColor: "#060A18",
      color: "rgb(0, 163, 255)",
      alt: "Webpulse Automation - Official Agency Website",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "stack-shack",
      name: "Stack Shack",
      detail: "RESTAURANT & FOOD ORDERING WEBSITE / WEB DEVELOPMENT",
      href: "https://stackshack.pages.dev/",
      mainImg: "/projects/stack-shack-cover.jpg",
      hoverImg: "/projects/stack-shack-detail.jpg",
      logo: "/projects/stack-shack-logo.jpg",
      bgColor: "#FAE5CA",
      color: "#E52020",
      alt: "Stack Shack - Restaurant & Food Ordering Website / Web Development",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "maison-dhaka",
      name: "Maison Dhaka",
      detail: "LUXURY ARCHITECTURE & INTERIOR DESIGN",
      href: "https://maisondhaka.pages.dev/",
      mainImg: "/projects/maison-dhaka-cover.jpg",
      hoverImg: "/projects/maison-dhaka-detail.jpg",
      logo: "/projects/maison-dhaka-logo.jpg",
      bgColor: "#0F1216",
      color: "#E5A84C",
      alt: "Maison Dhaka - Luxury Architecture & Interior Design",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "villa-solenne",
      name: "Villa Solenne",
      detail: "LUXURY SEASIDE HOTEL & VILLA WEBSITE",
      href: "https://villasolenne.pages.dev/",
      mainImg: "/projects/villa-solenne-cover.jpg",
      hoverImg: "/projects/villa-solenne-detail.jpg",
      logo: "/projects/villa-solenne-logo.jpg",
      bgColor: "#0F3734",
      color: "#D19E52",
      alt: "Villa Solenne - Luxury Seaside Hotel & Villa Website",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "mahadi-portfolio",
      name: "Mahadi's Portfolio",
      detail: "PROFESSIONAL PORTFOLIO WEBSITE",
      href: "https://mahadihasan.pages.dev/",
      mainImg: "/projects/image_41.png",
      hoverImg: "/projects/image_42.png",
      logo: "/projects/mahadi-portfolio-logo.png",
      bgColor: "#FFFFFF",
      color: "#FF5400",
      alt: "Mahadi's Portfolio - Professional Portfolio Website",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "ladiya-interior",
      name: "Ladiya Interior",
      detail: "INTERIOR DESIGN WEBSITE / WEB DEVELOPMENT",
      href: "https://ladiyainterior.pages.dev/",
      mainImg: "/projects/ladiya-interior-cover.jpg",
      hoverImg: "/projects/ladiya-interior-detail.jpg",
      logo: "/projects/ladiya-interior-logo.jpg",
      bgColor: "#201A17",
      color: "#C69A57",
      alt: "Ladiya Interior - Interior Design Website / Web Development",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "al-madina-madrasa",
      name: "AL-MADINA MODEL MADRASA",
      detail: "INSTITUTE WEBSITE & MANAGEMENT SYSTEM",
      href: "https://almadinamadrasa.pages.dev/",
      mainImg: "/projects/al-madina-bot-static.jpg",
      hoverImg: "/projects/al-madina-bot-hover.jpg",
      logo: "/projects/al-madina-bot-static.jpg",
      bgColor: "#FFFFFF",
      color: "rgb(0, 104, 56)",
      alt: "AL-MADINA MODEL MADRASA - INSTITUTE WEBSITE & MANAGEMENT SYSTEM",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "mezumir-ecommerce",
      name: "MeZuMir E-commarce",
      detail: "E-COMMERCE",
      href: "https://mezumir.pages.dev/",
      mainImg: "/projects/mezumir-static.png",
      hoverImg: "/projects/mezumir-hover.png",
      logo: "/projects/mezumir-logo.png",
      bgColor: "#FFFFFF",
      color: "rgb(7, 96, 40)",
      alt: "MeZuMir E-commarce - E-Commerce",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "coffee-peyala",
      name: "Coffee Peyayla",
      detail: "SPECIALTY COFFEE",
      href: "https://coffeepeyala.pages.dev/",
      mainImg: "/projects/coffee-peyala-static.jpg",
      hoverImg: "/projects/coffee-peyala-hover.png",
      logo: "/projects/coffee-peyala-logo.jpg",
      bgColor: "#160e0a",
      color: "#C99452",
      alt: "Coffee Peyayla - Specialty Coffee",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "nawabiyaat",
      name: "NAWABIYAAT",
      detail: "EXCLUSIVE COUTURE",
      href: "https://nawabiyaat.pages.dev/",
      mainImg: "/projects/nawabiyaat-static.jpg",
      hoverImg: "/projects/nawabiyaat-hover.png",
      logo: "/projects/nawabiyaat-logo.jpg",
      bgColor: "#000000",
      color: "#D4AF37",
      alt: "NAWABIYAAT - Exclusive Couture",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "bd-mess",
      name: "BD Mess",
      detail: "MANAGEMENT SYSTEM",
      href: "https://bd-mess.pages.dev/",
      mainImg: "/projects/bd-mess-static.jpg",
      hoverImg: "/projects/bd-mess-hover.jpg",
      logo: "/projects/bd-mess-logo.jpg",
      bgColor: "#FFFFFF",
      color: "rgb(251, 199, 17)",
      alt: "BD Mess - Management System",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "portfolio-website",
      name: "Portfolio Website",
      detail: "WEB DESIGN",
      href: "https://labibfohayer.pages.dev",
      mainImg: "/projects/portfolio-website-static.jpg",
      hoverImg: "/projects/portfolio-website-hover.jpg",
      logo: "/favicon.svg",
      bgColor: "#F9E1E0",
      color: "#FF5400",
      alt: "Portfolio Website - Web Design",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "ponyopuri-ecommerce",
      name: "Ponyopuri E-commerce",
      detail: "E-COMMERCE",
      href: "https://ponyopuri.com/",
      mainImg: "/projects/ponyopuri-static.jpg",
      hoverImg: "/projects/ponyopuri-hover.jpg",
      logo: "/projects/ponyopuri-logo.jpg",
      bgColor: "#FFFFFF",
      color: "rgb(30, 42, 84)",
      alt: "Ponyopuri E-commerce",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "webpulse-bot",
      name: "Webpulse Bot",
      detail: "AI Chatbot & Automation",
      href: "https://www.facebook.com/webpulseautomation",
      mainImg: "/projects/webpulse-bot-hover.jpg",
      hoverImg: "/projects/webpulse-bot-cover.jpg",
      logo: "/projects/webpulse-bot-logo.jpg",
      bgColor: "#061e44",
      color: "rgb(0, 163, 255)",
      alt: "Webpulse Bot - AI Automation",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "github-profile",
      name: "Github Profile",
      detail: "DEVELOPER PROFILE",
      href: "https://github.com/labibfohayer",
      mainImg: "/projects/github-profile-static.jpg",
      hoverImg: "/projects/github-profile-hover.png",
      logo: "/projects/github-profile-static.jpg",
      bgColor: "#000000",
      color: "rgb(1, 177, 253)",
      alt: "Github Profile - Developer Profile",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    },
    {
      id: "stride-choco",
      name: "STRIDE",
      detail: "3D CHOCOLATE BRAND WEBSITE",
      href: "https://stridechoco.pages.dev/",
      mainImg: "/projects/stride-cover.jpg",
      hoverImg: "/projects/stride-detail.jpg",
      logo: "/projects/stride-logo.jpg",
      bgColor: "#F7A2C3",
      color: "#E83D84",
      alt: "STRIDE - 3D CHOCOLATE BRAND WEBSITE",
      target: "_blank",
      rel: "noopener noreferrer",
      objectFit: "cover"
    }
  ];

  if (typeof window !== "undefined") {
    window.PORTFOLIO_PROJECTS = PORTFOLIO_PROJECTS;
    window.getProjects = function () {
      return window.PORTFOLIO_PROJECTS;
    };
    window.getFeaturedProjects = function () {
      return (window.PORTFOLIO_PROJECTS || PORTFOLIO_PROJECTS).slice(0, 6);
    };

    /**
     * Client-side Synchronizer for Home page #work section:
     * Guarantees the Home page dynamically renders exactly the first 6 projects
     * of window.PORTFOLIO_PROJECTS whenever called.
     */
    /**
     * Client-side Synchronizer for Work page project card numbering (01 to 15)
     */
    window.syncWorkProjectNumbers = function () {
      const isWorkPage =
        window.location.pathname.includes("/work") ||
        window.location.pathname.includes("/projects") ||
        window.location.pathname.includes("/portfolio") ||
        document.querySelector(".section-work-hero");

      if (!isWorkPage) return;

      const container = document.querySelector(".section-projects .projects-list, .projects-list");
      if (!container) return;

      const items = container.querySelectorAll(".project-item");
      items.forEach((item, idx) => {
        let numEl = item.querySelector(".project-card-num");
        const numText = String(idx + 1).padStart(2, "0");
        if (!numEl) {
          numEl = document.createElement("div");
          numEl.className = "project-card-num";
          item.insertBefore(numEl, item.firstChild);
        }
        if (numEl.textContent !== numText) {
          numEl.textContent = numText;
        }
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", window.syncWorkProjectNumbers);
    } else {
      window.syncWorkProjectNumbers();
    }

    window.syncFeaturedProjects = function () {
      const container = document.querySelector("#work .projects-list, .section-projects .projects-list");
      if (!container) return;

      const featured = window.getFeaturedProjects();
      const existingCards = container.querySelectorAll(".project-item");

      // If existing cards count matches and titles already match, ensure styles are pristine
      let matchesAll = existingCards.length === featured.length;
      if (matchesAll) {
        existingCards.forEach((card, idx) => {
          const title = card.querySelector(".project-name-text");
          if (!title || title.textContent.trim().toLowerCase() !== featured[idx].name.toLowerCase()) {
            matchesAll = false;
          }
        });
      }

      // If needed, re-sync card content seamlessly
      featured.forEach((p, idx) => {
        let cardItem = existingCards[idx];
        if (!cardItem) return;

        const link = cardItem.querySelector("a.project-card");
        if (link) {
          link.href = p.href;
          link.target = p.target || "_blank";
          link.rel = p.rel || "noopener noreferrer";
        }

        const wrapper = cardItem.querySelector(".project-card-img-wrapper");
        if (wrapper && p.bgColor) {
          wrapper.style.backgroundColor = p.bgColor;
        }

        const hoverImg = cardItem.querySelector(".project-img-hover");
        if (hoverImg) {
          hoverImg.src = p.hoverImg;
          hoverImg.alt = p.alt || p.name;
          hoverImg.style.objectFit = "cover";
          hoverImg.style.width = "100%";
          hoverImg.style.height = "100%";
        }

        const staticImg = cardItem.querySelector(".project-img");
        if (staticImg) {
          staticImg.src = p.mainImg;
          staticImg.alt = p.alt || p.name;
          staticImg.style.objectFit = "cover";
          staticImg.style.width = "100%";
          staticImg.style.height = "100%";
          staticImg.style.objectPosition = "center center";
        }

        const svgWrap = cardItem.querySelector(".project-img-svg");
        if (svgWrap && p.color) {
          svgWrap.style.color = p.color;
        }

        const maskImg = cardItem.querySelector(".project-card-mask-overlay image");
        if (maskImg) {
          maskImg.setAttribute("href", p.hoverImg);
          maskImg.setAttribute("xlink:href", p.hoverImg);
          maskImg.setAttribute("preserveAspectRatio", "xMidYMid slice");
        }

        const logoImg = cardItem.querySelector(".project-logo-img");
        if (logoImg) {
          logoImg.src = p.logo || p.mainImg;
          logoImg.alt = p.alt || p.name;
        }

        const titleEl = cardItem.querySelector(".project-name-text");
        if (titleEl) {
          titleEl.textContent = p.name;
        }

        const detailEl = cardItem.querySelector(".project-detail-text");
        if (detailEl) {
          detailEl.textContent = p.detail;
        }
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", window.syncFeaturedProjects);
    } else {
      window.syncFeaturedProjects();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { PORTFOLIO_PROJECTS };
  }
})();
