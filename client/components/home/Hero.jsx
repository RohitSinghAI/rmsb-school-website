"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGetAllSlidesQuery } from "../../redux/features/home/sliderApi";

export default function HomeSlider() {
  const { data, isLoading, isError } = useGetAllSlidesQuery();
  const slides = Array.isArray(data?.slides) ? data.slides : [];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef(null);
  const touchStartX = useRef(0);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (paused || slides.length === 0) return;

    let start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress((elapsed / 11000) * 100);

      if (elapsed >= 11000) {
        setIndex((p) => (p + 1) % slides.length);
        setProgress(0);
        start = Date.now();
      }
    }, 90);

    return () => clearInterval(intervalRef.current);
  }, [paused, index, slides.length]);

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight")
        setIndex((p) => (p + 1) % slides.length);
      if (e.key === "ArrowLeft")
        setIndex((p) => (p - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slides.length]);

  /* ================= TOUCH ================= */
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    if (touchStartX.current - endX > 100)
      setIndex((p) => (p + 1) % slides.length);
    if (endX - touchStartX.current > 100)
      setIndex((p) => (p - 1 + slides.length) % slides.length);
  };

  if (isLoading) {
    return (
      <section className="h-screen flex items-center justify-center bg-[#0b0b0b]">
        <span className="text-[10px] tracking-[0.6em] text-white/40 animate-pulse">
          CURATING ART
        </span>
      </section>
    );
  }

  if (isError || slides.length === 0) return null;

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-[#0b0b0b]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ================= SLIDES ================= */}
      {slides.map((slide, i) => (
        <div
          key={slide._id || i}
          className={`absolute inset-0 transition-opacity duration-[4000ms] ${
            index === i ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[30000ms] ${
              index === i ? "scale-[1.03]" : "scale-100"
            }`}
            style={{ backgroundImage: `url(${slide.image?.url})` }}
          />

          {/* Soft Museum Overlay */}
          <div className="absolute inset-0 bg-[#0b0b0b]/85" />

          {/* Content */}
          <div className="relative z-20 h-full flex items-center justify-center px-6">
            <div className="max-w-4xl text-center">
              <span className="block mb-12 text-white/50 text-[11px] tracking-[0.5em] uppercase">
                Curated Program
              </span>

              <h1 className="font-luxury text-[36px] sm:text-5xl md:text-6xl xl:text-[84px] leading-[1] text-white font-medium mb-14">
                {slide.title}
              </h1>

              <p className="font-sans text-white/60 text-[15px] sm:text-lg leading-relaxed max-w-3xl mx-auto mb-16">
                {slide.subtitle}
              </p>

              <Link
                href="/admission"
                className="inline-block px-16 py-4 border border-white/40 text-white text-sm sm:text-base tracking-wide hover:bg-white hover:text-black transition"
              >
                Enter Experience
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* ================= PROGRESS ================= */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 z-30">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ================= SLIDE INDEX ================= */}
      <div className="absolute left-10 bottom-10 z-30 text-white/40 text-xs tracking-[0.45em]">
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
