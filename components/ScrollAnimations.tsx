"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const isInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top <= vh * 0.85 && rect.bottom >= 0;
    };

    const animateOnScroll = () => {
      const aboutText = document.getElementById("aboutText");
      const aboutImage = document.getElementById("aboutImage");

      if (aboutText && isInViewport(aboutText)) aboutText.classList.add("animate");
      if (aboutImage && isInViewport(aboutImage)) aboutImage.classList.add("animate");

      const projectCards = [
        document.getElementById("projectCard1"),
        document.getElementById("projectCard2"),
        document.getElementById("projectCard3"),
      ].filter(Boolean) as HTMLElement[];

      projectCards.forEach((card, index) => {
        if (isInViewport(card)) {
          card.style.animationDelay = `${index * 0.2}s`;
          card.classList.add("animate");
        }
      });

      const blogCards = [
        document.getElementById("blogCard1"),
        document.getElementById("blogCard2"),
        document.getElementById("blogCard3"),
      ].filter(Boolean) as HTMLElement[];

      blogCards.forEach((card, index) => {
        if (isInViewport(card)) {
          card.style.animationDelay = `${index * 0.2}s`;
          card.classList.add("animate");
        }
      });

      const contactInfo = document.getElementById("contactInfo");
      const contactForm = document.getElementById("contactForm");

      if (contactInfo && isInViewport(contactInfo)) contactInfo.classList.add("animate");
      if (contactForm && isInViewport(contactForm)) contactForm.classList.add("animate");
    };

    window.addEventListener("scroll", animateOnScroll, { passive: true });
    window.addEventListener("load", animateOnScroll);

    // initial
    animateOnScroll();

    return () => {
      window.removeEventListener("scroll", animateOnScroll);
      window.removeEventListener("load", animateOnScroll);
    };
  }, []);

  return null;
}
