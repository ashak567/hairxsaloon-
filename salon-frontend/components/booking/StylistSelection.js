'use client';
import React, { useEffect, useState } from 'react';

export default function StylistSelection({ data, updateData, onNext, onPrev }) {
  const [stylists, setStylists] = useState([{ _id: 'any', name: 'Any Available', specialization: 'First Available Professional', rating: 'N/A' }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStylists() {
      try {
        const res = await fetch(`/api/stylists?branchId=${data.branchId}`);
        const result = await res.json();
        
        let fetchedData = result.stylists || result;
        if (!Array.isArray(fetchedData)) fetchedData = [];

        // Add "Any Available" as the default first option
        const anyAvail = { _id: 'any', name: 'Any Available', specialization: 'First Available Professional', rating: 'N/A' };
        setStylists([anyAvail, ...fetchedData]);
      } catch (err) {
        console.error("Failed to fetch stylists");
      } finally {
        setLoading(false);
      }
    }
    fetchStylists();
  }, [data.branchId]);
  // In real app, fetch /api/stylists?branchId=xyz and set state

  const handleSelect = (stylistId) => {
    updateData({ stylistId });
    setTimeout(onNext, 400);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-serif text-[var(--color-secondary)] mb-2">Choose your Professional</h2>
      <p className="text-sm opacity-60 font-light mb-8">Select a specific stylist or any available</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        {loading ? (
          <p className="text-sm opacity-40 col-span-3 text-center py-10">Loading professionals...</p>
        ) : stylists.length === 1 ? (
          <p className="text-sm opacity-40 col-span-3 text-center py-10">No specific professionals available for this branch today. Please select "Any Available".</p>
        ) : null}
        {!loading && stylists.map(stylist => (
          <div 
            key={stylist._id}
            onClick={() => handleSelect(stylist._id)}
            className={`glass-card p-6 flex flex-col items-center justify-center text-center rounded-xl cursor-pointer transition-all border ${
              data.stylistId === stylist._id ? 'border-[#B76E79] bg-[rgba(183,110,121,0.05)] shadow-[0_0_20px_rgba(183,110,121,0.2)]' : 'border-[rgba(255,255,255,0.05)]'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1C1C1C] to-[#B76E79] mb-4 flex items-center justify-center text-2xl font-serif border-2 border-[rgba(255,255,255,0.1)]">
                {stylist._id === 'any' ? '*' : stylist.name.charAt(0)}
            </div>
            <h3 className="text-lg font-medium text-white mb-1">{stylist.name}</h3>
            <p className="text-xs opacity-70 font-light mb-2">{stylist.specialization || 'Stylist'}</p>
            {stylist.rating && stylist.rating !== 'N/A' && <p className="text-xs text-[#B76E79]">★ {stylist.rating}</p>}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-start pt-4 border-t border-[rgba(255,255,255,0.1)]">
        <button onClick={onPrev} className="px-6 py-2 rounded-full border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors uppercase text-sm tracking-wider">
          Back
        </button>
      </div>
    </div>
  );
}
