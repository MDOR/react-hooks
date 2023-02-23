/**
 * @private
 * @description Attach function to specified events in any given object
 * @param {object} object
 * Object to that will be used to attach events
 * @param {string[]} events
 * List of events to be assigned
 * @param {Function} fn
 * Function to be added per every supported event
 */
export function attachEvents(object, events, fn) {
  for (const event of events) object.addEventListener(event, fn);
}

/**
 * @private
 * @description Attach function to specified events in any given object
 * @param {object} object
 * Object to that will be used to attach events
 * @param {string[]} events
 * List of events to be assigned
 * @param {Function} fn
 * Function to be added per every supported event
 */
export function detachEvents(object, events, fn) {
  for (const event of events) object.removeEventListener(event, fn);
}
