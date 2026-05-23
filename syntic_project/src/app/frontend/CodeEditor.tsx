'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Plus, History, Settings, Sparkles,
  AlertTriangle, Shield, RefreshCw, BarChart3, Bug,
  ChevronDown, ChevronRight, Copy, Check, Wand2,
  LogOut, Code2, Activity, X, Terminal, Info,
  CheckCircle2, AlertCircle, Zap,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { DashboardView } from './DashboardView';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingsView';
import { useAuditStore } from './component/hook/useAuditStore';
import { runAudit, loadSettings, type FullAuditResult, type LogEntry } from './component/services/aiServices';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

const SEVERITY_STYLE = {
  critical: { badge: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-500', label: 'CRITICAL' },
  high:     { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30', dot: 'bg-orange-400', label: 'HIGH' },
  medium:   { badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400', label: 'MEDIUM' },
  low:      { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400', label: 'LOW' },
};

const PRIORITY_STYLE = {
  high:   { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', label: 'HIGH' },
  medium: { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30', label: 'MEDIUM' },
  low:    { badge: 'bg-gray-500/15 text-gray-400 border-gray-500/30', label: 'LOW' },
};

const CAT_ICONS: Record<string, React.ElementType> = {
  naming: Code2,
  structure: RefreshCw,
  performance: Zap,
  maintainability: Activity,
  typing: Shield,
  'error-handling': AlertTriangle,
  testing: CheckCircle2,
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
      <svg width="96" height="96" className="absolute -rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="text-center">
        <div className="text-2xl font-light" style={{ color }}>{score}</div>
        <div className="text-xs text-gray-500">/100</div>
      </div>
    </div>
  );
}

function IssueCard({ item, type }: { item: any; type: 'bug' | 'security' }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const sev = SEVERITY_STYLE[item.severity as keyof typeof SEVERITY_STYLE] ?? SEVERITY_STYLE.low;

  const copy = () => {
    navigator.clipboard.writeText(item.fix);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-lg border border-white/8 bg-white/3 overflow-hidden">
      <button className="w-full text-left p-3 flex items-start gap-3" onClick={() => setOpen(!open)}>
        <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', sev.dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white text-xs font-medium">{item.type}</span>
            {item.line && <span className="text-gray-500 text-xs">line {item.line}</span>}
            {type === 'security' && item.owasp && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                {item.owasp.split('–')[0].trim()}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn('text-xs px-2 py-0.5 rounded-full border', sev.badge)}>{sev.label}</span>
          {open ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}>
            <div className="px-3 pb-3 border-t border-white/8 pt-3 space-y-2">
              <p className="text-gray-300 text-xs leading-relaxed">{item.description}</p>
              {type === 'security' && item.owasp && (
                <p className="text-xs text-red-400/70">⚠️ {item.owasp}</p>
              )}
              {item.fix && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-green-400 font-medium">💡 Fix Suggestion</span>
                    <button onClick={copy} className="text-gray-500 hover:text-white transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2.5 font-mono text-xs text-green-300 leading-relaxed whitespace-pre-wrap break-words">
                    {item.fix}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RefactorCard({ item }: { item: any }) {
  const [open, setOpen] = useState(false);
  const pr = PRIORITY_STYLE[item.priority as keyof typeof PRIORITY_STYLE] ?? PRIORITY_STYLE.low;
  const CatIcon = CAT_ICONS[item.category] ?? Code2;

  return (
    <div className="rounded-lg border border-white/8 bg-white/3 overflow-hidden">
      <button className="w-full text-left p-3 flex items-start gap-3" onClick={() => setOpen(!open)}>
        <CatIcon className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-medium">{item.title}</p>
          <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{item.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn('text-xs px-2 py-0.5 rounded-full border', pr.badge)}>{pr.label}</span>
          {open ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}>
            <div className="px-3 pb-3 border-t border-white/8 pt-3 space-y-3">
              <p className="text-gray-300 text-xs leading-relaxed">{item.description}</p>
              {item.before && (
                <div>
                  <p className="text-xs text-red-400 mb-1 font-medium">❌ Before</p>
                  <div className="bg-red-950/30 rounded-lg p-2.5 font-mono text-xs text-red-300 leading-relaxed whitespace-pre-wrap break-words border border-red-500/10">
                    {item.before}
                  </div>
                </div>
              )}
              {item.after && (
                <div>
                  <p className="text-xs text-green-400 mb-1 font-medium">✅ After</p>
                  <div className="bg-green-950/30 rounded-lg p-2.5 font-mono text-xs text-green-300 leading-relaxed whitespace-pre-wrap break-words border border-green-500/10">
                    {item.after}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Analysis Log Panel ───────────────────────────────────────────────────────
function LogPanel({ logs }: { logs: LogEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);

  const iconFor = (t: LogEntry['type']) =>
    t === 'error' ? '🔴' : t === 'warn' ? '🟡' : t === 'success' ? '🟢' : '🔵';

  return (
    <div ref={ref} className="flex-1 overflow-y-auto font-mono text-xs p-4 space-y-1.5 bg-black/40">
      {logs.map((log, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-2">
          <span className="text-gray-600 shrink-0 w-16">
            {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="shrink-0">{iconFor(log.type)}</span>
          <span className="text-purple-400 shrink-0">[{log.model}]</span>
          <span className={
            log.type === 'error' ? 'text-red-400' :
            log.type === 'warn' ? 'text-yellow-400' :
            log.type === 'success' ? 'text-green-400' :
            'text-gray-300'
          }>{log.message}</span>
        </motion.div>
      ))}
      {logs.length === 0 && (
        <p className="text-gray-600">Tekan GENERATE REVIEW untuk memulai analisis...</p>
      )}
    </div>
  );
}

// ─── Auto Fix Modal ───────────────────────────────────────────────────────────
function AutoFixModal({ fixedCode, onApply, onClose }: {
  fixedCode: string; onApply: () => void; onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0d0b1e] flex flex-col"
        style={{ maxHeight: '80vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Wand2 className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-white text-sm font-medium">Auto Fixed Code</h3>
              <p className="text-gray-400 text-xs">Dihasilkan oleh Gemini & Llama</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/10">
              {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
            <button onClick={onApply}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors">
              <Wand2 className="w-3.5 h-3.5" /> Apply to Editor
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <Editor
            height="60vh"
            language="typescript"
            theme="vs-dark"
            value={fixedCode}
            options={{
              readOnly: true, minimap: { enabled: false }, fontSize: 12,
              scrollBeyondLastLine: false, automaticLayout: true,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main CodeEditor Component ────────────────────────────────────────────────
export function CodeEditor() {
  const router = useRouter();
  const { saveAudit } = useAuditStore();

  const settings = loadSettings();
  const [code, setCode] = useState(`// Paste kode TypeScript atau JavaScript Anda di sini
async function fetchUserData(userId: string) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = response.json();
  return data;
}
`);

  const [language, setLanguage] = useState<'javascript' | 'typescript'>(
    settings.defaultLanguage ?? 'typescript'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState<FullAuditResult | null>(null);
  const [activeMenu, setActiveMenu] = useState('new-review');
  const [activeTab, setActiveTab] = useState<'overview' | 'bugs' | 'security' | 'refactor' | 'logs'>('overview');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showAutoFix, setShowAutoFix] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pushLog = (entry: LogEntry) => setLogs(prev => [...prev, entry]);

  const handleGenerateReview = async () => {
    if (!code.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    setLogs([]);
    setAuditResult(null);
    setActiveTab('logs');

    try {
      const result = await runAudit(code, language, pushLog);
      setAuditResult(result);
      setActiveTab('overview');

      saveAudit({
        fileName: `audit-${new Date().toISOString().split('T')[0]}.${language === 'typescript' ? 'ts' : 'js'}`,
        score: result.healthScore,
        bugs: result.bugs.length + result.securityIssues.length,
        efficiency: result.efficiency,
        language,
        status: result.healthScore >= 70 ? 'good' : 'needs-improvement',
        code,
        suggestions: result.refactorSuggestions.map(s => ({ id: s.id, description: s.description })),
      });
    } catch (err: any) {
      setError(err?.message || 'Unknown error');
      setActiveTab('logs');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyFix = () => {
    if (auditResult?.fixedCode) {
      setCode(auditResult.fixedCode);
      setShowAutoFix(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  const bugCount = auditResult?.bugs?.length ?? 0;
  const secCount = auditResult?.securityIssues?.length ?? 0;
  const refCount = auditResult?.refactorSuggestions?.length ?? 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'bugs', label: 'Bugs', icon: Bug, count: bugCount },
    { id: 'security', label: 'Security', icon: Shield, count: secCount },
    { id: 'refactor', label: 'Refactor', icon: RefreshCw, count: refCount },
    { id: 'logs', label: 'Logs', icon: Terminal },
  ] as const;

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: 'linear-gradient(180deg, #050609 0%, #1F164B 100%)' }}>
      {/* ── Sidebar ── */}
      <div className="w-48 border-r border-white/10 bg-black/20 flex flex-col shrink-0">
        <div className="p-5 pb-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-white text-base font-semibold">
              Syntic<span className="text-purple-400">.io</span>
            </h1>
          </div>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'new-review', label: 'New Review', icon: Plus },
            { id: 'history', label: 'History', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveMenu(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                activeMenu === id ? 'bg-purple-600/80 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/8">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 text-sm transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeMenu === 'dashboard' && <DashboardView />}
        {activeMenu === 'history' && <HistoryView />}
        {activeMenu === 'settings' && <SettingsView />}

        {activeMenu === 'new-review' && (
          <>
            <div className="border-b border-white/10 bg-black/20 px-5 py-3 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-sm font-semibold">New Code Review</h2>
                  <p className="text-gray-500 text-xs">Analisis mendalam dengan Llama & Gemini</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={language} onChange={(e) => setLanguage(e.target.value as any)}
                    className="bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs focus:outline-none">
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                  <button onClick={handleGenerateReview} disabled={isAnalyzing}
                    className={cn(
                      'px-5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all',
                      isAnalyzing ? 'bg-purple-800/50 text-purple-300' : 'bg-purple-600 hover:bg-purple-500 text-white'
                    )}>
                    {isAnalyzing ? <><Sparkles className="w-3.5 h-3.5 animate-spin" /> ANALYZING...</> : <><Sparkles className="w-3.5 h-3.5" /> GENERATE REVIEW</>}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* ── Result Panel (FIXED SCROLL) ── */}
              <div className="w-[340px] shrink-0 border-r border-white/10 flex flex-col overflow-hidden bg-black/10">
                <div className="flex border-b border-white/10 bg-black/10 shrink-0 overflow-x-auto">
                  {tabs.map((tab: any) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors',
                        activeTab === tab.id ? 'border-purple-500 text-white bg-white/3' : 'border-transparent text-gray-500 hover:text-gray-300'
                      )}>
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                      {tab.count > 0 && <span className="ml-1 px-1.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px]">{tab.count}</span>}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
                  {activeTab === 'overview' && (
                    <div className="p-4 space-y-4 pb-20"> 
                      {auditResult ? (
                        <>
                          {/* APPLY FIX BUTTON - MOVED TO TOP */}
                          {auditResult.fixedCode && (
                            <button onClick={() => setShowAutoFix(true)}
                              className="w-full flex items-center justify-center gap-2 py-3 mb-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-purple-600/30 border border-white/10">
                              <Wand2 className="w-4 h-4" />
                              APPLY AUTO FIX
                            </button>
                          )}

                          <div className="bg-white/4 rounded-xl border border-white/8 p-4">
                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-3">Health Score</p>
                            <div className="flex items-center gap-4">
                              <ScoreRing score={auditResult.healthScore} />
                              <div className="space-y-2 flex-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-gray-400">Efficiency</span>
                                  <span className="text-white">{auditResult.efficiency}/100</span>
                                </div>
                                <div className="h-1 rounded-full bg-white/8">
                                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${auditResult.efficiency}%` }} />
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-gray-400">Complexity</span>
                                  <span className="text-yellow-400 capitalize">{auditResult.complexity}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/4 rounded-xl border border-white/8 p-4">
                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">AI Summary</p>
                            <p className="text-gray-300 text-xs leading-relaxed">{auditResult.summary}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: 'Bugs', v: bugCount, c: 'text-orange-400', bg: 'bg-orange-500/10' },
                              { label: 'Security', v: secCount, c: 'text-red-400', bg: 'bg-red-500/10' },
                              { label: 'Refactor', v: refCount, c: 'text-purple-400', bg: 'bg-purple-500/10' },
                            ].map(s => (
                              <div key={s.label} className={cn('rounded-lg p-3 border border-white/5', s.bg)}>
                                <div className={cn('text-lg font-light', s.c)}>{s.v}</div>
                                <div className="text-gray-500 text-[10px]">{s.label}</div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-2">
                          <Sparkles className="w-8 h-8 opacity-20" />
                          <p className="text-xs">Tekan GENERATE REVIEW untuk memulai</p>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === 'bugs' && <div className="p-4 space-y-3">{auditResult?.bugs.map(b => <IssueCard key={b.id} item={b} type="bug" />)}</div>}
                  {activeTab === 'security' && <div className="p-4 space-y-3">{auditResult?.securityIssues.map(s => <IssueCard key={s.id} item={s} type="security" />)}</div>}
                  {activeTab === 'refactor' && <div className="p-4 space-y-3">{auditResult?.refactorSuggestions.map(r => <RefactorCard key={r.id} item={r} />)}</div>}
                  {activeTab === 'logs' && <LogPanel logs={logs} />}
                </div>
              </div>

              {/* ── Editor ── */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="border-b border-white/10 bg-black/20 px-4 py-2 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400 text-xs">input.{language === 'typescript' ? 'ts' : 'js'}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <Editor height="100%" language={language} theme="vs-dark" value={code} onChange={v => setCode(v || '')}
                    options={{ minimap: { enabled: true }, fontSize: 13, scrollBeyondLastLine: false, automaticLayout: true }} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showAutoFix && auditResult?.fixedCode && (
        <AutoFixModal fixedCode={auditResult.fixedCode} onApply={handleApplyFix} onClose={() => setShowAutoFix(false)} />
      )}
    </div>
  );
}