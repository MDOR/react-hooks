import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { IS_BROWSER, DEFAULT_DEBOUNCE_TIME } from "../constants";

const DEFAULT_SIZE = {
  height: 0,
  width: 0,
};

/**
 * React hook intended to get the browser dimensions. (Includes the inner height/width, without interface elements like toolbars and scrollbars)
 * @category Browser
 * @param {Object} [options={}]        Configuration object intended to contain the default used by the hook.
 * @param {number} [options.height=0]
 * Default height value.
 * @param {number} [options.width=0]
 * Default width value.
 * @param {number} [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns {Function}                 Returns React hook that will return browser width and browser height
 */
export function useBrowserDimensions(options = {}) {
  const userWindow = IS_BROWSER && window;
  const userDocument = IS_BROWSER && document;
  const userDocumentElement = userDocument && userDocument.documentElement;
  const userBodyElement = userDocument && userDocument.getElementsByTagName("body")[0];

  const [dimensions, updateBrowserDimensions] = useState({
    height: Number.isFinite(options.height) ? options.height : DEFAULT_SIZE.height,
    width: Number.isFinite(options.width) ? options.width : DEFAULT_SIZE.width,
  });

  useEffect(() => {
    function updateDimensionsFromBrowser() {
      // This variables return the dimensions
      const width = userWindow.innerWidth || userDocumentElement.clientWidth || userBodyElement.clientWidth || 0;
      const height = userWindow.innerHeight || userDocumentElement.clientHeight || userBodyElement.clientHeight || 0;

      updateBrowserDimensions({ width, height });
    }

    const debouncedUpdateFromBrowser = debounce(updateDimensionsFromBrowser, options.wait || DEFAULT_DEBOUNCE_TIME);

    if (!userWindow) return dimensions;

    document.addEventListener("DOMContentLoaded", debouncedUpdateFromBrowser);
    window.addEventListener("DOMContentLoaded", debouncedUpdateFromBrowser);
    window.addEventListener("resize", debouncedUpdateFromBrowser);
    debouncedUpdateFromBrowser();

    return () => {
      document.removeEventListener("DOMContentLoaded", debouncedUpdateFromBrowser);
      window.removeEventListener("DOMContentLoaded", debouncedUpdateFromBrowser);
      window.removeEventListener("resize", debouncedUpdateFromBrowser);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDocumentElement, userBodyElement]);

  return dimensions;
}
