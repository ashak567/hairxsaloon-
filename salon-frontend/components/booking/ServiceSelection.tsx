'use client';
import React, { useState } from 'react';

const ALL_SERVICES: Record<string, Array<{ _id: string; name: string; category: string; price: string; duration: string }>> = {
  Male: [
    { _id: 'm-h1', name: 'Haircut', category: 'Hair', price: '₹150 - ₹250', duration: '30 mins' },
    { _id: 'm-h2', name: 'Hair Wash', category: 'Hair', price: '₹100 - ₹150', duration: '15 mins' },
    { _id: 'm-h3', name: 'Hair Styling', category: 'Hair', price: '₹150 - ₹300', duration: '20 mins' },
    { _id: 'm-h4', name: 'Hair Spa', category: 'Hair', price: '₹500 - ₹900', duration: '45 mins' },
    { _id: 'm-h5', name: 'Hair Mask Treatment', category: 'Hair', price: '₹300 - ₹600', duration: '30 mins' },
    { _id: 'm-h6', name: 'Hair Nourishing Mask', category: 'Hair', price: '₹350 - ₹650', duration: '30 mins' },
    { _id: 'm-h7', name: 'Hair Repair Mask', category: 'Hair', price: '₹400 - ₹700', duration: '35 mins' },
    { _id: 'm-h8', name: 'Hair Coloring', category: 'Hair', price: '₹500 - ₹1,500', duration: '60 mins' },
    { _id: 'm-h9', name: 'Hair Smoothening', category: 'Hair', price: '₹1,500 - ₹3,000', duration: '120 mins' },
    { _id: 'm-h10', name: 'Keratin Treatment', category: 'Hair', price: '₹2,000 - ₹4,000', duration: '120 mins' },
    { _id: 'm-b1', name: 'Beard Trim', category: 'Beard', price: '₹100 - ₹200', duration: '15 mins' },
    { _id: 'm-b2', name: 'Beard Styling', category: 'Beard', price: '₹150 - ₹300', duration: '20 mins' },
    { _id: 'm-b3', name: 'Beard Coloring', category: 'Beard', price: '₹300 - ₹600', duration: '30 mins' },
    { _id: 'm-b4', name: 'Beard Conditioning Treatment', category: 'Beard', price: '₹250 - ₹500', duration: '25 mins' },
    { _id: 'm-s1', name: 'Face Cleanup', category: 'Skin', price: '₹300 - ₹600', duration: '30 mins' },
    { _id: 'm-s2', name: 'Facial', category: 'Skin', price: '₹800 - ₹1,500', duration: '60 mins' },
    { _id: 'm-s3', name: 'Charcoal Face Mask', category: 'Skin', price: '₹400 - ₹600', duration: '30 mins' },
    { _id: 'm-s4', name: 'Hydrating Face Mask', category: 'Skin', price: '₹350 - ₹550', duration: '30 mins' },
    { _id: 'm-s5', name: 'Anti-Acne Face Mask', category: 'Skin', price: '₹450 - ₹700', duration: '35 mins' },
    { _id: 'm-s6', name: 'Skin Brightening Mask', category: 'Skin', price: '₹500 - ₹800', duration: '35 mins' },
    { _id: 'm-w1', name: 'Chest Wax', category: 'Waxing', price: '₹300 - ₹600', duration: '30 mins' },
    { _id: 'm-w2', name: 'Back Wax', category: 'Waxing', price: '₹400 - ₹800', duration: '40 mins' },
    { _id: 'm-w3', name: 'Full Body Wax', category: 'Waxing', price: '₹2,000 - ₹4,000', duration: '90 mins' },
    { _id: 'm-m1', name: 'Head Massage', category: 'Massage', price: '₹200 - ₹400', duration: '20 mins' },
    { _id: 'm-m2', name: 'Full Body Massage', category: 'Massage', price: '₹1,500 - ₹3,000', duration: '60 mins' },
    { _id: 'm-m3', name: 'Aromatherapy Massage', category: 'Massage', price: '₹2,000 - ₹4,000', duration: '60 mins' },
    { _id: 'm-m4', name: 'Deep Tissue Massage', category: 'Massage', price: '₹2,500 - ₹4,500', duration: '60 mins' },
    { _id: 'm-g1', name: 'Groom Makeup', category: 'Groom', price: '₹3,000 - ₹8,000', duration: '60 mins' },
    { _id: 'm-g2', name: 'Pre-Groom Package', category: 'Groom', price: '₹5,000 - ₹12,000', duration: '180 mins' },
  ],
  Female: [
    { _id: 'f-h1', name: 'Haircut', category: 'Hair', price: '₹300 - ₹700', duration: '45 mins' },
    { _id: 'f-h2', name: 'Hair Wash', category: 'Hair', price: '₹200 - ₹400', duration: '20 mins' },
    { _id: 'f-h3', name: 'Hair Styling', category: 'Hair', price: '₹400 - ₹1,000', duration: '45 mins' },
    { _id: 'f-h4', name: 'Hair Spa', category: 'Hair', price: '₹800 - ₹1,500', duration: '60 mins' },
    { _id: 'f-h5', name: 'Hair Mask Treatment', category: 'Hair', price: '₹500 - ₹1,000', duration: '40 mins' },
    { _id: 'f-h6', name: 'Hair Nourishing Mask', category: 'Hair', price: '₹600 - ₹1,200', duration: '40 mins' },
    { _id: 'f-h7', name: 'Hair Repair Mask', category: 'Hair', price: '₹700 - ₹1,400', duration: '45 mins' },
    { _id: 'f-h8', name: 'Hair Strengthening Mask', category: 'Hair', price: '₹800 - ₹1,500', duration: '45 mins' },
    { _id: 'f-h9', name: 'Hair Coloring', category: 'Hair', price: '₹1,500 - ₹5,000', duration: '90 mins' },
    { _id: 'f-h10', name: 'Hair Smoothening', category: 'Hair', price: '₹3,000 - ₹6,000', duration: '120 mins' },
    { _id: 'f-h11', name: 'Keratin Treatment', category: 'Hair', price: '₹4,000 - ₹9,000', duration: '150 mins' },
    { _id: 'f-s1', name: 'Facial', category: 'Skin', price: '₹1,000 - ₹3,000', duration: '60 mins' },
    { _id: 'f-s2', name: 'Face Cleanup', category: 'Skin', price: '₹500 - ₹1,000', duration: '40 mins' },
    { _id: 'f-s3', name: 'Threading', category: 'Skin', price: '₹50 - ₹150', duration: '15 mins' },
    { _id: 'f-s4', name: 'Gold Face Mask', category: 'Skin', price: '₹1,000 - ₹2,000', duration: '45 mins' },
    { _id: 'f-s5', name: 'Collagen Face Mask', category: 'Skin', price: '₹1,200 - ₹2,500', duration: '45 mins' },
    { _id: 'f-s6', name: 'Skin Brightening Mask', category: 'Skin', price: '₹900 - ₹1,800', duration: '45 mins' },
    { _id: 'f-w1', name: 'Eyebrow Wax', category: 'Waxing', price: '₹100 - ₹200', duration: '15 mins' },
    { _id: 'f-w2', name: 'Upper Lip Wax', category: 'Waxing', price: '₹50 - ₹150', duration: '10 mins' },
    { _id: 'f-w3', name: 'Full Arm Wax', category: 'Waxing', price: '₹400 - ₹800', duration: '30 mins' },
    { _id: 'f-w4', name: 'Full Leg Wax', category: 'Waxing', price: '₹600 - ₹1,200', duration: '45 mins' },
    { _id: 'f-w5', name: 'Full Body Wax', category: 'Waxing', price: '₹2,500 - ₹5,000', duration: '90 mins' },
    { _id: 'f-w6', name: 'Chocolate Wax', category: 'Waxing', price: '₹800 - ₹1,500', duration: '45 mins' },
    { _id: 'f-w7', name: 'Rica Wax', category: 'Waxing', price: '₹1,200 - ₹2,500', duration: '60 mins' },
    { _id: 'f-m1', name: 'Head Massage', category: 'Massage', price: '₹300 - ₹600', duration: '20 mins' },
    { _id: 'f-m2', name: 'Full Body Massage', category: 'Massage', price: '₹2,000 - ₹4,000', duration: '60 mins' },
    { _id: 'f-m3', name: 'Aromatherapy Massage', category: 'Massage', price: '₹2,500 - ₹5,000', duration: '60 mins' },
    { _id: 'f-m4', name: 'Hair & Scalp Therapy Massage', category: 'Massage', price: '₹1,500 - ₹3,000', duration: '45 mins' },
    { _id: 'f-br1', name: 'Bridal Makeup', category: 'Bridal', price: '₹8,000 - ₹25,000', duration: '150 mins' },
    { _id: 'f-br2', name: 'Bridal Hairstyle', category: 'Bridal', price: '₹2,500 - ₹6,000', duration: '90 mins' },
    { _id: 'f-br3', name: 'Pre-Bridal Package', category: 'Bridal', price: '₹10,000 - ₹30,000', duration: '240 mins' },
    { _id: 'f-br4', name: 'Engagement Makeup', category: 'Bridal', price: '₹5,000 - ₹15,000', duration: '120 mins' },
    { _id: 'f-br5', name: 'Saree Draping', category: 'Bridal', price: '₹1,000 - ₹3,000', duration: '45 mins' },
    { _id: 'f-br6', name: 'Mehendi Application', category: 'Bridal', price: '₹2,000 - ₹8,000', duration: '120 mins' },
  ],
  Kids: [
    { _id: 'k1', name: 'Kids Haircut', category: 'Hair', price: '₹150 - ₹300', duration: '20 mins' },
    { _id: 'k2', name: 'Kids Hair Wash', category: 'Hair', price: '₹100 - ₹200', duration: '15 mins' },
  ],
};

type ServiceItem = { _id: string; name: string; category: string; price: string; duration: string };

export default function ServiceSelection({ data, updateData, onNext, onPrev }: any) {
  const services: ServiceItem[] = ALL_SERVICES[data.gender as string] || [];
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>(data.services || []);

  const displayed = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

  const toggle = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleNext = () => {
    if (!selectedIds.length) return;
    const selected = services.filter(s => selectedIds.includes(s._id));
    updateData({ services: selectedIds, serviceNames: selected.map(s => s.name) });
    onNext();
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-serif text-[#F5EFE7] mb-1">Select Services</h2>
      <p className="text-sm opacity-60 mb-4">Choose one or more services for {data.gender}</p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all ${
              activeCategory === cat
                ? 'bg-[rgba(183,110,121,0.2)] border border-[#B76E79] text-[#B76E79]'
                : 'border border-[rgba(255,255,255,0.1)] opacity-60 hover:opacity-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services list */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-6" style={{maxHeight: '360px'}}>
        {displayed.map(service => {
          const isSelected = selectedIds.includes(service._id);
          return (
            <div
              key={service._id}
              onClick={() => toggle(service._id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border flex items-center justify-between gap-4 ${
                isSelected
                  ? 'border-[#B76E79] bg-[rgba(183,110,121,0.08)]'
                  : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(183,110,121,0.3)]'
              }`}
            >
              <div className="flex-1">
                <p className={`font-medium text-sm ${isSelected ? 'text-[#B76E79]' : 'text-[#F5EFE7]'}`}>{service.name}</p>
                <p className="text-xs opacity-40">{service.category} · {service.duration}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-[#B76E79]">{service.price}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-[#B76E79] bg-[#B76E79]' : 'border-[rgba(255,255,255,0.3)]'}`}>
                {isSelected && <svg className="w-3 h-3 text-[#0d0d0d]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection summary */}
      {selectedIds.length > 0 && (
        <p className="text-xs text-[#B76E79] mb-4">{selectedIds.length} service{selectedIds.length > 1 ? 's' : ''} selected</p>
      )}

      <div className="flex justify-between pt-4 border-t border-[rgba(255,255,255,0.08)]">
        <button onClick={onPrev} className="px-6 py-2 rounded-full border border-[rgba(255,255,255,0.2)] text-[#F5EFE7] hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm">Back</button>
        <button
          onClick={handleNext}
          disabled={!selectedIds.length}
          className={`px-8 py-2 rounded-full font-medium text-sm tracking-wider transition-all ${
            selectedIds.length ? 'bg-[#B76E79] text-[#0d0d0d] hover:bg-[#F5EFE7]' : 'opacity-30 cursor-not-allowed bg-[rgba(255,255,255,0.1)] text-[#F5EFE7]'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
