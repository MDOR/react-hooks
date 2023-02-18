// Environment specific
export const IS_BROWSER = typeof window !== "undefined" && typeof document !== "undefined";
export const IS_PRODUCTION = process?.env?.NODE_ENV === "production";

// Browser / Screen
export const userWindow = IS_BROWSER && window;
export const userDocument = IS_BROWSER && document;
export const userScreen = IS_BROWSER && screen;
export const userNavigator = IS_BROWSER && navigator;
export const userNavigatorConnection = userNavigator && userNavigator.connection;

export const DEFAULT_SIZE = {
  height: 0,
  width: 0,
};

// General
export const DEFAULT_DEBOUNCE_TIME = 80;
