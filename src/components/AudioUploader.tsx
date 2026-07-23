import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  Sparkles,
} from "lucide-react";
import { AudioItem, AICleaningOptions } from "../types";
import { estimateAudioNoiseFloor, processAudioBuffer, PRESET_CONFIGS } from "../utils/audioEngine";
import { audioBufferToWavBlob } from "../utils/audioEncoder";

interface AudioUploaderProps {
  onAudioUploaded: (item: AudioItem) => void;
  onTryDemo: () => void;
  isLoadingDemo: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onAudioUploaded,
  onTryDemo,
  isLoadingDemo,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<boolean>(false);

  const SUPPORTED_EXTS = ["mp3", "wav", "m4a", "aac", "ogg", "flac"];
  const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

  async function handleFileProcess(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!SUPPORTED_EXTS.includes(ext)) {
      setErrorMessage(
        `Unsupported format (${ext.toUpperCase()}). Please upload MP3, WAV, M4A, AAC, OGG, or FLAC.`
      );
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage("File exceeds maximum allowed size of 500MB.");
      return;
    }

    setErrorMessage(null);
    setUploading(true);
    setProgress(10);
    setUploadStatusText("Reading audio file...");
    abortRef.current = false;

    try {
      // 1. Read File ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      if (abortRef.current) return;

      setProgress(35);
      setUploadStatusText("Decoding audio channels...");

      // 2. Decode using Web Audio Context
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      if (abortRef.current) return;

      setProgress(60);
      setUploadStatusText("Analyzing noise floor & acoustics...");

      const { estimatedNoiseDb } = estimateAudioNoiseFloor(decodedBuffer);

      // 3. Perform AI analysis request to server
      setProgress(75);
      setUploadStatusText("Requesting Gemini AI Voice Diagnostics...");

      let aiMetrics = {
        speechQualityScore: Math.min(96, Math.max(60, Math.round(90 - Math.abs(estimatedNoiseDb) * 0.5))),
        enhancementScore: 94,
        estimatedNoiseLevelDb: estimatedNoiseDb,
        detectedNoiseProfile: estimatedNoiseDb > -25 ? "HVAC Fan & Room Reverberation" : "Low Background Noise",
        aiRecommendations: [
          "Apply notch filters for hum isolation",
          "Enable spectral noise gate for background reduction",
          "Boost vocal clarity region @ 3.2kHz",
        ],
      };

      try {
        const response = await fetch("/api/ai-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            duration: decodedBuffer.duration,
            sampleRate: decodedBuffer.sampleRate,
            noiseEstimate: Math.abs(estimatedNoiseDb),
          }),
        });
        const json = await response.json();
        if (json.success && json.metrics) {
          aiMetrics = { ...aiMetrics, ...json.metrics };
        }
      } catch (err) {
        console.warn("AI endpoint unreachable, using direct DSP analysis");
      }

      setProgress(88);
      setUploadStatusText("Applying default Balanced AI Cleaning...");

      const defaultOptions: AICleaningOptions = PRESET_CONFIGS.Balanced.options;
      const cleanedBuffer = await processAudioBuffer(decodedBuffer, defaultOptions, "Balanced");

      const originalBlob = new Blob([arrayBuffer], { type: file.type || "audio/wav" });
      const originalUrl = URL.createObjectURL(originalBlob);

      const cleanedBlob = audioBufferToWavBlob(cleanedBuffer, decodedBuffer.sampleRate);
      const cleanedUrl = URL.createObjectURL(cleanedBlob);

      setProgress(100);
      setUploadStatusText("Complete!");

      const newItem: AudioItem = {
        id: "audio-" + Date.now(),
        filename: file.name,
        originalUrl,
        cleanedUrl,
        originalBuffer: decodedBuffer,
        cleanedBuffer,
        metadata: {
          filename: file.name,
          duration: decodedBuffer.duration,
          sampleRate: decodedBuffer.sampleRate,
          channels: decodedBuffer.numberOfChannels,
          bitrateKbps: Math.round((file.size * 8) / (decodedBuffer.duration * 1000) || 320),
          fileSizeBytes: file.size,
          format: ext.toUpperCase(),
          estimatedNoiseLevelDb: estimatedNoiseDb,
          speechQualityScore: aiMetrics.speechQualityScore,
          enhancementScore: aiMetrics.enhancementScore,
          detectedNoiseProfile: aiMetrics.detectedNoiseProfile,
          aiRecommendations: aiMetrics.aiRecommendations,
        },
        createdAt: new Date().toISOString(),
        status: "ready",
        presetUsed: "Balanced",
        optionsUsed: defaultOptions,
        isFavorite: false,
      };

      setTimeout(() => {
        setUploading(false);
        onAudioUploaded(newItem);
      }, 300);
    } catch (err: any) {
      console.error("Audio upload error:", err);
      setErrorMessage("Failed to decode audio file. Please try another file format.");
      setUploading(false);
    }
  }

  function handleCancelUpload() {
    abortRef.current = true;
    setUploading(false);
    setProgress(0);
    setUploadStatusText("");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Upload Audio File
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Upload any recorded voice note, podcast, or interview. Supports up to 500MB.
        </p>
      </div>

      {/* Main Drag Drop Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileProcess(e.dataTransfer.files[0]);
          }
        }}
        className={`relative p-8 sm:p-14 rounded-[28px] text-center transition-all duration-200 border-2 border-dashed ${
          isDragging
            ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 scale-[1.01]"
            : "border-zinc-300/80 dark:border-zinc-700/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.m4a,.aac,.ogg,.flac,audio/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        {uploading ? (
          <div className="max-w-md mx-auto space-y-6 py-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg">
                Processing Audio File
              </h3>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {uploadStatusText}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>{progress}% Completed</span>
                <span>DSP Offline Render</span>
              </div>
            </div>

            <button
              onClick={handleCancelUpload}
              className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center mx-auto shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Drag and drop your audio file here
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Supports MP3, WAV, M4A, AAC, OGG, and FLAC (Max 500MB)
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-xs shadow-md hover:opacity-90 transition-opacity"
              >
                Browse Audio File
              </button>

              <button
                onClick={onTryDemo}
                disabled={isLoadingDemo}
                className="px-5 py-3 rounded-2xl bg-amber-500 text-white font-medium text-xs shadow-sm hover:bg-amber-600 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Try Demo Sample</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="grow">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Format Badge Bar */}
      <div className="p-4 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          Supported Input Codecs:
        </span>
        <div className="flex flex-wrap gap-1.5 font-mono">
          {SUPPORTED_EXTS.map((ext) => (
            <span
              key={ext}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-[10px] uppercase font-bold"
            >
              {ext}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
