/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Bot, Globe, Zap, Save, CheckCircle2, Cpu } from 'lucide-react';
import { loadSettings, saveSettings, type SynticSettings } from '../frontend/component/services/aiServices';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-purple-600' : 'bg-white/10'}`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-6' : ''}`} />
    </button>
  );
}

export function SettingsView() {
  const [settings, setSettings] = useState<SynticSettings>({
    groqApiKey: '', geminiApiKey: '', // Tetap ada di state agar tidak error, tapi tidak ditampilkan
    preferredModel: 'both', defaultLanguage: 'typescript',
    uiLanguage: 'id', strictMode: false, autoSave: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const update = <K extends keyof SynticSettings>(key: K, value: SynticSettings[K]) => {
    setSettings((prev: SynticSettings) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const modelOptions: { value: SynticSettings['preferredModel']; label: string; desc: string }[] = [
    { value: 'both', label: '⚡ Dual AI (Recommended)', desc: 'Llama 3 untuk bug & security + Gemini untuk refactor' },
    { value: 'gemini', label: '✨ Gemini 1.5 Pro only', desc: 'Refactor suggestions, auto-fix, code quality' },
    { value: 'llama', label: '🦙 Llama 3 only', desc: 'Bug detection, security scanning, health score' },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h2 className="text-white text-2xl mb-1">Settings</h2>
        <p className="text-gray-400 text-sm">Konfigurasi preferensi analisis Syntic.io</p>
      </div>

      {/* Info Box: API Key Status */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
        <Cpu className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-300 text-sm font-medium">Server-Side API Active</p>
          <p className="text-blue-400/70 text-xs mt-1">
            Syntic sekarang menggunakan API Key yang dikonfigurasi di server untuk keamanan maksimal. 
            Anda tidak perlu lagi memasukkan key secara manual.
          </p>
        </div>
      </div>

      {/* AI Model Selection */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white text-sm font-medium">AI Model Configuration</h3>
            <p className="text-gray-400 text-xs">Pilih model yang akan digunakan untuk audit</p>
          </div>
        </div>
        <div className="space-y-2">
          {modelOptions.map((opt) => (
            <button key={opt.value} onClick={() => update('preferredModel', opt.value)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-150 ${
                settings.preferredModel === opt.value
                  ? 'bg-purple-600/15 border-purple-500/50'
                  : 'bg-white/3 border-white/8 hover:bg-white/6'
              }`}>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">{opt.label}</span>
                {settings.preferredModel === opt.value && (
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                )}
              </div>
              <p className="text-gray-400 text-xs mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white text-sm font-medium">Language Preferences</h3>
            <p className="text-gray-400 text-xs">Bahasa UI dan default bahasa kode</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-2 block">AI Response Language</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ v: 'id', label: '🇮🇩 Bahasa Indonesia' }, { v: 'en', label: '🇺🇸 English' }].map(({ v, label }) => (
                <button key={v} onClick={() => update('uiLanguage', v as 'id' | 'en')}
                  className={`py-2.5 px-4 rounded-lg border text-sm transition-all ${
                    settings.uiLanguage === v
                      ? 'bg-purple-600/15 border-purple-500/50 text-white'
                      : 'bg-white/3 border-white/8 text-gray-400 hover:bg-white/6'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">Default Code Language</label>
            <select value={settings.defaultLanguage} onChange={(e) => update('defaultLanguage', e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-purple-500">
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analysis Preferences */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white text-sm font-medium">Analysis Preferences</h3>
            <p className="text-gray-400 text-xs">Konfigurasi perilaku audit kode</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: 'strictMode' as const, label: 'Strict Mode', desc: 'Analisis lebih dalam (mungkin lebih lambat)' },
            { key: 'autoSave' as const, label: 'Auto-save Code', desc: 'Simpan kode secara otomatis saat mengetik' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="text-white text-sm">{label}</div>
                <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
              </div>
              <Toggle value={settings[key] as boolean} onChange={(v) => update(key, v)} />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleSave}
        className={`w-full py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
          saved
            ? 'bg-green-600 text-white shadow-green-500/20'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-500/20'
        }`}>
        {saved ? <><CheckCircle2 className="w-5 h-5" /> Settings Berhasil Disimpan!</> : <><Save className="w-5 h-5" /> Simpan Perubahan</>}
      </button>
    </div>
  );
}