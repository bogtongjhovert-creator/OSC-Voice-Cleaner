import React, { useState } from "react";
import {
  Download,
  CheckCircle2,
  SlidersHorizontal,
  FileAudio,
  Sparkles,
} from "lucide-react";
import { ExportFormat, ExportBitrate, ExportSampleRate, AudioItem } from "../types";
import { exportAudioBuffer } from "../utils/audioEncoder";

interface ExportPanelProps {
  item: AudioItem;
  onDownloadIncrement: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ item, onDownloadIncrement }) => {
  const [format, setFormat] = useState<ExportFormat>("WAV");
  const [bitrate, setBitrate] = useState<ExportBitrate>(320);
  const [sampleRate, setSampleRate] = useState<ExportSampleRate>(44100);
  const [exporting, setExporting] = useState(false);

  const formats: ExportFormat[] = ["WAV", "MP3", "FLAC", "AAC", "OGG"];
  const bitrates: ExportBitrate[] = [128, 192, 256, 320];
  const sampleRates: ExportSampleRate[] = [44100, 48000, 96000];

  async function handleDownload(targetType: "cleaned" | "original") {
    const targetBuffer = targetType === "cleaned" ? item.cleanedBuffer : item.originalBuffer;
    if (!targetBuffer) return;

    setExporting(true);

    try {
      const blob = exportAudioBuffer(targetBuffer, format, sampleRate);
      const url = URL.createObjectURL(blob);

      const cleanName = item.filename.replace(/\.[^/.]+$/, "");
      const ext = format.toLowerCase();
      const downloadFilename = `${cleanName}_${targetType}_ai_clean.${ext}`;

      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onDownloadIncrement();
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="p-6 rounded-[24px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-emerald-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Export & Download Options
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Target Codec Format
          </label>
          <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            {formats.map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  format === f
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bitrate Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Audio Bitrate
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            {bitrates.map((b) => (
              <button
                key={b}
                onClick={() => setBitrate(b)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  bitrate === b
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                {b}k
              </button>
            ))}
          </div>
        </div>

        {/* Sample Rate Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Sample Rate
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            {sampleRates.map((sr) => (
              <button
                key={sr}
                onClick={() => setSampleRate(sr)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  sampleRate === sr
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                {(sr / 1000).toFixed(1)}kHz
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>
            Ready to render <strong>{format}</strong> ({bitrate}kbps, {(sampleRate / 1000).toFixed(1)}kHz PCM)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownload("original")}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50"
          >
            Download Original
          </button>

          <button
            onClick={() => handleDownload("cleaned")}
            disabled={exporting}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {exporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 fill-current" />
            )}
            <span>Export Cleaned Voice Audio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
