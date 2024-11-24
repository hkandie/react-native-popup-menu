import React, { useRef } from 'react';

import { View, StyleSheet, TouchableWithoutFeedback, Animated, StyleProp, ViewStyle } from 'react-native';
import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION, USE_NATIVE_DRIVER } from './constants';

type BackdropProps = {
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
};

const Backdrop = ({ onPress, style }: any) => {
    const fadeAnim = useRef(new Animated.Value(0.001)).current;

    const open = () => {
        return new Promise((resolve) => {
            Animated.timing(fadeAnim, {
                duration: OPEN_ANIM_DURATION,
                toValue: 1,
                useNativeDriver: USE_NATIVE_DRIVER,
            }).start(resolve);
        });
    };

    const close = () => {
        return new Promise((resolve) => {
            Animated.timing(fadeAnim, {
                duration: CLOSE_ANIM_DURATION,
                toValue: 0,
                useNativeDriver: USE_NATIVE_DRIVER,
            }).start(resolve);
        });
    };

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
        right: 0,
    },
});

export default Backdrop;
