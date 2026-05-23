import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuditStore } from './component/hook/useAuditStore';

export function DashboardView() {
  const { getRecentAudits, getStatistics } = useAuditStore();
  const recentAudits = getRecentAudits(4);
  const stats = getStatistics();
  
  // Generate chart data from recent audits
  const auditHistory = getRecentAudits(6).reverse().map(audit => {
    const date = new Date(audit.date);
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      score: audit.score,
      bugs: audit.bugs,
      efficiency: audit.efficiency
    };
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'good':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'needs-improvement':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h2 className="text-white text-2xl mb-1">Dashboard Overview</h2>
        <p className="text-gray-400 text-sm">Monitor your code quality trends and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Audits</h3>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl text-white mb-1">{stats.totalAudits}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            {stats.totalAudits > 0 ? 'Keep going!' : 'Start analyzing'}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Average Score</h3>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl text-white mb-1">{stats.averageScore || 0}</div>
          <div className={`text-xs flex items-center gap-1 ${stats.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className={`w-3 h-3 ${stats.trend < 0 ? 'rotate-180' : ''}`} />
            {stats.trend > 0 ? '+' : ''}{stats.trend}% trend
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Issues Found</h3>
            <AlertCircle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-3xl text-white mb-1">{stats.totalIssues}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            Total bugs detected
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5">
          <h3 className="text-white text-sm mb-4">Code Quality Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={auditHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a2e', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5">
          <h3 className="text-white text-sm mb-4">Bugs Detected</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={auditHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a2e', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="bugs" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Audits */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5">
        <h3 className="text-white text-sm mb-4">Recent Audits</h3>
        {recentAudits.length > 0 ? (
          <div className="space-y-3">
            {recentAudits.map((audit) => {
              const date = new Date(audit.date);
              const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              
              return (
                <div key={audit.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-mono">{audit.fileName}</div>
                      <div className="text-gray-400 text-xs">{formattedDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-white text-lg">{audit.score}</div>
                      <div className="text-gray-400 text-xs">score</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-xs ${getStatusBadge(audit.status)}`}>
                      {audit.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No audits yet. Start reviewing your code!</p>
          </div>
        )}
      </div>
    </div>
  );
}