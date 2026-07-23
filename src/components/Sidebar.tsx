import React from "react";
import {
  LayoutDashboard,
  UploadCloud,
  Mic,
  Sliders,
  History,
  Star,
  Settings,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  Volume2,
} from "lucide-react";
import { TabType } from "../types";

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeItemCount: number;
  favoritesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  activeItemCount,
  favoritesCount,
}) => {
  const mainNavs = [
    { id: "landing" as TabType, label: "Dashboard", icon: Sparkles },
    { id: "dashboard" as TabType, label: "Overview", icon: LayoutDashboard },
    { id: "upload" as TabType, label: "Upload Audio", icon: UploadCloud },
    { id: "record" as TabType, label: "Record Audio", icon: Mic },
    {
      id: "editor" as TabType,
      label: "Audio Workbench",
      icon: Sliders,
      badge: activeItemCount > 0 ? `${activeItemCount}` : undefined,
    },
  ];

  const libraryNavs = [
    {
      id: "history" as TabType,
      label: "History",
      icon: History,
    },
    {
      id: "favorites" as TabType,
      label: "Favorites",
      icon: Star,
      badge: favoritesCount > 0 ? `${favoritesCount}` : undefined,
    },
  ];

  const systemNavs = [
    { id: "settings" as TabType, label: "Settings", icon: Settings },
    { id: "help" as TabType, label: "Help & Guide", icon: HelpCircle },
    { id: "admin" as TabType, label: "Admin Console", icon: ShieldAlert },
  ];

  return (
    <aside className="w-[240px] shrink-0 hidden lg:flex flex-col bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-r border-[#D2D2D7]/50 dark:border-zinc-800/80 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6 flex-1">
        {/* Main Section */}
        <div>
          <h3 className="px-3 text-[12px] font-semibold text-[#86868B] dark:text-zinc-500 uppercase tracking-wider mb-2">
            Library
          </h3>
          <nav className="space-y-1">
            {mainNavs.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-[#424245] dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-zinc-800/60 hover:text-[#1D1D1F] dark:hover:text-zinc-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Library Section */}
        <div>
          <h3 className="px-3 text-[12px] font-semibold text-[#86868B] dark:text-zinc-500 uppercase tracking-wider mb-2">
            Recent Projects
          </h3>
          <nav className="space-y-1">
            {libraryNavs.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-[#424245] dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-zinc-800/60 hover:text-[#1D1D1F] dark:hover:text-zinc-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System & Settings Section */}
        <div>
          <h3 className="px-3 text-[12px] font-semibold text-[#86868B] dark:text-zinc-500 uppercase tracking-wider mb-2">
            Preferences
          </h3>
          <nav className="space-y-1">
            {systemNavs.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-[#424245] dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-zinc-800/60 hover:text-[#1D1D1F] dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Pro Account Card */}
      <div className="pt-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200/50 dark:shadow-none">
          <p className="text-[11px] uppercase tracking-widest font-bold opacity-80 mb-1">
            Pro Account
          </p>
          <p className="text-[13px] font-medium leading-snug">
            Enhance audio with higher bitrates & 96kHz 32-bit DSP
          </p>
          <button
            onClick={() => onTabChange("upload")}
            className="mt-3 w-full bg-white text-indigo-600 hover:bg-indigo-50 text-[12px] font-bold py-2 rounded-lg transition-colors shadow-sm"
          >
            Upgrade Studio
          </button>
        </div>
      </div>
    </aside>
  );
};
