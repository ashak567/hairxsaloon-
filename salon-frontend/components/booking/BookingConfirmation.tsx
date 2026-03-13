'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';

// Duration lookup for common services (in minutes)
const SERVICE_DURATIONS: Record<string, number> = {
  'Haircut': 30, 'Hair Wash': 15, 'Hair Styling': 20, 'Hair Spa': 45,
  'Beard Trim': 15, 'Beard Styling': 20, 'Face Cleanup': 30, 'Facial': 60,
  'Threading': 15, 'Full Body Wax': 90, 'Head Massage': 20, 'Full Body Massage': 60,
  'Keratin Treatment': 120, 'Hair Smoothening': 120, 'Bridal Makeup': 150,
  'Pre-Bridal Package': 240, 'Pre-Groom Package': 180,
};

const DEFAULT_DURATION = 30;

export default function BookingConfirmation({ data, onPrev }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const branchName = data.branchId === '1' ? 'Parvatinagar Branch' : 'Ashok Nagar Branch';
  const branchAddress = data.branchId === '1'
    ? 'Beside Basua Bhawan, Parvatinagar'
    : 'Infantry Road, Near Wine World';

  const stylistMap: Record<string, string> = {
    's1': 'Arun Kumar', 's2': 'Priya Sharma', 's3': 'Ravi Naik',
    's4': 'Divya Reddy', 's5': 'Any Available',
  };
  const stylistName = stylistMap[data.stylistId] || data.stylistId || 'Professional';

  // Use serviceNames array passed from ServiceSelection
  const selectedServiceNames: string[] = data.serviceNames || [];

  // Calculate total duration from service names
  const totalDuration = selectedServiceNames.length > 0
    ? selectedServiceNames.reduce((sum, name) => sum + (SERVICE_DURATIONS[name] || DEFAULT_DURATION), 0)
    : (data.totalDuration || 0);

  // Format date safely
  let formattedDate = '';
  let formattedDateShort = '';
  try {
    const d = data.date instanceof Date ? data.date : new Date(data.date);
    formattedDate = format(d, 'EEEE, MMMM do, yyyy');
    formattedDateShort = format(d, 'MMM do, yyyy');
  } catch {
    formattedDate = 'Selected date';
    formattedDateShort = 'Selected date';
  }

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('hx_token') : null;
      const user = typeof window !== 'undefined' ? localStorage.getItem('hx_user') : null;
      const parsedUser = user ? JSON.parse(user) : null;

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customerName: parsedUser ? `${parsedUser.firstName} ${parsedUser.lastName}` : (data.customerName || 'Guest'),
          customerEmail: parsedUser?.email || data.customerEmail || 'guest@hairxstudio.com',
          customerPhone: parsedUser?.phone || data.phone || '',
          branch: branchName,
          branchId: data.branchId,
          gender: data.gender,
          services: selectedServiceNames,
          stylistId: data.stylistId,
          stylistName,
          date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
          time: data.time,
          durationMins: totalDuration || 30,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Booking failed. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center text-4xl mb-6">
          ✓
        </div>
        <h2 className="text-3xl font-serif text-[#F5EFE7] mb-4">Booking Confirmed!</h2>
        <p className="text-[#F5EFE7] opacity-70 mb-2">
          Your appointment with <span className="text-[#B76E79] font-medium">{stylistName}</span> is set for:
        </p>
        <p className="text-xl font-medium text-[#F5EFE7] mb-8">
          {formattedDate} at {data.time}
        </p>
        <div className="glass-card mb-8 p-6 text-sm opacity-70 max-w-sm rounded-xl text-[#F5EFE7]">
          <p className="mb-2">We&apos;ll send a confirmation SMS to your phone.</p>
          <p>Please arrive 10 minutes early.</p>
        </div>
        <Link
          href="/"
          className="px-10 py-3 bg-[#B76E79] text-[#0d0d0d] font-medium tracking-widest uppercase rounded-full hover:bg-[#F5EFE7] transition-colors text-sm"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-serif text-[#F5EFE7] mb-6 text-center">Review & Confirm</h2>

      <div className="flex-grow flex justify-center">
        <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-[rgba(183,110,121,0.25)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B76E79] to-transparent" />

          <div className="space-y-5">
            {/* Branch */}
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-4">
              <span className="text-xs uppercase tracking-widest opacity-50">Location</span>
              <div className="text-right">
                <p className="text-sm font-medium text-[#F5EFE7]">{branchName}</p>
                <p className="text-xs opacity-40">{branchAddress}</p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-4">
              <span className="text-xs uppercase tracking-widest opacity-50">Category</span>
              <span className="text-sm font-medium text-[#F5EFE7]">{data.gender}</span>
            </div>

            {/* Contact */}
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-4">
              <span className="text-xs uppercase tracking-widest opacity-50">Contact</span>
              <div className="text-right">
                <p className="text-sm font-medium text-[#F5EFE7]">{data.customerName}</p>
                <p className="text-xs opacity-40">{data.phone}</p>
              </div>
            </div>

            {/* Services */}
            <div className="border-b border-[rgba(255,255,255,0.05)] pb-4">
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-widest opacity-50">Services</span>
                <div className="text-right max-w-[60%]">
                  {selectedServiceNames.length > 0 ? (
                    selectedServiceNames.map((svc, i) => (
                      <p key={i} className="text-sm text-[#F5EFE7]">{svc}</p>
                    ))
                  ) : (
                    <p className="text-sm text-[#F5EFE7] opacity-60">Not specified</p>
                  )}
                </div>
              </div>
            </div>

            {/* When */}
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-4">
              <span className="text-xs uppercase tracking-widest opacity-50">When</span>
              <div className="text-right">
                <p className="text-sm font-medium text-[#F5EFE7]">{formattedDateShort}</p>
                <p className="text-sm text-[#B76E79]">
                  {data.time}
                  {totalDuration > 0 && ` · ${totalDuration} mins`}
                </p>
              </div>
            </div>

            {/* Stylist */}
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-4">
              <span className="text-xs uppercase tracking-widest opacity-50">Professional</span>
              <span className="text-sm font-medium text-[#F5EFE7]">{stylistName}</span>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs uppercase tracking-widest opacity-50">Est. Total</span>
              <span className="text-lg font-serif text-[#B76E79]">
                {selectedServiceNames.length > 0 ? 'As per menu' : 'Confirm at salon'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-[rgba(255,255,255,0.08)]">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-full border border-[rgba(255,255,255,0.2)] text-[#F5EFE7] hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="px-8 py-3 rounded-full font-medium tracking-widest uppercase bg-[#B76E79] text-[#0d0d0d] hover:bg-[#F5EFE7] transition-all text-sm disabled:opacity-70"
        >
          {isSubmitting ? 'Confirming…' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
