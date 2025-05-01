import React, { useEffect } from 'react';
import { I18nManager, Animated, Easing, StyleSheet, PixelRatio } from 'react-native';
import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION, USE_NATIVE_DRIVER } from '../constants';

const axisPosition = (oDim: any, wDim: any, tPos: any, tDim: any) => {
  // if options are bigger than window dimension, then render at 0
  if (oDim > wDim) {
    return 0;
  }
  // render at trigger position if possible
  if (tPos + oDim <= wDim) {
    return tPos;
  }
  // aligned to the trigger from the bottom (right)
  if (tPos + tDim - oDim >= 0) {
    return tPos + tDim - oDim;
  }
  // compute center position
  let pos = Math.round(tPos + tDim / 2 - oDim / 2);
  // check top boundary
  if (pos < 0) {
    return 0;
  }
  // check bottom boundary
  if (pos + oDim > wDim) {
    return wDim - oDim;
  }
  // if everything ok, render in center position
  return pos;
};

function fit(pos: any, len: any, minPos: any, maxPos: any) {
  if (pos === undefined) {
    return undefined;
  }
  if (pos + len > maxPos) {
    pos = maxPos - len;
  }
  if (pos < minPos) {
    pos = minPos;
  }
  return pos;
}
// fits options (position) into safeArea
export const fitPositionIntoSafeArea = (position: any, layouts: any) => {
  const { windowLayout, safeAreaLayout, optionsLayout } = layouts;
  if (!safeAreaLayout) {
    return position;
  }
  const { x: saX, y: saY, height: saHeight, width: saWidth } = safeAreaLayout;
  const { height: oHeight, width: oWidth } = optionsLayout;
  const { width: wWidth } = windowLayout;
  let { top, left, right } = position;
  top = fit(top, oHeight, saY, saY + saHeight);
  left = fit(left, oWidth, saX, saX + saWidth);
  right = fit(right, oWidth, wWidth - saX - saWidth, saX);
  return { top, left, right };
};

export const computePosition = (layouts: any, isRTL: any) => {
  const { windowLayout, triggerLayout, optionsLayout } = layouts;
  const { x: wX, y: wY, width: wWidth, height: wHeight } = windowLayout;
  const { x: tX, y: tY, height: tHeight, width: tWidth } = triggerLayout;
  const { height: oHeight, width: oWidth } = optionsLayout;
  const top = axisPosition(oHeight, wHeight, tY - wY, tHeight);
  const left = axisPosition(oWidth, wWidth, tX - wX, tWidth);
  const start = isRTL ? 'right' : 'left';
  const position = { top, [start]: left };
  return fitPositionIntoSafeArea(position, layouts);
};

interface ContextMenuProps {
  style?: any;
  children?: React.ReactNode;
  layouts: {
    windowLayout: { width: number; height: number; x: number; y: number };
    triggerLayout: { width: number; height: number; x: number; y: number };
    optionsLayout: { width: number; height: number; x: number; y: number };
    safeAreaLayout?: { width: number; height: number; x: number; y: number };
  };
}

const ContextMenu = (props: ContextMenuProps) => {
  const [scaleAnim, setScaleAnim] = React.useState(new Animated.Value(0.1));
  useEffect(() => {
    Animated.timing(scaleAnim, {
      duration: OPEN_ANIM_DURATION,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER
    }).start();
  }, []);

  const close = () => {
    return new Promise((resolve) => {
      Animated.timing(scaleAnim, {
        duration: CLOSE_ANIM_DURATION,
        toValue: 0,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER
      }).start(resolve);
    });
  };
  const { style = {}, children, layouts, ...other } = props;

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
// public exports
ContextMenu.computePosition = computePosition;
ContextMenu.fitPositionIntoSafeArea = fitPositionIntoSafeArea;

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
