'use client';
import React from 'react';
import Link from 'next/link';

const BRANCHES = [
  {
    id: 'main',
    name: 'Main Branch',
    address: 'Near Bus Stand, Gandhinagar, Ballari, Karnataka 583101',
    phone: '9480947076',
    hours: 'Mon–Sat: 9:00am – 8:30pm · Sun: 10:00am – 7:00pm',
    mapUrl: 'https://maps.google.com/?q=Hair+X+Studio+Ballari',
    features: ['All Services Available', '8 Styling Chairs', 'Private Rooms', 'Bridal Suite'],
    color: 'from-[rgba(183,110,121,0.2)] to-transparent',
  },
  {
    id: 'ashoknagar',
    name: 'Ashok Nagar Branch',
    address: "Infantry Road, Near Wine World, Opp Levi's Showroom, Ashok Nagar, Ballari 583103",
    phone: '07259375492',
    hours: 'Mon–Sat: 9:30am – 8:00pm · Sun: 10:00am – 6:30pm',
    mapUrl: 'https://maps.google.com/?q=Hair+X+Studio+Ashok+Nagar+Ballari',
    features: ['Men\'s Grooming Specialists', '6 Styling Chairs', 'Quick Service Lane', 'Beard Bar'],
    color: 'from-[rgba(245,239,231,0.05)] to-transparent',
  },
];

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-[#F5EFE7] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-6">Find Us</p>
          <h1 className="text-5xl md:text-7xl font-serif font-light">
            Our <span className="italic text-[#B76E79]">Locations</span>
          </h1>
          <p className="mt-6 opacity-60 font-light max-w-xl mx-auto">
            Two premium locations in the heart of Ballari, both designed to deliver the same luxury Hair X Studio experience.
          </p>
        </div>

        {/* Branches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {BRANCHES.map((branch) => (
            <div key={branch.id} className="glass-card rounded-3xl p-10 relative overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-br ${branch.color} pointer-events-none group-hover:opacity-150 transition-opacity`} />
              <div className="relative z-10">
                <span className="inline-block px-4 py-1 border border-[rgba(183,110,121,0.4)] rounded-full text-xs uppercase tracking-widest text-[#B76E79] mb-6">
                  {branch.id === 'main' ? 'Primary Location' : 'Second Location'}
                </span>
                <h2 className="text-3xl font-serif mb-4 group-hover:text-[#B76E79] transition-colors">{branch.name}</h2>
                <p className="opacity-70 font-light mb-2">{branch.address}</p>
                <p className="text-[#B76E79] font-medium text-lg mb-2">{branch.phone}</p>
                <p className="text-xs opacity-50 mb-8">{branch.hours}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {branch.features.map(f => (
                    <span key={f} className="text-xs px-3 py-1 bg-[rgba(183,110,121,0.1)] border border-[rgba(183,110,121,0.2)] rounded-full">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[rgba(255,255,255,0.2)] rounded-full text-xs uppercase tracking-widest hover:border-[#B76E79] hover:text-[#B76E79] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Get Directions
                  </a>
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B76E79] text-[#0d0d0d] rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#F5EFE7] transition-colors"
                  >
                    Book at This Branch
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map placeholder CTA */}
        <div className="glass-card rounded-3xl p-10 text-center">
          <p className="text-[#B76E79] uppercase tracking-[0.3em] text-xs mb-4">Call Us Directly</p>
          <h2 className="text-3xl font-serif mb-6">Have questions before you visit?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:9480947076" className="inline-block px-8 py-4 border border-[rgba(183,110,121,0.4)] rounded-full text-sm hover:bg-[rgba(183,110,121,0.1)] transition-all tracking-widest uppercase">
              Main: 9480947076
            </a>
            <a href="tel:07259375492" className="inline-block px-8 py-4 border border-[rgba(183,110,121,0.4)] rounded-full text-sm hover:bg-[rgba(183,110,121,0.1)] transition-all tracking-widest uppercase">
              Ashok Nagar: 07259375492
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
