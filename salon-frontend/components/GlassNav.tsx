'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GlassNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/services', label: 'Services' },
    { href: '/team', label: 'Team' },
    { href: '/locations', label: 'Locations' },
    { href: '/customer', label: 'My Bookings' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3 glass-nav' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif text-[#F5EFE7] tracking-widest hover:text-[#B76E79] transition-colors">
            Hair X Studio
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs font-light tracking-[0.2em] uppercase transition-colors ${pathname === href ? 'text-[#B76E79]' : 'text-[#F5EFE7] hover:text-[#B76E79]'}`}
              >
                {label}
              </Link>
            ))}


            <Link
              href="/book"
              className="text-xs font-medium tracking-[0.2em] uppercase text-[#0d0d0d] bg-[#B76E79] px-6 py-2.5 rounded-full hover:bg-[#F5EFE7] transition-colors shadow-[0_0_20px_rgba(183,110,121,0.4)]"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[#F5EFE7]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[rgba(13,13,13,0.97)] flex flex-col items-center justify-center gap-10 md:hidden">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-3xl font-serif text-[#F5EFE7] hover:text-[#B76E79] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/customer"
            className="text-xl font-light text-[#F5EFE7] opacity-70 hover:opacity-100 hover:text-[#B76E79] transition-all uppercase tracking-widest"
            onClick={() => setMobileOpen(false)}
          >
            My Bookings
          </Link>
          <Link
            href="/book"
            className="px-12 py-4 bg-[#B76E79] text-[#0d0d0d] font-medium tracking-widest uppercase rounded-full text-lg"
            onClick={() => setMobileOpen(false)}
          >
            Book Now
          </Link>
        </div>
      )}
    </>
  );
};

export default GlassNav;
