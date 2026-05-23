'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Code2, Shield, Zap, Bug, BarChart3, RefreshCw,
  Star, Check, Menu, X, ArrowRight, Sparkles, Terminal,
  GitBranch, AlertTriangle, Activity, Lock, Globe, Users,
  TrendingUp, Clock, Award, ChevronDown
} from 'lucide-react';
import { useTheme } from './component/hook/useTheme';
import { ThemeToggle } from './ThemeToggle';
import './component/styles/index.css';

// ─── Utility ───────────────────────────────────────────────────────────────
const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ');

// ─── Animated Counter ──────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Section Wrapper ───────────────────────────────────────────────────────
function FadeInSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}>
      {children}
    </motion.div>
  );
}

// ─── Code lines & audit data ───────────────────────────────────────────────
const codeLines = [
  { indent: 0, tokens: [{ text: 'async function ', color: '#C792EA' }, { text: 'fetchUserData', color: '#82AAFF' }, { text: '(id: ', color: '#CDD3DE' }, { text: 'string', color: '#FFCB6B' }, { text: ') {', color: '#CDD3DE' }] },
  { indent: 1, tokens: [{ text: 'const ', color: '#C792EA' }, { text: 'response ', color: '#CDD3DE' }, { text: '= ', color: '#89DDFF' }, { text: 'await ', color: '#C792EA' }, { text: 'fetch', color: '#82AAFF' }, { text: '(`/api/users/${', color: '#CDD3DE' }, { text: 'id', color: '#F07178' }, { text: '}`);', color: '#CDD3DE' }] },
  { indent: 1, tokens: [{ text: '// ⚠️ Missing error handling', color: '#546E7A' }] },
  { indent: 1, tokens: [{ text: 'return ', color: '#C792EA' }, { text: 'response.json', color: '#82AAFF' }, { text: '();', color: '#CDD3DE' }] },
  { indent: 0, tokens: [{ text: '}', color: '#CDD3DE' }] },
];
const auditResults = [
  { icon: AlertTriangle, color: '#F59E0B', label: 'Missing try/catch block', severity: 'HIGH' },
  { icon: Shield, color: '#EF4444', label: 'No input validation on id', severity: 'CRITICAL' },
  { icon: RefreshCw, color: '#8B5CF6', label: 'Consider using axios/swr', severity: 'SUGGEST' },
];

// ─── Pricing plans ─────────────────────────────────────────────────────────
const plans = [
  { name: 'Starter', price: 'Free', priceNote: 'Forever', highlight: false, cta: 'Get Started Free', features: ['50 audits / month', 'JS & TS support', 'Health Score', 'Basic bug detection', 'Community support'] },
  { name: 'Pro', price: '$19', priceNote: '/ month', highlight: true, cta: 'Start Free Trial', features: ['Unlimited audits', 'AI Refactor with Gemini', 'Security scanning', 'Auto Fix suggestions', 'History & analytics', 'Priority support'] },
  { name: 'Enterprise', price: 'Custom', priceNote: 'Contact us', highlight: false, cta: 'Talk to Sales', features: ['Everything in Pro', 'On-premise deployment', 'SSO / SAML', 'Custom AI model tuning', 'SLA 99.9%', 'Dedicated CSM'] },
];

// ─── Testimonials ──────────────────────────────────────────────────────────
const testimonials = [
  { name: 'Arif Santoso', role: 'Senior Engineer @ Tokopedia', avatar: 'AS', text: 'Syntic.io menemukan 12 celah keamanan di codebase kami yang sudah 3 tahun tidak terdeteksi. Game changer!', stars: 5 },
  { name: 'Maya Putri', role: 'Tech Lead @ Gojek', avatar: 'MP', text: 'Refactor suggestions dari Gemini AI sangat akurat. Tim kami hemat 40% waktu code review setiap sprint.', stars: 5 },
  { name: 'Budi Kurniawan', role: 'CTO @ Startup Fintech', avatar: 'BK', text: 'Health Score yang real-time membantu kami maintain kualitas kode sebelum merge ke production.', stars: 5 },
];

// ─── Feature Card ──────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color, delay, isDark }: {
  icon: React.ElementType; title: string; desc: string; color: string; delay: number; isDark: boolean
}) {
  return (
    <FadeInSection delay={delay}>
      <div className="group relative p-6 rounded-2xl transition-all duration-300 cursor-default h-full"
        style={{
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
          boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
        }}>
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle at 50% 0%, ${color}15 0%, transparent 70%)` }} />
        <div className="relative">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <h3 className="mb-2" style={{ color: isDark ? '#fff' : '#111827' }}>{title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{desc}</p>
        </div>
      </div>
    </FadeInSection>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────
export function LandingPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  // ── Theme tokens ──
  const bg = isDark
    ? 'linear-gradient(180deg, #050609 0%, #1F164B 50%, #050609 100%)'
    : 'linear-gradient(180deg, #f8f6ff 0%, #ede9fe 40%, #f0f4ff 100%)';

  const navScrolledBg = isDark
    ? 'rgba(5, 6, 9, 0.75)'
    : 'rgba(255, 255, 255, 0.85)';

  const navBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const navTextColor = isDark ? '#d1d5db' : '#374151';

  const mobileMenuBg = isDark ? 'rgba(5,6,9,0.95)' : 'rgba(248,246,255,0.98)';

  const headlineColor = isDark ? '#ffffff' : '#111827';
  const mutedColor = isDark ? '#9ca3af' : '#6b7280';
  const subtleColor = isDark ? '#6b7280' : '#9ca3af';

  const statsBorderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const cardShadow = isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)';

  const previewBg = isDark ? 'rgba(13, 10, 30, 0.9)' : 'rgba(255,255,255,0.9)';
  const previewBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const previewChrome = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
  const lineNumColor = isDark ? '#4b5563' : '#9ca3af';

  const sectionAccentBg = (opacity = 0.06) =>
    isDark
      ? `rgba(139,92,246,${opacity})`
      : `rgba(139,92,246,${opacity * 0.5})`;

  const badgeBg = isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.1)';
  const badgeBorder = isDark ? 'rgba(139,92,246,0.35)' : 'rgba(139,92,246,0.3)';
  const badgeColor = isDark ? '#c4b5fd' : '#7c3aed';

  const footerBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  return (
    <div className="min-h-screen overflow-x-hidden transition-colors duration-500" style={{ background: bg }}>

      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? navScrolledBg : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? `1px solid ${navBorder}` : '1px solid transparent',
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg" style={{ fontWeight: 700, letterSpacing: '-0.02em', color: headlineColor }}>
              Syntic<span className="text-purple-500">.io</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[['Features', 'features'], ['How It Works', 'how-it-works'], ['Pricing', 'pricing'], ['Testimonials', 'testimonials']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-sm transition-colors hover:text-purple-500"
                style={{ color: navTextColor }}>
                {label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <button onClick={() => router.push('/login')}
              className="text-sm transition-colors px-4 py-2 hover:text-purple-500"
              style={{ color: navTextColor }}>
              Login
            </button>
            <button onClick={() => router.push('/register')}
              className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} variant="compact" />
            <button className="p-2" style={{ color: headlineColor }} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="md:hidden px-4 py-4 flex flex-col gap-4 border-b"
              style={{ background: mobileMenuBg, backdropFilter: 'blur(20px)', borderColor: navBorder }}>
              {[['Features', 'features'], ['How It Works', 'how-it-works'], ['Pricing', 'pricing'], ['Testimonials', 'testimonials']].map(([label, id]) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="text-sm py-2 text-left hover:text-purple-500 transition-colors"
                  style={{ color: navTextColor }}>
                  {label}
                </button>
              ))}
              <div className="flex flex-col gap-2 pt-2" style={{ borderTop: `1px solid ${navBorder}` }}>
                <button onClick={() => router.push('/login')}
                  className="text-sm py-2.5 text-center rounded-lg transition-colors"
                  style={{ border: `1px solid ${navBorder}`, color: navTextColor }}>
                  Login
                </button>
                <button onClick={() => router.push('/register')}
                  className="bg-purple-600 text-white text-sm py-2.5 text-center rounded-lg">
                  Get Started Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero ── */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" style={{ position: 'relative' }}>
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
            style={{ background: `radial-gradient(circle, ${sectionAccentBg(0.18)} 0%, transparent 70%)` }} />
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full"
            style={{ background: `radial-gradient(circle, rgba(99,102,241,${isDark ? 0.1 : 0.06}) 0%, transparent 70%)` }} />
          <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full"
            style={{ background: `radial-gradient(circle, rgba(168,85,247,${isDark ? 0.08 : 0.05}) 0%, transparent 70%)` }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full mb-8"
            style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor }}>
            <Sparkles className="w-4 h-4" />
            Powered by Llama 3 & Gemini 1.5 Pro
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 leading-tight"
              style={{ fontWeight: 800, letterSpacing: '-0.03em', color: headlineColor }}>
              Audit Kode yang{' '}
              <span className="relative">
                <span className="relative z-10" style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #818CF8 50%, #C4B5FD 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>Lebih Cerdas</span>
                <span className="absolute -inset-1 blur-xl opacity-30 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }} />
              </span>
              <br />dengan AI
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: mutedColor }}>
            Syntic.io menganalisis kode TypeScript & JavaScript Anda secara mendalam — menemukan bug tersembunyi, celah keamanan, dan memberikan saran refactor berbasis AI dalam hitungan detik.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={() => router.push('/register')}
              className="group w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-purple-500/40"
              style={{ fontWeight: 600 }}>
              Mulai Gratis Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => scrollTo('demo')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:text-purple-500"
              style={{ color: navTextColor, border: `1px solid ${navBorder}` }}>
              <Terminal className="w-5 h-5" />
              Lihat Demo
            </button>
          </motion.div>

          {/* Code Preview */}
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}
            id="demo" className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-4 rounded-2xl opacity-25 blur-xl"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }} />
            <div className="relative rounded-2xl overflow-hidden"
              style={{ background: previewBg, backdropFilter: 'blur(20px)', border: `1px solid ${previewBorder}` }}>
              {/* Chrome */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: previewChrome, borderBottom: `1px solid ${previewBorder}` }}>
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs" style={{ color: subtleColor }}>userService.ts — Syntic.io Audit</span>
                <div className="ml-auto">
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-500 border border-purple-500/30">TypeScript</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* Code */}
                <div className="flex-1 p-6 font-mono text-sm" style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)' }}>
                  <div className="text-xs mb-3 flex items-center gap-2" style={{ color: subtleColor }}>
                    <Code2 className="w-3.5 h-3.5" /> Input Code
                  </div>
                  {codeLines.map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.12 }}
                      className="flex items-start gap-4 py-0.5">
                      <span className="text-xs w-5 text-right shrink-0 mt-0.5" style={{ color: lineNumColor }}>{i + 1}</span>
                      <span style={{ paddingLeft: `${line.indent * 20}px` }}>
                        {line.tokens.map((t, j) => (
                          <span key={j} style={{ color: isDark ? t.color : t.color }}>{t.text}</span>
                        ))}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Results */}
                <div className="lg:w-72 p-6">
                  <div className="text-xs mb-3 flex items-center gap-2" style={{ color: subtleColor }}>
                    <Activity className="w-3.5 h-3.5" /> Audit Results
                  </div>
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 }}
                    className="mb-4 p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs" style={{ color: mutedColor }}>Health Score</span>
                      <span className="text-xs text-yellow-500">needs work</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-yellow-500 text-2xl" style={{ fontWeight: 700 }}>62</span>
                      <span className="text-sm mb-0.5" style={{ color: subtleColor }}>/100</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ delay: 1.6, duration: 0.8 }}
                        className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
                    </div>
                  </motion.div>
                  <div className="space-y-2">
                    {auditResults.map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 + i * 0.15 }}
                        className="flex items-center gap-3 p-2.5 rounded-lg border"
                        style={{ borderColor: `${item.color}30`, background: `${item.color}08` }}>
                        <item.icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{item.label}</p>
                          <span className="text-xs" style={{ color: item.color }}>{item.severity}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            className="mt-12 flex flex-col items-center gap-2" style={{ color: subtleColor }}>
            <span className="text-xs">Scroll untuk explore</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16" style={{ borderTop: `1px solid ${statsBorderColor}`, borderBottom: `1px solid ${statsBorderColor}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Lines Analyzed', value: 250, suffix: 'M+', icon: Code2 },
              { label: 'Bugs Detected', value: 1200, suffix: 'K+', icon: Bug },
              { label: 'Active Developers', value: 48, suffix: 'K+', icon: Users },
              { label: 'Avg. Health Score', value: 91, suffix: '%', icon: TrendingUp },
            ].map((stat, i) => (
              <FadeInSection key={stat.label} delay={i * 0.1} className="text-center">
                <stat.icon className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                <div className="text-3xl mb-1" style={{ fontWeight: 700, color: headlineColor }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm" style={{ color: mutedColor }}>{stat.label}</div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full mb-4"
              style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor }}>
              <Zap className="w-4 h-4" /> Fitur Unggulan
            </div>
            <h2 className="text-4xl lg:text-5xl mb-4" style={{ fontWeight: 700, letterSpacing: '-0.02em', color: headlineColor }}>
              Semua yang Anda butuhkan<br />untuk kode berkualitas
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: mutedColor }}>
              Dari deteksi bug otomatis hingga refactoring berbasis AI — Syntic.io hadir sebagai partner coding terpercaya Anda.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard isDark={isDark} icon={BarChart3} color="#8B5CF6" delay={0} title="Health Score" desc="Skor kesehatan kode real-time dari 0–100 berdasarkan kompleksitas, duplikasi, dan best practices." />
            <FeatureCard isDark={isDark} icon={RefreshCw} color="#6366F1" delay={0.1} title="Refactor Suggestions" desc="Saran refactoring cerdas dari Gemini 1.5 Pro untuk membuat kode lebih clean dan maintainable." />
            <FeatureCard isDark={isDark} icon={Shield} color="#EC4899" delay={0.2} title="Security Scanning" desc="Deteksi OWASP Top 10, injection flaws, XSS vulnerabilities, dan celah keamanan lainnya." />
            <FeatureCard isDark={isDark} icon={Bug} color="#F59E0B" delay={0.3} title="Bug Detection" desc="Identifikasi null dereferences, race conditions, memory leaks, dan potential runtime errors." />
            <FeatureCard isDark={isDark} icon={Zap} color="#10B981" delay={0.1} title="Auto Fix" desc="Perbaikan otomatis satu klik untuk issue yang terdeteksi dengan preview diff sebelum apply." />
            <FeatureCard isDark={isDark} icon={GitBranch} color="#3B82F6" delay={0.2} title="History & Tracking" desc="Lacak progress kualitas kode dari waktu ke waktu dengan grafik tren dan perbandingan versi." />
            <FeatureCard isDark={isDark} icon={Globe} color="#A78BFA" delay={0.3} title="Multi Language UI" desc="Interface tersedia dalam Bahasa Indonesia dan English untuk kenyamanan penggunaan." />
            <FeatureCard isDark={isDark} icon={Lock} color="#F472B6" delay={0.4} title="Private & Secure" desc="Kode Anda diproses secara aman dan tidak pernah disimpan di server kami tanpa izin." />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${sectionAccentBg(0.06)} 0%, transparent 70%)` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full mb-4"
              style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor }}>
              <Clock className="w-4 h-4" /> Cara Kerja
            </div>
            <h2 className="text-4xl lg:text-5xl mb-4" style={{ fontWeight: 700, letterSpacing: '-0.02em', color: headlineColor }}>
              Audit kode dalam 3 langkah
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: mutedColor }}>
              Tidak perlu setup rumit. Paste kode Anda dan biarkan AI bekerja.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
            {[
              { step: '01', icon: Code2, color: '#8B5CF6', title: 'Paste atau Ketik Kode', desc: 'Tempelkan kode TypeScript atau JavaScript Anda di Monaco Editor dengan syntax highlighting penuh.' },
              { step: '02', icon: Sparkles, color: '#6366F1', title: 'AI Menganalisis', desc: 'Llama 3 & Gemini 1.5 Pro menganalisis kode Anda secara mendalam dalam hitungan detik.' },
              { step: '03', icon: Award, color: '#A78BFA', title: 'Terima Laporan Lengkap', desc: 'Dapatkan Health Score, daftar bug, celah keamanan, dan saran refactor yang actionable.' },
            ].map((item, i) => (
              <FadeInSection key={item.step} delay={i * 0.15}>
                <div className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 duration-300"
                      style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                      <item.icon className="w-8 h-8" style={{ color: item.color }} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                      style={{ background: item.color, fontWeight: 700 }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="mb-3" style={{ color: headlineColor }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: mutedColor }}>{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Showcase ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <div className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full mb-6"
                style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor }}>
                <Sparkles className="w-4 h-4" /> Dual AI Engine
              </div>
              <h2 className="text-4xl mb-6" style={{ fontWeight: 700, letterSpacing: '-0.02em', color: headlineColor }}>
                Dua AI terbaik,<br />
                <span style={{ background: 'linear-gradient(135deg, #A78BFA, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  satu platform
                </span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: mutedColor }}>
                Syntic.io mengintegrasikan <strong style={{ color: headlineColor }}>Meta Llama 3</strong> untuk analisis bug dan keamanan yang cepat, serta <strong style={{ color: headlineColor }}>Google Gemini 1.5 Pro</strong> untuk saran refactoring yang kontekstual dan mendalam.
              </p>
              <div className="space-y-4">
                {[
                  { ai: 'Llama 3', badge: 'Meta', color: '#3B82F6', use: 'Bug detection, security scanning, runtime analysis' },
                  { ai: 'Gemini 1.5 Pro', badge: 'Google', color: '#10B981', use: 'Code refactoring, architectural suggestions, best practices' },
                ].map(item => (
                  <div key={item.ai} className="flex items-start gap-4 p-4 rounded-xl"
                    style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                      <Sparkles className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm" style={{ fontWeight: 600, color: headlineColor }}>{item.ai}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}30` }}>
                          by {item.badge}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: mutedColor }}>{item.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-8 rounded-3xl opacity-20 blur-2xl"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }} />
                <div className="relative rounded-2xl overflow-hidden"
                  style={{ background: isDark ? 'rgba(13,10,30,0.95)' : 'rgba(255,255,255,0.95)', border: `1px solid ${previewBorder}`, boxShadow: isDark ? 'none' : '0 8px 32px rgba(0,0,0,0.1)' }}>
                  <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${previewBorder}` }}>
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-xs" style={{ color: mutedColor }}>AI Analysis in progress...</span>
                  </div>
                  <div className="p-6 space-y-4 font-mono text-sm">
                    {[
                      { model: '🦙 Llama 3', time: '0.3s', color: '#3B82F6', msg: 'Scanning for security vulnerabilities...' },
                      { model: '🦙 Llama 3', time: '0.8s', color: '#EF4444', msg: '🚨 SQL injection risk detected at line 24' },
                      { model: '✨ Gemini', time: '1.2s', color: '#10B981', msg: 'Analyzing code structure and patterns...' },
                      { model: '✨ Gemini', time: '1.9s', color: '#A78BFA', msg: '💡 Suggest: Extract to repository pattern' },
                      { model: '✨ Gemini', time: '2.1s', color: '#A78BFA', msg: '💡 Apply async/await consistently' },
                      { model: '🦙 Llama 3', time: '2.3s', color: '#F59E0B', msg: '⚠️ Unhandled promise rejection (3 found)' },
                    ].map((log, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.2 }}
                        className="flex items-start gap-3 text-xs">
                        <span className="w-8 shrink-0" style={{ color: subtleColor }}>{log.time}</span>
                        <span className="shrink-0" style={{ color: log.color }}>[{log.model}]</span>
                        <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>{log.msg}</span>
                      </motion.div>
                    ))}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                      className="pt-4" style={{ borderTop: `1px solid ${previewBorder}` }}>
                      <div className="flex items-center gap-2 text-xs text-green-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Analysis complete. Health Score: 62/100
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${sectionAccentBg(0.05)} 0%, transparent 70%)` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full mb-4"
              style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor }}>
              <Star className="w-4 h-4" /> Testimoni
            </div>
            <h2 className="text-4xl mb-4" style={{ fontWeight: 700, letterSpacing: '-0.02em', color: headlineColor }}>
              Dipercaya developer terbaik
            </h2>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeInSection key={t.name} delay={i * 0.1}>
                <div className="p-6 rounded-2xl h-full flex flex-col transition-all duration-300"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: mutedColor }}>{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm text-white"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', fontWeight: 700 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm" style={{ fontWeight: 600, color: headlineColor }}>{t.name}</div>
                      <div className="text-xs" style={{ color: subtleColor }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full mb-4"
              style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor }}>
              <Award className="w-4 h-4" /> Harga
            </div>
            <h2 className="text-4xl lg:text-5xl mb-4" style={{ fontWeight: 700, letterSpacing: '-0.02em', color: headlineColor }}>
              Mulai gratis,<br />scale sesuai kebutuhan
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: mutedColor }}>
              Tidak ada kartu kredit untuk memulai. Upgrade kapan saja.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <FadeInSection key={plan.name} delay={i * 0.1}>
                <div className="relative p-8 rounded-2xl h-full flex flex-col transition-all duration-300"
                  style={{
                    background: plan.highlight
                      ? (isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)')
                      : cardBg,
                    border: plan.highlight ? '1px solid rgba(139,92,246,0.5)' : `1px solid ${cardBorder}`,
                    boxShadow: plan.highlight
                      ? '0 0 32px rgba(139,92,246,0.15)'
                      : cardShadow,
                  }}>
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-4 py-1 rounded-full" style={{ fontWeight: 600 }}>
                      MOST POPULAR
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="mb-4" style={{ color: headlineColor }}>{plan.name}</h3>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl" style={{ fontWeight: 700, color: headlineColor }}>{plan.price}</span>
                      <span className="text-sm mb-1" style={{ color: mutedColor }}>{plan.priceNote}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map(feat => (
                      <li key={feat} className="flex items-center gap-3 text-sm" style={{ color: mutedColor }}>
                        <Check className={cn('w-4 h-4 shrink-0', plan.highlight ? 'text-purple-500' : 'text-green-500')} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => router.push(plan.name === 'Enterprise' ? '#' : '/register')}
                    className={cn('w-full py-3 rounded-xl text-sm transition-all duration-200', plan.highlight ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25' : '')}
                    style={plan.highlight ? { fontWeight: 600 } : { fontWeight: 600, border: `1px solid ${cardBorder}`, color: mutedColor }}>
                    {plan.cta}
                  </button>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <div className="relative p-12 rounded-3xl overflow-hidden"
              style={{
                background: isDark ? 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.15) 100%)' : 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(79,70,229,0.08) 100%)',
                border: '1px solid rgba(139,92,246,0.3)',
              }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center mx-auto mb-6">
                  <Code2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl lg:text-5xl mb-4" style={{ fontWeight: 700, letterSpacing: '-0.02em', color: headlineColor }}>
                  Siap menulis kode<br />yang lebih baik?
                </h2>
                <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: mutedColor }}>
                  Bergabung dengan 48.000+ developer yang sudah menggunakan Syntic.io untuk meningkatkan kualitas kode mereka.
                </p>
                <button onClick={() => router.push('/register')}
                  className="group inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl transition-all shadow-lg shadow-purple-600/35"
                  style={{ fontWeight: 600 }}>
                  Mulai Gratis — Tanpa Kartu Kredit
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${footerBorder}` }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg" style={{ fontWeight: 700, color: headlineColor }}>
                  Syntic<span className="text-purple-500">.io</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: subtleColor }}>
                Platform audit kode AI terdepan untuk developer modern. Powered by Llama 3 & Gemini 1.5 Pro.
              </p>
            </div>
            {[
              { title: 'Produk', items: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Perusahaan', items: ['About', 'Blog', 'Careers', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm mb-4" style={{ fontWeight: 600, color: headlineColor }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.items.map(item => (
                    <li key={item}>
                      <button className="text-sm transition-colors hover:text-purple-500" style={{ color: subtleColor }}>{item}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: `1px solid ${footerBorder}` }}>
            <p className="text-sm" style={{ color: subtleColor }}>© 2025 Syntic.io. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <button key={item} className="text-sm transition-colors hover:text-purple-500" style={{ color: subtleColor }}>{item}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}