import React from 'react';
import { GestureResponderEvent, Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { makeTouchable } from '../helpers/util';
import { useMenuActions } from '../hooks/useMenuActions';
import { debug } from '../util/logger';
import { usePopupMenu } from './MenuProvider';
import { useMenuRegister } from './MenuRegisterProvider';

interface MenuTriggerProps {
    text?: string;
    onRef?: React.RefObject<View>;
    onPress?: (event: GestureResponderEvent) => void;
    onAlternativeAction?: (event: GestureResponderEvent) => void;
    triggerOnLongPress?: boolean;
    style?: StyleProp<ViewStyle>;
    customStyles?: {
        triggerOuterWrapper?: Object;
        triggerTouchable?: Object;
        triggerWrapper?: Object;
        triggerText: StyleProp<TextStyle>;
    };
    children?: React.ReactNode;
    testID?: string;
    defaultTouchableProps?: Object;
    disabled?: boolean;
    menuName?: string;
}

const MenuTrigger = (props: MenuTriggerProps) => {
    const { disabled, text, onAlternativeAction, triggerOnLongPress, style, customStyles, children, testID, ...other } =
        props;
    const { menuCtx } = usePopupMenu();
    const { menuName } = useMenuRegister();

    const onPress = () => {
        debug('trigger onPress', menuName, menuCtx.menuRegistry.getAll());
        if (!disabled) {
            menuCtx?.menuActions.openMenu(menuName);
        }
    };

    return (
        <View
            ref={props.onRef}
            collapsable={false}
            style={customStyles?.triggerOuterWrapper}
        >
            <Pressable
                testID={testID}
                onPress={triggerOnLongPress ? onAlternativeAction : onPress}
                onLongPress={triggerOnLongPress ? onPress : onAlternativeAction}
                // {...defaultTouchableProps}
                {...customStyles?.triggerTouchable}
            >
                <View
                    {...other}
                    style={[customStyles?.triggerWrapper, style]}
                >
                    {text ? <Text style={customStyles?.triggerText}>{text}</Text> : children}
                </View>
            </Pressable>
        </View>
    );
};
export default MenuTrigger;
