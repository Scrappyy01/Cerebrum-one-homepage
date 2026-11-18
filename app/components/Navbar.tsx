'use client';

import { useState } from 'react';
import Link from 'next/link';

const LINKS = [
  { href: '/about', label: 'ABOUT' },
  { href: '/information', label: 'INFORMATION' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/95 backdrop-blur-sm border-b border-brand-accent/20">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fortis-cerebrum-one-neon-logo.webp" alt="Cerebrum One logo" className="h-12 w-auto" />
        </Link>

        <div className="hidden md:flex gap-8 text-sm tracking-wide">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-white hover:text-brand-accent transition-colors duration-300">
              {l.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer pl-3"
          onClick={() => setOpen(!open)}
          aria-label="Toggle mobile menu"
          aria-expanded={open}
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-brand-bg border-t border-brand-accent/20 py-4 px-8">
          <div className="flex flex-col gap-4 text-sm tracking-wide">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-white hover:text-brand-accent transition-colors duration-300 py-2"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
