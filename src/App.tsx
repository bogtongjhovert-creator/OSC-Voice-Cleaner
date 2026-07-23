import React, { useState, useEffect, useCallback } from "react";
import { TabType, AudioItem, ProcessingPreset, AICleaningOptions, SystemMetrics, SystemLog } from "./types";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { HeroLanding } from "./components/HeroLanding";
import { DashboardOverview } from "./components/DashboardOverview";
import { AudioUploader } from "./components/AudioUploader";
import { AudioRecorder } from "./components/AudioRecorder";
import { WaveformPlayer } from "./components/WaveformPlayer";
import { CleaningControls } from "./components/CleaningControls";
import { AudioInfoCard } from "./components/AudioInfoCard";
import { ExportPanel } from "./components/ExportPanel";
import { ProcessingHistory } from "./components/ProcessingHistory";
import { SettingsModal } from "./components/SettingsModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { HelpGuide } from "./components/HelpGuide";
import { createDemoAudioItem } from "./utils/demoAudio";
import { processAudioBuffer, PRESET_CONFIGS } from "./utils/audioEngine";
import { audioBufferToWavBlob } from "./utils/audioEncoder";

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("landing");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [historyItems, setHistoryItems] = useState<AudioItem[]>([]);
  const [activeItem, setActiveItem] = useState<AudioItem | null>(null);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultPreset, setDefaultPreset] = useState<ProcessingPreset>("Balanced");
  const [targetPeakDb, setTargetPeakDb] = useState<number>(-1.0);

  const [metrics, setMetrics] = useState<SystemMetrics>({
    filesProcessed: 0,
    totalStorageBytes: 0,
    totalProcessingTimeSec: 0,
    totalDownloads: 0,
  });

  const [logs, setLogs] = useState<SystemLog[]>([
    {
      id: "log-init",
      timestamp: new Date().toISOString(),
      type: "INFO",
      message: "AI Voice Cleaner initialized. Web Audio API DSP ready.",
    },
  ]);

  // Sync dark mode CSS class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const addLog = useCallback((type: "INFO" | "WARN" | "ERROR" | "AI_PROCESSING", message: string) => {
    setLogs((prev) => [
      { id: "log-" + Date.now() + Math.random(), timestamp: new Date().toISOString(), type, message },
      ...prev,
    ]);
  }, []);

  // Handle new uploaded or recorded audio item
  const handleAudioLoaded = useCallback(
    (item: AudioItem) => {
      setActiveItem(item);
      setHistoryItems((prev) => [item, ...prev]);
      setCurrentTab("editor");

      setMetrics((prev) => ({
        ...prev,
        filesProcessed: prev.filesProcessed + 1,
        totalStorageBytes: prev.totalStorageBytes + (item.metadata.fileSizeBytes || 0),
        totalProcessingTimeSec: prev.totalProcessingTimeSec + 0.8,
      }));

      addLog(
        "AI_PROCESSING",
        `Processed audio file '${item.filename}' (${item.metadata.duration.toFixed(1)}s) with ${item.presetUsed} preset.`
      );
    },
    [addLog]
  );

  // Instant Demo audio sample loader
  const handleTryDemo = async () => {
    setIsLoadingDemo(true);
    addLog("INFO", "Generating synthetic demo audio sample...");
    try {
      const demoItem = await createDemoAudioItem();
      handleAudioLoaded(demoItem);
    } catch (err: any) {
      console.error("Demo error:", err);
      addLog("ERROR", "Failed to generate demo sample.");
    } finally {
      setIsLoadingDemo(false);
    }
  };

  // Re-process audio buffer with current selected preset & options
  const handleReProcessAudio = async () => {
    if (!activeItem || !activeItem.originalBuffer) return;
    setIsProcessing(true);
    addLog("AI_PROCESSING", `Re-applying DSP pipeline to '${activeItem.filename}'...`);

    const startTime = performance.now();
    try {
      const newCleanedBuffer = await processAudioBuffer(
        activeItem.originalBuffer,
        activeItem.optionsUsed,
        activeItem.presetUsed
      );

      const cleanedBlob = audioBufferToWavBlob(newCleanedBuffer, activeItem.originalBuffer.sampleRate);
      const cleanedUrl = URL.createObjectURL(cleanedBlob);

      const elapsedTime = (performance.now() - startTime) / 1000;

      const updatedItem: AudioItem = {
        ...activeItem,
        cleanedBuffer: newCleanedBuffer,
        cleanedUrl,
      };

      setActiveItem(updatedItem);
      setHistoryItems((prev) => prev.map((h) => (h.id === updatedItem.id ? updatedItem : h)));

      setMetrics((m) => ({
        ...m,
        totalProcessingTimeSec: m.totalProcessingTimeSec + elapsedTime,
      }));

      addLog("INFO", `Re-processing complete in ${elapsedTime.toFixed(2)}s.`);
    } catch (err) {
      console.error("Re-process error:", err);
      addLog("ERROR", "Re-processing failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePresetSelect = (preset: ProcessingPreset) => {
    if (!activeItem) return;
    const presetCfg = PRESET_CONFIGS[preset];
    const updatedItem: AudioItem = {
      ...activeItem,
      presetUsed: preset,
      optionsUsed: presetCfg ? presetCfg.options : activeItem.optionsUsed,
    };
    setActiveItem(updatedItem);
  };

  const handleOptionsChange = (newOptions: AICleaningOptions) => {
    if (!activeItem) return;
    setActiveItem({
      ...activeItem,
      optionsUsed: newOptions,
    });
  };

  const handleDeleteFile = (id: string) => {
    setHistoryItems((prev) => prev.filter((i) => i.id !== id));
    if (activeItem && activeItem.id === id) {
      setActiveItem(null);
      setCurrentTab("dashboard");
    }
    addLog("INFO", `Deleted audio item ${id}`);
  };

  const handleToggleFavorite = (id: string) => {
    setHistoryItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isFavorite: !i.isFavorite } : i))
    );
    if (activeItem && activeItem.id === id) {
      setActiveItem((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    setActiveItem(null);
    setMetrics((m) => ({ ...m, filesProcessed: 0, totalStorageBytes: 0 }));
    addLog("WARN", "Cleared all processing history.");
  };

  const handleDownloadIncrement = () => {
    setMetrics((m) => ({ ...m, totalDownloads: m.totalDownloads + 1 }));
    addLog("INFO", "Exported audio file download.");
  };

  const favoritesCount = historyItems.filter((i) => i.isFavorite).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Top Glass Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasAudioReady={!!activeItem}
      />

      <div className="flex grow max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          activeItemCount={activeItem ? 1 : 0}
          favoritesCount={favoritesCount}
        />

        {/* Main Workspace Area */}
        <main className="grow p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">
          {currentTab === "landing" && (
            <HeroLanding
              onTabChange={setCurrentTab}
              onTryDemo={handleTryDemo}
              isLoadingDemo={isLoadingDemo}
            />
          )}

          {currentTab === "dashboard" && (
            <DashboardOverview
              metrics={metrics}
              recentFiles={historyItems}
              onSelectFile={(item) => {
                setActiveItem(item);
                setCurrentTab("editor");
              }}
              onDeleteFile={handleDeleteFile}
              onToggleFavorite={handleToggleFavorite}
              onTabChange={setCurrentTab}
              onTryDemo={handleTryDemo}
              isLoadingDemo={isLoadingDemo}
            />
          )}

          {currentTab === "upload" && (
            <AudioUploader
              onAudioUploaded={handleAudioLoaded}
              onTryDemo={handleTryDemo}
              isLoadingDemo={isLoadingDemo}
            />
          )}

          {currentTab === "record" && (
            <AudioRecorder onAudioRecorded={handleAudioLoaded} />
          )}

          {currentTab === "editor" && (
            <div className="space-y-6">
              {!activeItem ? (
                <div className="p-12 text-center rounded-[28px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h2 className="text-xl font-bold">No Active Audio File Selected</h2>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    Upload an audio file, record from microphone, or load a sample to use the AI Voice Cleaner editor.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setCurrentTab("upload")}
                      className="px-5 py-2.5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-xs shadow"
                    >
                      Upload Audio
                    </button>
                    <button
                      onClick={handleTryDemo}
                      disabled={isLoadingDemo}
                      className="px-5 py-2.5 rounded-2xl bg-amber-500 text-white font-medium text-xs shadow"
                    >
                      Try Instant Demo
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <WaveformPlayer item={activeItem} />
                  <CleaningControls
                    currentPreset={activeItem.presetUsed}
                    currentOptions={activeItem.optionsUsed}
                    onPresetSelect={handlePresetSelect}
                    onOptionsChange={handleOptionsChange}
                    onApplyReProcess={handleReProcessAudio}
                    isProcessing={isProcessing}
                  />
                  <AudioInfoCard metadata={activeItem.metadata} />
                  <ExportPanel
                    item={activeItem}
                    onDownloadIncrement={handleDownloadIncrement}
                  />
                </>
              )}
            </div>
          )}

          {currentTab === "history" && (
            <ProcessingHistory
              items={historyItems}
              onSelectFile={(item) => {
                setActiveItem(item);
                setCurrentTab("editor");
              }}
              onDeleteFile={handleDeleteFile}
              onToggleFavorite={handleToggleFavorite}
              onClearAll={handleClearHistory}
              onlyFavorites={false}
            />
          )}

          {currentTab === "favorites" && (
            <ProcessingHistory
              items={historyItems}
              onSelectFile={(item) => {
                setActiveItem(item);
                setCurrentTab("editor");
              }}
              onDeleteFile={handleDeleteFile}
              onToggleFavorite={handleToggleFavorite}
              onClearAll={handleClearHistory}
              onlyFavorites={true}
            />
          )}

          {currentTab === "settings" && (
            <div className="max-w-2xl mx-auto">
              <SettingsModal
                isOpen={true}
                onClose={() => setCurrentTab("dashboard")}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                defaultPreset={defaultPreset}
                onDefaultPresetChange={setDefaultPreset}
                targetPeakDb={targetPeakDb}
                onTargetPeakDbChange={setTargetPeakDb}
                onClearHistory={handleClearHistory}
              />
            </div>
          )}

          {currentTab === "help" && <HelpGuide />}

          {currentTab === "admin" && (
            <AdminDashboard
              metrics={metrics}
              logs={logs}
              onClearLogs={() => setLogs([])}
            />
          )}
        </main>
      </div>

      {/* Settings Modal Overlay */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        defaultPreset={defaultPreset}
        onDefaultPresetChange={setDefaultPreset}
        targetPeakDb={targetPeakDb}
        onTargetPeakDbChange={setTargetPeakDb}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
