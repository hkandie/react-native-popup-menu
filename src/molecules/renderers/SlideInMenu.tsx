import React, { useEffect, useRef } from 'react';

import { Animated, StyleSheet, Easing } from 'react-native';
import { OPEN_ANIM_DURATION, USE_NATIVE_DRIVER } from '../constants';

export const computePosition = (layouts: any) => {
  const { windowLayout, optionsLayout } = layouts;
  const { height: wHeight } = windowLayout;
  const { height: oHeight } = optionsLayout;
  const top = wHeight - oHeight;
  const left = 0,
    right = 0;
  const position = { top, left, right };
  // TODO what is the best way to handle safeArea?
  // most likely some extra paddings inside SlideInMenu
  return position;
};

const SlideInMenu = (props: any) => {
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slide, {
      duration: OPEN_ANIM_DURATION,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER
    }).start();
  }, []);

  const { style, children, layouts, ...other } = props;
  const { height: oHeight } = layouts.optionsLayout;
  const animation = {
    transform: [
      {
        translateY: slide.interpolate({
          inputRange: [0, 1],
          outputRange: [oHeight, 0]
        })
      }
    ]
  };
  const position = computePosition(layouts);
  return (
    <Animated.View
      style={[styles.options, style, animation, position]}
      {...other}
    >
      {children}
    </Animated.View>
  );
};

export default SlideInMenu;
const styles = StyleSheet.create({
  options: {
    position: 'absolute',
    backgroundColor: 'white',

    // Shadow only works on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,

    // This will elevate the view on Android, causing shadow to be drawn.
    elevation: 5
  }
});
