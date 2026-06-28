// ─── Simple structured logger for the Notification Platform ───────────────────

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_PREFIX = "[Notification]";

function formatMessage(level: LogLevel, context: string, message: string, meta?: any): string {
  const ts = new Date().toISOString();
  const base = `${ts} ${LOG_PREFIX}[${level.toUpperCase()}][${context}] ${message}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
}

export const notificationLogger = {
  debug: (context: string, message: string, meta?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(formatMessage("debug", context, message, meta));
    }
  },
  info: (context: string, message: string, meta?: any) => {
    console.info(formatMessage("info", context, message, meta));
  },
  warn: (context: string, message: string, meta?: any) => {
    console.warn(formatMessage("warn", context, message, meta));
  },
  error: (context: string, message: string, meta?: any) => {
    console.error(formatMessage("error", context, message, meta));
  },
};
