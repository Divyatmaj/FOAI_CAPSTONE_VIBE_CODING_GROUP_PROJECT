const key = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
if (!key) throw new Error("Missing OPENROUTER_API_KEY or VITE_OPENROUTER_API_KEY in environment");

const callAI = async (prompt, model) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error('ERROR for', model, response.status, JSON.stringify(err));
    throw new Error('API Error');
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
};

(async () => {
  try {
    const prompt = `Create a study planner from today for "Acids" exam on in 14 days. 2 hours/day.\nReturn ONLY a JSON array: [{"day":1,"date":"YYYY-MM-DD","topics":["..."],"hours":2,"focus":"...","type":"study|revision|practice|rest","done":false}]`;
    const plannerText = await callAI(prompt, "meta-llama/llama-3.3-70b-instruct:free");
    console.log("PLANNER OUTPUT:");
    console.log(plannerText);
    
    // Test parsing
    const parseJSON = (text, defaultValue = []) => {
      if (!text) return defaultValue;
      try {
        const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
        return JSON.parse(cleaned);
      } catch {
        const arrMatch = text.match(/\[[\s\S]*\]/);
        try {
          if (arrMatch) return JSON.parse(arrMatch[0]);
        } catch { }
        return defaultValue;
      }
    };
    
    console.log("PARSED PLANNER:", parseJSON(plannerText));
    
    const notesText = await callAI(`Generate structured concise study notes for:\nSubject: Chemistry\nChapter: Acids\nLevel: intermediate\nSubtopics: all main topics\n\nFormat as markdown with ## headings, bullet points, key terms bolded.`, "meta-llama/llama-3.3-70b-instruct:free");
    console.log("NOTES OUTPUT:", notesText.substring(0, 100));

  } catch (e) {
    console.error(e);
  }
})();
