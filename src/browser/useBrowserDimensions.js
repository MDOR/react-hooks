import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE, userWindow, userDocument } from "../constants";

/**
 * @typedef {Object} browserDimensions
 * @property {number} height
 *  Browser height without interface elements
 * @property {number} width
 *  Browser width without interface elements
 *
 * React hook intended to get the browser dimensions. (Includes the inner height/width, without interface elements like toolbars and scrollbars)
 *
 * @category Browser
 *
 * @param {Object} [options={}]        Configuration object intended to contain the default used by the hook.
 * @param {number} [options.height=0]
 * Default height value.
 * @param {number} [options.width=0]
 * Default width value.
 * @param {number} [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns {browserDimensions}
 */
export function useBrowserDimensions(options = {}) {
  const userDocumentElement = userDocument && userDocument.documentElement;
  const userBodyElement = userDocument && userDocument.getElementsByTagName("body")[0];

  const [dimensions, updateBrowserDimensions] = useState({
    height: Number.isFinite(options.height) ? options.height : DEFAULT_SIZE.height,
    width: Number.isFinite(options.width) ? options.width : DEFAULT_SIZE.width,
  });

  useEffect(() => {
    function updateDimensionsFromBrowser() {
      const width =
        userWindow.innerWidth || userDocumentElement.clientWidth || userBodyElement.clientWidth || DEFAULT_SIZE.width;
      const height =
        userWindow.innerHeight ||
        userDocumentElement.clientHeight ||
        userBodyElement.clientHeight ||
        DEFAULT_SIZE.height;

      updateBrowserDimensions({ width, height });
    }

    const debouncedUpdateFromBrowser = debounce(updateDimensionsFromBrowser, options.wait || DEFAULT_DEBOUNCE_TIME);

    if (userWindow) {
      document.addEventListener("DOMContentLoaded", debouncedUpdateFromBrowser);
      window.addEventListener("DOMContentLoaded", debouncedUpdateFromBrowser);
      window.addEventListener("resize", debouncedUpdateFromBrowser);
      debouncedUpdateFromBrowser();
    }

    return () => {
      if (userWindow) {
        document.removeEventListener("DOMContentLoaded", debouncedUpdateFromBrowser);
        window.removeEventListener("DOMContentLoaded", debouncedUpdateFromBrowser);
        window.removeEventListener("resize", debouncedUpdateFromBrowser);
      }
    };
  }, [userDocumentElement, userBodyElement, options.wait]);

  return dimensions;
}
