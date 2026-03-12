'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  {
    name: 'Arun Kumar',
    role: 'Master Stylist & Color Expert',
    exp: '12 Years',
    speciality: ['Keratin Treatment', 'Balayage', 'Precision Cuts', 'Hair Coloring'],
    branches: ['Main Branch', 'Ashok Nagar'],
    bio: 'Arun is our flagship stylist, trained in Mumbai and internationally certified in L\'Oréal color techniques. His precision cuts have earned him a loyal clientele across Ballari.',
  },
  {
    name: 'Priya Sharma',
    role: 'Bridal & Makeup Artist',
    exp: '9 Years',
    speciality: ['Bridal Makeup', 'Skin Care', 'Threading', 'Pre-Bridal Package'],
    branches: ['Main Branch'],
    bio: 'Priya has transformed over 500 brides with her signature ethereal bridal aesthetic. She specializes in airbrush foundations and elaborate bridal hairstyles.',
  },
  {
    name: 'Ravi Naik',
    role: 'Beard Craft & Men\'s Grooming',
    exp: '7 Years',
    speciality: ['Beard Styling', 'Waxing', 'Grooming', 'Men\'s Facials'],
    branches: ['Main Branch', 'Ashok Nagar'],
    bio: 'Ravi is the go-to specialist for men\'s grooming in Ballari. His precision beard work and relaxing massage techniques make every visit feel like a spa retreat.',
  },
  {
    name: 'Divya Reddy',
    role: 'Hair Therapy Specialist',
    exp: '8 Years',
    speciality: ['Hair Spa', 'Mask Treatments', 'Women\'s Styling', 'Smoothening'],
    branches: ['Ashok Nagar'],
    bio: 'Divya\'s deep knowledge of hair biology means she diagnoses and treats hair damage with surgical precision. Clients report visible transformation after a single session.',
  },
  {
    name: 'Meera Patil',
    role: 'Skin & Wellness Expert',
    exp: '6 Years',
    speciality: ['Facials', 'Face Mask Therapy', 'Massage', 'Aromatherapy'],
    branches: ['Main Branch'],
    bio: 'Meera combines Ayurvedic principles with modern skincare techniques to deliver deeply relaxing, skin-renewing experiences.',
  },
  {
    name: 'Suresh D.',
    role: 'Junior Stylist',
    exp: '3 Years',
    speciality: ['Haircuts', 'Blow-dry', 'Hair Wash', 'Basic Styling'],
    branches: ['Main Branch', 'Ashok Nagar'],
    bio: 'Suresh is our rising star — enthusiastic, precise, and passionate about making every client feel welcome and beautiful.',
  },
];

export default function TeamPage() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.8,
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      }
    );
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-[#F5EFE7] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-6">The People Behind the Magic</p>
          <h1 className="text-5xl md:text-7xl font-serif font-light">
            Meet the <span className="italic text-[#B76E79]">Team</span>
          </h1>
          <p className="mt-6 opacity-60 font-light max-w-xl mx-auto">
            Our artisans are more than stylists. They are certified experts, passionate artists, and devoted caretakers of your beauty.
          </p>
        </div>

        {/* Team Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM.map((member) => (
            <div key={member.name} className="glass-card p-8 rounded-2xl group hover:border-[rgba(183,110,121,0.4)] transition-all duration-500">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(183,110,121,0.4)] to-[rgba(13,13,13,0.9)] flex items-center justify-center mb-6 border border-[rgba(183,110,121,0.2)]">
                <span className="text-2xl font-serif text-[#B76E79]">{member.name[0]}</span>
              </div>
              <h2 className="font-serif text-xl mb-1 group-hover:text-[#B76E79] transition-colors">{member.name}</h2>
              <p className="text-[#B76E79] text-xs uppercase tracking-widest mb-4">{member.role}</p>
              <p className="text-xs opacity-60 font-light leading-relaxed mb-6">{member.bio}</p>

              <div className="border-t border-[rgba(255,255,255,0.05)] pt-4">
                <p className="text-xs uppercase tracking-widest opacity-40 mb-2">Specialities</p>
                <div className="flex flex-wrap gap-2">
                  {member.speciality.map(s => (
                    <span key={s} className="text-xs px-2 py-1 border border-[rgba(183,110,121,0.3)] rounded-full opacity-70">{s}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-widest opacity-40 mb-2">Available At</p>
                <div className="flex gap-2">
                  {member.branches.map(b => (
                    <span key={b} className="text-xs px-2 py-1 bg-[rgba(183,110,121,0.1)] rounded-full text-[#B76E79]">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/book" className="inline-block px-10 py-4 bg-[#B76E79] text-[#0d0d0d] font-medium tracking-widest uppercase rounded-full hover:bg-[#F5EFE7] transition-colors text-sm">
            Book with a Stylist
          </Link>
        </div>
      </div>
    </main>
  );
}
