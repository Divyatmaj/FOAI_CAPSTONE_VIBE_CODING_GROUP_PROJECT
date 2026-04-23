import { useState } from 'react';
import useAppStore from '../store/useAppStore';

const callAI = async (prompt, system = '', key, model, timeoutMs = 20000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Smart Study Assistant+',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'anthropic/claude-3.5-sonnet',
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt },
        ],
        max_tokens: 1500,
      }),
      signal: controller.signal,
    });

    clearTimeout(id);

    // 🔴 Handle API errors properly
    if (!response.ok) {
      let errData = {};
      try {
        errData = await response.json();
      } catch (e) {}

      console.error("🔴 OpenRouter API Error:", errData);

      const message =
        errData?.error?.message ||
        `Request failed with status ${response.status}`;

      throw new Error(message);
    }

    const data = await response.json();

    return data?.choices?.[0]?.message?.content || '';

  } catch (err) {
    clearTimeout(id);

    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Try again.');
    }

    throw err;
  }
};

const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (prompt, system = '', taskType = 'general') => {
    setLoading(true);
    setError(null);

    try {
      const state = useAppStore.getState();

      const key =
        import.meta.env.VITE_OPENROUTER_API_KEY ||
        state.apiKey ||
        localStorage.getItem('or_key') ||
        '';

      console.log("🔑 API KEY:", key);

      // ✅ Strong validation
      if (!key || key.length < 20) {
        throw new Error('Invalid or missing OpenRouter API key. Please add it in Settings.');
      }

      let selectedModel = 'google/gemma-3-27b-it:free';
      const subj = (state.subject || '').toLowerCase();

      if (taskType === 'flashcards') {
        selectedModel = 'meta-llama/llama-3.3-70b-instruct';
      } else if (subj) {
        if (subj.includes('math') || subj.includes('calculus') || subj.includes('algebra')) {
          selectedModel = 'openai/o3-mini';
        } else if (subj.includes('physic') || subj.includes('mechanic')) {
          selectedModel = 'google/gemini-2.5-pro';
        } else if (subj.includes('chem')) {
          selectedModel = 'anthropic/claude-3-opus';
        }
      }

      let text;

      try {
        console.log("⚡ Trying model:", selectedModel);
        text = await callAI(prompt, system, key, selectedModel, 20000);
      } catch (err) {
        console.warn(`⚠️ Model ${selectedModel} failed: ${err.message}`);

        try {
          console.log("🔁 Fallback → gemma-3-27b-it");
          text = await callAI(prompt, system, key, 'google/gemma-3-27b-it:free', 15000);
        } catch (err2) {
          console.warn("⚠️ Gemma failed:", err2.message);

          console.log("🔁 Final fallback → openrouter/free");
          text = await callAI(prompt, system, key, 'openrouter/free', 25000);
        }
      }

      if (!text) {
        throw new Error('AI returned empty response.');
      }

      return text;

    } catch (e) {
      console.error("❌ FINAL ERROR:", e);
      setError(e.message || 'Something went wrong');
      return '';
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
};

export default useAI;