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

// 🛠️ 核心修复：超强 Base64 清洗器
function decodeBase64(base64: string) {
  // 1. 移除所有非 Base64 字符（空格、换行符等），这是报错的根源
  let clean = base64.replace(/[^A-Za-z0-9+/=_]/g, '');
  
  // 2. 替换 URL 安全字符
  clean = clean.replace(/-/g, '+').replace(/_/g, '/');
  
  // 3. 补全末尾的 padding (=)
  while (clean.length % 4) {
    clean += '=';
  }

  // 4. 安全解码
  const binaryString = atob(clean);
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
    // 这里的地址必须和你 vercel 里的 api 文件路径一致
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'tts', text, voice: voiceName })
    });

    if (!response.ok) {
        // 如果是 429 (Too Many Requests)，提示用户慢一点
        if (response.status === 429) {
            throw new Error("Too fast! Please wait a moment.");
        }
        const errText = await response.text();
        throw new Error(`Server Error (${response.status}): ${errText}`);
    }
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!data.audio) throw new Error("Empty audio data received");

    // 解码并播放
    const pcmData = decodeBase64(data.audio);
    const audioBuffer = createAudioBufferFromPCM(pcmData, ctx, 24000);
    audioCache.set(cacheKey, audioBuffer);
    playBuffer(ctx, audioBuffer);

  } catch (error: any) {
    console.error("Audio Error:", error);
    // 只在非 Base64 错误时弹窗，避免打断体验
    if (!error.message.includes("atob")) {
        alert("⚠️ Audio Error: " + error.message);
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
