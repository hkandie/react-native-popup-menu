import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { CLOSE_ANIM_DURATION, OPEN_ANIM_DURATION, USE_NATIVE_DRIVER } from '../constants';

interface BackdropProps {
    onPress: () => void;
    style?: {};
}
const Backdrop = (props: BackdropProps) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    function open() {
        return new Promise((resolve) => {
            Animated.timing(fadeAnim, {
                duration: OPEN_ANIM_DURATION,
                toValue: 1,
                useNativeDriver: USE_NATIVE_DRIVER,
            }).start(resolve);
        });
    }

    function close() {
        return new Promise((resolve) => {
            Animated.timing(fadeAnim, {
                duration: CLOSE_ANIM_DURATION,
                toValue: 0,
                useNativeDriver: USE_NATIVE_DRIVER,
            }).start(resolve);
        });
    }

    const { onPress, style } = props;
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Animated.View style={[styles.fullscreen, { opacity: fadeAnim }]}>
                <View style={[styles.fullscreen, style]} />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

Backdrop.propTypes = {
    onPress: PropTypes.func.isRequired,
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
