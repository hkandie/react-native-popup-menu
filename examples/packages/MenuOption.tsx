import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { View, StyleSheet, Text } from 'react-native';
import { debug } from './logger';

import { makeTouchable } from './helpers';

import { withCtx } from './MenuProvider';

interface MenuOptionProps {
  disabled?: boolean;
  disableTouchable?: boolean;
  onSelect?: (value: any) => boolean | void;
  text?: string;
  value?: any;
  customStyles?: any;
  testID?: string;
  ctx?: any; // injected by withCtx
  style?: any;
  children?: React.ReactNode;
}

const MenuOption = (props: MenuOptionProps) => {
  const onSelect = () => {
    const { value, ctx } = props;
    const onSelect = props.onSelect || ctx.menuActions._getOpenedMenu().instance.props.onSelect;
    const shouldClose = onSelect(value) !== false;
    debug('select option', value, shouldClose);
    if (shouldClose) {
      ctx.menuActions.closeMenu();
    }
  };

  const _getMenusOnSelect = () => {
    const menu = props.ctx.menuActions._getOpenedMenu();
    return menu.instance.props.onSelect;
  };

  const getCustomStyles = () => {
    // FIXME react 16.3 workaround for ControlledExample!
    const menu = props.ctx.menuActions._getOpenedMenu() || {};
    const { optionsCustomStyles } = menu;
    return {
      ...optionsCustomStyles,
      ...props.customStyles
    };
  };
  const { text, disabled, disableTouchable, children, style, testID } = props;
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

MenuOption.propTypes = {
  disabled: PropTypes.bool,
  disableTouchable: PropTypes.bool,
  onSelect: PropTypes.func,
  text: PropTypes.string,
  value: PropTypes.any,
  customStyles: PropTypes.object,
  testID: PropTypes.string
};

MenuOption.defaultProps = {
  disabled: false,
  disableTouchable: false,
  customStyles: {},
  testID: undefined
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
