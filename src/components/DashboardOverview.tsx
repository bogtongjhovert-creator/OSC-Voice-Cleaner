import React from "react";
import {
  FileAudio,
  HardDrive,
  Clock,
  Download,
  Plus,
  Mic,
  Play,
  Star,
  Trash2,
  Sliders,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { AudioItem, SystemMetrics, TabType } from "../types";

interface DashboardOverviewProps {
  metrics: SystemMetrics;
  recentFiles: AudioItem[];
  onSelectFile: (item: AudioItem) => void;
  onDeleteFile: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTabChange: (tab: TabType) => void;
  onTryDemo: () => void;
  isLoadingDemo: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  metrics,
  recentFiles,
  onSelectFile,
  onDeleteFile,
  onToggleFavorite,
  onTabChange,
  onTryDemo,
  isLoadingDemo,
}) => {
  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    if (mb < 1000) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  }

  return (
    <div className="space-y-8 py-4">
      {/* Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Overview of processed voice files, storage consumption, and enhancement metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange("upload")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium shadow hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New</span>
          </button>
          <button
            onClick={() => onTabChange("record")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-500" />
            <span>Record</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Files Processed */}
        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Files Processed</span>
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <FileAudio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {metrics.filesProcessed}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>AI Cleaner Active</span>
          </p>
        </div>

        {/* Storage Used */}
        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Storage Used</span>
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatBytes(metrics.totalStorageBytes)}
          </div>
          <p className="text-[11px] text-zinc-400">Local Cache persistent</p>
        </div>

        {/* Processing Time */}
        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Processing Time</span>
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatTime(metrics.totalProcessingTimeSec)}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
            Avg ~0.8s / file
          </p>
        </div>

        {/* Downloads */}
        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Downloads</span>
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {metrics.totalDownloads}
          </div>
          <p className="text-[11px] text-zinc-400">WAV / MP3 / AAC</p>
        </div>
      </div>

      {/* Recent Files Table */}
      <div className="p-6 rounded-[24px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Recent Audio Files
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Select any file to load into the AI Voice Cleaner editor.
            </p>
          </div>

          {recentFiles.length > 0 && (
            <button
              onClick={() => onTabChange("history")}
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              View All ({recentFiles.length})
            </button>
          )}
        </div>

        {recentFiles.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
            <FileAudio className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                No recent files found
              </p>
              <p className="text-xs text-zinc-400">
                Upload or record an audio file to begin AI voice cleaning.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => onTabChange("upload")}
                className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium"
              >
                Upload File
              </button>
              <button
                onClick={onTryDemo}
                disabled={isLoadingDemo}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-medium"
              >
                Try Demo Sample
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Filename</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Noise Floor</th>
                  <th className="pb-3">Preset</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {recentFiles.slice(0, 5).map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectFile(item)}
                  >
                    <td className="py-3 pl-2 font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        <FileAudio className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="truncate max-w-[200px]" title={item.filename}>
                        {item.filename}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-500 font-mono">
                      {item.metadata.duration.toFixed(1)}s
                    </td>
                    <td className="py-3 font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px]">
                        {item.metadata.estimatedNoiseLevelDb} dB
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {item.presetUsed}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right pr-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onToggleFavorite(item.id)}
                          title="Favorite"
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.isFavorite
                              ? "text-amber-500"
                              : "text-zinc-400 hover:text-amber-500"
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => onSelectFile(item)}
                          title="Open in Editor"
                          className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteFile(item.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
