import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { DEFAULT_DEBOUNCE_TIME, userScreen } from "../constants";

/**
 * @typedef {Object} screenOrientation
 * @property {boolean} support
 *  Specify if the property is supported or not
 * @property {number} angle
 *  Screen angle
 * @property {("portrait-primary"|"portrait-secondary"|"landscape-primary"|"landscape-secondary")} type
 *  Screen orientation type
 *
 * React hook intended to get the browser orientation and angle.
 *
 * @category Browser
 *
 * @param {Object} [options={}]
 * Configuration object intended to contain the default used by the hook.
 * @param {string} [options.defaultOrientation="portrait-primary"]
 * Default height value.
 * @param {number} [options.angle=0]
 * Default width value.
 * @param {number} [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @return {screenOrientation}
 */

export function useScreenOrientation(options = {}) {
  const support =
    userScreen && Boolean(userScreen.orientation || userScreen.mozOrientation || userScreen.msOrientation);

  const [orientation, updateOrientation] = useState({
    support,
    orientation: options.defaultOrientation || "portrait-primary",
    angle: options.angle || 0,
  });

  useEffect(() => {
    function updateOrientationFromBrowser() {
      const { angle, type } = userScreen.orientation || userScreen.mozOrientation || userScreen.msOrientation;

      updateOrientation(previousOrientation => ({
        ...previousOrientation,
        angle,
        orientation: type,
      }));
    }
    const debouncedUpdateOrientationFromBrowser = debounce(
      updateOrientationFromBrowser,
      options.wait || DEFAULT_DEBOUNCE_TIME
    );

    if (support) {
      window.addEventListener("orientationchange", debouncedUpdateOrientationFromBrowser);
      window.addEventListener("resize", debouncedUpdateOrientationFromBrowser);
      debouncedUpdateOrientationFromBrowser();
    }

    return () => {
      if (support) {
        window.removeEventListener("orientationchange", debouncedUpdateOrientationFromBrowser);
        window.removeEventListener("resize", debouncedUpdateOrientationFromBrowser);
      }
    };
  }, [support, options.wait]);

  return orientation;
}
