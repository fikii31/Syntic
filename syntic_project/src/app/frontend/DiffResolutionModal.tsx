import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

export interface DiffResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFix: (fixedCode: string) => void;
  originalCode: string;
  fixedCode: string;
  language: string;
  suggestions: string[];
}

export default function DiffResolutionModal({
  isOpen,
  onClose,
  onApplyFix,
  originalCode,
  fixedCode,
  language,
  suggestions,
}: DiffResolutionModalProps) {
  
  // Kalau modal nggak dibuka, jangan render apa-apa
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1117]/95 backdrop-blur-sm flex flex-col font-sans transition-all duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#161b22] shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-wide">AI Code Resolution</h2>
          <p className="text-sm text-gray-400 mt-1">
            Bandingkan kode asli lo dengan hasil optimasi dari AI engine.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Tombol Batal / Tutup */}
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-transparent hover:bg-gray-800 text-gray-300 text-sm font-medium rounded-md border border-gray-700 transition-all"
          >
            Tutup
          </button>
          
          {/* Tombol Terapkan (Apply) */}
          <button 
            onClick={() => onApplyFix(fixedCode)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md shadow-md shadow-blue-900/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Terapkan Perbaikan
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT (SPLIT VIEW) --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Kiri: Monaco Diff Editor */}
        <div className="w-3/4 h-full border-r border-gray-800 relative">
          {/* Label untuk Original vs Fixed */}
          <div className="absolute top-0 inset-x-0 flex text-xs text-gray-500 bg-[#1e1e1e] border-b border-gray-800 z-10 pointer-events-none">
            <div className="w-1/2 px-4 py-1 text-red-400/80">Original Code</div>
            <div className="w-1/2 px-4 py-1 border-l border-gray-800 text-green-400/80">AI Optimized Code</div>
          </div>
          
          <div className="h-full pt-6">
            <DiffEditor
              language={language}
              theme="vs-dark"
              original={originalCode}
              modified={fixedCode}
              options={{
                renderSideBySide: true,
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          </div>
        </div>

        {/* Kanan: Sidebar Penjelasan (Refactor Suggestions) */}
        <div className="w-1/4 h-full bg-[#161b22] flex flex-col">
          <div className="p-5 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-blue-400">⚡</span> Logika Perbaikan
            </h3>
          </div>
          
          <div className="p-5 overflow-y-auto flex-1">
            {suggestions && suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-[#0d1117] border border-gray-800/60 p-4 rounded-lg hover:border-blue-500/30 transition-colors">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <p className="text-sm text-gray-500 italic">
                  AI tidak memberikan catatan spesifik. Perubahan biasanya difokuskan pada efisiensi sintaks dan perbaikan keamanan standar.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}