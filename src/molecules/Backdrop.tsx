import React, { useRef } from 'react';

import { View, StyleSheet, TouchableWithoutFeedback, Animated, StyleProp, ViewStyle } from 'react-native';
import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION, USE_NATIVE_DRIVER } from './constants';

type BackdropProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const Backdrop = ({ onPress, style }: BackdropProps) => {
  const fadeAnim = useRef(new Animated.Value(0.001)).current;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={[styles.fullscreen, { opacity: fadeAnim }]}>
        <View style={[styles.fullscreen, style]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

export default Backdrop;
