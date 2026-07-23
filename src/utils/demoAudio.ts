import { AudioItem, AICleaningOptions } from "../types";
import { estimateAudioNoiseFloor, processAudioBuffer } from "./audioEngine";
import { audioBufferToWavBlob } from "./audioEncoder";

/**
 * Generates an instant synthetic demo AudioBuffer containing spoken phrase simulation + background HVAC hum and room echo noise.
 */
export async function createDemoAudioItem(): Promise<AudioItem> {
  const sampleRate = 44100;
  const duration = 10; // 10 seconds demo audio
  const numFrames = sampleRate * duration;

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate,
  });

  const buffer = audioCtx.createBuffer(1, numFrames, sampleRate);
  const data = buffer.getChannelData(0);

  // Generate synthetic voice formants + background noise
  for (let i = 0; i < numFrames; i++) {
    const t = i / sampleRate;

    // Background electrical hum (60Hz + 120Hz harmonic)
    const hum = Math.sin(2 * Math.PI * 60 * t) * 0.08 + Math.sin(2 * Math.PI * 120 * t) * 0.04;

    // Background white/pink HVAC noise
    const whiteNoise = (Math.random() * 2 - 1) * 0.06;

    // Spoken speech cadence simulation (cadence at ~1.5Hz)
    const speechGate = Math.max(0, Math.sin(2 * Math.PI * 0.35 * t)) * (Math.sin(2 * Math.PI * 2.5 * t) > 0 ? 1 : 0.6);

    // Formant voice frequencies (F0 fundamental ~135Hz, F1 ~600Hz, F2 ~1800Hz)
    let voice = 0;
    if (speechGate > 0.1) {
      const f0 = 135 + Math.sin(2 * Math.PI * 1.2 * t) * 15;
      const f1 = 620;
      const f2 = 1850;

      voice =
        (Math.sin(2 * Math.PI * f0 * t) * 0.4 +
          Math.sin(2 * Math.PI * f1 * t) * 0.25 +
          Math.sin(2 * Math.PI * f2 * t) * 0.15) *
        speechGate;

      // Occasional sibilance / 's' sound simulation
      if (Math.sin(2 * Math.PI * 4 * t) > 0.85) {
        voice += (Math.random() * 2 - 1) * 0.3;
      }
    }

    // Combine voice + noisy background
    data[i] = voice * 0.6 + hum + whiteNoise;
  }

  const { estimatedNoiseDb } = estimateAudioNoiseFloor(buffer);
  const originalBlob = audioBufferToWavBlob(buffer, 44100);
  const originalUrl = URL.createObjectURL(originalBlob);

  const defaultOptions: AICleaningOptions = {
    noiseReduction: true,
    echoRemoval: true,
    windRemoval: true,
    humRemoval: true,
    hissRemoval: true,
    breathReduction: true,
    clickRemoval: true,
    popFilter: true,
    voiceEnhancement: true,
    volumeNormalization: true,
    speechIsolation: true,
    bassBoost: true,
    trebleEnhancement: true,
    vocalCompression: true,
  };

  const cleanedBuffer = await processAudioBuffer(buffer, defaultOptions, "Balanced");
  const cleanedBlob = audioBufferToWavBlob(cleanedBuffer, 44100);
  const cleanedUrl = URL.createObjectURL(cleanedBlob);

  const demoItem: AudioItem = {
    id: "demo-sample-" + Date.now(),
    filename: "podcast_interview_sample_noisy.wav",
    originalUrl,
    cleanedUrl,
    originalBuffer: buffer,
    cleanedBuffer,
    metadata: {
      filename: "podcast_interview_sample_noisy.wav",
      duration: 10.0,
      sampleRate: 44100,
      channels: 1,
      bitrateKbps: 256,
      fileSizeBytes: originalBlob.size,
      format: "WAV",
      estimatedNoiseLevelDb: estimatedNoiseDb || -22,
      speechQualityScore: 68,
      enhancementScore: 96,
      detectedNoiseProfile: "AC Fan Hum (60Hz/120Hz) & Soft Ambient Room Echo",
      aiRecommendations: [
        "Engaged 60Hz narrow notch filter to kill electrical mains hum",
        "Applied spectral noise gate at -34dB to clean speech pauses",
        "Boosted vocal formant region @ 3.2kHz for broadcast clarity",
        "Normalized peak volume to -1.0 dBFS"
      ],
    },
    createdAt: new Date().toISOString(),
    status: "ready",
    presetUsed: "Balanced",
    optionsUsed: defaultOptions,
    isFavorite: true,
  };

  return demoItem;
}
