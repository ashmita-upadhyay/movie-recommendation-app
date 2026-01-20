import dotenv from "dotenv";
import { buildApp } from "./app.js";

dotenv.config();

const fastify = buildApp();

const PORT = process.env.PORT || 3001;

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log("🚀 Backend running on:", address);
});
