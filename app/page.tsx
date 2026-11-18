'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';

const SLIDES = [
  { id: 1, label: 'INTRO' },
  { id: 2, label: 'ABOUT' },
  { id: 3, label: 'VISION' },
  { id: 4, label: 'IDENTITY' },
  { id: 5, label: 'CONTACT' },
];

const SHADOW_LG = '0 0 30px rgba(0,0,0,0.8), 0 4px 15px rgba(0,0,0,0.9)';
const SHADOW_MD = '0 0 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)';

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(1);
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const lockRef = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScroll = useRef(0);

  const goTo = (i: number) => window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' });

  // Active slide + reveal-on-scroll (throttled, once per slide)
  useEffect(() => {
    const onScroll = () => {
      const now = Date.now();
      if (now - lastScroll.current < 100) return;
      lastScroll.current = now;

      const h = window.innerHeight;
      const n = Math.round(window.scrollY / h) + 1;
      setActiveSlide(Math.min(Math.max(n, 1), SLIDES.length));

      setVisible((prev) => {
        let next = prev;
        for (const { id } of SLIDES) {
          if (prev[id]) continue;
          const el = document.getElementById(`slide${id}`);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top < h * 0.75 && r.bottom > 0) next = { ...next, [id]: true };
        }
        return next;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Wheel snap: one slide per wheel gesture
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (lockRef.current) return;
      const h = window.innerHeight;
      const current = Math.round(window.scrollY / h);
      const target = Math.max(0, Math.min(SLIDES.length - 1, current + (e.deltaY > 0 ? 1 : -1)));
      if (target === current) return;
      lockRef.current = true;
      goTo(target);
      if (lockTimer.current) clearTimeout(lockTimer.current);
      lockTimer.current = setTimeout(() => (lockRef.current = false), 1000);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
  }, []);

  const reveal = (id: number, delay = '') =>
    `transition-all duration-1000 ease-out ${delay} ${
      visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`;

  return (
    <>
      <Navbar />

      {/* Fixed background video (optional: add public/hero.mp4) */}
      <div className="fixed inset-0 -z-10 bg-brand-bg">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-50"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Slide indicators */}
      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to ${s.label}`}
            aria-current={activeSlide === s.id}
            className="group flex items-center justify-end gap-3 cursor-pointer"
          >
            <span
              className={`text-xs tracking-widest transition-opacity duration-300 ${
                activeSlide === s.id ? 'opacity-100 text-brand-accent' : 'opacity-0 group-hover:opacity-100 text-white'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block h-3 w-3 rounded-full border border-brand-accent transition-all duration-300 ${
                activeSlide === s.id ? 'bg-brand-accent scale-125' : 'bg-transparent'
              }`}
            />
          </button>
        ))}
      </div>

      <main className="text-white">
        {/* 1. Intro */}
        <section id="slide1" className="relative flex h-screen items-center justify-center px-8 text-center">
          <div className="flex flex-col items-center">
            <div className="mb-8 flex gap-3" aria-hidden="true">
              <span className="block h-24 w-0.5 origin-top bg-[#0055cf] animate-line-emerge-1" />
              <span className="block h-32 w-0.5 origin-top bg-[#0055cf] animate-line-emerge-2" />
              <span className="block h-20 w-0.5 origin-top bg-[#0055cf] animate-line-emerge-3" />
            </div>
            <h1
              className="text-5xl font-light tracking-[0.3em] md:text-7xl"
              style={{ textShadow: SHADOW_LG, animation: 'text-glow 6s ease-in-out infinite' }}
            >
              CEREBRUM ONE
            </h1>
            <p className="mt-6 text-lg tracking-widest text-brand-accent-light md:text-xl" style={{ textShadow: SHADOW_MD }}>
              Intelligence, engineered.
            </p>
          </div>
          <button
            onClick={() => goTo(1)}
            aria-label="Scroll to next section"
            className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer text-brand-accent animate-bounce-arrow"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </section>

        {/* 2. About */}
        <section id="slide2" className="flex h-screen items-center justify-center px-8">
          <div className="max-w-3xl text-center">
            <h2 className={`text-3xl font-light tracking-[0.25em] text-brand-accent md:text-5xl ${reveal(2)}`} style={{ textShadow: SHADOW_LG }}>
              ABOUT
            </h2>
            <p className={`mt-8 text-lg leading-relaxed md:text-xl ${reveal(2, 'delay-200')}`} style={{ textShadow: SHADOW_MD }}>
              Placeholder copy: describe what Cerebrum One is, what we do, and how it benefits everyone.
            </p>
          </div>
        </section>

        {/* 3. Vision */}
        <section id="slide3" className="flex h-screen items-center justify-center px-8">
          <div className="max-w-3xl text-center">
            <h2 className={`text-3xl font-light tracking-[0.25em] text-brand-accent md:text-5xl ${reveal(3)}`} style={{ textShadow: SHADOW_LG }}>
              VISION
            </h2>
            <p className={`mt-8 text-lg leading-relaxed md:text-xl ${reveal(3, 'delay-200')}`} style={{ textShadow: SHADOW_MD }}>
              Placeholder copy: share where you are headed and the principles that guide the work.
            </p>
          </div>
        </section>

        {/* 4. Identity */}
        <section id="slide4" className="flex h-screen items-center justify-center px-8">
          <div className="max-w-3xl text-center">
            <h2 className={`text-3xl font-light tracking-[0.25em] text-brand-accent md:text-5xl ${reveal(4)}`} style={{ textShadow: SHADOW_LG }}>
              IDENTITY
            </h2>
            <p className={`mt-8 text-lg leading-relaxed md:text-xl ${reveal(4, 'delay-200')}`} style={{ textShadow: SHADOW_MD }}>
              Placeholder copy: explain the story and values behind the site.
            </p>
          </div>
        </section>

        {/* 5. Contact */}
        <section id="slide5" className="flex h-screen items-center justify-center px-8">
          <div className="max-w-3xl text-center">
            <h2 className={`text-3xl font-light tracking-[0.25em] text-brand-accent md:text-5xl ${reveal(5)}`} style={{ textShadow: SHADOW_LG }}>
              CONTACT
            </h2>
            <p className={`mt-8 text-lg leading-relaxed md:text-xl ${reveal(5, 'delay-200')}`} style={{ textShadow: SHADOW_MD }}>
              Let&apos;s talk about what we can build together.
            </p>
            <a
              href="/contact"
              className={`mt-10 inline-block border border-brand-accent px-10 py-3 text-sm tracking-widest text-brand-accent transition-colors duration-300 hover:bg-brand-accent hover:text-brand-bg ${reveal(5, 'delay-500')}`}
            >
              GET IN TOUCH
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
