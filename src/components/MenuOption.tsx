import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import { usePopupMenu } from './MenuProvider';
import { useMenuRegister } from './MenuRegisterProvider';
import { debug } from '../util/logger';
import { makeTouchable } from '../helpers/util';

interface MenuOptionsProps {
    disabled?: boolean;
    disableTouchable?: boolean;
    onSelect?: Function;
    text?: string;
    value?: any;
    customStyles?: {};
    testID?: string;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
const MenuOption = ({
    disabled = false,
    disableTouchable = false,
    testID: undefined,
    text,
    value,
    testID,
    children,
    style,
    ...props
}: MenuOptionsProps) => {
    const { menuCtx } = usePopupMenu();
    const { menuName } = useMenuRegister();

    function _onSelect() {
        const onSelect = props.onSelect || _getMenusOnSelect();
        const shouldClose = onSelect?.(value) !== false;
        debug('select option', value, shouldClose);
        if (shouldClose) {
            menuCtx.menuActions.closeMenu();
        }
    }

    function _getMenusOnSelect() {
        const menu = menuCtx.menuRegistry.getMenu(menuName);

        return menu?.instance?.onSelect;
    }

    function _getCustomStyles() {
        // FIXME react 16.3 workaround for ControlledExample!
        const menu = menuCtx.menuRegistry.getMenu(menuName) || {};
        const { optionsCustomStyles } = menu;
        return {
            optionWrapper: optionsCustomStyles?.optionWrapper || {},
            optionText: optionsCustomStyles?.optionText || {},
            optionTouchable: optionsCustomStyles?.optionTouchable || {},
            OptionTouchableComponent: optionsCustomStyles?.OptionTouchableComponent,
            ...props.customStyles,
        };
    }

    const customStyles = _getCustomStyles();
    if (text && React.Children.count(children) > 0) {
        console.warn(
            "MenuOption: Please don't use text property together with explicit children. Children are ignored."
        );
    }
    if (disabled) {
        const disabledStyles = [defaultStyles.optionTextDisabled, customStyles.optionText];
        return (
            <View style={[defaultStyles.option, customStyles.optionWrapper, style]}>
                {text ? <Text style={disabledStyles}>{text}</Text> : children}
            </View>
        );
    }
    const rendered = (
        <View style={[defaultStyles.option, customStyles.optionWrapper, style]}>
            {text ? <Text style={customStyles.optionText}>{text}</Text> : children}
        </View>
    );
    if (disableTouchable) {
        return rendered;
    } else {
        const { Touchable, defaultTouchableProps } = makeTouchable(customStyles.OptionTouchableComponent);
        return (
            <Touchable
                testID={testID}
                onPress={() => _onSelect()}
                {...defaultTouchableProps}
                {...customStyles.optionTouchable}
            >
                {rendered}
            </Touchable>
        );
    }
};

const defaultStyles = StyleSheet.create({
    option: {
        padding: 5,
        backgroundColor: 'transparent',
    },
    optionTextDisabled: {
        color: '#ccc',
    },
});

export default MenuOption;
