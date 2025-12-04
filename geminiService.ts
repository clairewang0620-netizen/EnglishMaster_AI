// services/geminiService.ts

// 1. 音频缓存
const audioCache = new Map<string, AudioBuffer>();
let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass({ sampleRate: 24000 });
  }
  return audioContext;
}

function createAudioBufferFromPCM(data: Uint8Array, ctx: AudioContext, sampleRate: number = 24000): AudioBuffer {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

// 🛠️ 修复核心：增强版 Base64 解码器
function decodeBase64(base64: string) {
  // 1. 替换 URL 安全字符 (- 转 +, _ 转 /)
  let cleanBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  
  // 2. 补全 padding (=)
  while (cleanBase64.length % 4) {
    cleanBase64 += '=';
  }

  // 3. 解码
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const playTextToSpeech = async (text: string, voiceName: string = 'Kore'): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') { try { await ctx.resume(); } catch (e) {} }

  const cacheKey = `${text}-${voiceName}`;
  if (audioCache.has(cacheKey)) {
    playBuffer(ctx, audioCache.get(cacheKey)!);
    return;
  }

  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'tts', text, voice: voiceName })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server Error: ${response.status} - ${errText}`);
    }
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!data.audio) throw new Error("No audio data received");

    // 调用增强版解码
    const pcmData = decodeBase64(data.audio);
    const audioBuffer = createAudioBufferFromPCM(pcmData, ctx, 24000);
    
    audioCache.set(cacheKey, audioBuffer);
    playBuffer(ctx, audioBuffer);

  } catch (error: any) {
    console.error("Audio Error:", error);
    // 这里不再弹窗打扰用户，改为控制台输出，除非是严重错误
    if (error.message.includes("atob")) {
        alert("Audio decoding failed. Please try again.");
    }
  }
};

function playBuffer(ctx: AudioContext, buffer: AudioBuffer) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
}

export const generateExplanation = async (phrase: string): Promise<string> => {
    try {
        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'explain', text: phrase })
        });
        const data = await response.json();
        return data.text || "No explanation.";
    } catch (e) {
        return "Thinking failed.";
    }
}
