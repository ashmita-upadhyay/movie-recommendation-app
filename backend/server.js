import { buildApp } from "./app.js";

const fastify = buildApp();

fastify.listen({ port: process.env.PORT || 3001, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Backend running on:", address);
});
