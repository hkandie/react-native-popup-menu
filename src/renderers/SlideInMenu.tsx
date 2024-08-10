import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION, USE_NATIVE_DRIVER } from '../constants';

export const computePosition = (layouts: { windowLayout: any; optionsLayout: any }) => {
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

interface SlideInMenuProp {
    style?: any;
    children?: any;
    layouts: {
        windowLayout: any;
        optionsLayout: any;
    };
}

const SlideInMenu = ({ style, children, layouts, ...other }: SlideInMenuProp) => {
    const [slide] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(slide, {
            duration: OPEN_ANIM_DURATION,
            toValue: 1,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: USE_NATIVE_DRIVER,
        }).start();
    }, []);

    function close() {
        return new Promise((resolve) => {
            Animated.timing(slide, {
                duration: CLOSE_ANIM_DURATION,
                toValue: 0,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: USE_NATIVE_DRIVER,
            }).start(resolve);
        });
    }

    const { height: oHeight } = layouts.optionsLayout;
    const animation = {
        transform: [
            {
                translateY: slide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [oHeight, 0],
                }),
            },
        ],
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
        elevation: 5,
    },
});
