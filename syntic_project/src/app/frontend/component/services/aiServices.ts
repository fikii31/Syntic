/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║            SYNTIC.IO — FRONTEND SERVICE LAYER (v2 Secure)                ║
 * ║   Handles communication with internal API and UI State Management        ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

export const SETTINGS_KEY = 'syntic_settings';

export interface SynticSettings {
  groqApiKey: string;      // Llama 3 via Groq
  geminiApiKey: string;    // Gemini 2.5 Flash
  preferredModel: 'gemini' | 'llama' | 'both';
  defaultLanguage: 'typescript' | 'javascript';
  uiLanguage: 'id' | 'en';
  strictMode: boolean;
  autoSave: boolean;
}

export const DEFAULT_SETTINGS: SynticSettings = {
  groqApiKey: '',
  geminiApiKey: '',
  preferredModel: 'both',
  defaultLanguage: 'typescript',
  uiLanguage: 'id',
  strictMode: false,
  autoSave: true,
};

export function loadSettings(): SynticSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: Partial<SynticSettings>): void {
  const current = loadSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
}

// --- Types & Interfaces ---
export interface FullAuditResult {
  healthScore: number;
  efficiency: number;
  summary: string;
  codeQualityNotes: string;
  complexity: string;
  maintainability: string;
  bugs: any[];
  securityIssues: any[];
  refactorSuggestions: any[];
  fixedCode: string;
  modelsUsed: string[];
  analysisMs: number;
}

export type LogEntry = { 
  model: string; 
  message: string; 
  type: 'info' | 'warn' | 'success' | 'error' 
};
export type LogEmitter = (entry: LogEntry) => void;

/**
 * Helper untuk memberikan jeda waktu agar log bisa dinikmati di UI
 */
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Main Orchestrator (Calling Internal API) ---
export async function runAudit(
  code: string,
  language: string,
  onLog: LogEmitter
): Promise<FullAuditResult> {
  const t0 = Date.now();
  const settings = loadSettings();
  // --- Start Progress Logs ---
  onLog({ model: 'Syntic', message: 'Inisialisasi audit keamanan...', type: 'info' });
  await wait(1500); // Jeda biar estetik
  onLog({ model: 'Syntic', message: `Konfigurasi: ${settings.preferredModel.toUpperCase()} | ${language.toUpperCase()}`, type: 'info' });
  // Tampilkan pesan engine mana yang lagi siap-siap
  if (settings.preferredModel === 'both' || settings.preferredModel === 'llama') {
    onLog({ model: 'Llama 3', message: 'Mempersiapkan Security Engine...', type: 'info' });
  }
  if (settings.preferredModel === 'both' || settings.preferredModel === 'gemini') {
    onLog({ model: 'Gemini', message: 'Mempersiapkan Refactor Engine...', type: 'info' });
  }
  await wait(1500);
  onLog({ model: 'Syntic', message: 'Menghubungkan ke secure backend server...', type: 'info' });
  try {
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        language,
        uiLanguage: settings.uiLanguage,
        preferredModel: settings.preferredModel
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Terjadi kesalahan pada backend server');
    }

    const result = await response.json();
    
    // Log dinamis berdasarkan AI yang beneran ngasih jawaban dari backend
    if (result.modelsUsed && result.modelsUsed.length > 0) {
      for (const modelName of result.modelsUsed) {
        onLog({ 
          model: modelName.includes('Llama') ? 'Llama 3' : 'Gemini', 
          message: `Berhasil menerima data dari ${modelName}`, 
          type: 'success' 
        });
        await wait(1500);
      }
    }

    const analysisMs = Date.now() - t0;
    onLog({ 
      model: 'Syntic', 
      message: `Audit sukses dalam ${(analysisMs / 1000).toFixed(1)} detik!`, 
      type: 'success' 
    });

    return {
      ...result,
      analysisMs
    };

  } catch (error: any) {
    onLog({ model: 'Syntic', message: `Audit Gagal: ${error.message}`, type: 'error' });
    throw error;
  }
}