import { buildApp } from "./app.js";

const fastify = buildApp();

export default async function handler(req, res) {
  await fastify.ready();
  fastify.server.emit("request", req, res);
}
