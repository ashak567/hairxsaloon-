'use client';
import React, { useState } from 'react';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      localStorage.setItem('hx_admin_token', data.token);
      localStorage.setItem('hx_admin_user', data.username);
      onLogin();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-4">Secure Access</p>
          <h1 className="text-4xl font-serif text-[#F5EFE7]">Staff Portal</h1>
          <p className="opacity-40 text-sm mt-3">Hair X Studio · Management System</p>
        </div>

        <div className="glass-card p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-3 text-[#F5EFE7] focus:outline-none focus:border-[#B76E79] transition-colors"
                placeholder="Manager"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-3 text-[#F5EFE7] focus:outline-none focus:border-[#B76E79] transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B76E79] text-[#0d0d0d] font-medium py-3 rounded-xl uppercase tracking-widest text-sm transition-all hover:bg-[#F5EFE7] disabled:opacity-50 disabled:cursor-wait mt-2"
            >
              {loading ? 'Authenticating…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs opacity-40 mt-6 leading-relaxed">
            First-time login? The credentials you enter here will automatically become the permanent master Admin account.
          </p>
        </div>
      </div>
    </div>
  );
}
