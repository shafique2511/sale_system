import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Routes
  app.post("/api/ai/insights", async (req, res) => {
    try {
      const { context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      const genAI = new GoogleGenAI({ apiKey });
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      
      const prompt = `You are an expert business consultant for a small business management platform called OmniBiz. 
        Given the following business state, provide 3 short, actionable insights or recommendations.
        Format your response as a JSON array of objects with "title", "insight", and "impact" (High/Medium/Low).
        
        Business Context:
        ${context}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json(JSON.parse(response.text() || "[]"));
    } catch (error) {
      console.error("AI Insights Error:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { question, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      const genAI = new GoogleGenAI({ apiKey });
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: `You are OmniAssistant, the intelligent helper for the OmniBiz management platform. 
          You have access to the business's current state. 
          Help the user with their questions about their business, inventory, staff, or customers.
          Be professional, helpful, and concise.
          
          Context: ${context}`,
      });

      const result = await model.generateContent(question);
      const response = await result.response;
      res.json({ text: response.text() });
    } catch (error) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: "Failed to process chat" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
