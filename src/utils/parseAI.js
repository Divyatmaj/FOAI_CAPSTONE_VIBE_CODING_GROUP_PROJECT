/**
 * Strip markdown code fences (```json ... ```) and safely parse JSON.
 * Falls back to the defaultValue on failure.
 */
export const parseJSON = (text, defaultValue = []) => {
  if (!text) return defaultValue;
  try {
    // Remove ```json ... ``` or ``` ... ``` fences
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    // Try to extract first [...] or {...} block
    const arrMatch = text.match(/\[[\s\S]*\]/);
    const objMatch = text.match(/\{[\s\S]*\}/);
    try {
      if (arrMatch) return JSON.parse(arrMatch[0]);
      if (objMatch) return JSON.parse(objMatch[0]);
    } catch { /* ignore */ }
    return defaultValue;
  }
};
