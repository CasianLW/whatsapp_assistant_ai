// baileys-logger.ts
// Define a simple logger that Baileys can use
export const baileysLogger = {
  debug: (msg: string) => console.debug(`[Baileys Debug] ${msg}`),
  info: (msg: string) => console.info(`[Baileys Info] ${msg}`),
  warn: (msg: string) => console.warn(`[Baileys Warn] ${msg}`),
  error: (msg: string) => console.error(`[Baileys Error] ${msg}`),
};
