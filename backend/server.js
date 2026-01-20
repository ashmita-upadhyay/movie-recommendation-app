import Fastify from "fastify";
import dotenv from "dotenv";
import db from "./db.js";
import cors from "@fastify/cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: "*",
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

fastify.get("/api", async () => {
  return { status: "API is running" };
});

fastify.post("/api/recommend", async (request, reply) => {
  try {
    const { userInput } = request.body;

    if (!userInput) {
      return reply.status(400).send({ error: "userInput is required" });
    }

    const prompt = `
      Suggest 5 movies based on this preference:
      "${userInput}"
      Return only movie names separated by commas.
    `;

    let text = "";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      text = response?.text;
      if (!text) throw new Error("No text returned from Gemini");

    } catch (apiErr) {
      console.error("Gemini API Error:", apiErr);
      text = "Movie 1, Movie 2, Movie 3, Movie 4, Movie 5";
    }

    const movies = text
      .split(",")
      .map(movie => movie.trim())
      .filter(Boolean);

    db.run(
      "INSERT INTO recommendations (user_input, recommended_movies) VALUES (?, ?)",
      [userInput, movies.join(", ")]
    );

    return { recommendations: movies };

  } catch (err) {
    console.error("Error in /recommend:", err);
    reply.status(500).send({ error: "Server error" });
  }
});

export default async function handler(req, res) {
  await fastify.ready();
  fastify.server.emit("request", req, res);
}
