import React from "react";
import {
  Upload,
  Mic,
  Play,
  Sparkles,
  Zap,
  Volume2,
  SlidersHorizontal,
  Download,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Radio,
  Headphones,
  Sliders,
} from "lucide-react";
import { TabType } from "../types";

interface HeroLandingProps {
  onTabChange: (tab: TabType) => void;
  onTryDemo: () => void;
  isLoadingDemo: boolean;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onTabChange,
  onTryDemo,
  isLoadingDemo,
}) => {
  const featureList = [
    {
      icon: Zap,
      title: "AI Noise Removal",
      desc: "Instant suppression of AC hums, PC fans, traffic, and background room noise.",
    },
    {
      icon: Volume2,
      title: "Voice Enhancement",
      desc: "Resonant formant boosting and vocal clarity taming for crystal clear speech.",
    },
    {
      icon: Radio,
      title: "Echo & Reverb Reduction",
      desc: "Attenuates harsh room reflections and acoustic reverberation in unconditioned spaces.",
    },
    {
      icon: SlidersHorizontal,
      title: "Automatic Leveling",
      desc: "Smart peak normalization and dynamic vocal compression to broadcast targets.",
    },
    {
      icon: Download,
      title: "Multi-Format Export",
      desc: "Export studio-grade WAV, MP3, FLAC, AAC, or OGG up to 96kHz 320kbps.",
    },
    {
      icon: ShieldCheck,
      title: "100% Private & Fast",
      desc: "Client-side offline Web Audio API DSP pipeline. Your audio never leaks.",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Upload or Record",
      desc: "Drop any MP3, WAV, M4A, or record directly from browser microphone.",
      icon: Upload,
    },
    {
      step: "02",
      title: "AI Cleans Voice",
      desc: "Multi-band spectral noise gate, hum notch filters & voice equalizer apply in seconds.",
      icon: Sparkles,
    },
    {
      step: "03",
      title: "A/B Preview",
      desc: "Compare original vs cleaned audio in real-time with dual visual waveforms.",
      icon: Headphones,
    },
    {
      step: "04",
      title: "Export & Download",
      desc: "Download high quality processed audio with customized bitrate and sample rate.",
      icon: Download,
    },
  ];

  return (
    <div className="space-y-16 py-6 pb-12">
      {/* Hero Header Container */}
      <section className="relative overflow-hidden rounded-[24px] bg-white/80 dark:bg-zinc-900/60 border border-[#D2D2D7]/50 dark:border-zinc-800 p-8 md:p-14 text-center shadow-sm backdrop-blur-2xl">
        {/* Glow backdrop ambient circles */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation AI Speech Isolation Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1D1D1F] dark:text-zinc-100 tracking-tight leading-[1.15]">
            AI Voice Cleaner
          </h1>

          <p className="text-base sm:text-lg text-[#86868B] dark:text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Remove background noise, eliminate HVAC hums & room echoes, and enhance speech clarity automatically in seconds with studio DSP precision.
          </p>

          {/* Action Button Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onTabChange("upload")}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Audio File</span>
            </button>

            <button
              onClick={() => onTabChange("record")}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-zinc-800 text-[#1D1D1F] dark:text-zinc-100 font-semibold text-sm border border-[#D2D2D7] dark:border-zinc-700 shadow-sm hover:bg-[#F5F5F7] dark:hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Record Live Speech</span>
            </button>

            <button
              onClick={onTryDemo}
              disabled={isLoadingDemo}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoadingDemo ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              <span>{isLoadingDemo ? "Generating Demo..." : "Try Instant Demo"}</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No signup required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Supports MP3, WAV, M4A, FLAC up to 500MB
            </span>
          </div>
        </div>
      </section>

      {/* Feature Section Cards */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Comprehensive Voice Processing Features
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Powered by multi-band notch filters, adaptive spectral noise gating, and parametric formant EQs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureList.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-[20px] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Diagram */}
      <section className="p-8 rounded-[24px] bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Simple 4-Step Pipeline
          </span>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            How AI Voice Cleaner Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {workflowSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-5 rounded-[20px] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                    {step.step}
                  </span>
                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <StepIcon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Launch Banner */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 gap-4">
          <div>
            <h3 className="font-bold text-lg">Ready to transform your voice audio?</h3>
            <p className="text-xs opacity-80">
              Clean podcasts, interview recordings, voice memos, and meetings now.
            </p>
          </div>
          <button
            onClick={() => onTabChange("upload")}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium text-xs shadow hover:opacity-90 transition-opacity"
          >
            <span>Start Cleaning Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
