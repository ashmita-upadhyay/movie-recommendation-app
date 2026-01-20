import Fastify from "fastify";
import dotenv from "dotenv";
import db from "./db.js";
import cors from "@fastify/cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

export function buildApp() {
  const fastify = Fastify({ logger: true });

  fastify.register(cors, { origin: "*" });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  fastify.get("/api", async () => ({ status: "API running" }));

  fastify.post("/api/recommend", async (request, reply) => {
    const { userInput } = request.body;
    if (!userInput) return reply.status(400).send({ error: "userInput is required" });

    const prompt = `
      Suggest 5 movies based on this preference:
      "${userInput}"
      Return only movie names separated by commas.
    `;

    let text = "";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
      });
      text = response.text;
    } catch (err) {
      console.error("Gemini error:", err);
      text = "Movie 1, Movie 2, Movie 3, Movie 4, Movie 5";
    }

    const movies = text.split(",").map((m) => m.trim());

    db.run(
      "INSERT INTO recommendations (user_input, recommended_movies) VALUES (?, ?)",
      [userInput, movies.join(", ")]
    );

    return { recommendations: movies };
  });

  return fastify;
}
