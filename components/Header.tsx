"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);

      // Active section highlight
      const sections = Array.from(document.querySelectorAll("section[id]")) as HTMLElement[];
      let current = "home";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) current = section.id;
      });
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header id="header" className={scrolled ? "header-scrolled" : ""}>
      <div className="container header-container">
        <div className="logo">
          <div className="logo-icon">
            <div className="logo-sun">
              <div className="sun-face" />
              <div className="sun-ray ray1" />
              <div className="sun-ray ray2" />
              <div className="sun-ray ray3" />
              <div className="sun-ray ray4" />
            </div>
          </div>
          <span className="logo-text">Creator Architecture</span>
        </div>

        <div
          className="mobile-menu"
          id="mobileMenuBtn"
          onClick={() => setOpen((v) => !v)}
          role="button"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </div>

        <nav id="navMenu" className={open ? "active" : ""}>
          <ul>
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "projects", label: "Projects" },
              { id: "blog", label: "Blog" },
              { id: "contact", label: "Contact" },
            ].map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={active === l.id ? "active" : ""}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
