import { Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';

/**
 * Create touchable component based on passed parameter and platform.
 * It also returns default props for specific touchable types.
 */
export function makeTouchable(TouchableComponent) {
  const Touchable =
    TouchableComponent ||
    Platform.select({
      android: TouchableNativeFeedback,
      ios: TouchableHighlight,
      default: TouchableHighlight
    });
  let defaultTouchableProps = {};
  if (Touchable === TouchableHighlight) {
    defaultTouchableProps = { underlayColor: 'rgba(0, 0, 0, 0.1)' };
  }
  return { Touchable, defaultTouchableProps };
}

export function debug(...args: any[]) {
  console.log(...args);
}
/**
 * Create unique menu name across all menu instances.
 */
export const makeName = (function () {
  let nextID = 1;
  return () => `menu-${nextID++}`;
})();
