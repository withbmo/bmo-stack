function readPort(): number {
  const rawPort = process.env.PORT ?? "3001";
  const parsedPort = Number.parseInt(rawPort, 10);

  if (Number.isNaN(parsedPort)) {
    throw new Error(`Invalid PORT value "${rawPort}"`);
  }

  return parsedPort;
}

export const env = {
  port: readPort(),
} as const;
