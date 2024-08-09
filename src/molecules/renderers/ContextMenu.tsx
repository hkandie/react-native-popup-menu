import React, { useEffect } from 'react';

import { I18nManager, Animated, Easing, StyleSheet, PixelRatio, StyleProp, ViewStyle } from 'react-native';
import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION, USE_NATIVE_DRIVER } from '../constants';
import { computePosition } from '../position';

type ContextMenuProps = {
  style: StyleProp<ViewStyle>;
  children: React.ReactNode;
  layouts: any;
};

const ContextMenu = (props: ContextMenuProps) => {
  const [scaleAnim] = React.useState(new Animated.Value(0.1));

  useEffect(() => {
    Animated.timing(scaleAnim, {
      duration: OPEN_ANIM_DURATION,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER
    }).start();
  }, []);

  function close() {
    return new Promise((resolve) => {
      Animated.timing(scaleAnim, {
        duration: CLOSE_ANIM_DURATION,
        toValue: 0,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER
      }).start(resolve);
    });
  }

  const { style, children, layouts, ...other } = props;
  const animation = {
    transform: [{ scale: scaleAnim }],
    opacity: scaleAnim
  };
  const position = computePosition(layouts, I18nManager.isRTL);
  return (
    <Animated.View
      {...other}
      style={[styles.options, style, animation, position]}
    >
      {children}
    </Animated.View>
  );
};

export default ContextMenu;
export const styles = StyleSheet.create({
  options: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: 'white',
    width: PixelRatio.roundToNearestPixel(200),

    // Shadow only works on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,

    // This will elevate the view on Android, causing shadow to be drawn.
    elevation: 5
  }
});
