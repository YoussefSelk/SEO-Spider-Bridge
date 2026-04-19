import Fastify, { type FastifyInstance } from "fastify";

export const buildApp = (): FastifyInstance => {
  const app = Fastify({
    logger: false,
  });

  app.get("/ping", async () => {
    return { status: "ok" };
  });

  return app;
};
