function readAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME?.trim() || "Pytholit Next Web";
}

export const env = {
  appName: readAppName(),
} as const;
