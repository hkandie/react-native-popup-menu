import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text } from 'react-native';

import { makeTouchable } from './helpers';

import { debug } from './logger';
import { useMenuContext } from '../hooks/useMenuContext';

type MenuTriggerProps = {
  disabled: boolean;
  text: string;
  onPress: () => void;
  onAlternativeAction: () => void;
  customStyles: {
    TriggerTouchableComponent: any;
    triggerOuterWrapper: any;
    triggerTouchable: any;
    triggerWrapper: any;
    triggerText: any;
  };
  triggerOnLongPress: boolean;
  testID: string;
  onRef: any;
  style: any;
  children: any;
  menuName: string;
};

const MenuTrigger = ({
  disabled,
  onRef,
  text,
  children,
  style,
  customStyles = {
    TriggerTouchableComponent: null,
    triggerOuterWrapper: null,
    triggerTouchable: null,
    triggerWrapper: null,
    triggerText: null
  },
  menuName,
  triggerOnLongPress,
  onAlternativeAction,
  testID,
  ...other
}: MenuTriggerProps) => {
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
};
export default MenuTrigger;
