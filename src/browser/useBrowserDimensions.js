import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE, userWindow, userDocument } from "../constants";
import { attachEvents, detachEvents } from "../utils";

const supportedDimensionEvents = ["DOMContentLoaded", "resize"];
/**
 * @typedef {object} browserDimensions
 * @property {number} height
 * Browser height without interface elements.
 * @property {number} width
 * Browser width without interface elements.
 * @description
 * React hook intended to get the browser dimensions.
 * It does not include interface elements like toolbars and scrollbars.
 * @param {object} [options={}]
 * React Hook configuration options.
 * @param {number} [options.height=0]
 * Default height value.
 * @param {number} [options.width=0]
 * Default width value.
 * @param {number} [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns {browserDimensions} Browseer dimension's objects, inclyding height and width.
 */
export function useBrowserDimensions(options = {}) {
  const userDocumentElement = userDocument && userDocument.documentElement;
  const userBodyElement = userDocument && userDocument.getElementsByTagName("body")[0];

  const [dimensions, updateBrowserDimensions] = useState({
    height: Number.isFinite(options.height) ? options.height : DEFAULT_SIZE.height,
    width: Number.isFinite(options.width) ? options.width : DEFAULT_SIZE.width,
  });

  useEffect(() => {
    const debouncedUpdateFromBrowser = debounce(function updateDimensionsFromBrowser() {
      const width =
        userWindow.innerWidth || userDocumentElement.clientWidth || userBodyElement.clientWidth || DEFAULT_SIZE.width;
      const height =
        userWindow.innerHeight ||
        userDocumentElement.clientHeight ||
        userBodyElement.clientHeight ||
        DEFAULT_SIZE.height;

      updateBrowserDimensions({ width, height });
    }, options.wait || DEFAULT_DEBOUNCE_TIME);

    if (userWindow) {
      attachEvents(userWindow, supportedDimensionEvents, debouncedUpdateFromBrowser);
      debouncedUpdateFromBrowser();
    }

    return () => {
      if (userWindow) {
        detachEvents(userWindow, supportedDimensionEvents, debouncedUpdateFromBrowser);
      }
    };
  }, [userDocumentElement, userBodyElement, options.wait]);

  return dimensions;
}
