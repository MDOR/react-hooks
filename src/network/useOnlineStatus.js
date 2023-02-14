import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { IS_BROWSER, DEFAULT_DEBOUNCE_TIME } from "../constants";

/**
 * React hook intended to get the online status, from the navigation object
 * @category Network
 * @param    {Object}  [options={}]
 * Configuration object intended to contain the default used by the hook.
 * @param    {boolean} [options.defaultStatus=true]
 * Default online status
 * @param    {number}  [options.wait=80]
 * The number of milliseconds to delay from the last event.*
 * @returns  {Function}           Returns React hook that will return browser width and browser height
 */
export function useOnlineStatus(options = {}) {
  const userWindow = IS_BROWSER && window;
  const [onlineStatus, updateOnlineStatus] = useState(options.defaultStatus || true);

  useEffect(() => {
    const debouncedGetOnlineStatus = debounce(() => {
      updateOnlineStatus(typeof navigator.onLine === "boolean" ? navigator.onLine : options.defaultStatus);
    }, options.wait || DEFAULT_DEBOUNCE_TIME);

    if (!userWindow || !navigator) {
      window.addEventListener("online", debouncedGetOnlineStatus);
      window.addEventListener("offline", debouncedGetOnlineStatus);
      debouncedGetOnlineStatus();
    }
    return () => {
      if (!userWindow || !navigator) {
        window.removeEventListener("online", debouncedGetOnlineStatus);
        window.removeEventListener("offline", debouncedGetOnlineStatus);
      }
    };
  }, [options.defaultStatus, options.wait, userWindow]);

  return onlineStatus;
}
