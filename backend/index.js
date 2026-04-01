import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// ---------- Fastify ----------
const fastify = Fastify({ logger: true });
await fastify.register(cors);

// ---------- Gemini ----------
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ---------- SQLite ----------
const db = new sqlite3.Database("./movies.db");

db.run(`
  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_input TEXT,
    recommended_movies TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ---------- API Route ----------
fastify.post("/recommend", async (request, reply) => {
  const { userInput } = request.body;

  if (!userInput) {
    return reply.code(400).send({ error: "User input required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      
      contents: `
Recommend 3 to 5 movies based on this preference:
"${userInput}"

Return only movie names separated by commas.
      `,
      
    });
    

    const text = response.text;

    // Save to DB
    db.run(
      "INSERT INTO recommendations (user_input, recommended_movies) VALUES (?, ?)",
      [userInput, text]
    );

    return {
      recommendations: text.split(",").map(m => m.trim()),
    };

  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Gemini API error" });
  }
});

// ---------- Server Start ----------
const PORT = process.env.PORT || 3001;

fastify.listen({ port: PORT }, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("Gemini Key Loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");

});
