import { fastify } from "fastify";

const app = fastify({ logger: true });

app.get("/health", async () => ({ status: "ok" }));

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT ?? 3001), host: "0.0.0.0" });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
