'use client';
import React, { useState } from 'react';
import Link from 'next/link';

// Full service catalog (static, matches the database seeder)
const ALL_SERVICES: Record<string, Record<string, { name: string; price: string; duration: string }[]>> = {
  Male: {
    'Hair': [
      { name: 'Haircut', price: '₹150 - ₹250', duration: '30 mins' },
      { name: 'Hair Wash', price: '₹100 - ₹150', duration: '15 mins' },
      { name: 'Hair Styling', price: '₹150 - ₹300', duration: '20 mins' },
      { name: 'Hair Spa', price: '₹500 - ₹900', duration: '45 mins' },
      { name: 'Hair Mask Treatment', price: '₹300 - ₹600', duration: '30 mins' },
      { name: 'Hair Nourishing Mask', price: '₹350 - ₹650', duration: '30 mins' },
      { name: 'Hair Repair Mask', price: '₹400 - ₹700', duration: '35 mins' },
      { name: 'Hair Coloring', price: '₹500 - ₹1,500', duration: '60 mins' },
      { name: 'Hair Smoothening', price: '₹1,500 - ₹3,000', duration: '120 mins' },
      { name: 'Keratin Treatment', price: '₹2,000 - ₹4,000', duration: '120 mins' },
    ],
    'Beard': [
      { name: 'Beard Trim', price: '₹100 - ₹200', duration: '15 mins' },
      { name: 'Beard Styling', price: '₹150 - ₹300', duration: '20 mins' },
      { name: 'Beard Coloring', price: '₹300 - ₹600', duration: '30 mins' },
      { name: 'Beard Conditioning Treatment', price: '₹250 - ₹500', duration: '25 mins' },
    ],
    'Skin': [
      { name: 'Face Cleanup', price: '₹300 - ₹600', duration: '30 mins' },
      { name: 'Facial', price: '₹800 - ₹1,500', duration: '60 mins' },
      { name: 'Charcoal Face Mask', price: '₹400 - ₹600', duration: '30 mins' },
      { name: 'Hydrating Face Mask', price: '₹350 - ₹550', duration: '30 mins' },
      { name: 'Anti-Acne Face Mask', price: '₹450 - ₹700', duration: '35 mins' },
      { name: 'Skin Brightening Mask', price: '₹500 - ₹800', duration: '35 mins' },
    ],
    'Waxing': [
      { name: 'Chest Wax', price: '₹300 - ₹600', duration: '30 mins' },
      { name: 'Back Wax', price: '₹400 - ₹800', duration: '40 mins' },
      { name: 'Shoulder Wax', price: '₹200 - ₹400', duration: '20 mins' },
      { name: 'Stomach Wax', price: '₹300 - ₹500', duration: '30 mins' },
      { name: 'Full Body Wax', price: '₹2,000 - ₹4,000', duration: '90 mins' },
    ],
    'Massage': [
      { name: 'Head Massage', price: '₹200 - ₹400', duration: '20 mins' },
      { name: 'Shoulder Massage', price: '₹250 - ₹450', duration: '25 mins' },
      { name: 'Back Massage', price: '₹400 - ₹800', duration: '30 mins' },
      { name: 'Full Body Massage', price: '₹1,500 - ₹3,000', duration: '60 mins' },
      { name: 'Aromatherapy Massage', price: '₹2,000 - ₹4,000', duration: '60 mins' },
      { name: 'Deep Tissue Massage', price: '₹2,500 - ₹4,500', duration: '60 mins' },
      { name: 'Hot Oil Massage', price: '₹1,800 - ₹3,500', duration: '60 mins' },
    ],
    'Groom': [
      { name: 'Groom Makeup', price: '₹3,000 - ₹8,000', duration: '60 mins' },
      { name: 'Groom Facial', price: '₹1,500 - ₹3,500', duration: '60 mins' },
      { name: 'Premium Beard Styling', price: '₹500 - ₹1,000', duration: '45 mins' },
      { name: 'Hair Styling for Groom', price: '₹800 - ₹1,500', duration: '45 mins' },
      { name: 'Pre-Groom Package', price: '₹5,000 - ₹12,000', duration: '180 mins' },
      { name: 'Hair Coloring for Groom', price: '₹1,000 - ₹2,500', duration: '60 mins' },
    ],
  },
  Female: {
    'Hair': [
      { name: 'Haircut', price: '₹300 - ₹700', duration: '45 mins' },
      { name: 'Hair Wash', price: '₹200 - ₹400', duration: '20 mins' },
      { name: 'Hair Styling', price: '₹400 - ₹1,000', duration: '45 mins' },
      { name: 'Hair Spa', price: '₹800 - ₹1,500', duration: '60 mins' },
      { name: 'Hair Mask Treatment', price: '₹500 - ₹1,000', duration: '40 mins' },
      { name: 'Hair Nourishing Mask', price: '₹600 - ₹1,200', duration: '40 mins' },
      { name: 'Hair Repair Mask', price: '₹700 - ₹1,400', duration: '45 mins' },
      { name: 'Hair Strengthening Mask', price: '₹800 - ₹1,500', duration: '45 mins' },
      { name: 'Hair Coloring', price: '₹1,500 - ₹5,000', duration: '90 mins' },
      { name: 'Hair Smoothening', price: '₹3,000 - ₹6,000', duration: '120 mins' },
      { name: 'Keratin Treatment', price: '₹4,000 - ₹9,000', duration: '150 mins' },
    ],
    'Skin': [
      { name: 'Facial', price: '₹1,000 - ₹3,000', duration: '60 mins' },
      { name: 'Face Cleanup', price: '₹500 - ₹1,000', duration: '40 mins' },
      { name: 'Threading', price: '₹50 - ₹150', duration: '15 mins' },
      { name: 'Charcoal Face Mask', price: '₹500 - ₹900', duration: '30 mins' },
      { name: 'Hydrating Face Mask', price: '₹600 - ₹1,000', duration: '35 mins' },
      { name: 'Gold Face Mask', price: '₹1,000 - ₹2,000', duration: '45 mins' },
      { name: 'Anti-Acne Face Mask', price: '₹800 - ₹1,500', duration: '40 mins' },
      { name: 'Skin Brightening Mask', price: '₹900 - ₹1,800', duration: '45 mins' },
      { name: 'Collagen Face Mask', price: '₹1,200 - ₹2,500', duration: '45 mins' },
    ],
    'Waxing': [
      { name: 'Eyebrow Wax', price: '₹100 - ₹200', duration: '15 mins' },
      { name: 'Upper Lip Wax', price: '₹50 - ₹150', duration: '10 mins' },
      { name: 'Chin Wax', price: '₹50 - ₹150', duration: '10 mins' },
      { name: 'Underarm Wax', price: '₹150 - ₹300', duration: '15 mins' },
      { name: 'Half Arm Wax', price: '₹250 - ₹500', duration: '20 mins' },
      { name: 'Full Arm Wax', price: '₹400 - ₹800', duration: '30 mins' },
      { name: 'Half Leg Wax', price: '₹350 - ₹700', duration: '30 mins' },
      { name: 'Full Leg Wax', price: '₹600 - ₹1,200', duration: '45 mins' },
      { name: 'Full Body Wax', price: '₹2,500 - ₹5,000', duration: '90 mins' },
      { name: 'Chocolate Wax', price: '₹800 - ₹1,500', duration: '45 mins' },
      { name: 'Rica Wax', price: '₹1,200 - ₹2,500', duration: '60 mins' },
      { name: 'Hard Wax', price: '₹1,000 - ₹2,000', duration: '60 mins' },
    ],
    'Massage': [
      { name: 'Head Massage', price: '₹300 - ₹600', duration: '20 mins' },
      { name: 'Shoulder Massage', price: '₹400 - ₹800', duration: '30 mins' },
      { name: 'Back Massage', price: '₹600 - ₹1,200', duration: '40 mins' },
      { name: 'Full Body Massage', price: '₹2,000 - ₹4,000', duration: '60 mins' },
      { name: 'Aromatherapy Massage', price: '₹2,500 - ₹5,000', duration: '60 mins' },
      { name: 'Deep Tissue Massage', price: '₹3,000 - ₹6,000', duration: '60 mins' },
      { name: 'Hot Oil Massage', price: '₹2,200 - ₹4,500', duration: '60 mins' },
      { name: 'Hair & Scalp Therapy Massage', price: '₹1,500 - ₹3,000', duration: '45 mins' },
    ],
    'Bridal': [
      { name: 'Bridal Makeup', price: '₹8,000 - ₹25,000', duration: '150 mins' },
      { name: 'Bridal Hairstyle', price: '₹2,500 - ₹6,000', duration: '90 mins' },
      { name: 'Bridal Facial Package', price: '₹3,000 - ₹8,000', duration: '90 mins' },
      { name: 'Pre-Bridal Package', price: '₹10,000 - ₹30,000', duration: '240 mins' },
      { name: 'Engagement Makeup', price: '₹5,000 - ₹15,000', duration: '120 mins' },
      { name: 'Saree Draping', price: '₹1,000 - ₹3,000', duration: '45 mins' },
      { name: 'Mehendi Application', price: '₹2,000 - ₹8,000', duration: '120 mins' },
    ],
  },
  Kids: {
    'Hair': [
      { name: 'Kids Haircut', price: '₹150 - ₹300', duration: '20 mins' },
      { name: 'Kids Hair Wash', price: '₹100 - ₹200', duration: '15 mins' },
    ],
  },
};

const GENDER_TABS = ['Female', 'Male', 'Kids'] as const;
type Gender = typeof GENDER_TABS[number];

export default function ServicesPage() {
  const [activeGender, setActiveGender] = useState<Gender>('Female');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Object.keys(ALL_SERVICES[activeGender])];
  const servicesForGender = ALL_SERVICES[activeGender];
  const filtered = activeCategory === 'All'
    ? Object.values(servicesForGender).flat()
    : servicesForGender[activeCategory] || [];

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-[#F5EFE7] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-6">Experience Excellence</p>
          <h1 className="text-5xl md:text-7xl font-serif font-light">
            Our <span className="italic text-[#B76E79]">Services</span>
          </h1>
          <p className="mt-6 opacity-60 font-light max-w-xl mx-auto">
            Explore our comprehensive menu of premium hair, beauty, and wellness services crafted for every need.
          </p>
        </div>

        {/* Gender tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {GENDER_TABS.map((g) => (
            <button
              key={g}
              onClick={() => { setActiveGender(g); setActiveCategory('All'); }}
              className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${
                activeGender === g
                  ? 'bg-[#B76E79] text-[#0d0d0d] shadow-[0_0_20px_rgba(183,110,121,0.4)]'
                  : 'border border-[rgba(255,255,255,0.15)] hover:border-[#B76E79] text-[#F5EFE7]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[rgba(183,110,121,0.2)] border border-[#B76E79] text-[#B76E79]'
                  : 'border border-[rgba(255,255,255,0.08)] opacity-60 hover:opacity-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services count */}
        <p className="text-center text-xs opacity-40 uppercase tracking-widest mb-10">
          {filtered.length} services
        </p>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((svc) => (
            <div
              key={`${activeGender}-${svc.name}`}
              className="glass-card p-6 rounded-2xl group hover:border-[rgba(183,110,121,0.4)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif text-base mb-1 group-hover:text-[#B76E79] transition-colors">{svc.name}</h3>
                <p className="text-xs opacity-40 mb-4">{svc.duration}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-[#B76E79] text-sm font-medium">{svc.price}</p>
                <Link
                  href="/book"
                  className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-[#F5EFE7] hover:text-[#B76E79]"
                >
                  Book →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <p className="opacity-60 mb-6 font-light">Can&apos;t find what you&apos;re looking for? Call us and we&apos;ll help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="inline-block px-10 py-4 bg-[#B76E79] text-[#0d0d0d] font-medium tracking-widest uppercase rounded-full hover:bg-[#F5EFE7] transition-colors text-sm">
              Book Appointment
            </Link>
            <a href="tel:9480947076" className="inline-block px-10 py-4 border border-[rgba(183,110,121,0.4)] text-[#F5EFE7] rounded-full hover:bg-[rgba(183,110,121,0.1)] transition-all text-sm tracking-widest uppercase">
              Call: 9480947076
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
