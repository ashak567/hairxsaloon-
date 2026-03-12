'use client';
import React, { useEffect, useState } from 'react';

export default function QueueDisplay() {
  const [queue] = useState([
    { ticket: 'A01', name: 'John D.', service: 'Haircut', status: 'Serving', chair: 'CH-1' },
    { ticket: 'A02', name: 'Priya M.', service: 'Hair Spa', status: 'Serving', chair: 'CH-4' },
    { ticket: 'B01', name: 'Ravi K.', service: 'Beard Trim', status: 'Next',  chair: '-' },
    { ticket: 'C01', name: 'Sana F.', service: 'Facial', status: 'Waiting', chair: '-' },
    { ticket: 'A03', name: 'Walk-In', service: 'Coloring', status: 'Waiting', chair: '-' }
  ]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Clock
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Socket connection
    // const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000');
    // socket.emit('join-branch-queue', 'branch_1');
    // socket.on('queue:update', (data) => setQueue(data));
    
    return () => {
        clearInterval(timer);
        // socket.disconnect();
    };
  }, []);

  const serving = queue.filter(q => q.status === 'Serving');
  const waiting = queue.filter(q => q.status !== 'Serving');

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-[var(--color-secondary)] p-8 flex flex-col overflow-hidden relative">
      <style>{`
        /* Hide navbar/cursor elements if this is running as standalone TV display */
        nav { display: none !important; }
        .custom-cursor { display: none !important; }
        body { cursor: none; }
      `}</style>
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.1)] pb-6 mb-8">
         <h1 className="text-5xl font-serif text-[#B76E79]">Hair X Studio <span className="font-light text-white opacity-80 text-4xl">| Live Queue</span></h1>
         <div className="text-right">
             <p className="text-4xl font-medium tracking-wider">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
             <p className="text-lg opacity-60">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric'})}</p>
         </div>
      </div>

      <div className="pl-6 pt-1 flex flex-row gap-12 flex-grow">
          {/* NOW SERVING Column (Left - 60%) */}
          <div className="w-[60%] flex flex-col">
              <h2 className="text-3xl font-serif uppercase tracking-widest text-[#B76E79] mb-8 flex items-center gap-3">
                 <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                 Now Serving
              </h2>
              
              <div className="grid grid-cols-1 gap-6 flex-grow pb-4">
                  {serving.length > 0 ? serving.map((item, idx) => (
                      <div key={idx} className="glass-card bg-[rgba(255,255,255,0.03)] border-l-4 border-[#B76E79] rounded-2xl p-8 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                          <div className="flex items-center gap-8">
                             <div className="w-24 h-24 rounded-2xl bg-[rgba(183,110,121,0.1)] flex items-center justify-center border border-[rgba(183,110,121,0.3)]">
                                 <span className="text-3xl font-bold text-[#B76E79]">{item.ticket}</span>
                             </div>
                             <div>
                                 <p className="text-4xl font-medium mb-2">{item.name}</p>
                                 <p className="text-xl opacity-60 tracking-wider uppercase">{item.service}</p>
                             </div>
                          </div>
                          <div className="text-right">
                              <p className="text-sm uppercase tracking-widest opacity-50 mb-2">Proceed To</p>
                              <p className="text-5xl font-serif font-medium text-white">{item.chair}</p>
                          </div>
                      </div>
                  )) : (
                      <div className="flex items-center justify-center h-full opacity-30 text-2xl border-2 border-dashed border-[rgba(255,255,255,0.2)] rounded-3xl">
                          No active services at this moment
                      </div>
                  )}
              </div>
          </div>

          {/* UP NEXT Column (Right - 40%) */}
          <div className="w-[40%] flex flex-col border-l border-[rgba(255,255,255,0.1)] pl-12">
              <h2 className="text-3xl font-serif uppercase tracking-widest text-[var(--color-secondary)] mb-8 flex items-center gap-3 opacity-80">
                 Up Next
              </h2>
              
              <div className="space-y-4 overflow-y-auto no-scrollbar pb-8">
                  {waiting.length > 0 ? waiting.map((item, idx) => (
                      <div key={idx} className={`rounded-xl p-6 flex justify-between items-center border ${
                          idx === 0 
                             ? 'glass-card border-[#B76E79] shadow-inner bg-[rgba(183,110,121,0.05)]' 
                             : 'border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)] opacity-70'
                      }`}>
                          <div className="flex items-center gap-6">
                              <span className={`text-2xl font-bold ${idx === 0 ? 'text-[#B76E79]' : 'text-white'}`}>{item.ticket}</span>
                              <div>
                                  <p className="text-2xl font-medium">{item.name}</p>
                                  <p className="text-sm opacity-60 uppercase">{item.service}</p>
                              </div>
                          </div>
                          {idx === 0 && <span className="text-xs uppercase tracking-widest px-3 py-1 bg-[#B76E79] text-[#1C1C1C] rounded font-medium animate-pulse">Next</span>}
                      </div>
                  )) : (
                      <div className="text-center opacity-40 py-10 text-xl border border-[rgba(255,255,255,0.1)] rounded-xl">Queue is empty</div>
                  )}
              </div>
          </div>
      </div>

      {/* Ticker Tape Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-[#B76E79] text-[#1C1C1C] flex items-center overflow-hidden font-medium border-t border-[rgba(255,255,255,0.2)]">
          <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] px-4 -ml-2">
              <span className="mx-8">—</span> Welcome to Hair X Studio 
              <span className="mx-8">—</span> Google Review Rating: 4.4 ⭐ 
              <span className="mx-8">—</span> Premium Services starting at ₹150 
              <span className="mx-8">—</span> Ask your stylist about our new Keratin Packages
              <span className="mx-8">—</span> Welcome to Hair X Studio 
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
      </div>

    </main>
  );
}
