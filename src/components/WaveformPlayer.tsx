import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Repeat,
  ZoomIn,
  ZoomOut,
  Scissors,
  Sparkles,
  ArrowRightLeft,
  Sliders,
} from "lucide-react";
import { AudioItem } from "../types";

interface WaveformPlayerProps {
  item: AudioItem;
  onTrimUpdate?: (start: number, end: number) => void;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({ item, onTrimUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChannel, setActiveChannel] = useState<"cleaned" | "original">("cleaned");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(item.metadata.duration || 10);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [trimStart, setTrimStart] = useState(item.trimStart || 0);
  const [trimEnd, setTrimEnd] = useState(item.trimEnd || item.metadata.duration || 10);

  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cleanedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync audio source when channel changes or item changes
  useEffect(() => {
    if (audioRef.current) {
      const isWasPlaying = isPlaying;
      audioRef.current.pause();

      const src = activeChannel === "cleaned" ? item.cleanedUrl : item.originalUrl;
      if (src) {
        audioRef.current.src = src;
        audioRef.current.currentTime = currentTime;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.loop = isLooping;

        if (isWasPlaying) {
          audioRef.current.play().catch(console.warn);
        }
      }
    }
  }, [activeChannel, item]);

  useEffect(() => {
    setDuration(item.metadata.duration || 10);
    setTrimEnd(item.trimEnd || item.metadata.duration || 10);
  }, [item]);

  // Draw Waveforms on Canvases
  useEffect(() => {
    if (item.originalBuffer) {
      drawWaveform(originalCanvasRef.current, item.originalBuffer, "#a5b4fc", currentTime, zoomLevel, true);
    }
    if (item.cleanedBuffer) {
      drawWaveform(cleanedCanvasRef.current, item.cleanedBuffer, "#4f46e5", currentTime, zoomLevel, false);
    }
  }, [item, currentTime, zoomLevel]);

  function drawWaveform(
    canvas: HTMLCanvasElement | null,
    buffer: AudioBuffer,
    color: string,
    timePos: number,
    zoom: number,
    isRaw: boolean
  ) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / (width * zoom));
    const amp = height / 2;

    // Draw baseline
    ctx.strokeStyle = isRaw ? "rgba(165, 180, 252, 0.2)" : "rgba(79, 70, 229, 0.15)";
    ctx.beginPath();
    ctx.moveTo(0, amp);
    ctx.lineTo(width, amp);
    ctx.stroke();

    // Draw bars
    ctx.fillStyle = color;
    for (let i = 0; i < width; i += 3) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      const y1 = (1 + min) * amp;
      const y2 = (1 + max) * amp;
      const barHeight = Math.max(3, y2 - y1);
      
      // Rounded bar look
      ctx.beginPath();
      ctx.roundRect(i, amp - barHeight / 2, 2, barHeight, 2);
      ctx.fill();
    }

    // Draw Playhead Line
    const progress = timePos / (buffer.duration || 1);
    const playX = progress * width;

    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playX, 0);
    ctx.lineTo(playX, height);
    ctx.stroke();
  }

  function handlePlayPause() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const newTime = ratio * duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }

  function handleTimeUpdate() {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      setCurrentTime(cur);

      // Enforce loop / trim bounds
      if (cur >= trimEnd) {
        if (isLooping) {
          audioRef.current.currentTime = trimStart;
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    }
  }

  function toggleMute() {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  }

  function handleVolumeChange(val: number) {
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  }

  function formatTime(secs: number) {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${mins}:${remaining.toString().padStart(2, "0")}.${ms}`;
  }

  return (
    <div className="space-y-6">
      <audio
        ref={audioRef}
        src={activeChannel === "cleaned" ? item.cleanedUrl : item.originalUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-zinc-100">
            Audio Workbench
          </h1>
          <p className="text-[#86868B] text-sm">
            Editing: <span className="font-medium text-[#1D1D1F] dark:text-zinc-200">{item.filename}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveChannel(activeChannel === "cleaned" ? "original" : "cleaned")}
            className="px-4 py-2 bg-white dark:bg-zinc-800 border border-[#D2D2D7] dark:border-zinc-700 rounded-full text-sm font-medium shadow-sm hover:bg-[#F5F5F7] dark:hover:bg-zinc-700 text-[#1D1D1F] dark:text-zinc-200 transition-colors"
          >
            {activeChannel === "cleaned" ? "Preview Original" : "Listening Raw"}
          </button>
          <button
            onClick={() => setActiveChannel("cleaned")}
            className="px-5 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all"
          >
            Enhanced Output Active
          </button>
        </div>
      </header>

      {/* Waveform Comparison Section */}
      <section className="flex flex-col gap-4">
        {/* Raw Signal Card */}
        <div className="bg-white/80 dark:bg-zinc-900/60 border border-[#D2D2D7]/50 dark:border-zinc-800 rounded-[20px] p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868B]">
              Raw Input Signal
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 bg-red-100 text-red-600 rounded">
              Noise & Clipping
            </span>
          </div>
          <div
            onClick={handleSeek}
            className="h-20 w-full bg-[#F4F4F7] dark:bg-zinc-950 rounded-xl overflow-hidden cursor-pointer relative"
          >
            <canvas ref={originalCanvasRef} width={800} height={80} className="w-full h-full opacity-60" />
          </div>
        </div>

        {/* AI Enhanced Waveform Card */}
        <div className="bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800/80 rounded-[20px] p-6 shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-50/20 pointer-events-none"></div>
          <div className="relative flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Enhanced Output
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded">
              Cleaned & Balanced
            </span>
          </div>
          <div
            onClick={handleSeek}
            className="relative h-28 w-full bg-[#FAFBFD] dark:bg-zinc-950 rounded-xl overflow-hidden cursor-pointer border border-indigo-100 dark:border-zinc-800"
          >
            <canvas ref={cleanedCanvasRef} width={800} height={112} className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-[#D2D2D7]/50 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveChannel(activeChannel === "cleaned" ? "original" : "cleaned");
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>A/B Switch</span>
          </button>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2.5 rounded-full text-xs transition-colors ${
              isLooping
                ? "bg-amber-500 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        <div className="font-mono text-xs font-bold text-[#1D1D1F] dark:text-zinc-200">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-[#86868B] hover:text-[#1D1D1F]">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
              className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-[#86868B] w-6 text-center">
              {zoomLevel}x
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(4, zoomLevel + 0.5))}
              className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid from Design Mockup */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-[#D2D2D7]/50 dark:border-zinc-800 flex flex-col">
          <span className="text-[11px] font-bold text-[#86868B] uppercase">Clarity Score</span>
          <span className="text-2xl font-semibold text-[#1D1D1F] dark:text-zinc-100">94%</span>
          <div className="w-full h-1 bg-gray-100 dark:bg-zinc-800 rounded-full mt-2">
            <div className="w-[94%] h-full bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-[#D2D2D7]/50 dark:border-zinc-800 flex flex-col">
          <span className="text-[11px] font-bold text-[#86868B] uppercase">Noise Reduced</span>
          <span className="text-2xl font-semibold text-[#1D1D1F] dark:text-zinc-100">-18dB</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Significant improvement
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-[#D2D2D7]/50 dark:border-zinc-800 flex flex-col">
          <span className="text-[11px] font-bold text-[#86868B] uppercase">Duration</span>
          <span className="text-2xl font-semibold text-[#1D1D1F] dark:text-zinc-100">
            {formatTime(duration)}
          </span>
          <span className="text-[10px] text-[#86868B] mt-1">Processed in ~0.8s</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-[#D2D2D7]/50 dark:border-zinc-800 flex flex-col">
          <span className="text-[11px] font-bold text-[#86868B] uppercase">Format</span>
          <span className="text-2xl font-semibold text-[#1D1D1F] dark:text-zinc-100">WAV</span>
          <span className="text-[10px] text-[#86868B] mt-1">48kHz • 24-bit PCM</span>
        </div>
      </div>
    </div>
  );
};
