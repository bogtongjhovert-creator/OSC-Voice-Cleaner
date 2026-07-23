import React from "react";
import {
  X,
  Settings,
  Sun,
  Moon,
  Sliders,
  Keyboard,
  Trash2,
  Check,
  HardDrive,
} from "lucide-react";
import { ProcessingPreset } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  defaultPreset: ProcessingPreset;
  onDefaultPresetChange: (preset: ProcessingPreset) => void;
  targetPeakDb: number;
  onTargetPeakDbChange: (db: number) => void;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode,
  defaultPreset,
  onDefaultPresetChange,
  targetPeakDb,
  onTargetPeakDbChange,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-[28px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Preferences & Application Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Settings */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Appearance
          </label>
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isDarkMode ? "Dark Mode (Glassmorphism)" : "Light Mode (Apple Clean)"}</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium"
            >
              Switch Theme
            </button>
          </div>
        </div>

        {/* Default Preset Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Default AI Processing Preset
          </label>
          <select
            value={defaultPreset}
            onChange={(e) => onDefaultPresetChange(e.target.value as ProcessingPreset)}
            className="w-full p-3 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none"
          >
            <option value="Basic">Basic (Fast Cut)</option>
            <option value="Balanced">Balanced (Default Recommended)</option>
            <option value="Studio">Studio (Pro Broadcast)</option>
            <option value="Podcast">Podcast (Warm Voice & Gate)</option>
            <option value="Meeting">Meeting (Call Isolation)</option>
            <option value="Music Vocal">Music Vocal (Singing)</option>
          </select>
        </div>

        {/* Peak Volume Target */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-500 uppercase tracking-wider">
              Normalization Peak Target
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              {targetPeakDb} dBFS
            </span>
          </div>
          <input
            type="range"
            min="-6"
            max="0"
            step="0.5"
            value={targetPeakDb}
            onChange={(e) => onTargetPeakDbChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Keyboard Shortcuts Guide */}
        <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <Keyboard className="w-4 h-4" />
            <span>Keyboard Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
            <div>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700">Space</kbd> Play /
              Pause
            </div>
            <div>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700">A / B</kbd> Switch
              Channel
            </div>
            <div>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700">M</kbd> Toggle Mute
            </div>
            <div>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700">R</kbd> Open Recorder
            </div>
          </div>
        </div>

        {/* Danger Clear Action */}
        <div className="pt-2 flex items-center justify-between border-t border-zinc-200/80 dark:border-zinc-800/80">
          <button
            onClick={() => {
              onClearHistory();
              onClose();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cache & History</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
