export function getServiceStatus() {
  return {
    service: "fastify-api",
    ok: true,
    message: "Pytholit Fastify template is running",
  } as const;
}
