'use client';
import React from 'react';
import RibbonTransition from '@/components/RibbonTransition';

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[var(--color-primary)]">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* About Section */}
        <section className="mb-24 text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-secondary)] mb-8 tracking-wide">
                The Hair X <span className="text-[#B76E79] italic">Experience</span>
            </h1>
            <p className="text-lg md:text-xl font-light opacity-80 max-w-3xl mx-auto leading-relaxed text-[var(--color-secondary)]">
                Founded with a passion for luxury beauty, Hair X Studio represents the pinnacle of salon experiences in Ballari. We blend modern aesthetic trends with timeless elegance to deliver personalized services that leave you feeling confident, refreshed, and beautiful.
            </p>
        </section>

        {/* Branches Section */}
        <RibbonTransition>
            <section id="locations" className="mt-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-secondary)] mb-4">Our Locations</h2>
                    <p className="opacity-60 text-sm tracking-widest uppercase">Visit us at two premium locations in Ballari</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Branch 1 */}
                    <div className="glass-card p-8 md:p-12 rounded-3xl border border-[rgba(183,110,121,0.2)] hover:border-[#B76E79] transition-all group">
                        <div className="w-16 h-16 rounded-full bg-[rgba(183,110,121,0.1)] flex items-center justify-center mb-6 text-[#B76E79] group-hover:bg-[#B76E79] group-hover:text-[#1C1C1C] transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-2">Parvatinagar Branch</h3>
                        <p className="opacity-70 font-light mb-6">Beside Basua Bhawan, Parvatinagar, Police Gymkhana, Ballari, Karnataka 583103</p>
                        <p className="font-medium text-[#B76E79] text-xl tracking-wider mb-8">07899711400</p>
                        
                        <div className="flex gap-4">
                            <a href="/book" className="px-6 py-2 rounded-full bg-[var(--color-secondary)] text-[#1C1C1C] text-sm uppercase tracking-wider font-medium hover:bg-[#B76E79] transition-colors">Book Here</a>
                            <a href="https://maps.google.com/?q=Hair+X+Studio+Parvatinagar" target="_blank" rel="noreferrer" className="px-6 py-2 rounded-full border border-[rgba(255,255,255,0.2)] text-white text-sm uppercase tracking-wider hover:bg-[rgba(255,255,255,0.1)] transition-colors">Directions</a>
                        </div>
                    </div>

                    {/* Branch 2 */}
                    <div className="glass-card p-8 md:p-12 rounded-3xl border border-[rgba(183,110,121,0.2)] hover:border-[#B76E79] transition-all group">
                        <div className="w-16 h-16 rounded-full bg-[rgba(183,110,121,0.1)] flex items-center justify-center mb-6 text-[#B76E79] group-hover:bg-[#B76E79] group-hover:text-[#1C1C1C] transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-2">Ashok Nagar Branch</h3>
                        <p className="opacity-70 font-light mb-6">Infantry Road, Near Wine World, Opp Levi&apos;s Showroom, Ashok Nagar, Ballari, 583103</p>
                        <p className="font-medium text-[#B76E79] text-xl tracking-wider mb-8">07259375492</p>
                        
                        <div className="flex gap-4">
                            <a href="/book" className="px-6 py-2 rounded-full bg-[var(--color-secondary)] text-[#1C1C1C] text-sm uppercase tracking-wider font-medium hover:bg-[#B76E79] transition-colors">Book Here</a>
                            <a href="https://maps.google.com/?q=Hair+X+Studio+Ashok+Nagar" target="_blank" rel="noreferrer" className="px-6 py-2 rounded-full border border-[rgba(255,255,255,0.2)] text-white text-sm uppercase tracking-wider hover:bg-[rgba(255,255,255,0.1)] transition-colors">Directions</a>
                        </div>
                    </div>
                </div>
            </section>
        </RibbonTransition>
      </div>
    </main>
  );
}
