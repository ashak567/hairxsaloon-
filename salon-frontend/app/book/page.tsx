'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock components for each step
import BranchSelection from '@/components/booking/BranchSelection';
import GenderSelection from '@/components/booking/GenderSelection';
import ServiceSelection from '@/components/booking/ServiceSelection';
import StylistSelection from '@/components/booking/StylistSelection';
import DateTimeSelection from '@/components/booking/DateTimeSelection';
import BookingConfirmation from '@/components/booking/BookingConfirmation';

const steps = [
  'Branch',
  'Gender',
  'Services',
  'Stylist',
  'Date & Time',
  'Confirm'
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    branchId: null,
    gender: null,
    services: [], // Array of service IDs
    stylistId: null,
    date: null,
    time: null,
    totalPriceMin: 0,
    totalPriceMax: 0,
    totalDuration: 0,
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const updateBookingData = (data: any) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BranchSelection data={bookingData} updateData={updateBookingData} onNext={nextStep} />;
      case 1:
        return <GenderSelection data={bookingData} updateData={updateBookingData} onNext={nextStep} onPrev={prevStep} />;
      case 2:
        return <ServiceSelection data={bookingData} updateData={updateBookingData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <StylistSelection data={bookingData} updateData={updateBookingData} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <DateTimeSelection data={bookingData} updateData={updateBookingData} onNext={nextStep} onPrev={prevStep} />;
      case 5:
        return <BookingConfirmation data={bookingData} onPrev={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 flex flex-col items-center bg-[var(--color-primary)] bg-[url('/noise.png')]">
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-[rgba(245,239,231,0.1)] -z-10"></div>
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#B76E79] -z-10"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-[#B76E79] text-white shadow-[0_0_10px_rgba(183,110,121,0.5)]' 
                      : 'bg-[#1C1C1C] text-[var(--color-secondary)] border border-[rgba(245,239,231,0.2)]'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className={`text-xs mt-2 uppercase tracking-wider hidden md:block ${
                  index <= currentStep ? 'text-[var(--color-secondary)]' : 'text-[#888]'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="glass-panel p-6 md:p-10 rounded-2xl min-h-[500px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
      
      {/* Background ambient glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B76E79] rounded-full blur-[150px] opacity-10 pointer-events-none -z-0"></div>
    </main>
  );
}
