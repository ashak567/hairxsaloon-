'use client';
import React, { useEffect, useState } from 'react';

export default function BranchSelection({ data, updateData, onNext }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real app, fetch from /api/branches
    // Mocking for now based on requirements
    setTimeout(() => {
      setBranches([
        { _id: '1', name: 'Parvatinagar Branch', address: 'Beside Basua Bhawan, Parvatinagar', city: 'Ballari' },
        { _id: '2', name: 'Ashok Nagar Branch', address: 'Infantry Road, Near Wine World', city: 'Ballari' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSelect = (branchId) => {
    updateData({ branchId });
    setTimeout(onNext, 400); // Small delay for UX
  };

  if (loading) return <div className="flex h-full items-center justify-center text-[var(--color-secondary)]">Loading lux locations...</div>;

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-serif text-[var(--color-secondary)] mb-2">Select a Salon</h2>
      <p className="text-sm opacity-60 font-light mb-8">Choose your preferred Hair X Studio location</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {branches.map(branch => (
          <div 
            key={branch._id}
            onClick={() => handleSelect(branch._id)}
            className={`glass-card p-6 rounded-xl cursor-pointer transition-all border ${
              data.branchId === branch._id ? 'border-[#B76E79] shadow-[0_0_20px_rgba(183,110,121,0.2)]' : 'border-[rgba(255,255,255,0.05)]'
            }`}
          >
            <h3 className="text-xl font-medium mb-2 text-white">{branch.name}</h3>
            <p className="text-sm opacity-70 leading-relaxed font-light">{branch.address}</p>
            <p className="text-sm opacity-50 mt-4">{branch.city}, Karnataka</p>
          </div>
        ))}
      </div>
    </div>
  );
}
