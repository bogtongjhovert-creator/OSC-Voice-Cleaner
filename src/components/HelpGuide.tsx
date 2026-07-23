import React from "react";
import {
  HelpCircle,
  Sparkles,
  Sliders,
  CheckCircle2,
  Mic,
  FileAudio,
  Radio,
  Keyboard,
  Download,
} from "lucide-react";

export const HelpGuide: React.FC = () => {
  const faqs = [
    {
      q: "How does AI Voice Cleaner process audio without uploading to external servers?",
      a: "Our core audio engine runs entirely in your browser using the high-performance Web Audio API with 32-bit floating-point OfflineAudioContext rendering. This means instant processing, zero bandwidth usage, and 100% privacy.",
    },
    {
      q: "Which preset level should I choose for my audio?",
      a: "Use 'Balanced' for general voice recordings and memos. Use 'Studio' or 'Podcast' for broadcast clarity and voice warmth. Use 'Meeting' if you are cleaning an online conference call with HVAC or keyboard typing noise.",
    },
    {
      q: "How can I get the cleanest recorded voice from my microphone?",
      a: "Ensure your room is reasonably quiet, position your microphone 4 to 8 inches from your mouth, and enable the 'Pop Filter' and 'Hum Removal' options in the AI Cleaner options.",
    },
    {
      q: "What export format offers the highest quality?",
      a: "Select WAV or FLAC format at 48kHz or 96kHz with 320kbps bitrate for lossless, pristine audio reproduction.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Help & User Guide
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Learn how to use AI Voice Cleaner presets, microphone tools, and export settings.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-[24px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 w-fit">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
            DSP Processing Pipeline
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            The processing chain consists of High-Pass rumble cutoff (&lt;80Hz), 50Hz/60Hz narrow electrical notch filters, adaptive spectral noise gating, 3.2kHz formant voice clarity EQ, dynamic compression, and peak volume normalization to -1.0 dBFS.
          </p>
        </div>

        <div className="p-6 rounded-[24px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-fit">
            <Radio className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
            Presets & Audio Context
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Each preset automatically adjusts noise gate thresholds, EQ curves, and compression ratios. You can override any of the 14 individual toggles in the AI Studio Cleaner tab.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="p-6 rounded-[28px] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/50 space-y-1.5"
            >
              <h3 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{item.q}</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-6 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
