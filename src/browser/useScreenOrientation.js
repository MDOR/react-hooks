import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { DEFAULT_DEBOUNCE_TIME, userScreen, userWindow } from "../constants";
import { attachEvents, detachEvents } from "../utils";

const supportedOrientationEvents = ["orientationchange", "resize"];

/**
 * @typedef {object} screenOrientation
 * @property {boolean} support
 *  Specify if the feature is supported or not.
 * @property {number} angle
 *  Screen angle.
 * @property {("portrait-primary"|"portrait-secondary"|"landscape-primary"|"landscape-secondary")} type
 *  Screen orientation type.
 *
 * React hook intended to get the browser orientation and angle.
 * @param {object} [options={}]
 * Configuration object intended to contain the default used by the hook.
 * @param {string} [options.defaultOrientation="portrait-primary"]
 * Default height value.
 * @param {number} [options.angle=0]
 * Default width value.
 * @param {number} [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns {screenOrientation}
 * Return screenOrientation object including: support, angle and orientation.
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
    /**
     *
     */
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
      attachEvents(userWindow, supportedOrientationEvents, debouncedUpdateOrientationFromBrowser);
      debouncedUpdateOrientationFromBrowser();
    }

    return () => {
      if (support) {
        detachEvents(userWindow, supportedOrientationEvents, debouncedUpdateOrientationFromBrowser);
      }
    };
  }, [support, options.wait]);

  return orientation;
}
