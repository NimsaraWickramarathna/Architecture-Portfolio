"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function HeroSlider() {
  const slides = useMemo(
    () => [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    []
  );

  const [current, setCurrent] = useState(0);
  const timer = useRef<number | null>(null);

  const start = () => {
    stop();
    timer.current = window.setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 3000);
  };

  const stop = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className="hero-slideshow"
        id="heroSlideshow"
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        {slides.map((url, i) => (
          <div
            key={url}
            className={`slide ${i === current ? "active" : ""}`}
            style={{ backgroundImage: `url('${url}')` }}
          />
        ))}
      </div>

      <div className="slideshow-indicators" id="slideshowIndicators">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`indicator ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
            role="button"
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
