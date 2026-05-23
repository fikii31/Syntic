/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';

export interface AuditRecord {
  id: string;
  fileName: string;
  date: string;
  score: number;
  bugs: number;
  efficiency: number;
  language: 'javascript' | 'typescript';
  status: string;
  code: string;
  suggestions: Array<{
    id: number;
    description: string;
  }>;
}

const STORAGE_KEY = 'syntic_audit_history';

export function useAuditStore() {
  const [auditHistory, setAuditHistory] = useState<AuditRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAuditHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse audit history:', error);
      }
    }
  }, []);

  const saveAudit = (audit: Omit<AuditRecord, 'id' | 'date'>) => {
    const newAudit: AuditRecord = {
      ...audit,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    setAuditHistory(prev => {
      const updated = [newAudit, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newAudit;
  };

  const getRecentAudits = (limit = 10) => {
    return auditHistory.slice(0, limit);
  };

  const getAuditById = (id: string) => {
    return auditHistory.find(audit => audit.id === id);
  };

  const deleteAudit = (id: string) => {
    const updated = auditHistory.filter(audit => audit.id !== id);
    setAuditHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getStatistics = () => {
    if (auditHistory.length === 0) {
      return {
        totalAudits: 0,
        averageScore: 0,
        totalIssues: 0,
        trend: 0
      };
    }

    const totalScore = auditHistory.reduce((sum, audit) => sum + audit.score, 0);
    const totalIssues = auditHistory.reduce((sum, audit) => sum + audit.bugs, 0);
    
    // Calculate trend (compare latest 5 vs previous 5)
    const recent = auditHistory.slice(0, 5);
    const previous = auditHistory.slice(5, 10);
    const recentAvg = recent.reduce((sum, a) => sum + a.score, 0) / recent.length;
    const previousAvg = previous.length > 0 
      ? previous.reduce((sum, a) => sum + a.score, 0) / previous.length 
      : recentAvg;
    
    return {
      totalAudits: auditHistory.length,
      averageScore: Number((totalScore / auditHistory.length).toFixed(1)),
      totalIssues,
      trend: Number(((recentAvg - previousAvg) / previousAvg * 100).toFixed(1))
    };
  };

  return {
    auditHistory,
    saveAudit,
    getRecentAudits,
    getAuditById,
    deleteAudit,
    getStatistics
  };
}