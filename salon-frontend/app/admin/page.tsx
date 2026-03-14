'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLogin from '@/components/admin/AdminLogin';

const STYLISTS = ['Arun Kumar', 'Priya Sharma', 'Ravi Naik', 'Divya Reddy', 'Meera Patil', 'Suresh D.'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Appointment {
  _id: string; customerName: string; customerEmail: string; customerPhone: string;
  services: string[]; stylistName: string; date: string; time: string;
  status: string; totalAmount: number; branch: string; gender: string;
}
interface Invoice {
  _id: string; invoiceNumber: string; customerName: string; customerEmail: string;
  date: string; items: { service: string; amount: number }[];
  subtotal: number; cgst: number; sgst: number; total: number; status: string; branch: string;
}
interface ReportData {
  today: { revenue: number; appointments: number; revenueChange: number; appointmentsChange: number };
  totalRevenue: number; totalBookings: number;
  popularServices: { name: string; count: number; revenue: number }[];
  topStylists: { name: string; clients: number }[];
}

function statusColor(s: string) {
  if (s === 'Confirmed') return 'bg-green-500/20 text-green-300';
  if (s === 'Completed') return 'bg-blue-500/20 text-blue-300';
  if (s === 'Pending') return 'bg-yellow-500/20 text-yellow-300';
  if (s === 'Cancelled') return 'bg-red-500/20 text-red-300';
  return 'bg-gray-500/20 text-gray-300';
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('Appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reports, setReports] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  
  // Check for existing session token
  useEffect(() => {
    const token = localStorage.getItem('hx_admin_token');
    if (token) setIsAuthenticated(true);
  }, []);

  // Audio notification tracking
  const prevAppts = useRef<Appointment[]>([]);
  const isFirstLoad = useRef(true);

  // Play a pleasant double-chime for new bookings
  const playNewBookingChime = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1);
    } catch (e) { console.warn("AudioContext requires user interaction first", e); }
  }, []);

  // Play a low downward sweep for cancellations
  const playCancelChime = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
    } catch (e) { console.warn("AudioContext requires user interaction first", e); }
  }, []);

  // Manage modal state
  const [manageAppt, setManageAppt] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [assignStylist, setAssignStylist] = useState('');

  // Invoice preview
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  // Walk-in modal
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinData, setWalkinData] = useState({ name: '', phone: '', email: '', gender: 'Male', service: '', stylist: STYLISTS[0] });

  // Settings modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsData, setSettingsData] = useState({ username: '', password: '' });
  const [settingsStatus, setSettingsStatus] = useState({ loading: false, error: '', success: '' });

  const fetchAll = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const [apptRes, invRes, repRes] = await Promise.all([
      fetch('/api/appointments?all=1'),
      fetch('/api/invoices'),
      fetch('/api/reports'),
    ]);
    
    if (apptRes.ok) {
      const data = await apptRes.json();
      const newAppts: Appointment[] = data.appointments;
      
      // Detect changes for audio notifications
      if (!isFirstLoad.current) {
        const oldIds = prevAppts.current.map(a => a._id);
        const hasNewBooking = newAppts.some(a => !oldIds.includes(a._id));
        
        const hasCancellation = newAppts.some(newA => {
          const oldA = prevAppts.current.find(a => a._id === newA._id);
          return oldA && oldA.status !== 'Cancelled' && newA.status === 'Cancelled';
        });

        if (hasNewBooking) playNewBookingChime();
        else if (hasCancellation) playCancelChime();
      }
      
      prevAppts.current = newAppts;
      isFirstLoad.current = false;
      setAppointments(newAppts);
    }
    
    if (invRes.ok) setInvoices((await invRes.json()).invoices);
    if (repRes.ok) setReports(await repRes.json());
    if (!isSilent) setLoading(false);
  }, [playNewBookingChime, playCancelChime]);

  // Polling loop for real-time updates
  useEffect(() => { 
    if (isAuthenticated) {
      fetchAll(); 
      const interval = setInterval(() => fetchAll(true), 15000); // 15s poll
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchAll]);

  const updateApptStatus = async (id: string, status: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setManageAppt(null);
    fetchAll();
  };



  const assignStylistToAppt = async (id: string, stylistName: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stylistName })
    });
    setAssignTarget(null);
    fetchAll();
  };

  const toggleInvoiceStatus = async (inv: Invoice) => {
    const newStatus = inv.status === 'Paid' ? 'Unpaid' : 'Paid';
    await fetch(`/api/invoices/${inv._id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setPreviewInvoice(null);
    fetchAll(true);
  };

  const addWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);
    await fetch('/api/appointments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: walkinData.name,
        customerEmail: walkinData.email || `walkin-${Date.now()}@hairxstudio.com`,
        customerPhone: walkinData.phone,
        branch: selectedBranch === 'All Branches' ? 'Parvatinagar Branch' : selectedBranch, 
        branchId: selectedBranch === 'All Branches' ? '1' : (selectedBranch.includes('Ashok') ? '2' : '1'),
        gender: walkinData.gender,
        services: [walkinData.service],
        stylistId: walkinData.stylist.toLowerCase().replace(' ', '-'),
        stylistName: walkinData.stylist,
        date: today, time, durationMins: 30,
      })
    });
    setShowWalkinModal(false);
    setWalkinData({ name: '', phone: '', email: '', gender: 'Male', service: '', stylist: STYLISTS[0] });
    fetchAll(true);
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus({ loading: true, error: '', success: '' });
    try {
      const token = localStorage.getItem('hx_admin_token');
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          newUsername: settingsData.username, 
          newPassword: settingsData.password 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');
      
      localStorage.setItem('hx_admin_user', data.username);
      setSettingsStatus({ loading: false, error: '', success: 'Settings updated successfully!' });
      setTimeout(() => setShowSettingsModal(false), 2000);
    } catch (err: any) {
      setSettingsStatus({ loading: false, error: err.message, success: '' });
    }
  };

  const handleWipeData = async (type: 'appointments' | 'invoices') => {
    if (!window.confirm(`Are you absolutely sure you want to delete all ${type}? This action cannot be undone.`)) return;
    
    setSettingsStatus({ loading: true, error: '', success: '' });
    try {
      const token = localStorage.getItem('hx_admin_token');
      const res = await fetch(`/api/admin/reset?type=${type}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to wipe data');
      
      setSettingsStatus({ loading: false, error: '', success: data.message });
      fetchAll(true); // refresh tables instantly
    } catch (err: any) {
      setSettingsStatus({ loading: false, error: err.message, success: '' });
    }
  };

  const tabs = ['Appointments', 'Queue', 'Availability', 'Invoices', 'Reports'];
  const inputCls = 'w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-[#F5EFE7] text-sm focus:outline-none focus:border-[#B76E79] transition-colors';

  const filteredAppointments = selectedBranch === 'All Branches' 
    ? appointments 
    : appointments.filter(a => a.branch === selectedBranch);

  const filteredInvoices = selectedBranch === 'All Branches'
    ? invoices
    : invoices.filter(i => i.branch === selectedBranch);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = filteredAppointments.filter(a => a.date === todayStr && a.status !== 'Cancelled');
  const upcomingAppts = filteredAppointments.filter(a => a.date > todayStr && a.status !== 'Cancelled');

  if (!isAuthenticated) return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-[#F5EFE7] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[#B76E79] uppercase tracking-widest text-xs mb-1">Hair X Studio</p>
            <h1 className="text-3xl font-serif">Staff Portal</h1>
          </div>
          <div className="flex gap-3 items-center">
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] px-4 py-2 rounded-full text-xs uppercase tracking-widest text-[#F5EFE7] focus:outline-none focus:border-[#B76E79]"
            >
              <option value="All Branches" className="bg-[#1a1a1a]">All Branches</option>
              <option value="Parvatinagar Branch" className="bg-[#1a1a1a]">Parvatinagar Branch</option>
              <option value="Ashok Nagar Branch" className="bg-[#1a1a1a]">Ashok Nagar Branch</option>
            </select>
            <button onClick={() => setShowWalkinModal(true)}
              className="bg-[#B76E79] text-[#0d0d0d] px-6 py-2 rounded-full font-medium tracking-wider hover:bg-[#F5EFE7] transition-colors text-sm">
              + Walk-In
            </button>
            <button onClick={() => { fetchAll(); }}
              className="border border-[rgba(255,255,255,0.15)] px-4 py-2 rounded-full text-xs uppercase tracking-widest hover:border-[#B76E79] hover:text-[#B76E79] transition-colors">
              Refresh
            </button>
            <button onClick={() => {
              setSettingsData({ username: localStorage.getItem('hx_admin_user') || '', password: '' });
              setSettingsStatus({ loading: false, error: '', success: '' });
              setShowSettingsModal(true);
            }}
              className="border border-[rgba(255,255,255,0.15)] px-4 py-2 rounded-full text-xs uppercase tracking-widest hover:border-[#B76E79] hover:text-[#B76E79] transition-colors">
              Settings
            </button>
            <button onClick={() => {
              localStorage.removeItem('hx_admin_token');
              localStorage.removeItem('hx_admin_user');
              setIsAuthenticated(false);
            }}
              className="border border-[rgba(255,255,255,0.15)] px-4 py-2 rounded-full text-xs uppercase tracking-widest hover:border-[#B76E79] hover:text-[#B76E79] transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-[rgba(255,255,255,0.08)] mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs font-medium uppercase tracking-widest whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === tab ? 'text-[#B76E79] border-[#B76E79]' : 'text-[#F5EFE7] opacity-50 border-transparent hover:opacity-100'}`}>
              {tab}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl min-h-[500px]">

          {/* ── APPOINTMENTS ── */}
          {activeTab === 'Appointments' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">Appointments {loading && <span className="text-sm opacity-40 font-sans ml-2">Loading...</span>}</h2>

              {/* Today */}
              <h3 className="text-xs uppercase tracking-widest opacity-50 mb-3">Today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
              {todayAppts.length === 0 ? (
                <p className="text-sm opacity-40 mb-8 pl-1">No appointments today.</p>
              ) : (
                <div className="overflow-x-auto mb-8">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.08)] text-xs uppercase tracking-wider opacity-50">
                        <th className="pb-3">Time</th><th className="pb-3">Customer</th>
                        <th className="pb-3">Service</th><th className="pb-3">Stylist</th>
                        <th className="pb-3">Status</th><th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayAppts.sort((a, b) => a.time.localeCompare(b.time)).map(appt => (
                        <tr key={appt._id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                          <td className="py-4 font-medium text-[#B76E79]">{appt.time}</td>
                          <td className="py-4">{appt.customerName}<br /><span className="text-xs opacity-40">{appt.customerPhone}</span></td>
                          <td className="py-4">{appt.services.join(', ')}</td>
                          <td className="py-4">{appt.stylistName}</td>
                          <td className="py-4"><span className={`text-xs px-2 py-1 rounded-full ${statusColor(appt.status)}`}>{appt.status}</span></td>
                          <td className="py-4">
                            <button onClick={() => { setManageAppt(appt); setNewStatus(appt.status); }}
                              className="text-xs border border-[rgba(255,255,255,0.15)] px-3 py-1 rounded hover:border-[#B76E79] hover:text-[#B76E79] transition-colors">
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Upcoming */}
              {upcomingAppts.length > 0 && (
                <>
                  <h3 className="text-xs uppercase tracking-widest opacity-50 mb-3">Upcoming</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[rgba(255,255,255,0.08)] text-xs uppercase tracking-wider opacity-50">
                          <th className="pb-3">Date</th><th className="pb-3">Time</th><th className="pb-3">Customer</th>
                          <th className="pb-3">Service</th><th className="pb-3">Stylist</th><th className="pb-3">Status</th><th className="pb-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingAppts.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map(appt => (
                          <tr key={appt._id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                            <td className="py-3 text-[#B76E79]">{new Date(appt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                            <td className="py-3">{appt.time}</td>
                            <td className="py-3">{appt.customerName}</td>
                            <td className="py-3">{appt.services.join(', ')}</td>
                            <td className="py-3">{appt.stylistName}</td>
                            <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColor(appt.status)}`}>{appt.status}</span></td>
                            <td className="py-3">
                              <button onClick={() => { setManageAppt(appt); setNewStatus(appt.status); }}
                                className="text-xs border border-[rgba(255,255,255,0.15)] px-3 py-1 rounded hover:border-[#B76E79] hover:text-[#B76E79] transition-colors">
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {filteredAppointments.length === 0 && !loading && (
                <div className="text-center py-16 opacity-40">
                  <p className="text-lg">No appointments yet.</p>
                  <p className="text-sm mt-2">Bookings made through the website will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* ── QUEUE ── */}
          {activeTab === 'Queue' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-serif mb-6">Today&apos;s Queue</h2>
                {todayAppts.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length === 0 ? (
                  <p className="text-sm opacity-40">No one in queue today.</p>
                ) : (
                  <div className="space-y-3">
                    {todayAppts
                      .filter(a => a.status === 'Confirmed' || a.status === 'Pending')
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appt, idx) => (
                        <div key={appt._id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-[rgba(183,110,121,0.2)] border border-[#B76E79] flex items-center justify-center text-[#B76E79] font-medium text-sm">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{appt.customerName}</p>
                              <p className="text-xs opacity-50">{appt.services.join(', ')} · {appt.time}</p>
                            </div>
                          </div>
                          <button onClick={() => { setAssignTarget(appt._id); setAssignStylist(appt.stylistName); }}
                            className="text-xs px-3 py-1 border border-[rgba(255,255,255,0.1)] rounded hover:bg-[#B76E79] hover:text-[#0d0d0d] hover:border-[#B76E79] transition-colors">
                            Assign
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-serif mb-6">Stylist Status</h2>
                <div className="grid grid-cols-2 gap-3">
                  {STYLISTS.map((stylist) => {
                    const busy = todayAppts.some(a => a.stylistName === stylist && (a.status === 'Confirmed' || a.status === 'Pending'));
                    const cls = busy ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-green-500/10 border-green-500/30 text-green-300';
                    return (
                      <div key={stylist} className={`border rounded-xl p-4 ${cls}`}>
                        <p className="text-xs opacity-60 mb-1">{stylist}</p>
                        <p className="font-medium text-sm">{busy ? 'Booked' : 'Available'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── AVAILABILITY ── */}
          {activeTab === 'Availability' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">Stylist Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {STYLISTS.map(stylist => (
                  <div key={stylist} className="glass-card p-5 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[rgba(183,110,121,0.2)] flex items-center justify-center text-[#B76E79] font-serif">{stylist[0]}</div>
                      <div>
                        <p className="font-medium text-sm">{stylist}</p>
                        <p className="text-xs opacity-40">Stylist</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {DAYS.map(day => (
                        <div key={day} className="flex items-center gap-3 text-xs">
                          <span className="opacity-50 w-8">{day}</span>
                          <select className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded px-2 py-1 text-xs text-[#F5EFE7]">
                            <option className="bg-[#1a1a1a]">9am – 6pm</option>
                            <option className="bg-[#1a1a1a]">10am – 7pm</option>
                            <option className="bg-[#1a1a1a]">Off</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── INVOICES ── */}
          {activeTab === 'Invoices' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">Invoices</h2>
              {invoices.length === 0 ? (
                <div className="text-center py-16 opacity-40">
                  <p>No invoices yet. They are generated automatically when bookings are made.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.08)] text-xs uppercase tracking-wider opacity-50">
                        <th className="pb-3">Invoice #</th><th className="pb-3">Customer</th>
                        <th className="pb-3">Date</th><th className="pb-3">Total</th>
                        <th className="pb-3">Status</th><th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map(inv => (
                        <tr key={inv._id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                          <td className="py-4 font-mono text-xs text-[#B76E79]">{inv.invoiceNumber}</td>
                          <td className="py-4">{inv.customerName}<br /><span className="text-xs opacity-40">{inv.customerEmail}</span></td>
                          <td className="py-4">{inv.date}</td>
                          <td className="py-4 font-medium">₹{inv.total.toLocaleString()}</td>
                          <td className="py-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${inv.status === 'Paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-4 flex gap-2">
                            <button onClick={() => setPreviewInvoice(inv)}
                              className="text-xs border border-[rgba(255,255,255,0.15)] px-3 py-1 rounded hover:border-[#B76E79] hover:text-[#B76E79] transition-colors">
                              View
                            </button>
                            <button onClick={() => toggleInvoiceStatus(inv)}
                              className={`text-xs border px-3 py-1 rounded transition-colors ${inv.status === 'Paid' ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'}`}>
                              Mark {inv.status === 'Paid' ? 'Unpaid' : 'Paid'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── REPORTS ── */}
          {activeTab === 'Reports' && (
            <div>
              <h2 className="text-2xl font-serif mb-6">Reports & Analytics</h2>
              {!reports ? (
                <p className="opacity-40 text-sm">Loading...</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Today's Revenue", value: `₹${reports.today.revenue.toLocaleString()}`, sub: `${reports.today.revenueChange >= 0 ? '+' : ''}${reports.today.revenueChange}% vs yesterday` },
                      { label: "Today's Bookings", value: reports.today.appointments, sub: `${reports.today.appointmentsChange >= 0 ? '+' : ''}${reports.today.appointmentsChange} vs yesterday` },
                      { label: 'Total Revenue (All Time)', value: `₹${reports.totalRevenue.toLocaleString()}`, sub: 'From paid invoices' },
                      { label: 'Total Bookings', value: reports.totalBookings, sub: 'All time' },
                    ].map(card => (
                      <div key={card.label} className="glass-card p-5 rounded-xl">
                        <p className="text-xs uppercase tracking-widest opacity-50 mb-2">{card.label}</p>
                        <p className="text-2xl font-serif text-[#B76E79]">{card.value}</p>
                        <p className="text-xs opacity-40 mt-1">{card.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-xl">
                      <h3 className="text-base font-serif mb-4">Most Popular Services</h3>
                      {reports.popularServices.length === 0 ? (
                        <p className="text-sm opacity-40">No data yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {reports.popularServices.map((svc, i) => (
                            <div key={svc.name} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-3">
                                <span className="text-xs opacity-40 w-5">#{i + 1}</span>
                                <span>{svc.name}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[#B76E79]">{svc.count}x</span>
                                {svc.revenue > 0 && <span className="text-xs opacity-40 ml-2">₹{svc.revenue.toLocaleString()}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="glass-card p-6 rounded-xl">
                      <h3 className="text-base font-serif mb-4">Top Stylists (All Time)</h3>
                      {reports.topStylists.length === 0 ? (
                        <p className="text-sm opacity-40">No data yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {reports.topStylists.map(s => (
                            <div key={s.name} className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[rgba(183,110,121,0.2)] flex items-center justify-center text-[#B76E79] text-sm font-serif">{s.name[0]}</div>
                                <span className="text-sm">{s.name}</span>
                              </div>
                              <span className="text-sm text-[#B76E79]">{s.clients} clients</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── MANAGE MODAL ── */}
      <AnimatePresence>
        {manageAppt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-md p-8 rounded-2xl">
              <button onClick={() => setManageAppt(null)} className="absolute top-6 right-6 text-2xl opacity-50 hover:opacity-100">&times;</button>
              <h2 className="text-xl font-serif mb-2">Manage Appointment</h2>
              <p className="text-sm opacity-60 mb-6">{manageAppt.customerName} · {manageAppt.services.join(', ')}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Update Status</label>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className={inputCls}>
                    <option className="bg-[#1a1a1a]">Confirmed</option>
                    <option className="bg-[#1a1a1a]">Pending</option>
                    <option className="bg-[#1a1a1a]">Completed</option>
                    <option className="bg-[#1a1a1a]">Cancelled</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setManageAppt(null)}
                    className="flex-1 py-3 border border-[rgba(255,255,255,0.15)] rounded-xl text-sm hover:border-[#B76E79] transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => updateApptStatus(manageAppt._id, newStatus)}
                    className="flex-1 py-3 bg-[#B76E79] text-[#0d0d0d] rounded-xl text-sm font-medium hover:bg-[#F5EFE7] transition-colors">
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ASSIGN STYLIST MODAL ── */}
      <AnimatePresence>
        {assignTarget && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-sm p-8 rounded-2xl">
              <h2 className="text-xl font-serif mb-6">Assign Stylist</h2>
              <select value={assignStylist} onChange={e => setAssignStylist(e.target.value)} className={`${inputCls} mb-4`}>
                {STYLISTS.map(s => <option key={s} className="bg-[#1a1a1a]">{s}</option>)}
              </select>
              <div className="flex gap-3">
                <button onClick={() => setAssignTarget(null)}
                  className="flex-1 py-3 border border-[rgba(255,255,255,0.15)] rounded-xl text-sm">Cancel</button>
                <button onClick={() => assignStylistToAppt(assignTarget, assignStylist)}
                  className="flex-1 py-3 bg-[#B76E79] text-[#0d0d0d] rounded-xl text-sm font-medium hover:bg-[#F5EFE7] transition-colors">Assign</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── INVOICE PREVIEW MODAL ── */}
      <AnimatePresence>
        {previewInvoice && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-[#1a1a1a] w-full max-w-lg p-8 rounded-2xl">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold tracking-widest uppercase">Hair X Studio</h2>
                <p className="text-xs text-gray-500 mt-1">{previewInvoice.branch} · Ballari, Karnataka</p>
              </div>
              <div className="flex justify-between text-sm mb-6">
                <div><p className="font-semibold">Billed To:</p><p>{previewInvoice.customerName}</p><p className="text-gray-500 text-xs">{previewInvoice.customerEmail}</p></div>
                <div className="text-right"><p className="font-semibold">Invoice: {previewInvoice.invoiceNumber}</p><p className="text-gray-500 text-xs">Date: {previewInvoice.date}</p></div>
              </div>
              <table className="w-full text-sm mb-6">
                <thead><tr className="border-b"><th className="text-left pb-2">Service</th><th className="text-right pb-2">Amount</th></tr></thead>
                <tbody>
                  {previewInvoice.items.map((item, i) => (
                    <tr key={i}><td className="py-2">{item.service}</td><td className="py-2 text-right">₹{item.amount.toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t pt-4 text-sm space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{previewInvoice.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>CGST (9%)</span><span>₹{previewInvoice.cgst.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>SGST (9%)</span><span>₹{previewInvoice.sgst.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total</span><span>₹{previewInvoice.total.toLocaleString()}</span></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setPreviewInvoice(null)}
                  className="flex-1 py-3 border rounded-lg text-sm">Close</button>
                <button onClick={() => toggleInvoiceStatus(previewInvoice)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium text-white ${previewInvoice.status === 'Paid' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'} transition-colors`}>
                  Mark {previewInvoice.status === 'Paid' ? 'Unpaid' : 'Paid'}
                </button>
                <button onClick={() => window.print()}
                  className="flex-1 py-3 bg-black text-white rounded-lg text-sm font-medium">Print</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── WALK-IN MODAL ── */}
      <AnimatePresence>
        {showWalkinModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg p-8 rounded-2xl relative">
              <button onClick={() => setShowWalkinModal(false)} className="absolute top-6 right-6 text-2xl opacity-50 hover:opacity-100">&times;</button>
              <h2 className="text-2xl font-serif mb-6">Add Walk-In</h2>
              <form className="space-y-4" onSubmit={addWalkin}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs opacity-60 mb-1 tracking-widest uppercase">Name</label>
                    <input required value={walkinData.name} onChange={e => setWalkinData(p => ({ ...p, name: e.target.value }))}
                      className={inputCls} placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-xs opacity-60 mb-1 tracking-widest uppercase">Phone</label>
                    <input type="tel" required value={walkinData.phone} onChange={e => setWalkinData(p => ({ ...p, phone: e.target.value }))}
                      className={inputCls} placeholder="+91 xxxxx" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs opacity-60 mb-1 tracking-widest uppercase">Email (optional)</label>
                  <input type="email" value={walkinData.email} onChange={e => setWalkinData(p => ({ ...p, email: e.target.value }))}
                    className={inputCls} placeholder="customer@email.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs opacity-60 mb-1 tracking-widest uppercase">Gender</label>
                    <select value={walkinData.gender} onChange={e => setWalkinData(p => ({ ...p, gender: e.target.value }))} className={inputCls}>
                      <option>Male</option><option>Female</option><option>Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs opacity-60 mb-1 tracking-widest uppercase">Stylist</label>
                    <select value={walkinData.stylist} onChange={e => setWalkinData(p => ({ ...p, stylist: e.target.value }))} className={inputCls}>
                      {STYLISTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs opacity-60 mb-1 tracking-widest uppercase">Service</label>
                  <input required value={walkinData.service} onChange={e => setWalkinData(p => ({ ...p, service: e.target.value }))}
                    className={inputCls} placeholder="e.g. Haircut, Beard Trim" />
                </div>
                <button type="submit"
                  className="w-full bg-[#B76E79] text-[#0d0d0d] font-medium py-3 rounded-xl mt-2 uppercase tracking-widest text-sm hover:bg-[#F5EFE7] transition-colors">
                  Add to Queue
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ── SETTINGS MODAL ── */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-sm p-6 relative">
              <button onClick={() => setShowSettingsModal(false)}
                className="absolute top-4 right-4 text-xs opacity-50 hover:opacity-100 hover:text-[#B76E79] transition-colors">
                ✕ CLOSE
              </button>
              <h3 className="text-xl font-serif mb-6 mt-2">Admin Settings</h3>
              
              <form onSubmit={handleUpdateSettings}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Username</label>
                    <input
                      type="text"
                      required
                      value={settingsData.username}
                      onChange={e => setSettingsData(p => ({ ...p, username: e.target.value }))}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-3 text-[#F5EFE7] focus:outline-none focus:border-[#B76E79] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">New Password (Optional)</label>
                    <input
                      type="password"
                      value={settingsData.password}
                      onChange={e => setSettingsData(p => ({ ...p, password: e.target.value }))}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-3 text-[#F5EFE7] focus:outline-none focus:border-[#B76E79] transition-colors text-sm"
                      placeholder="Leave blank to keep unchanged"
                    />
                  </div>
                </div>

                {settingsStatus.error && (
                  <p className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded text-center">
                    {settingsStatus.error}
                  </p>
                )}
                {settingsStatus.success && (
                  <p className="mt-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded text-center">
                    {settingsStatus.success}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={settingsStatus.loading}
                  className="w-full bg-[#B76E79] text-[#0d0d0d] font-medium py-3 rounded-xl mt-6 uppercase tracking-widest text-sm hover:bg-[#F5EFE7] disabled:opacity-50 transition-colors"
                >
                  {settingsStatus.loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-red-500/20">
                <h4 className="text-red-400 text-xs uppercase tracking-widest mb-4 opacity-80 font-medium">Danger Zone</h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleWipeData('appointments')}
                    disabled={settingsStatus.loading}
                    className="w-full bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-medium py-2 rounded-lg text-xs uppercase tracking-widest transition-colors"
                  >
                    Clear Appointments History
                  </button>
                  <button 
                    onClick={() => handleWipeData('invoices')}
                    disabled={settingsStatus.loading}
                    className="w-full bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-medium py-2 rounded-lg text-xs uppercase tracking-widest transition-colors"
                  >
                    Reset Revenue (Clear Invoices)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
