import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { DEFAULT_DEBOUNCE_TIME, userNavigator, userWindow } from "../constants";
import { attachEvents, detachEvents } from "../utils";

const supportedOnLineEvents = ["online", "offline"];

/**
 * @typedef {object} onLineStatus
 * @property {boolean} support
 * Specify if the feature is supported or not.
 * @property {boolean} onLine
 * Actual onLine status from the browser.
 * @description
 * React hook intended to get the online status, from the navigation object.
 * @param    {object}  [options={}]
 * Configuration object intended to contain the default used by the hook.
 * @param    {boolean} [options.defaultStatus=true]
 * Default online status
 * @param    {number}  [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns  {onLineStatus}
 * Return onLine status  object, including: support and online status.
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
      attachEvents(userWindow, supportedOnLineEvents, debouncedGetOnlineStatus);
      debouncedGetOnlineStatus();
    }

    return () => {
      if (userNavigator) {
        detachEvents(userWindow, supportedOnLineEvents, debouncedGetOnlineStatus);
      }
    };
  }, [options.defaultStatus, options.wait]);

  return onlineStatus;
}
