"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const header = document.getElementById("header");

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#") || href === "#") return;

      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;

      e.preventDefault();
      const headerHeight = header?.offsetHeight || 0;
      const top = el.offsetTop - headerHeight;

      window.scrollTo({ top, behavior: "smooth" });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
