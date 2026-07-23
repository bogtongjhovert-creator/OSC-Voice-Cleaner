import React from "react";
import {
  FileText,
  Clock,
  Radio,
  Sliders,
  HardDrive,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Activity,
  Award,
} from "lucide-react";
import { AudioMetadata } from "../types";

interface AudioInfoCardProps {
  metadata: AudioMetadata;
}

export const AudioInfoCard: React.FC<AudioInfoCardProps> = ({ metadata }) => {
  function formatBytes(bytes: number) {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    if (mb < 1000) return `${mb.toFixed(2)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  }

  return (
    <div className="p-6 rounded-[24px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Audio Specifications & AI Metrics
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
          {metadata.format}
        </span>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/50 space-y-1">
          <span className="text-[10px] font-medium text-zinc-400">Duration</span>
          <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {metadata.duration.toFixed(1)}s
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/50 space-y-1">
          <span className="text-[10px] font-medium text-zinc-400">Sample Rate</span>
          <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {(metadata.sampleRate / 1000).toFixed(1)} kHz
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/50 space-y-1">
          <span className="text-[10px] font-medium text-zinc-400">Bitrate</span>
          <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {metadata.bitrateKbps} kbps
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/50 space-y-1">
          <span className="text-[10px] font-medium text-zinc-400">Channels</span>
          <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {metadata.channels === 1 ? "Mono" : "Stereo (2Ch)"}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/50 space-y-1">
          <span className="text-[10px] font-medium text-zinc-400">File Size</span>
          <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {formatBytes(metadata.fileSizeBytes)}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/50 space-y-1">
          <span className="text-[10px] font-medium text-zinc-400">Noise Level</span>
          <div className="font-mono text-xs font-bold text-rose-500">
            {metadata.estimatedNoiseLevelDb} dB
          </div>
        </div>
      </div>

      {/* AI Speech Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Speech Quality Score */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div className="grow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Speech Quality Score
              </span>
              <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {metadata.speechQualityScore} / 100
              </span>
            </div>
            <div className="w-full h-2 bg-emerald-200 dark:bg-emerald-900/60 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${metadata.speechQualityScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Enhancement Score */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/50 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="grow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                AI Enhancement Gain
              </span>
              <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
                +{metadata.enhancementScore}%
              </span>
            </div>
            <div className="w-full h-2 bg-amber-200 dark:bg-amber-900/60 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${metadata.enhancementScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gemini AI Recommendations & Noise Profile */}
      {metadata.aiRecommendations && metadata.aiRecommendations.length > 0 && (
        <div className="p-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Voice Diagnostics & Optimization Notes</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
            Detected Noise Profile: "{metadata.detectedNoiseProfile || "AC Hum & Room Echo"}"
          </p>
          <ul className="space-y-1 pt-1">
            {metadata.aiRecommendations.map((rec, i) => (
              <li
                key={i}
                className="text-xs text-zinc-600 dark:text-zinc-300 flex items-start gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
