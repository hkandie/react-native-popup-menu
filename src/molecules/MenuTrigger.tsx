import React, { Component, forwardRef, ForwardRefExoticComponent } from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { makeTouchable } from './helpers';

import { debug } from './logger';
import { useMenuContext } from '../hooks/useMenuContext';
/**
 * MenuTrigger
 * @see https://github.com/instea/react-native-popup-menu/blob/master/doc/api.md#menutrigger
 */
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
  menuName?: string;
  onRef?(ref: any): void;
}

const MenuTrigger = forwardRef(
  (
    {
      disabled,
      onRef,
      text,
      children,
      style,
      customStyles = {
        triggerOuterWrapper: null,
        triggerWrapper: null,
        triggerText: null
      },
      menuName,
      triggerOnLongPress,
      onAlternativeAction,
      testID,
      ...other
    }: MenuTriggerProps,
    ref: React.Ref<any>
  ) => {
    const ctx = useMenuContext();
    function _onPress() {
      debug('trigger onPress');
      other.onPress && other.onPress();
      ctx.menuActions.openMenu(menuName);
    }
    const onPress = () => !disabled && _onPress();
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
  }
);
export default MenuTrigger;
