import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { IS_BROWSER, DEFAULT_DEBOUNCE_TIME } from "../constants";

const DEFAULT_SIZE = {
  height: 0,
  width: 0,
};

/**
 * React hook intended to get the screen dimensions. (Includes the inner height/width, without interface elements like toolbars and scrollbars)
 * @category Browser
 * @param {Object} [options={}]        Configuration object intended to contain the default used by the hook.
 * @param {number} [options.height=0]
 * Default height value.
 * @param {number} [options.width=0]
 * Default width value.
 * @param {number} [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns {Function}                 Returns React hook that will return screen width and screen height
 */
export function useScreenDimensions(options = {}) {
  const userScreen = IS_BROWSER && screen;

  const [dimensions, updateScreenDimensions] = useState({
    height: Number.isFinite(options.height) ? options.height : DEFAULT_SIZE.height,
    width: Number.isFinite(options.width) ? options.width : DEFAULT_SIZE.width,
  });

  useEffect(() => {
    function updateDimensionsFromScreen() {
      const width = window.screen.availWidth || DEFAULT_SIZE.height;
      const height = window.screen.availHeight || DEFAULT_SIZE.width;

      updateScreenDimensions({ width, height });
    }

    const debouncedUpdateFromBrowser = debounce(updateDimensionsFromScreen, options.wait || DEFAULT_DEBOUNCE_TIME);

    if (screen.orientation) {
      screen.addEventListener("orientationchange", debouncedUpdateFromBrowser);
      debouncedUpdateFromBrowser();
    }

    return () => {
      if (screen.orientation) {
        screen.removeEventListener("orientationchange", debouncedUpdateFromBrowser);
      }
    };
  }, [userScreen, options.wait]);

  return dimensions;
}
