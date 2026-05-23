'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code2, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useTheme } from './component/hook/useTheme';
import { ThemeToggle } from './ThemeToggle';


export function Login() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/editor');
    }
  };

  const bg = isDark
    ? 'linear-gradient(180deg, #050609 0%, #1F164B 100%)'
    : 'linear-gradient(180deg, #f8f6ff 0%, #ede9fe 100%)';
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.85)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const textColor = isDark ? '#ffffff' : '#111827';
  const mutedColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-500" style={{ background: bg }}>
      {/* Theme Toggle top-right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      <div className="w-full max-w-md px-6">
        <button onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm mb-8 transition-colors group hover:text-purple-500"
          style={{ color: mutedColor }}>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Syntic.io
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Code2 className="w-12 h-12 text-purple-500" />
            <h1 className="text-4xl" style={{ color: textColor }}>Syntic<span className="text-purple-500">.io</span></h1>
          </div>
          <p style={{ color: mutedColor }}>Code Audit Platform</p>
        </div>

        <div className="backdrop-blur-sm rounded-xl p-8" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? 'none' : '0 8px 32px rgba(0,0,0,0.08)' }}>
          <h2 className="mb-6 text-center" style={{ color: textColor }}>Login to Your Account</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm block mb-2" style={{ color: mutedColor }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: mutedColor }} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-purple-400 transition-colors"
                  style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textColor }}
                  placeholder="your@email.com" required
                />
              </div>
            </div>

            <div>
              <label className="text-sm block mb-2" style={{ color: mutedColor }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: mutedColor }} />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-purple-400 transition-colors"
                  style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textColor }}
                  placeholder="••••••••" required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-lg py-3 transition-colors">
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm" style={{ color: mutedColor }}>Dont have an account? </span>
            <button onClick={() => router.push('/register')} className="text-purple-500 hover:text-purple-400 text-sm">
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}