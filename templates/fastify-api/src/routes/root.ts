import type { FastifyInstance } from "fastify";

import { getServiceStatus } from "../services/status-service.js";

export async function registerRootRoutes(app: FastifyInstance) {
  app.get("/", async () => getServiceStatus());
}
