'use client';

import { useRouter } from 'next/navigation';
import { Shield, Bug, RefreshCw, Activity, AlertTriangle, CheckCircle2, XCircle, Code2, FileCode, ArrowLeft, LogOut } from 'lucide-react';

export function Dashboard() {
  const router = useRouter();
  const healthScore = 87;

  const refactorSuggestions = [
    { id: 1, file: 'input.ts', line: 45, issue: 'Function complexity too high', suggestion: 'Break down validateUserInput into smaller functions', severity: 'medium' },
    { id: 2, file: 'input.ts', line: 123, issue: 'Duplicate code detected', suggestion: 'Extract repeated logic into reusable function', severity: 'low' },
    { id: 3, file: 'input.ts', line: 78, issue: 'Inefficient error handling', suggestion: 'Implement centralized error handler', severity: 'medium' },
  ];

  const securityIssues = [
    { id: 1, file: 'input.ts', line: 34, issue: 'Potential XSS vulnerability', description: 'User input not sanitized before rendering', severity: 'critical' },
    { id: 2, file: 'input.ts', line: 12, issue: 'Hardcoded API key detected', description: 'API key should be stored in environment variables', severity: 'high' },
  ];

  const potentialBugs = [
    { id: 1, file: 'input.ts', line: 56, issue: 'Race condition detected', description: 'Async state updates may cause inconsistent state', severity: 'high' },
    { id: 2, file: 'input.ts', line: 23, issue: 'Null pointer exception', description: 'Missing null check before accessing property', severity: 'medium' },
    { id: 3, file: 'input.ts', line: 89, issue: 'Memory leak potential', description: 'Event listener not cleaned up properly', severity: 'medium' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  return (
    <div className="min-h-screen overflow-auto" style={{ background: 'linear-gradient(180deg, #050609 0%, #1F164B 100%)' }}>
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/editor')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Editor</span>
            </button>
            <div className="flex items-center gap-3">
              <Code2 className="w-8 h-8 text-purple-400" />
              <h1 className="text-white text-2xl">Syntic.io</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      <div className="min-h-full px-8 py-12">
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-white text-3xl mb-2">Audit Results</h2>
          <p className="text-gray-400">Detailed analysis of your code quality and security</p>
        </div>

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Health Score Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <h2 className="text-white">Code Health Score</h2>
                </div>
                <p className="text-gray-400 text-sm">Overall codebase quality assessment</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`text-5xl ${getScoreColor(healthScore)}`}>{healthScore}</div>
                  <div className="text-gray-400 text-sm">/ 100</div>
                </div>
                <div className="w-24 h-24 rounded-full border-8 border-green-400/30 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="text-blue-400 text-2xl">{refactorSuggestions.length}</div>
                <div className="text-gray-400 text-sm mt-1">Refactor Suggestions</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="text-red-400 text-2xl">{securityIssues.length}</div>
                <div className="text-gray-400 text-sm mt-1">Security Issues</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="text-yellow-400 text-2xl">{potentialBugs.length}</div>
                <div className="text-gray-400 text-sm mt-1">Potential Bugs</div>
              </div>
            </div>
          </div>

          {/* Refactor Suggestions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="w-5 h-5 text-blue-400" />
              <h2 className="text-white">Refactor Suggestions</h2>
            </div>
            <div className="space-y-3">
              {refactorSuggestions.map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-gray-400" />
                      <span className="text-purple-300 text-sm font-mono">{item.file}:{item.line}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(item.severity)}`}>
                      {item.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-white mb-1">{item.issue}</div>
                  <div className="text-gray-400 text-sm">{item.suggestion}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Vulnerabilities */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-red-400" />
              <h2 className="text-white">Security Vulnerabilities</h2>
            </div>
            <div className="space-y-3">
              {securityIssues.map((item) => (
                <div key={item.id} className="bg-white/5 border border-red-500/20 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-purple-300 text-sm font-mono">{item.file}:{item.line}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(item.severity)}`}>
                      {item.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-white mb-1">{item.issue}</div>
                  <div className="text-gray-400 text-sm">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Potential Bugs */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bug className="w-5 h-5 text-yellow-400" />
              <h2 className="text-white">Potential Bugs</h2>
            </div>
            <div className="space-y-3">
              {potentialBugs.map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-purple-300 text-sm font-mono">{item.file}:{item.line}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(item.severity)}`}>
                      {item.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-white mb-1">{item.issue}</div>
                  <div className="text-gray-400 text-sm">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
