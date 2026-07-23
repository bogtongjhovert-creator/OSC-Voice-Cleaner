import React from "react";
import {
  Mic,
  Sparkles,
  Sun,
  Moon,
  Settings,
  ShieldAlert,
  Volume2,
  FolderOpen,
} from "lucide-react";
import { TabType } from "../types";

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings: () => void;
  hasAudioReady: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenSettings,
  hasAudioReady,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 dark:bg-zinc-900/80 border-b border-[#D2D2D7]/50 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div
          onClick={() => onTabChange("landing")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[17px] tracking-tight text-[#1D1D1F] dark:text-zinc-100">
                VoicePure AI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-[#86868B] dark:text-zinc-400 hidden sm:block">
              AI Voice Cleaning & Enhancement Workbench
            </p>
          </div>
        </div>

        {/* Quick Nav Badges */}
        <div className="hidden md:flex items-center gap-1 bg-[#F4F4F7] dark:bg-zinc-800/80 p-1 rounded-2xl border border-[#D2D2D7]/50 dark:border-zinc-700/60">
          <button
            onClick={() => onTabChange("landing")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentTab === "landing"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold"
                : "text-[#424245] dark:text-zinc-400 hover:text-[#1D1D1F] dark:hover:text-zinc-100"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onTabChange("dashboard")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentTab === "dashboard"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold"
                : "text-[#424245] dark:text-zinc-400 hover:text-[#1D1D1F] dark:hover:text-zinc-100"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange("upload")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentTab === "upload"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold"
                : "text-[#424245] dark:text-zinc-400 hover:text-[#1D1D1F] dark:hover:text-zinc-100"
            }`}
          >
            Upload Audio
          </button>
          <button
            onClick={() => onTabChange("record")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentTab === "record"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold"
                : "text-[#424245] dark:text-zinc-400 hover:text-[#1D1D1F] dark:hover:text-zinc-100"
            }`}
          >
            Recorder
          </button>
          {hasAudioReady && (
            <button
              onClick={() => onTabChange("editor")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTab === "editor"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                  : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              Active Workbench
            </button>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Quick Upload CTA */}
          <button
            onClick={() => onTabChange("upload")}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D1D1F] dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium shadow-md hover:opacity-90 transition-opacity"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Clean Audio</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl text-[#424245] dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-xl text-[#424245] dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Hidden Admin Direct Switch */}
          <button
            onClick={() => onTabChange("admin")}
            title="Admin Console"
            className="p-2 rounded-xl text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-zinc-200 transition-colors opacity-60 hover:opacity-100"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
