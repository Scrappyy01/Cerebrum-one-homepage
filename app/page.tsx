'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import ImagePlaceholder from './components/ImagePlaceholder';

const SLIDES = [
  { id: 'home', label: 'HOME' },
  { id: 'data-centres', label: 'DATA CENTRES' },
  { id: 'why-now', label: 'WHY NOW' },
  { id: 'sustainability', label: 'SUSTAINABILITY' },
  { id: 'timeline', label: 'TIMELINE' },
  { id: 'your-say', label: 'YOUR SAY' },
  { id: 'contact', label: 'CONTACT' },
];

const SHADOW_LG = '0 0 30px rgba(0,0,0,0.8), 0 4px 15px rgba(0,0,0,0.9)';
const SHADOW_MD = '0 0 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)';

const DATA_CENTRE_USES = [
  { title: 'Everyday apps', body: 'Streaming, messaging, maps and the cloud services on every phone and laptop.' },
  { title: 'Banking & payments', body: 'Card transactions, online banking and the systems that keep money moving.' },
  { title: 'Health & government', body: 'Medical records, emergency services and the digital services communities rely on.' },
  { title: 'AI & research', body: 'The computing power behind modern AI, science and emerging industries.' },
];

const WHY_NOW = [
  { title: 'Global demand', body: 'Placeholder: current and projected global demand for data centres, and the key drivers behind it.' },
  { title: 'Australian demand', body: 'Placeholder: current and projected Australian demand for data centres, and what is driving it.' },
  {
    title: 'Why the Gold Coast',
    body: 'National critical infrastructure the Gold Coast cannot afford to be without, supporting its growing technology focus.',
    points: [
      'Gold Coast Health and Knowledge Precinct',
      'Gilmore Space',
      'Council space technology precinct, Norwell',
      'Universities and TAFEs',
    ],
  },
];

const SUSTAINABILITY = [
  'Co-located renewable energy generation',
  'BESS (battery energy storage)',
  'Green electrons',
  'Non-consumptive water use: closed-loop, liquid-to-chip cooling',
  'Buffers and screening',
  'Strategic location minimising impacts and aligning with infrastructure',
];

const CARD = 'border border-brand-accent/30 bg-black/40 p-5 backdrop-blur-sm';
const H2 = 'text-2xl font-light tracking-[0.2em] text-brand-accent md:text-4xl';

const slideTop = (id: string) => document.getElementById(id)?.offsetTop ?? 0;

const currentIndex = () => {
  let best = 0;
  let bestDist = Infinity;
  SLIDES.forEach(({ id }, i) => {
    const dist = Math.abs(slideTop(id) - window.scrollY);
    if (dist < bestDist) {
      best = i;
      bestDist = dist;
    }
  });
  return best;
};

const goTo = (i: number) => window.scrollTo({ top: slideTop(SLIDES[i].id), behavior: 'smooth' });

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const lockRef = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScroll = useRef(0);

  // Active slide + reveal-on-scroll (throttled, once per slide)
  useEffect(() => {
    const onScroll = () => {
      const now = Date.now();
      if (now - lastScroll.current < 100) return;
      lastScroll.current = now;

      const h = window.innerHeight;
      setActiveSlide(currentIndex());

      setVisible((prev) => {
        let next = prev;
        for (const { id } of SLIDES) {
          if (prev[id]) continue;
          const el = document.getElementById(id);
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

  // Wheel snap: one slide per wheel gesture (native scroll on small viewports)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768 || window.innerHeight < 640) return;
      e.preventDefault();
      if (lockRef.current) return;
      const current = currentIndex();
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

  const reveal = (id: string, delay = '') =>
    `transition-all duration-1000 ease-out ${delay} ${
      visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`;

  const slide = 'flex min-h-screen items-center justify-center px-8 pt-28 pb-12';

  return (
    <>
      <Navbar />

      {/* Fixed background: swap in the hero render image here when available */}
      <div className="fixed inset-0 -z-10 bg-brand-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Slide indicators */}
      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to ${s.label}`}
            aria-current={activeSlide === i}
            className="group flex items-center justify-end gap-3 cursor-pointer"
          >
            <span
              className={`text-xs tracking-widest transition-opacity duration-300 ${
                activeSlide === i ? 'opacity-100 text-brand-accent' : 'opacity-0 group-hover:opacity-100 text-white'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block h-3 w-3 rounded-full border border-brand-accent transition-all duration-300 ${
                activeSlide === i ? 'bg-brand-accent scale-125' : 'bg-transparent'
              }`}
            />
          </button>
        ))}
      </div>

      <main className="text-white">
        {/* Home */}
        <section id="home" className="relative flex min-h-screen flex-col items-center justify-center px-8 pt-28 pb-24 text-center">
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

          <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
            <ImagePlaceholder label="Hero render image" className="h-28 md:h-36" />
            <ImagePlaceholder label="Feel good image" className="h-28 md:h-36" />
            <ImagePlaceholder label="Technology and renewables image" className="h-28 md:h-36" />
          </div>

          <button
            onClick={() => goTo(1)}
            aria-label="Scroll to next section"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer text-brand-accent animate-bounce-arrow"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </section>

        {/* What goes on in a data centre? */}
        <section id="data-centres" className={slide}>
          <div className="w-full max-w-5xl text-center">
            <h2 className={`${H2} ${reveal('data-centres')}`} style={{ textShadow: SHADOW_LG }}>
              WHAT GOES ON IN A DATA CENTRE?
            </h2>
            <p className={`mx-auto mt-6 max-w-3xl text-base leading-relaxed md:text-lg ${reveal('data-centres', 'delay-200')}`} style={{ textShadow: SHADOW_MD }}>
              Placeholder copy: explain the various uses of data centres, what they do, and why they are critically
              important to everything we do in the modern world.
            </p>
            <div className={`mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4 ${reveal('data-centres', 'delay-300')}`}>
              {DATA_CENTRE_USES.map((u) => (
                <div key={u.title} className={CARD}>
                  <h3 className="text-sm tracking-widest text-brand-accent">{u.title.toUpperCase()}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">{u.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why data centres, why now? */}
        <section id="why-now" className={slide}>
          <div className="w-full max-w-5xl text-center">
            <h2 className={`${H2} ${reveal('why-now')}`} style={{ textShadow: SHADOW_LG }}>
              WHY DATA CENTRES, WHY NOW?
            </h2>
            <div className={`mt-8 grid grid-cols-1 gap-4 text-left lg:grid-cols-3 ${reveal('why-now', 'delay-300')}`}>
              {WHY_NOW.map((w) => (
                <div key={w.title} className={CARD}>
                  <h3 className="text-sm tracking-widest text-brand-accent">{w.title.toUpperCase()}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">{w.body}</p>
                  {w.points && (
                    <ul className="mt-3 space-y-1.5 text-sm text-white/80">
                      {w.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-brand-accent" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* World leading sustainability */}
        <section id="sustainability" className={slide}>
          <div className="w-full max-w-5xl text-center">
            <h2 className={`${H2} ${reveal('sustainability')}`} style={{ textShadow: SHADOW_LG }}>
              WORLD LEADING SUSTAINABILITY
            </h2>
            <p className={`mx-auto mt-6 max-w-3xl text-base leading-relaxed md:text-lg ${reveal('sustainability', 'delay-200')}`} style={{ textShadow: SHADOW_MD }}>
              Placeholder copy: our focus on world leading sustainability and efficiency, minimising impacts and providing
              social benefit.
            </p>
            <div className={`mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-3 ${reveal('sustainability', 'delay-300')}`}>
              {SUSTAINABILITY.map((s) => (
                <div key={s} className={`${CARD} flex items-start gap-3`}>
                  <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                  <p className="text-sm leading-relaxed text-white/90">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery timeline */}
        <section id="timeline" className={slide}>
          <div className="w-full max-w-4xl text-center">
            <h2 className={`${H2} ${reveal('timeline')}`} style={{ textShadow: SHADOW_LG }}>
              DELIVERY TIMELINE
            </h2>
            <div className={`mt-8 ${reveal('timeline', 'delay-300')}`}>
              <ImagePlaceholder label="Project timing chart coming soon" className="h-56 md:h-72" />
            </div>
          </div>
        </section>

        {/* Ask a question and have your say */}
        <section id="your-say" className={slide}>
          <div className="w-full max-w-3xl text-center">
            <h2 className={`${H2} ${reveal('your-say')}`} style={{ textShadow: SHADOW_LG }}>
              ASK A QUESTION AND HAVE YOUR SAY
            </h2>
            <div className={`mt-8 ${CARD} py-10 ${reveal('your-say', 'delay-300')}`}>
              <p className="text-lg tracking-wide md:text-xl">Share your opinion here</p>
              <p className="mt-3 text-sm tracking-widest text-brand-accent">AI ASSISTANT COMING SOON</p>
            </div>
          </div>
        </section>

        {/* Contact us */}
        <section id="contact" className={slide}>
          <div className="w-full max-w-xl text-center">
            <h2 className={`${H2} ${reveal('contact')}`} style={{ textShadow: SHADOW_LG }}>
              CONTACT US
            </h2>
            <p className={`mt-6 text-base md:text-lg ${reveal('contact', 'delay-200')}`} style={{ textShadow: SHADOW_MD }}>
              Submit a form to get in contact
            </p>
            <form className={`mt-6 text-left ${reveal('contact', 'delay-300')}`} onSubmit={(e) => e.preventDefault()}>
              <fieldset disabled className="space-y-4">
                <input type="text" placeholder="Name" aria-label="Name" className={`${CARD} w-full py-3 text-sm placeholder:text-white/50`} />
                <input type="email" placeholder="Email" aria-label="Email" className={`${CARD} w-full py-3 text-sm placeholder:text-white/50`} />
                <textarea placeholder="Message" aria-label="Message" rows={4} className={`${CARD} w-full py-3 text-sm placeholder:text-white/50`} />
                <button
                  type="submit"
                  className="w-full border border-brand-accent px-10 py-3 text-sm tracking-widest text-brand-accent opacity-60"
                >
                  COMING SOON
                </button>
              </fieldset>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
