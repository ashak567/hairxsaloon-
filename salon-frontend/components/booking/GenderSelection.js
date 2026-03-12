'use client';
import React from 'react';

export default function GenderSelection({ data, updateData, onNext, onPrev }) {
  const options = ['Male', 'Female', 'Kids'];

  const handleSelect = (gender) => {
    updateData({ gender, services: [] }); // Reset services when gender changes
    setTimeout(onNext, 400);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-serif text-[var(--color-secondary)] mb-2">Who is this for?</h2>
      <p className="text-sm opacity-60 font-light mb-8">Select category to view tailored services</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        {options.map(gender => (
          <div 
            key={gender}
            onClick={() => handleSelect(gender)}
            className={`glass-card flex items-center justify-center h-40 rounded-xl cursor-pointer transition-all border ${
              data.gender === gender ? 'border-[#B76E79] bg-[rgba(183,110,121,0.1)]' : 'border-[rgba(255,255,255,0.05)]'
            }`}
          >
            <h3 className="text-2xl font-serif tracking-widest uppercase">{gender}</h3>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-start">
        <button onClick={onPrev} className="px-6 py-2 rounded-full border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors uppercase text-sm tracking-wider">
          Back
        </button>
      </div>
    </div>
  );
}
