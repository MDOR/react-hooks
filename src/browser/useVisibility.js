import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { DEFAULT_DEBOUNCE_TIME, userDocument } from "../constants";

/**
 * @typedef {Object} visibilityStatus
 * @property {boolean} support
 * Specify if the property is supported or not
 * @property {boolean} visibility
 * Actual visibility status from the browser
 *
 * React hook intended to get browser's visibility status
 *
 * @category Browser
 *
 * @param    {Object}  [options={}]
 * Configuration object intended to contain the default used by the hook.
 * @param    {boolean} [options.defaultVisibility=true]
 * Default visibility status
 * @param    {number}  [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns  {visibilityStatus}
 */
export function useVisibility(options = {}) {
  const [_, eventType] =
    [
      ["hidden", "visibilitychange"],
      ["msHidden", "msvisibilitychange"],
      ["webkitHidden", "webkitvisibilitychange"],
    ].find(([prop]) => userDocument && userDocument[prop]) || [];

  const support = Boolean(eventType);
  const [visibility, updateVisibility] = useState({
    support,
    visibility: options.defaultVisibility || true,
  });

  useEffect(() => {
    const debouncedUpdateVisibility = debounce(event => {
      updateVisibility(previousState => ({
        ...previousState,
        visibility: event.target.visibilityState === "visible",
      }));
    }, options.wait || DEFAULT_DEBOUNCE_TIME);

    if (eventType) userDocument.addEventListener(eventType, debouncedUpdateVisibility);

    return () => {
      if (eventType) userDocument.removeEventListener(eventType, debouncedUpdateVisibility);
    };
  }, [eventType, options.wait]);

  return visibility;
}
