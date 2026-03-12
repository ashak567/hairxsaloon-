'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface User { id: string; firstName: string; lastName: string; email: string; phone: string; }
interface Appointment {
  _id: string; services: string[]; stylistName: string; date: string; time: string;
  status: string; totalAmount: number; branch: string;
}

const inputCls = 'w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-[#F5EFE7] placeholder-[rgba(245,239,231,0.3)] focus:outline-none focus:border-[#B76E79] transition-colors';

export default function CustomerDashboard() {
  const [mode, setMode] = useState<'signin'|'signup'|'dash'>('signin');
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rescheduleTarget, setRescheduleTarget] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Sign In form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up form state
  const [signupData, setSignupData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
  });

  // Restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('hx_token');
    const savedUser = localStorage.getItem('hx_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setMode('dash');
    }
  }, []);

  // Fetch appointments when in dash mode
  useEffect(() => {
    if (mode === 'dash' && user) {
      fetchAppointments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, user]);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('hx_token');
    try {
      const res = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch { /* ignore */ }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem('hx_token', data.token);
      localStorage.setItem('hx_user', JSON.stringify(data.user));
      setUser(data.user);
      setMode('dash');
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem('hx_token', data.token);
      localStorage.setItem('hx_user', JSON.stringify(data.user));
      setUser(data.user);
      setMode('dash');
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('hx_token');
    localStorage.removeItem('hx_user');
    setUser(null); setAppointments([]); setMode('signin');
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    const token = localStorage.getItem('hx_token');
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'Cancelled' })
    });
    if (res.ok) fetchAppointments();
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget || !newDate || !newTime) return;
    const token = localStorage.getItem('hx_token');
    const res = await fetch(`/api/appointments/${rescheduleTarget}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ date: newDate, time: newTime })
    });
    if (res.ok) { setRescheduleTarget(null); fetchAppointments(); }
  };

  const upcoming = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const past = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  const statusColor = (s: string) => {
    if (s === 'Confirmed') return 'bg-green-500/20 text-green-300';
    if (s === 'Pending') return 'bg-yellow-500/20 text-yellow-300';
    if (s === 'Cancelled') return 'bg-red-500/20 text-red-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  return (
    <main className="min-h-screen pt-32 pb-16 px-4 md:px-8 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── SIGN IN ── */}
          {mode === 'signin' && (
            <motion.div key="signin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h1 className="text-4xl font-serif text-[#F5EFE7] mb-2">Welcome Back</h1>
              <p className="text-sm opacity-50 mb-10">Sign in to view and manage your appointments.</p>
              <div className="glass-card max-w-md p-8 rounded-2xl">
                <form onSubmit={handleSignIn} className="space-y-4">
                  {error && <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">{error}</p>}
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className={inputCls} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Password</label>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                      className={inputCls} placeholder="••••••••" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#B76E79] text-[#0d0d0d] font-medium py-3 rounded-xl uppercase tracking-widest text-sm hover:bg-[#F5EFE7] transition-colors mt-2">
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
                <p className="text-center text-sm opacity-60 mt-6">
                  New here?{' '}
                  <button onClick={() => { setMode('signup'); setError(''); }}
                    className="text-[#B76E79] hover:underline">Create an account</button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── SIGN UP ── */}
          {mode === 'signup' && (
            <motion.div key="signup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h1 className="text-4xl font-serif text-[#F5EFE7] mb-2">Create Account</h1>
              <p className="text-sm opacity-50 mb-10">Join Hair X Studio to track and manage your bookings.</p>
              <div className="glass-card max-w-md p-8 rounded-2xl">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {error && <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">{error}</p>}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">First Name</label>
                      <input type="text" required value={signupData.firstName}
                        onChange={e => setSignupData(p => ({ ...p, firstName: e.target.value }))}
                        className={inputCls} placeholder="Priya" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Last Name</label>
                      <input type="text" required value={signupData.lastName}
                        onChange={e => setSignupData(p => ({ ...p, lastName: e.target.value }))}
                        className={inputCls} placeholder="Sharma" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Phone Number</label>
                    <input type="tel" required value={signupData.phone}
                      onChange={e => setSignupData(p => ({ ...p, phone: e.target.value }))}
                      className={inputCls} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Email Address</label>
                    <input type="email" required value={signupData.email}
                      onChange={e => setSignupData(p => ({ ...p, email: e.target.value }))}
                      className={inputCls} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Password</label>
                    <input type="password" required value={signupData.password}
                      onChange={e => setSignupData(p => ({ ...p, password: e.target.value }))}
                      className={inputCls} placeholder="Min. 6 characters" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Confirm Password</label>
                    <input type="password" required value={signupData.confirmPassword}
                      onChange={e => setSignupData(p => ({ ...p, confirmPassword: e.target.value }))}
                      className={inputCls} placeholder="Repeat password" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#B76E79] text-[#0d0d0d] font-medium py-3 rounded-xl uppercase tracking-widest text-sm hover:bg-[#F5EFE7] transition-colors mt-2">
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
                <p className="text-center text-sm opacity-60 mt-6">
                  Already have an account?{' '}
                  <button onClick={() => { setMode('signin'); setError(''); }}
                    className="text-[#B76E79] hover:underline">Sign In</button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── DASHBOARD ── */}
          {mode === 'dash' && user && (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Welcome bar */}
              <div className="glass-card p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Welcome back</p>
                  <p className="text-xl font-serif text-[#F5EFE7]">{user.firstName} {user.lastName}</p>
                  <p className="text-xs opacity-40 mt-1">{user.email} · {user.phone}</p>
                </div>
                <button onClick={handleLogout}
                  className="px-5 py-2 text-xs border border-[rgba(255,255,255,0.2)] rounded-full hover:border-[#B76E79] hover:text-[#B76E79] transition-colors uppercase tracking-widest">
                  Logout
                </button>
              </div>

              {/* Upcoming */}
              <div>
                <h2 className="text-2xl font-serif text-[#F5EFE7] mb-4">Upcoming Appointments</h2>
                {upcoming.length === 0 ? (
                  <div className="glass-card p-8 rounded-2xl text-center opacity-50">
                    <p className="text-sm">No upcoming appointments.</p>
                    <a href="/book" className="inline-block mt-4 text-[#B76E79] text-sm hover:underline">Book one now →</a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcoming.map(appt => (
                      <div key={appt._id} className="glass-card p-6 rounded-xl border border-[rgba(255,255,255,0.04)] hover:border-[rgba(183,110,121,0.3)] transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-lg font-medium text-[#F5EFE7]">{appt.services.join(', ')}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${statusColor(appt.status)}`}>{appt.status}</span>
                            </div>
                            <p className="text-sm opacity-60">with {appt.stylistName} · {appt.branch}</p>
                            <p className="text-sm text-[#B76E79] mt-1">
                              {new Date(appt.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })} at {appt.time}
                              {appt.totalAmount > 0 && ` · ₹${appt.totalAmount.toLocaleString()}`}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => { setRescheduleTarget(appt._id); setNewDate(appt.date); setNewTime(appt.time); }}
                              className="px-4 py-2 text-xs border border-[rgba(255,255,255,0.2)] rounded-lg hover:border-[#B76E79] hover:text-[#B76E79] transition-colors uppercase tracking-wide">
                              Reschedule
                            </button>
                            <button onClick={() => handleCancel(appt._id)}
                              className="px-4 py-2 text-xs border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors uppercase tracking-wide">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past */}
              {past.length > 0 && (
                <div>
                  <h2 className="text-2xl font-serif text-[#F5EFE7] mb-4">Past Appointments</h2>
                  <div className="space-y-3">
                    {past.map(appt => (
                      <div key={appt._id} className="glass-card p-5 rounded-xl opacity-60">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{appt.services.join(', ')}</p>
                            <p className="text-xs opacity-60 mt-1">
                              {appt.date} at {appt.time} · {appt.stylistName}
                              {appt.totalAmount > 0 && ` · ₹${appt.totalAmount.toLocaleString()}`}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColor(appt.status)}`}>{appt.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleTarget && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-md p-8 rounded-2xl">
              <h2 className="text-2xl font-serif mb-6">Reschedule Appointment</h2>
              <form onSubmit={handleReschedule} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">New Date</label>
                  <input type="date" required value={newDate} onChange={e => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">New Time</label>
                  <select value={newTime} onChange={e => setNewTime(e.target.value)} className={inputCls}>
                    {['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30',
                      '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setRescheduleTarget(null)}
                    className="flex-1 py-3 border border-[rgba(255,255,255,0.15)] rounded-xl text-sm hover:border-[#B76E79] transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 bg-[#B76E79] text-[#0d0d0d] rounded-xl text-sm font-medium hover:bg-[#F5EFE7] transition-colors">
                    Confirm
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
