import Fastify from "fastify";

import { registerHealthRoutes } from "./routes/health.js";
import { registerRootRoutes } from "./routes/root.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  void registerRootRoutes(app);
  void registerHealthRoutes(app);

  return app;
}
