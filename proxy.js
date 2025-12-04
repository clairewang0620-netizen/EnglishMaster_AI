import { GoogleGenAI, Modality } from "@google/genai";

export default async function handler(req, res) {
  // 1. CORS 设置 (允许前端跨域访问)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. 检查 API Key
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server API_KEY missing" });
  }

  try {
    const { type, text, voice } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    if (type === 'tts') {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voice || 'Kore' } },
          },
        },
      });
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return res.status(200).json({ audio: audioData });
    }

    if (type === 'explain') {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Explain "${text}" simply in English.`,
        });
        return res.status(200).json({ text: response.text });
    }

    return res.status(400).json({ error: "Invalid type" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
