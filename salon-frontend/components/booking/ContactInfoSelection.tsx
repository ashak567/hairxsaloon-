'use client';
import React, { useState, useEffect } from 'react';

export default function ContactInfoSelection({ data, updateData, onNext, onPrev }: any) {
  const [name, setName] = useState(data.customerName || '');
  const [email, setEmail] = useState(data.customerEmail || '');
  const [phone, setPhone] = useState(data.phone || '');
  const [error, setError] = useState('');

  // Pre-fill from local storage if logged in
  useEffect(() => {
    if (!name && !email && !phone) {
      const userStr = localStorage.getItem('hx_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setName(user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '');
          setEmail(user.email || '');
          setPhone(user.phone || '');
        } catch (e) {}
      }
    }
  }, []);

  const handleNext = () => {
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }
    
    setError('');
    updateData({ customerName: name, customerEmail: email, phone });
    onNext();
  };

  const inputCls = "w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#F5EFE7] focus:outline-none focus:border-[#B76E79] transition-colors";

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-serif text-[#F5EFE7] mb-2 text-center">Your Details</h2>
      <p className="text-center text-sm opacity-60 mb-8 tracking-widest uppercase">How can we reach you?</p>

      <div className="flex-grow flex justify-center items-start">
        <div className="w-full max-w-sm space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={inputCls} 
              placeholder="e.g. Jane Doe"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className={inputCls} 
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Email (Optional)</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={inputCls} 
              placeholder="jane@example.com"
            />
            <p className="text-[10px] opacity-40 mt-1">We'll send your invoice here.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-[rgba(255,255,255,0.08)]">
        <button
          onClick={onPrev}
          className="px-6 py-2 rounded-full border border-[rgba(255,255,255,0.2)] text-[#F5EFE7] hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-full font-medium tracking-widest uppercase bg-[#B76E79] text-[#0d0d0d] hover:bg-[#F5EFE7] transition-all text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
