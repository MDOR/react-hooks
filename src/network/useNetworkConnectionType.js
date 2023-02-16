import { debounce } from "lodash";
import { useState, useEffect } from "react";

import { DEFAULT_DEBOUNCE_TIME, userNavigatorConnection } from "../constants";

/**
 * @typedef {Object} networkInformation
 * @property {boolean} support
 *   If the feature is supported or not
 * @property {('slow-2g'|'2g'|'3g'|'4g'|null)} effectiveType
 *   If this feature is supported for the actual browser
 *
 * React hook intended to get the network type, from the navigation object
 * * This feature still as an experimental, for more information check:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType Compatibility table}
 *
 * @category Network
 *
 * @param    {Object}  [options={}]
 * Configuration object intended to contain the default used by the hook.
 * @param    {("slow-2g"|"2g"|"3g"|"4g"|undefined)} [options.defaultEffectiveType=null]
 * @param    {number}  [options.wait=80]
 * The number of milliseconds to delay from the last event.
 * @returns  {networkInformation}
 */

export function useNetworkConnectionType(options = {}) {
  const [networkConnectionType, updateNetworkConnectionType] = useState({
    support: Boolean(userNavigatorConnection),
    effectiveType: options.defaultEffectiveType,
  });

  useEffect(() => {
    function getNetworkConnectionType() {
      updateNetworkConnectionType(networkConnectionType => ({
        ...networkConnectionType,
        userNavigatorConnection: userNavigatorConnection.effectiveType,
      }));
    }

    const debouncedGetNetworkConnectionType = debounce(getNetworkConnectionType, options.wait || DEFAULT_DEBOUNCE_TIME);

    if (userNavigatorConnection) {
      userNavigatorConnection.addEventListener("change", debouncedGetNetworkConnectionType);
      debouncedGetNetworkConnectionType();
    }
    return () => {
      if (userNavigatorConnection)
        userNavigatorConnection.removeEventListener("change", debouncedGetNetworkConnectionType);
    };
  }, [options.wait]);

  return networkConnectionType;
}
