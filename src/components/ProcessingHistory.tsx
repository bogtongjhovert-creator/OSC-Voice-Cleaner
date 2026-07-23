import React, { useState } from "react";
import {
  History,
  Search,
  Star,
  Trash2,
  Sliders,
  Download,
  FileAudio,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { AudioItem, ProcessingPreset } from "../types";
import { exportAudioBuffer } from "../utils/audioEncoder";

interface ProcessingHistoryProps {
  items: AudioItem[];
  onSelectFile: (item: AudioItem) => void;
  onDeleteFile: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearAll: () => void;
  onlyFavorites?: boolean;
}

export const ProcessingHistory: React.FC<ProcessingHistoryProps> = ({
  items,
  onSelectFile,
  onDeleteFile,
  onToggleFavorite,
  onClearAll,
  onlyFavorites = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [presetFilter, setPresetFilter] = useState<string>("ALL");

  const filteredItems = items.filter((item) => {
    if (onlyFavorites && !item.isFavorite) return false;
    if (
      searchTerm &&
      !item.filename.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (presetFilter !== "ALL" && item.presetUsed !== presetFilter) {
      return false;
    }
    return true;
  });

  function handleQuickDownload(item: AudioItem) {
    const buffer = item.cleanedBuffer || item.originalBuffer;
    if (!buffer) return;
    const blob = exportAudioBuffer(buffer, "WAV", 44100);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.filename}_cleaned.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6 py-4">
      {/* Title & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {onlyFavorites ? "Favorites Library" : "Processing History"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            {onlyFavorites
              ? "Your starred audio files and presets."
              : "All audio files cleaned during this session."}
          </p>
        </div>

        {items.length > 0 && !onlyFavorites && (
          <button
            onClick={onClearAll}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
          >
            Clear All History
          </button>
        )}
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audio filenames..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none border border-zinc-200/60 dark:border-zinc-700/60"
          />
        </div>

        {/* Preset Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={presetFilter}
            onChange={(e) => setPresetFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none border border-zinc-200/60 dark:border-zinc-700/60"
          >
            <option value="ALL">All Presets</option>
            <option value="Basic">Basic</option>
            <option value="Balanced">Balanced</option>
            <option value="Studio">Studio</option>
            <option value="Podcast">Podcast</option>
            <option value="Meeting">Meeting</option>
            <option value="Music Vocal">Music Vocal</option>
          </select>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-[24px] bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <FileAudio className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            No audio files match your search
          </p>
          <p className="text-xs text-zinc-400">
            Upload or record audio to build your voice cleaner processing history.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-[24px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Filename</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Noise Level</th>
                <th className="pb-3">Preset</th>
                <th className="pb-3">Processed Date</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectFile(item)}
                >
                  <td className="py-3.5 pl-2 font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-emerald-500">
                      <FileAudio className="w-4 h-4" />
                    </div>
                    <span className="truncate max-w-[220px]" title={item.filename}>
                      {item.filename}
                    </span>
                  </td>
                  <td className="py-3.5 text-zinc-500 font-mono">
                    {item.metadata.duration.toFixed(1)}s
                  </td>
                  <td className="py-3.5 font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px]">
                      {item.metadata.estimatedNoiseLevelDb} dB
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      {item.presetUsed}
                    </span>
                  </td>
                  <td className="py-3.5 text-zinc-400">
                    {new Date(item.createdAt).toLocaleDateString()}{" "}
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 text-right pr-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        title="Star Favorite"
                        className={`p-2 rounded-xl transition-colors ${
                          item.isFavorite
                            ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                            : "text-zinc-400 hover:text-amber-500"
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={() => handleQuickDownload(item)}
                        title="Quick Download WAV"
                        className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectFile(item)}
                        title="Open in AI Editor"
                        className="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteFile(item.id)}
                        title="Delete"
                        className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
};
