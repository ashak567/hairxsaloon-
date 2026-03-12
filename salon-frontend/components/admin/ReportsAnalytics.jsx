'use client';
import React from 'react';

export default function ReportsAnalytics() {
  
  const metrics = [
    { label: 'Today\'s Revenue', value: '₹24,500', trend: '+12%', color: 'text-green-400' },
    { label: 'Appointments', value: '38', trend: '+4', color: 'text-green-400' },
    { label: 'Walk-ins', value: '12', trend: '-2', color: 'text-red-400' },
    { label: 'Avg Serve Time', value: '45 min', trend: '-5 min', color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
             <div key={i} className="glass-card p-6 rounded-2xl border border-[rgba(255,255,255,0.05)] text-center">
                 <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{m.label}</p>
                 <p className="text-3xl font-serif text-white mb-2">{m.value}</p>
                 <p className={`text-xs font-medium ${m.color}`}>{m.trend} vs yesterday</p>
             </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Services */}
          <div className="glass-card p-8 rounded-2xl border border-[rgba(255,255,255,0.05)]">
              <h3 className="text-xl font-serif mb-6 border-b border-[rgba(255,255,255,0.1)] pb-4">Most Popular Services</h3>
              <div className="space-y-4">
                  {[
                    { name: 'Keratin Treatment', count: 45, rev: '₹180k' },
                    { name: 'Bridal Makeup', count: 12, rev: '₹150k' },
                    { name: 'Men\'s Haircut', count: 120, rev: '₹30k' },
                    { name: 'Hair Spa', count: 85, rev: '₹76k' }
                  ].map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                              <span className="w-6 text-center opacity-40">#{i+1}</span>
                              <span className="text-white">{s.name}</span>
                          </div>
                          <div className="flex gap-6 opacity-80 text-right">
                              <span className="w-12">{s.count}x</span>
                              <span className="w-16 text-[#B76E79]">{s.rev}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Stylist Performance */}
          <div className="glass-card p-8 rounded-2xl border border-[rgba(255,255,255,0.05)]">
              <h3 className="text-xl font-serif mb-6 border-b border-[rgba(255,255,255,0.1)] pb-4">Top Stylists (This Week)</h3>
              <div className="space-y-6">
                  {[
                    { name: 'Arun Kumar', rating: '4.9', clients: 42 },
                    { name: 'Priya Sharma', rating: '4.8', clients: 38 },
                    { name: 'Vikram Singh', rating: '4.7', clients: 35 }
                  ].map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-[rgba(183,110,121,0.1)] text-[#B76E79] flex items-center justify-center font-bold text-xs">{s.name.charAt(0)}</div>
                              <div>
                                  <p className="font-medium text-white">{s.name}</p>
                                  <p className="text-xs opacity-60">★ {s.rating} avg</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="font-medium">{s.clients}</p>
                              <p className="text-[10px] uppercase tracking-wider opacity-50">Clients</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
