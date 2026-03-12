'use client';
import React, { useState } from 'react';

// This would typically be a subcomponent or tab in the AdminDashboard.
// For demonstration of the invoice/billing phase, I'm separating its logic.

export default function InvoiceManagement() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const mockInvoices = [
    { id: 'INV-20260315-001', customer: 'Vipul Gupta', amount: 4720, date: 'Mar 15, 2026', status: 'Paid' },
    { id: 'INV-20260315-002', customer: 'Neha Sharma', amount: 1416, date: 'Mar 15, 2026', status: 'Unpaid' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif">Recent Invoices</h3>
          <button className="bg-[rgba(255,255,255,0.1)] px-4 py-2 rounded-lg text-sm hover:bg-[rgba(255,255,255,0.2)] transition-colors">Generate New</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* List */}
        <div className="md:col-span-1 space-y-3">
           {mockInvoices.map(inv => (
             <div 
                key={inv.id} 
                onClick={() => setSelectedInvoice(inv)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                  selectedInvoice?.id === inv.id 
                     ? 'border-[#B76E79] bg-[rgba(183,110,121,0.05)]' 
                     : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)]'
                }`}
             >
                <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-white">{inv.customer}</span>
                    <span className="text-sm opacity-60">{inv.date}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-serif text-[#B76E79]">₹{inv.amount}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${inv.status === 'Paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {inv.status}
                    </span>
                </div>
             </div>
           ))}
        </div>

        {/* Preview & Print */}
        <div className="md:col-span-2">
           {selectedInvoice ? (
               <div className="bg-white text-black p-8 rounded-xl shadow-lg print-section max-w-lg mx-auto">
                   {/* This section would have print-specific CSS */}
                   <div className="text-center mb-8 border-b pb-6">
                      <h2 className="text-3xl font-serif text-black mb-1">Hair X Studio</h2>
                      <p className="text-sm text-gray-500 font-light tracking-widest uppercase">Premium Family Salon</p>
                      <p className="text-xs text-gray-400 mt-2">Parvatinagar Branch, Ballari, Karnataka 583103</p>
                      <p className="text-xs text-gray-400">GSTIN: 29XXXXX0000X1Z5</p>
                   </div>
                   
                   <div className="flex justify-between text-sm mb-6">
                       <div>
                           <p className="font-bold text-gray-800">Billed To:</p>
                           <p>{selectedInvoice.customer}</p>
                       </div>
                       <div className="text-right">
                           <p><span className="font-bold text-gray-800">Invoice:</span> {selectedInvoice.id}</p>
                           <p><span className="font-bold text-gray-800">Date:</span> {selectedInvoice.date}</p>
                       </div>
                   </div>

                   <table className="w-full text-sm mb-6">
                       <thead>
                           <tr className="border-b border-gray-200">
                               <th className="text-left py-2 text-gray-600">Service</th>
                               <th className="text-right py-2 text-gray-600">Amount</th>
                           </tr>
                       </thead>
                       <tbody>
                           <tr className="border-b border-gray-100">
                               <td className="py-3">Keratin Treatment (Medium)</td>
                               <td className="text-right py-3">₹4000.00</td>
                           </tr>
                           <tr className="border-b border-gray-100">
                               <td className="py-3">Hair Trimming</td>
                               <td className="text-right py-3">₹0.00</td>
                           </tr>
                       </tbody>
                   </table>

                   <div className="flex justify-end text-sm mb-8">
                       <div className="w-48 space-y-2">
                           <div className="flex justify-between text-gray-600">
                               <span>Subtotal</span>
                               <span>₹4000.00</span>
                           </div>
                           <div className="flex justify-between text-gray-600">
                               <span>CGST (9%)</span>
                               <span>₹360.00</span>
                           </div>
                           <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-2">
                               <span>SGST (9%)</span>
                               <span>₹360.00</span>
                           </div>
                           <div className="flex justify-between font-bold text-lg pt-2">
                               <span>Total</span>
                               <span>₹4720.00</span>
                           </div>
                       </div>
                   </div>

                   <button 
                     onClick={handlePrint}
                     className="w-full bg-black text-white font-medium py-3 rounded uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors print:hidden"
                   >
                       Print Invoice
                   </button>
               </div>
           ) : (
               <div className="h-full flex items-center justify-center border border-dashed border-[rgba(255,255,255,0.2)] rounded-xl opacity-50">
                   Select an invoice to preview
               </div>
           )}
        </div>
      </div>
      <style>{`
          @media print {
              body * { visibility: hidden; }
              .print-section, .print-section * { visibility: visible; }
              .print-section { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border-radius: 0; }
              .print\\:hidden { display: none !important; }
          }
      `}</style>
    </div>
  );
}
