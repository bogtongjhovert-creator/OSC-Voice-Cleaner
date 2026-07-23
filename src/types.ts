export type TabType =
  | "landing"
  | "dashboard"
  | "upload"
  | "record"
  | "editor"
  | "history"
  | "favorites"
  | "settings"
  | "help"
  | "admin";

export type ProcessingPreset =
  | "Basic"
  | "Balanced"
  | "Studio"
  | "Podcast"
  | "Meeting"
  | "Music Vocal";

export interface AICleaningOptions {
  noiseReduction: boolean;
  echoRemoval: boolean;
  windRemoval: boolean;
  humRemoval: boolean;
  hissRemoval: boolean;
  breathReduction: boolean;
  clickRemoval: boolean;
  popFilter: boolean;
  voiceEnhancement: boolean;
  volumeNormalization: boolean;
  speechIsolation: boolean;
  bassBoost: boolean;
  trebleEnhancement: boolean;
  vocalCompression: boolean;
}

export interface AudioMetadata {
  filename: string;
  duration: number; // in seconds
  sampleRate: number; // e.g. 44100 or 48000
  channels: number; // 1 or 2
  bitrateKbps: number; // e.g. 320
  fileSizeBytes: number;
  format: string; // e.g. "wav", "mp3"
  estimatedNoiseLevelDb: number; // e.g. -24
  speechQualityScore: number; // 0 - 100
  enhancementScore: number; // 0 - 100
  detectedNoiseProfile?: string;
  aiRecommendations?: string[];
}

export interface AudioItem {
  id: string;
  filename: string;
  originalUrl: string;
  cleanedUrl?: string;
  originalBuffer?: AudioBuffer;
  cleanedBuffer?: AudioBuffer;
  metadata: AudioMetadata;
  createdAt: string;
  status: "uploaded" | "processing" | "ready" | "error";
  presetUsed: ProcessingPreset;
  optionsUsed: AICleaningOptions;
  isFavorite: boolean;
  trimStart?: number;
  trimEnd?: number;
}

export type ExportFormat = "WAV" | "MP3" | "FLAC" | "AAC" | "OGG";
export type ExportBitrate = 128 | 192 | 256 | 320;
export type ExportSampleRate = 44100 | 48000 | 96000;

export interface SystemMetrics {
  filesProcessed: number;
  totalStorageBytes: number;
  totalProcessingTimeSec: number;
  totalDownloads: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: "INFO" | "WARN" | "ERROR" | "AI_PROCESSING";
  message: string;
}
