import React from 'react';
import { View, Text, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { debug } from './logger';
import { makeTouchable } from './helpers';
import { withCtx } from './MenuProvider.js';

interface MenuTriggerProps {
    disabled?: boolean;
    text?: string;
    customStyles?: {
        triggerOuterWrapper?: StyleProp<ViewStyle>;
        triggerWrapper?: StyleProp<ViewStyle>;
        triggerText?: StyleProp<TextStyle>;
        TriggerTouchableComponent?: Function;
        triggerTouchable?: {};
    };
    testID?: string;
    triggerOnLongPress?: boolean;

    onPress?(): void;
    onAlternativeAction?(): void;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const MenuTrigger = ({
    disabled = false,
    onRef,
    text,
    children,
    style,
    customStyles = {},
    menuName,
    triggerOnLongPress,
    onAlternativeAction,
    testID,
    ctx,
    ...other
}: MenuTriggerProps) => {
    const onPress = () => !disabled && _onPress();

    const _onPress = () => {
        debug('trigger onPress');
        onPress && onPress();
        ctx.menuActions.openMenu(menuName);
    };

    const { Touchable, defaultTouchableProps } = makeTouchable(customStyles.TriggerTouchableComponent);
    return (
        <View
            ref={onRef}
            collapsable={false}
            style={customStyles.triggerOuterWrapper}
        >
            <Touchable
                testID={testID}
                onPress={triggerOnLongPress ? onAlternativeAction : onPress}
                onLongPress={triggerOnLongPress ? onPress : onAlternativeAction}
                {...defaultTouchableProps}
                {...customStyles.triggerTouchable}
            >
                <View
                    {...other}
                    style={[customStyles.triggerWrapper, style]}
                >
                    {text ? <Text style={customStyles.triggerText}>{text}</Text> : children}
                </View>
            </Touchable>
        </View>
    );
};

export default withCtx(MenuTrigger);
