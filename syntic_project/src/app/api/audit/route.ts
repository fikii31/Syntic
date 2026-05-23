/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import {
  LLAMA_SYSTEM_PROMPT,
  GEMINI_SYSTEM_PROMPT,
  buildLlamaUserPrompt,
  buildGeminiUserPrompt,
  extractJSON,
} from '../prompt';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { code, language, uiLanguage, preferredModel } = await req.json();

    const useLlama = (preferredModel === 'llama' || preferredModel === 'both') && GROQ_API_KEY;
    const useGemini = (preferredModel === 'gemini' || preferredModel === 'both') && GEMINI_API_KEY;

    if (!useLlama && !useGemini) {
      return NextResponse.json({ error: 'No API Keys configured on server' }, { status: 500 });
    }

    // Eksekusi Audit Parallel
    const [llamaResult, geminiResult] = await Promise.all([
      useLlama ? callLlamaServer(code, language, uiLanguage) : Promise.resolve(null),
      useGemini ? callGeminiServer(code, language, uiLanguage) : Promise.resolve(null),
    ]);

    // Merging Logic dengan Fallback yang aman
    const healthScore = llamaResult ? Math.min(100, Math.max(5, Math.round(llamaResult.healthScore ?? 70))) : 70;
    const efficiency = geminiResult ? Math.min(100, Math.max(10, Math.round(geminiResult.efficiency ?? 70))) : 70;
    
    const modelsUsed = [];
    if (useLlama) modelsUsed.push('Llama 3 (Groq)');
    if (useGemini) modelsUsed.push('Gemini 1.5 Pro');

    return NextResponse.json({
      healthScore,
      efficiency,
      summary: llamaResult?.summary || geminiResult?.codeQualityNotes || 'Audit completed.',
      codeQualityNotes: geminiResult?.codeQualityNotes || '',
      complexity: llamaResult?.complexity || 'medium',
      maintainability: llamaResult?.maintainability || 'medium',
      bugs: llamaResult?.bugs ?? [],
      securityIssues: llamaResult?.securityIssues ?? [],
      refactorSuggestions: geminiResult?.refactorSuggestions ?? [],
      fixedCode: geminiResult?.fixedCode || code,
      modelsUsed,
    });

  } catch (error: any) {
    console.error('Audit Route Error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message 
    }, { status: 500 });
  }
}

// Helper untuk parsing JSON yang aman agar tidak kena "Unexpected end of JSON"
function safeJsonParse(text: string) {
  try {
    const cleaned = extractJSON(text);
    if (!cleaned || cleaned.trim() === "") return null;
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Gagal parse JSON dari AI. Teks mentah:", text);
    return null;
  }
}

async function callLlamaServer(code: string, language: string, uiLang: string) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${GROQ_API_KEY}` 
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: LLAMA_SYSTEM_PROMPT + "\nResponse must be valid JSON object." },
          { role: 'user', content: buildLlamaUserPrompt(code, language, uiLang) },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) throw new Error(`Groq API Error: ${response.status}`);
    
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    return safeJsonParse(content) || { healthScore: 70, bugs: [], securityIssues: [], summary: "Error parsing Llama response." };
  } catch (err) {
    console.error("Llama Server Error:", err);
    return null;
  }
}

async function callGeminiServer(code: string, language: string, uiLang: string) {
  try {
    // Gunakan gemini-1.5-pro jika 2.5-pro belum stabil/tersedia di region Anda
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `${GEMINI_SYSTEM_PROMPT}\n\n${buildGeminiUserPrompt(code, language, uiLang)}\n\nIMPORTANT: Return only valid JSON without markdown code blocks.` 
          }]
        }],
        generationConfig: {
          temperature: 0.1,
        }
      }),
    });

    if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return safeJsonParse(content) || { efficiency: 70, refactorSuggestions: [], fixedCode: code };
  } catch (err) {
    console.error("Gemini Server Error:", err);
    return null;
  }
}