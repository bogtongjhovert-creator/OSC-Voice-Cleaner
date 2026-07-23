import React from "react";
import {
  Sliders,
  Sparkles,
  Zap,
  Volume2,
  CheckCircle2,
  Mic,
  Radio,
  Wind,
  Shield,
  Layers,
  Activity,
  Headphones,
} from "lucide-react";
import { AICleaningOptions, ProcessingPreset } from "../types";
import { PRESET_CONFIGS } from "../utils/audioEngine";

interface CleaningControlsProps {
  currentPreset: ProcessingPreset;
  currentOptions: AICleaningOptions;
  onPresetSelect: (preset: ProcessingPreset) => void;
  onOptionsChange: (newOptions: AICleaningOptions) => void;
  onApplyReProcess: () => void;
  isProcessing: boolean;
}

export const CleaningControls: React.FC<CleaningControlsProps> = ({
  currentPreset,
  currentOptions,
  onPresetSelect,
  onOptionsChange,
  onApplyReProcess,
  isProcessing,
}) => {
  const presetsList: { preset: ProcessingPreset; label: string; desc: string; icon: any }[] = [
    { preset: "Studio", label: "Studio", desc: "Pro broadcast clarity", icon: Headphones },
    { preset: "Podcast", label: "Podcast", desc: "Warm rich voice & compressor", icon: Radio },
    { preset: "Meeting", label: "Meeting", desc: "Call & HVAC noise isolation", icon: Mic },
    { preset: "Balanced", label: "Balanced", desc: "Default voice clarity", icon: Activity },
    { preset: "Basic", label: "Fast Cut", desc: "Fast hum & rumble removal", icon: Zap },
    { preset: "Music Vocal", label: "Music Vocal", desc: "Singing & music presence", icon: Volume2 },
  ];

  const optionToggles: { key: keyof AICleaningOptions; label: string; desc: string }[] = [
    { key: "noiseReduction", label: "Noise Reduction", desc: "Spectral noise floor attenuation" },
    { key: "speechIsolation", label: "Voice Isolation", desc: "Multi-band vocal presence gain" },
    { key: "echoRemoval", label: "De-Reverb", desc: "Acoustic room reflection cut" },
    { key: "popFilter", label: "Plosive Removal", desc: "P & B pop pressure absorber" },
    { key: "humRemoval", label: "Hum Notch 50/60Hz", desc: "Electrical ground line cut" },
    { key: "windRemoval", label: "Wind Cut", desc: "Sub-bass rumble high-pass" },
    { key: "hissRemoval", label: "Hiss Tamer", desc: "High frequency tape noise control" },
    { key: "breathReduction", label: "Breath Smoother", desc: "Heavy pause intake dampening" },
    { key: "voiceEnhancement", label: "Formant EQ Boost", desc: "3.2kHz speech clarity curve" },
    { key: "volumeNormalization", label: "Peak Leveler", desc: "Target -1dBFS normalization" },
    { key: "bassBoost", label: "Bass Warmth", desc: "120Hz low shelf resonance" },
    { key: "trebleEnhancement", label: "Air Treble", desc: "10kHz crisp sparkle boost" },
    { key: "vocalCompression", label: "Dynamic Compressor", desc: "Broadcast dynamic leveler" },
    { key: "clickRemoval", label: "De-Clicker", desc: "Transient mouth click remover" },
  ];

  function toggleOption(key: keyof AICleaningOptions) {
    onOptionsChange({
      ...currentOptions,
      [key]: !currentOptions[key],
    });
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#D2D2D7]/50 dark:border-zinc-800 rounded-[24px] p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D2D2D7]/50 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-semibold text-[#1D1D1F] dark:text-zinc-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Enhancement Suite</span>
          </h2>
          <p className="text-xs text-[#86868B] dark:text-zinc-400">
            Configure AI audio DSP parameters and mastering presets.
          </p>
        </div>

        <button
          onClick={onApplyReProcess}
          disabled={isProcessing}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-xs flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          <span>{isProcessing ? "Processing DSP..." : "Apply & Re-Process"}</span>
        </button>
      </div>

      {/* Preset Cards Grid */}
      <div>
        <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider mb-3 block">
          Mastering Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {presetsList.map((item) => {
            const isSelected = currentPreset === item.preset;
            return (
              <button
                key={item.preset}
                onClick={() => onPresetSelect(item.preset)}
                className={`p-3 rounded-xl text-center cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 font-bold shadow-sm"
                    : "bg-white dark:bg-zinc-800/60 border-[#D2D2D7]/60 dark:border-zinc-700/60 text-[#424245] dark:text-zinc-300 hover:bg-black/5"
                }`}
              >
                <p className="text-xs font-bold">{item.label}</p>
                <p className="text-[10px] text-[#86868B] dark:text-zinc-400 mt-0.5 truncate">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Modules Switches */}
      <div>
        <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider mb-3 block">
          AI Modules & DSP Parameters
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {optionToggles.map((opt) => {
            const isChecked = !!currentOptions[opt.key];
            return (
              <div
                key={opt.key}
                onClick={() => toggleOption(opt.key)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? "bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-800/60"
                    : "bg-[#F4F4F7]/60 dark:bg-zinc-800/30 border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <div className="pr-2">
                  <div className="text-xs font-semibold text-[#1D1D1F] dark:text-zinc-100">
                    {opt.label}
                  </div>
                  <p className="text-[10px] text-[#86868B] dark:text-zinc-400">{opt.desc}</p>
                </div>

                {/* Immersive UI Toggle Switch */}
                <div
                  className={`w-10 h-5.5 rounded-full relative transition-colors shrink-0 ${
                    isChecked ? "bg-indigo-600" : "bg-[#D2D2D7] dark:bg-zinc-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-md transition-transform ${
                      isChecked ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
