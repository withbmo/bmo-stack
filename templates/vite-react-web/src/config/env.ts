function readAppName(): string {
  return import.meta.env.VITE_APP_NAME?.trim() || "Pytholit Vite React Web";
}

export const env = {
  appName: readAppName(),
} as const;
