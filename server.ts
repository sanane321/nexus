import fs from "node:fs/promises";
import express from "express";
import path from "node:path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini Setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/analyze-telemetry", async (req, res) => {
  try {
    const { deviceData } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following IoT telemetry data for potential issues or optimizations: ${JSON.stringify(deviceData)}. Provide a brief, professional summary with actionable insights.`,
    });
    res.json({ analysis: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to analyze telemetry" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(path.join(distPath, "client"), { index: false }));
  }

  app.get("*", async (req, res) => {
    const url = req.originalUrl;

    try {
      let template: string;
      let render: any;

      if (process.env.NODE_ENV !== "production") {
        template = await fs.readFile(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        const distPath = path.join(process.cwd(), "dist");
        template = await fs.readFile(path.resolve(distPath, "client/index.html"), "utf-8");
        // @ts-ignore
        render = (await import("./dist/server/entry-server.js")).render;
      }

      const { html: appHtml, head: headHtml } = render(url);
      let html = template.replace(`<!--ssr-outlet-->`, appHtml);
      html = html.replace(`<!--ssr-head-->`, headHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") {
        vite.ssrFixStacktrace(e);
      }
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
