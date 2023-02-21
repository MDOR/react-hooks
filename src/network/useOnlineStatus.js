import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { DEFAULT_DEBOUNCE_TIME, userNavigator } from "../constants";

/**
 * @typedef {Object} onLineStatus
 * @property {boolean} support
 * Specify if the property is supported or not
 * @property {boolean} onLine
 * Actual onLine status from the browser
 *
 * React hook intended to get the online status, from the navigation object
 *
 * @category Network
 *
 * @param    {Object}  [options={}]
 * Configuration object intended to contain the default used by the hook.
 * @param    {boolean} [options.defaultStatus=true]
 * Default online status
 * @param    {number}  [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns  {onLineStatus}
 */
export function useOnlineStatus(options = {}) {
  const support = userNavigator && typeof userNavigator.onLine !== "undefined";

  const [onlineStatus, updateOnlineStatus] = useState({
    support,
    onLine: options.defaultStatus || true,
  });

  useEffect(() => {
    const debouncedGetOnlineStatus = debounce(() => {
      updateOnlineStatus(previousOnLineStatus => ({
        ...previousOnLineStatus,
        onLine: userNavigator.onLine,
      }));
    }, options.wait || DEFAULT_DEBOUNCE_TIME);

    if (userNavigator) {
      window.addEventListener("online", debouncedGetOnlineStatus);
      window.addEventListener("offline", debouncedGetOnlineStatus);
      debouncedGetOnlineStatus();
    }

    return () => {
      if (userNavigator) {
        window.removeEventListener("online", debouncedGetOnlineStatus);
        window.removeEventListener("offline", debouncedGetOnlineStatus);
      }
    };
  }, [options.defaultStatus, options.wait]);

  return onlineStatus;
}
