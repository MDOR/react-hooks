import { userNavigatorConnection } from "../constants";

/**
 * @typedef {Object} saveDataConfiguration
 * @property {boolean} support
 * If this feature is supported by any browser
 * @property {boolean} saveData
 * Configuration of the saveData attribute*
 *
 * React hook intended to get if the user has set reduced usage option.
 * This feature still as an experimental, for more information check:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData#browser_compatibility Compatibility table}
 *
 * @category Network
 *
 * @param {Object} [options={}]
 * Hook configuration
 * @param {number} [options.default=false]
 * Default value for saveData property
 * @returns {saveDataConfiguration}
 */

export function useSaveData(options = {}) {
  const support = userNavigatorConnection && "saveData" in userNavigatorConnection;
  const saveData = support ? userNavigatorConnection.saveData : options.default || false;

  return { support, saveData };
}
