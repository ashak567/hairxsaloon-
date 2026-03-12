'use client';
import React, { useState } from 'react';

// Default credentials — change via environment variable for production
const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin123';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        onLogin();
      } else {
        setError('Invalid username or password.');
        setLoading(false);
      }
    }, 600);
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
                className="input-elegant"
                placeholder="admin"
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
                className="input-elegant"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B76E79] text-[#0d0d0d] font-medium py-3 rounded-xl uppercase tracking-widest text-sm transition-all hover:bg-[#F5EFE7] disabled:opacity-50 disabled:cursor-wait mt-2"
            >
              {loading ? 'Authenticating…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs opacity-30 mt-6">Default: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}
