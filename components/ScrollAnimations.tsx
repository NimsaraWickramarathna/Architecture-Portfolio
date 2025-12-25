"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll(
        "#aboutText, #aboutImage, .project-card, .blog-card, #contactInfo, #contactForm"
      )
    ) as HTMLElement[];

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("animate");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
