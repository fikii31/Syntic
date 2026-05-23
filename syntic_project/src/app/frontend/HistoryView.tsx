/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { FileCode, Calendar, TrendingUp, Filter, Search } from 'lucide-react';
import { useAuditStore } from '././component/hook/useAuditStore';
import '../frontend/component/styles/index.css';

export function HistoryView() {
  const { auditHistory } = useAuditStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

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

  const filteredHistory = auditHistory.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h2 className="text-white text-2xl mb-1">Audit History</h2>
        <p className="text-gray-400 text-sm">View all your previous code audits and their results</p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="needs-improvement">Needs Improvement</option>
        </select>
      </div>

      {/* History Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 text-xs uppercase px-5 py-3">File Name</th>
                <th className="text-left text-gray-400 text-xs uppercase px-5 py-3">Date</th>
                <th className="text-left text-gray-400 text-xs uppercase px-5 py-3">Language</th>
                <th className="text-center text-gray-400 text-xs uppercase px-5 py-3">Score</th>
                <th className="text-center text-gray-400 text-xs uppercase px-5 py-3">Bugs</th>
                <th className="text-center text-gray-400 text-xs uppercase px-5 py-3">Efficiency</th>
                <th className="text-left text-gray-400 text-xs uppercase px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => {
                const date = new Date(item.date);
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                
                return (
                  <tr 
                    key={item.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm font-mono">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400 text-sm">{formattedDate}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-gray-300 text-sm capitalize">{item.language}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-lg ${getScoreColor(item.score)}`}>{item.score}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-yellow-400 text-sm">{item.bugs}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-blue-400 text-sm">{item.efficiency}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full border text-xs ${getStatusBadge(item.status)}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <FileCode className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
          <p className="text-gray-400">No audit history found</p>
        </div>
      )}
    </div>
  );
}