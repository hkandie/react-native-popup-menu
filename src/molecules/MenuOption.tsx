import React, { Component } from 'react';

import PropTypes, { func } from 'prop-types';

import { View, StyleSheet, Text } from 'react-native';
import { debug } from './logger';

import { makeTouchable } from './helpers';

import { withCtx } from './MenuProvider';
import { useMenuContext } from '../hooks/useMenuContext';

type MenuOptionProps = {
  disabled: boolean;
  disableTouchable: boolean;
  onSelect: () => void;
  text: string;
  value: any;
  customStyles: any;
  testID: string;
  style: any;
  children: any;
};

const MenuOption = ({ disabled = false, disableTouchable = false, ...props }) => {
  const ctx = useMenuContext();

  function onSelect() {
    const { value } = props;
    const onSelect = props.onSelect || getMenusOnSelect();
    const shouldClose = onSelect(value) !== false;
    debug('select option', value, shouldClose);
    if (shouldClose) {
      ctx.menuActions.closeMenu();
    }
  }

  function getMenusOnSelect() {
    const menu = ctx.menuActions._getOpenedMenu();
    return menu.instance.props.onSelect;
  }

  function getCustomStyles() {
    const menu = ctx.menuActions._getOpenedMenu() || {};
    const { optionsCustomStyles } = menu;
    return {
      ...optionsCustomStyles,
      ...props.customStyles
    };
  }

  const { text, children, style, testID } = props;
  const customStyles = getCustomStyles();
  if (text && React.Children.count(children) > 0) {
    console.warn("MenuOption: Please don't use text property together with explicit children. Children are ignored.");
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
        onPress={() => onSelect()}
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
    backgroundColor: 'transparent'
  },
  optionTextDisabled: {
    color: '#ccc'
  }
});

export default withCtx(MenuOption);
