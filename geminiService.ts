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

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
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

    // --- 诊断代码开始 ---
    if (!response.ok) {
        // 读取服务器返回的具体错误文字
        const errorText = await response.text();
        let errorMessage = `Status: ${response.status} (${response.statusText})`;
        
        // 尝试解析 JSON 错误
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error) errorMessage = errorJson.error;
        } catch (e) {
            if (errorText) errorMessage += ` - ${errorText.substring(0, 100)}`;
        }
        
        throw new Error(errorMessage);
    }
    // --- 诊断代码结束 ---
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);

    const pcmData = decodeBase64(data.audio);
    const audioBuffer = createAudioBufferFromPCM(pcmData, ctx, 24000);
    audioCache.set(cacheKey, audioBuffer);
    playBuffer(ctx, audioBuffer);

  } catch (error: any) {
    console.error("Audio Error Details:", error);
    alert("❌ Error: " + error.message);
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
