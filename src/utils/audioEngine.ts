import { AICleaningOptions, ProcessingPreset } from "../types";

export interface PresetDefaults {
  preset: ProcessingPreset;
  options: AICleaningOptions;
  noiseGateThresholdDb: number;
  vocalBoostDb: number;
  compressionRatio: number;
}

export const PRESET_CONFIGS: Record<ProcessingPreset, PresetDefaults> = {
  Basic: {
    preset: "Basic",
    options: {
      noiseReduction: true,
      echoRemoval: false,
      windRemoval: true,
      humRemoval: true,
      hissRemoval: true,
      breathReduction: false,
      clickRemoval: true,
      popFilter: true,
      voiceEnhancement: true,
      volumeNormalization: true,
      speechIsolation: false,
      bassBoost: false,
      trebleEnhancement: false,
      vocalCompression: true,
    },
    noiseGateThresholdDb: -38,
    vocalBoostDb: 2.5,
    compressionRatio: 2.5,
  },
  Balanced: {
    preset: "Balanced",
    options: {
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
    },
    noiseGateThresholdDb: -34,
    vocalBoostDb: 4.0,
    compressionRatio: 3.2,
  },
  Studio: {
    preset: "Studio",
    options: {
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
    },
    noiseGateThresholdDb: -32,
    vocalBoostDb: 5.0,
    compressionRatio: 4.0,
  },
  Podcast: {
    preset: "Podcast",
    options: {
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
    },
    noiseGateThresholdDb: -30,
    vocalBoostDb: 5.5,
    compressionRatio: 4.5,
  },
  Meeting: {
    preset: "Meeting",
    options: {
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
      bassBoost: false,
      trebleEnhancement: false,
      vocalCompression: true,
    },
    noiseGateThresholdDb: -26,
    vocalBoostDb: 3.5,
    compressionRatio: 3.5,
  },
  "Music Vocal": {
    preset: "Music Vocal",
    options: {
      noiseReduction: true,
      echoRemoval: false,
      windRemoval: true,
      humRemoval: true,
      hissRemoval: true,
      breathReduction: false,
      clickRemoval: true,
      popFilter: true,
      voiceEnhancement: true,
      volumeNormalization: true,
      speechIsolation: false,
      bassBoost: true,
      trebleEnhancement: true,
      vocalCompression: true,
    },
    noiseGateThresholdDb: -40,
    vocalBoostDb: 6.0,
    compressionRatio: 3.8,
  },
};

/**
 * Process an AudioBuffer through high-grade Web Audio DSP pipeline using OfflineAudioContext.
 */
export async function processAudioBuffer(
  inputBuffer: AudioBuffer,
  options: AICleaningOptions,
  preset: ProcessingPreset = "Balanced"
): Promise<AudioBuffer> {
  const numChannels = inputBuffer.numberOfChannels;
  const sampleRate = inputBuffer.sampleRate;
  const length = inputBuffer.length;

  const offlineCtx = new OfflineAudioContext(numChannels, length, sampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = inputBuffer;

  const presetCfg = PRESET_CONFIGS[preset] || PRESET_CONFIGS.Balanced;

  // Build Filter Graph
  let currentHead: AudioNode = source;

  // 1. High-Pass Filter (Wind & Sub-bass rumble < 80Hz)
  if (options.windRemoval || options.popFilter) {
    const highpass = offlineCtx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = options.popFilter ? 90 : 75;
    highpass.Q.value = 0.707;
    currentHead.connect(highpass);
    currentHead = highpass;
  }

  // 2. Hum Removal Notch Filters (50Hz / 60Hz and harmonics)
  if (options.humRemoval) {
    const notchFrequencies = [50, 60, 100, 120];
    notchFrequencies.forEach((freq) => {
      const notch = offlineCtx.createBiquadFilter();
      notch.type = "notch";
      notch.frequency.value = freq;
      notch.Q.value = 25; // Narrow notch
      currentHead.connect(notch);
      currentHead = notch;
    });
  }

  // 3. Low-Pass / High-Shelf Hiss & High Frequency Cut (> 12kHz)
  if (options.hissRemoval) {
    const lowpass = offlineCtx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 13500;
    lowpass.Q.value = 0.7;
    currentHead.connect(lowpass);
    currentHead = lowpass;
  }

  // 4. De-Esser (Peaking Notch around 6.8kHz to tame harsh sibilance)
  if (options.clickRemoval || options.hissRemoval) {
    const deEsser = offlineCtx.createBiquadFilter();
    deEsser.type = "peaking";
    deEsser.frequency.value = 6800;
    deEsser.Q.value = 2.0;
    deEsser.gain.value = -3.5;
    currentHead.connect(deEsser);
    currentHead = deEsser;
  }

  // 5. Parametric Voice Enhancement (Formant boost around 2.8kHz - 3.8kHz)
  if (options.voiceEnhancement || options.speechIsolation) {
    const voiceClarity = offlineCtx.createBiquadFilter();
    voiceClarity.type = "peaking";
    voiceClarity.frequency.value = 3200;
    voiceClarity.Q.value = 1.2;
    voiceClarity.gain.value = presetCfg.vocalBoostDb;
    currentHead.connect(voiceClarity);
    currentHead = voiceClarity;
  }

  // 6. Bass Boost (Warmth Low Shelf @ 120Hz)
  if (options.bassBoost) {
    const bassShelf = offlineCtx.createBiquadFilter();
    bassShelf.type = "lowshelf";
    bassShelf.frequency.value = 120;
    bassShelf.gain.value = 3.5;
    currentHead.connect(bassShelf);
    currentHead = bassShelf;
  }

  // 7. Treble Enhancement (Air High Shelf @ 10kHz)
  if (options.trebleEnhancement) {
    const trebleShelf = offlineCtx.createBiquadFilter();
    trebleShelf.type = "highshelf";
    trebleShelf.frequency.value = 10000;
    trebleShelf.gain.value = 3.0;
    currentHead.connect(trebleShelf);
    currentHead = trebleShelf;
  }

  // 8. Dynamic Vocal Compressor
  if (options.vocalCompression) {
    const compressor = offlineCtx.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 10;
    compressor.ratio.value = presetCfg.compressionRatio;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.12;
    currentHead.connect(compressor);
    currentHead = compressor;
  }

  currentHead.connect(offlineCtx.destination);
  source.start(0);

  const renderedBuffer = await offlineCtx.startRendering();

  // Apply Spectral Noise Suppression & Noise Gate pass directly on PCM buffers
  if (options.noiseReduction || options.echoRemoval || options.breathReduction) {
    applySpectralNoiseGate(renderedBuffer, presetCfg.noiseGateThresholdDb, options);
  }

  // Volume Normalization pass
  if (options.volumeNormalization) {
    normalizeAudioBufferPeak(renderedBuffer, -1.0); // -1dBFS target peak
  }

  return renderedBuffer;
}

/**
 * Direct PCM Spectral Noise Gate & Silence Expander for background noise reduction
 */
function applySpectralNoiseGate(
  buffer: AudioBuffer,
  thresholdDb: number,
  options: AICleaningOptions
) {
  const thresholdLinear = Math.pow(10, thresholdDb / 20);
  const gateAttenuation = options.noiseReduction ? 0.2 : 0.4; // 80% noise floor reduction
  const numChannels = buffer.numberOfChannels;

  for (let ch = 0; ch < numChannels; ch++) {
    const data = buffer.getChannelData(ch);
    const windowSize = 256;
    const step = 128;

    let envelope = 0;

    for (let i = 0; i < data.length; i += step) {
      // Calculate local RMS
      let sum = 0;
      const end = Math.min(i + windowSize, data.length);
      for (let j = i; j < end; j++) {
        sum += data[j] * data[j];
      }
      const rms = Math.sqrt(sum / (end - i || 1));

      // Fast envelope follower
      if (rms > envelope) {
        envelope = envelope * 0.3 + rms * 0.7; // Fast attack
      } else {
        envelope = envelope * 0.95 + rms * 0.05; // Slow release
      }

      // If RMS signal is below noise gate threshold, attenuate background noise
      if (envelope < thresholdLinear) {
        const factor = Math.max(gateAttenuation, envelope / (thresholdLinear || 0.0001));
        for (let j = i; j < end; j++) {
          data[j] *= factor;
        }
      }
    }
  }
}

/**
 * Normalizes Peak volume to target dBFS (e.g. -1.0dBFS)
 */
function normalizeAudioBufferPeak(buffer: AudioBuffer, targetDb: number = -1.0) {
  const targetLinear = Math.pow(10, targetDb / 20);
  let maxPeak = 0;

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < data.length; i++) {
      const abs = Math.abs(data[i]);
      if (abs > maxPeak) {
        maxPeak = abs;
      }
    }
  }

  if (maxPeak > 0.0001) {
    const gain = targetLinear / maxPeak;
    // Apply linear scaling
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) {
        data[i] *= gain;
      }
    }
  }
}

/**
 * Measures estimated Noise Level (in dB) and Peak RMS from AudioBuffer
 */
export function estimateAudioNoiseFloor(buffer: AudioBuffer): {
  estimatedNoiseDb: number;
  peakDb: number;
} {
  const data = buffer.getChannelData(0);
  const frameCount = data.length;
  if (frameCount === 0) return { estimatedNoiseDb: -60, peakDb: -60 };

  const windowSize = 512;
  const rmsValues: number[] = [];
  let globalPeak = 0;

  for (let i = 0; i < frameCount; i += windowSize) {
    let sum = 0;
    const end = Math.min(i + windowSize, frameCount);
    for (let j = i; j < end; j++) {
      const abs = Math.abs(data[j]);
      if (abs > globalPeak) globalPeak = abs;
      sum += data[j] * data[j];
    }
    const rms = Math.sqrt(sum / (end - i));
    rmsValues.push(rms);
  }

  rmsValues.sort((a, b) => a - b);
  // Bottom 15th percentile corresponds to background noise floor
  const noiseFloorRms = rmsValues[Math.floor(rmsValues.length * 0.15)] || 0.001;

  const estimatedNoiseDb = Math.round(20 * Math.log10(Math.max(0.0001, noiseFloorRms)));
  const peakDb = Math.round(20 * Math.log10(Math.max(0.0001, globalPeak)));

  return { estimatedNoiseDb, peakDb };
}
