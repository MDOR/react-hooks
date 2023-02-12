// Environment specific
export const IS_BROWSER = typeof window !== "undefined" && typeof document !== "undefined";
export const IS_PRODUCTION = process?.env?.NODE_ENV === "production";

// General
export const DEFAULT_DEBOUNCE_TIME = 80;
