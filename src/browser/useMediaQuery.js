import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { DEFAULT_DEBOUNCE_TIME, userWindow } from "../constants";

/**
 * React hook intended to test any given media query string and return if it a match or not
 *
 * @category Browser
 *
 * @param {string} mediaQuery
 * Given media query to be tested
 * @param {Object} [options={}]
 * Configuration object intended to contain the default used by the hook.
 * @param {boolean} [options.defaultValue=false]
 * Default value if this is match or not
 * @param {number} [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns {boolean}
 **/

export function useMediaQuery(query, options = {}) {
  const [match, updateMatch] = useState(options.defaultValue || false);

  useEffect(() => {
    function updateMatchFromMatchMedia() {
      const { matches } = userWindow.matchMedia(query);
      updateMatch(matches);
    }
    const debouncedUpdateMatchFromMatchMedia = debounce(
      updateMatchFromMatchMedia,
      options.wait || DEFAULT_DEBOUNCE_TIME
    );

    if (userWindow && userWindow.matchMedia) {
      userWindow.matchMedia.addEventListener("change", debouncedUpdateMatchFromMatchMedia);
      debouncedUpdateMatchFromMatchMedia();
    }

    return () => {
      if (userWindow && userWindow.matchMedia) {
        userWindow.matchMedia.removeEventListener("change", debouncedUpdateMatchFromMatchMedia);
      }
    };
  }, [query, options.wait]);

  return match;
}
