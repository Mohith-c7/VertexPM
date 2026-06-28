export const skillLogger = {
  info: (message: string, meta?: any) => {
    console.log(`[AI Skill] INFO: ${message}`, meta ? meta : '');
  },
  error: (message: string, meta?: any) => {
    console.error(`[AI Skill] ERROR: ${message}`, meta ? meta : '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[AI Skill] WARN: ${message}`, meta ? meta : '');
  },
  debug: (message: string, meta?: any) => {
    console.debug(`[AI Skill] DEBUG: ${message}`, meta ? meta : '');
  }
};
