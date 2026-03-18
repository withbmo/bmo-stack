import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { listenHost } from "./lib/server.js";

const app = buildApp();

app.listen({ host: listenHost(), port: env.port }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
