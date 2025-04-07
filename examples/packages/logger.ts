export const CFG = {
  debug: false
};
/**
 * Debug logger depending on `Menu.debug` static porperty.
 */
export const debug = (...args: object[]) => {
  CFG.debug && console.log('react-native-popup-menu', ...args);
};
