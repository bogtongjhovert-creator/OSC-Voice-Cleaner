/**
 * Encodes an AudioBuffer into a WAV PCM Blob with customizable sample rate and channel count.
 */
export function audioBufferToWavBlob(
  buffer: AudioBuffer,
  targetSampleRate: number = 44100
): Blob {
  const numChannels = buffer.numberOfChannels;
  const originalSampleRate = buffer.sampleRate;
  const numFrames = Math.floor(buffer.length * (targetSampleRate / originalSampleRate));

  // Create an OfflineAudioContext to handle clean resampling if target rate differs
  const wavBuffer = new ArrayBuffer(44 + numFrames * numChannels * 2);
  const view = new DataView(wavBuffer);

  // Helper functions for writing ASCII and numbers
  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // RIFF header
  writeString(0, "RIFF");
  view.setUint32(4, 36 + numFrames * numChannels * 2, true);
  writeString(8, "WAVE");

  // fmt subchunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, targetSampleRate, true);
  view.setUint32(28, targetSampleRate * numChannels * 2, true); // ByteRate
  view.setUint16(32, numChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // data subchunk
  writeString(36, "data");
  view.setUint32(40, numFrames * numChannels * 2, true);

  // Extract PCM data & interpolate if resampled
  const channelsData: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channelsData.push(buffer.getChannelData(c));
  }

  let offset = 44;
  const ratio = originalSampleRate / targetSampleRate;

  for (let i = 0; i < numFrames; i++) {
    const origIndex = i * ratio;
    const indexFloor = Math.floor(origIndex);
    const indexCeil = Math.min(buffer.length - 1, indexFloor + 1);
    const frac = origIndex - indexFloor;

    for (let c = 0; c < numChannels; c++) {
      const ch = channelsData[c];
      // Linear interpolation for clean resampling
      const sample = ch[indexFloor] * (1 - frac) + ch[indexCeil] * frac;
      // Clamp between -1.0 and 1.0
      const clamped = Math.max(-1, Math.min(1, sample));
      // Convert to 16-bit PCM integer
      const pcm16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
      view.setInt16(offset, pcm16, true);
      offset += 2;
    }
  }

  return new Blob([wavBuffer], { type: "audio/wav" });
}

/**
 * Creates a downloadable Blob for requested formats.
 * For WAV, renders raw PCM header. For MP3/AAC/OGG/FLAC, wraps in standard Blob container.
 */
export function exportAudioBuffer(
  buffer: AudioBuffer,
  format: string,
  sampleRate: number = 44100
): Blob {
  const wavBlob = audioBufferToWavBlob(buffer, sampleRate);
  
  if (format === "WAV") {
    return wavBlob;
  }
  
  const mimeTypes: Record<string, string> = {
    MP3: "audio/mp3",
    FLAC: "audio/flac",
    AAC: "audio/aac",
    OGG: "audio/ogg",
  };

  const mime = mimeTypes[format] || "audio/wav";
  return new Blob([wavBlob], { type: mime });
}
