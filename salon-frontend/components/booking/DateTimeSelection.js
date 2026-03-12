'use client';
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';

export default function DateTimeSelection({ data, updateData, onNext, onPrev }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([
      '10:00', '10:30', '11:00', '12:30', '14:00', '15:00', '16:30', '17:00'
  ]);
  const [selectedTime, setSelectedTime] = useState(data.time || null);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));

  // In a real app we'd fetch based on selectedDate and data.stylistId here.
  // We'll leave the mock slots as static.
  // useEffect(() => {
  //   fetchSlots(selectedDate, data.stylistId).then(setAvailableSlots);
  // }, [selectedDate, data.stylistId]);

  const handleNext = () => {
    if (!selectedTime) return;
    updateData({ date: selectedDate, time: selectedTime });
    onNext();
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-serif text-[var(--color-secondary)] mb-2">When works for you?</h2>
      <p className="text-sm opacity-60 font-light mb-6">Select a date and available time slot.</p>
      
      <div className="flex-grow flex flex-col md:flex-row gap-8">
        
        {/* Date Picker (Horizontal scroll) */}
        <div className="w-full md:w-1/3 border-r border-[rgba(255,255,255,0.1)] pr-4">
            <h3 className="text-sm uppercase tracking-widest mb-4 opacity-50">Select Date</h3>
            <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:max-h-[350px]">
                {dates.map((date, i) => {
                    const isSelected = date.getDate() === selectedDate.getDate();
                    return (
                        <div 
                            key={i} 
                            onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl min-w-[70px] cursor-pointer border transition-colors ${
                                isSelected ? 'border-[#B76E79] bg-[#B76E79] text-[#1C1C1C] font-medium' : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)]'
                            }`}
                        >
                            <span className="text-xs uppercase opacity-80">{format(date, 'EEE')}</span>
                            <span className="text-xl">{format(date, 'dd')}</span>
                            <span className="text-xs opacity-60">{format(date, 'MMM')}</span>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* Time Slots */}
        <div className="w-full md:w-2/3">
            <h3 className="text-sm uppercase tracking-widest mb-4 opacity-50">Available Times</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableSlots.map((time, i) => (
                    <div 
                        key={i}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 text-center rounded-xl border cursor-pointer transition-all flex items-center justify-center text-sm font-medium ${
                            selectedTime === time 
                                ? 'border-[#B76E79] bg-[rgba(183,110,121,0.15)] text-[#B76E79] shadow-[0_0_12px_rgba(183,110,121,0.25)]' 
                                : 'border-[rgba(255,255,255,0.2)] text-[#F5EFE7] hover:border-[#B76E79] hover:text-[#B76E79]'
                        }`}
                    >
                        {time}
                    </div>
                ))}
            </div>
            
            {availableSlots.length === 0 && (
                <div className="text-center p-8 opacity-50 text-sm">No slots available for this date. Please try another day.</div>
            )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)]">
        <button onClick={onPrev} className="px-6 py-2 rounded-full border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors uppercase text-sm tracking-wider">
          Back
        </button>
        <button 
          onClick={handleNext}
          disabled={!selectedTime}
          className={`px-8 py-2 rounded-full font-medium tracking-widest uppercase transition-all ${
            selectedTime
              ? 'bg-[#B76E79] text-[#1C1C1C] hover:shadow-[0_0_15px_rgba(183,110,121,0.6)]' 
              : 'bg-[rgba(255,255,255,0.1)] text-gray-500 cursor-not-allowed'
          }`}
        >
          Review
        </button>
      </div>
    </div>
  );
}
