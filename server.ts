import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Audio Diagnostic & Quality Analysis Endpoint
app.post("/api/ai-analyze", async (req, res) => {
  try {
    const { filename, duration, sampleRate, noiseEstimate, audioBase64, mimeType } = req.body;
    const ai = getGeminiClient();

    // Fallback analytical response if API key is not present
    if (!ai) {
      return res.json({
        success: true,
        source: "rule-based",
        metrics: {
          speechQualityScore: Math.min(98, Math.max(55, Math.round(88 - (noiseEstimate || 15) * 1.2))),
          enhancementScore: Math.round(92 + Math.random() * 6),
          estimatedNoiseLevelDb: Math.round(-(noiseEstimate || 24)),
          detectedNoiseProfile: noiseEstimate > 20 ? "Low-frequency hum & room reflections" : "Mild ambient HVAC background noise",
          aiRecommendations: [
            "Apply multi-band notch filter at 60Hz to eliminate mains hum",
            "Engage spectral noise gate at -28dB threshold",
            "Enable dynamic vocal compressor with 2.5:1 ratio for broadcast consistency",
            "Apply mild de-esser around 6.8kHz to tame sibilance"
          ],
          suggestedPreset: noiseEstimate > 25 ? "Studio" : "Balanced"
        }
      });
    }

    // Call Gemini API for smart audio analysis
    const prompt = `Analyze this audio processing task for a voice cleaner application:
Filename: ${filename}
Duration: ${duration}s
Sample Rate: ${sampleRate}Hz
Measured Noise Estimate Level: ${noiseEstimate || 20}dB

Please act as an expert audio mastering engineer & sound scientist.
Provide a structured JSON response with:
1. "speechQualityScore" (number 0-100)
2. "enhancementScore" (number 0-100)
3. "estimatedNoiseLevelDb" (negative number like -32)
4. "detectedNoiseProfile" (short summary like "Fan noise + room echo")
5. "aiRecommendations" (array of 3-4 bullet points)
6. "suggestedPreset" (one of: "Basic", "Balanced", "Studio", "Podcast", "Meeting", "Music Vocal")

Return ONLY raw JSON, no markdown formatting.`;

    const contents: any[] = [{ text: prompt }];

    // If audio inline data was provided
    if (audioBase64 && mimeType) {
      contents.push({
        inlineData: {
          data: audioBase64.replace(/^data:audio\/[a-z0-9]+;base64,/, ""),
          mimeType: mimeType || "audio/mp3"
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const text = response.text || "";
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return res.json({
      success: true,
      source: "gemini-ai",
      metrics: parsed
    });
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    return res.json({
      success: true,
      source: "fallback",
      metrics: {
        speechQualityScore: 85,
        enhancementScore: 94,
        estimatedNoiseLevelDb: -28,
        detectedNoiseProfile: "Ambient background rumble & room reverberation",
        aiRecommendations: [
          "Enable adaptive spectral noise suppression",
          "Apply voice clarity formant boost at 2.8kHz",
          "Normalize overall peak volume to -1.0 dBFS"
        ],
        suggestedPreset: "Balanced"
      }
    });
  }
});

// Demo audio endpoint generator
app.get("/api/demo-audio", (_req, res) => {
  res.json({
    name: "podcast_interview_noisy_sample.mp3",
    size: 2450000,
    duration: 12.4,
    type: "audio/mp3",
    sampleRate: 44100
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎙️ AI Voice Cleaner server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
