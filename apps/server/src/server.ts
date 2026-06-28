import { buildApp } from "./app";
import { initSocketServer } from "./modules/realtime";

const app = buildApp();
initSocketServer(app.server);

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT ?? 3001), host: "0.0.0.0" });
    app.log.info(`Server and Socket.IO listening on port ${process.env.PORT ?? 3001}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
