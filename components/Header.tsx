"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blogs", label: "Blogs" },
   
  ];

  return (
    <header id="header" className={scrolled ? "header-scrolled" : ""}>
      <div className="container header-container">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
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
        </Link>


        <div
          className="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          role="button"
          aria-label="Toggle menu"
          aria-expanded={open ? "true" : "false"}
          aria-controls="navMenu"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((v) => !v);
            }
          }}
        >
          {open ? "✕" : "☰"}
        </div>


        <nav id="navMenu" className={open ? "active" : ""}>
          <ul>
            {links.map((l) => {
              const isActive = pathname === l.href;

              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={isActive ? "active" : ""}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
