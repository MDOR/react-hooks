import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { DEFAULT_DEBOUNCE_TIME, userNavigator } from "../constants";
import { attachEvents, detachEvents } from "../utils";

const supportedBatteryEvents = ["levelchange", "chargingchange", "chargingtimechange", "dischargingtimechange"];

/**
 * @typedef {object} battery
 * @property {boolean} support
 * If this feature is supported by any browser.
 * @property {boolean} charging
 * Reflect if the device is charging.
 * @property {number} chargingTime
 * Time to charge device.
 * @property {number} dischargingTime
 * Time to charge device.
 * @property {number} levelCharging
 * Device charging level.
 * @description
 * React hook intended to get battery status.
 * This feature still as an experimental, for more information check:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API#browser_compatibility Compatibility table}
 * @param {object} [options={}]
 * React Hook configuration options.
 * @param {number} [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns {battery}
 * Battery object including: support, charging, chargingTime, dischargingTime and levelCharging.
 */
export function useBattery(options = {}) {
  // Support is limited by browser and constrained to the HTTPS context
  const support = userNavigator && typeof userNavigator.getBattery === "function";

  const [battery, updateBattery] = useState({
    support,
    charging: false,
    chargingTime: 0,
    dischargingTime: 0,
    level: 0,
  });
  // Battery object is available using a promise to the "getBattery" method. For this reason, we cannot get it directly
  const [userBattery, updateUserBattery] = useState(null);

  useEffect(() => {
    async function checkIfBatteryIsAvailable() {
      if (!support) return console.log("Battery API is not supported.");

      const batteryObject = await userNavigator.getBattery();
      if (batteryObject) updateUserBattery(batteryObject);
    }

    checkIfBatteryIsAvailable();
  }, [support]);

  useEffect(() => {
    const debouncedGetBatteryStats = debounce(() => {
      // The event won't get any Event Type as parameter, instead we shold rely in the battery instance.
      const { level, charging, chargingTime, dischargingTime } = userBattery;

      updateBattery(previousBattery => ({
        ...previousBattery,
        level,
        charging,
        chargingTime,
        dischargingTime,
      }));
    }, options.wait || DEFAULT_DEBOUNCE_TIME);

    if (userBattery) {
      attachEvents(userBattery, supportedBatteryEvents, debouncedGetBatteryStats);
      debouncedGetBatteryStats();
    }

    return () => {
      if (userBattery) {
        detachEvents(userBattery, supportedBatteryEvents, debouncedGetBatteryStats);
      }
    };
  }, [userBattery, options.wait]);

  return battery;
}
