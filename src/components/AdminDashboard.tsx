import React, { useState } from "react";
import {
  ShieldAlert,
  Lock,
  Users,
  HardDrive,
  Cpu,
  Activity,
  Terminal,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Settings,
} from "lucide-react";
import { SystemLog, SystemMetrics } from "../types";

interface AdminDashboardProps {
  metrics: SystemMetrics;
  logs: SystemLog[];
  onClearLogs: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  metrics,
  logs,
  onClearLogs,
}) => {
  const [passkey, setPasskey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [aiTemperature, setAiTemperature] = useState(0.2);
  const [aiModel, setAiModel] = useState("gemini-2.5-flash");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passkey === "admin" || passkey === "admin123" || passkey === "secret") {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 space-y-6">
        <div className="p-8 rounded-[28px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Admin System Console
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Restricted Route (<code className="font-mono">/admin-secret-dashboard</code>)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-zinc-500">Passkey / Master PIN</label>
              <input
                type="password"
                placeholder="Enter admin passkey (e.g. admin)"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none border border-zinc-200 dark:border-zinc-700 mt-1"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-500 font-medium">
                Invalid passkey. Try "admin".
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
            >
              Authenticate Admin Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Admin Secret Dashboard
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            System health, offline Web Audio DSP metrics, Gemini API logs, and server stats.
          </p>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
        >
          Lock Console
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>System Users</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">1 (Active)</div>
          <span className="text-[10px] text-emerald-500 font-mono">● Online Session</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Audio Processed</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {metrics.filesProcessed} files
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">Web Audio API Offline DSP</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Storage Cache</span>
            <HardDrive className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {(metrics.totalStorageBytes / (1024 * 1024)).toFixed(1)} MB
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">IndexedDB / Memory</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Gemini API Pipeline</span>
            <Cpu className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500">200 OK</div>
          <span className="text-[10px] text-zinc-400 font-mono">gemini-2.5-flash Ready</span>
        </div>
      </div>

      {/* AI Model Parameters */}
      <div className="p-6 rounded-[24px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-500" />
          <span>AI Model & Server Settings</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-500">Gemini Model Alias</label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (Fast Voice Diagnostics)</option>
              <option value="gemini-2.5-pro">gemini-2.5-pro (Deep Acoustic Analysis)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-500">
              Sampling Temperature: <span className="font-mono text-emerald-500">{aiTemperature}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={aiTemperature}
              onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* System Logs */}
      <div className="p-6 rounded-[24px] bg-zinc-950 text-zinc-200 shadow-xl space-y-4 border border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Terminal className="w-4 h-4" />
            <span>System Telemetry Logs</span>
          </div>

          <button
            onClick={onClearLogs}
            className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-400"
          >
            Clear Console Logs
          </button>
        </div>

        <div className="h-60 overflow-y-auto font-mono text-[11px] space-y-1.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
          {logs.length === 0 ? (
            <div className="text-zinc-600 italic">No system log entries recorded yet.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="text-zinc-500 shrink-0">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                    log.type === "INFO"
                      ? "bg-zinc-800 text-zinc-300"
                      : log.type === "AI_PROCESSING"
                      ? "bg-emerald-950 text-emerald-400"
                      : log.type === "WARN"
                      ? "bg-amber-950 text-amber-400"
                      : "bg-rose-950 text-rose-400"
                  }`}
                >
                  {log.type}
                </span>
                <span className="text-zinc-300">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
