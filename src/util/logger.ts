export const CFG = {
    debug: false,
};
/**
 * Debug logger depending on `Menu.debug` static porperty.
 */
export const debug = (...args: any[]) => {
    CFG.debug && console.log('react-native-popup-menu', ...args);
};