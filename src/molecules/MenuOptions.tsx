import React, { useEffect } from 'react';

import PropTypes from 'prop-types';

import { StyleProp, View, ViewStyle } from 'react-native';

import { withCtx } from './MenuProvider';
import { useMenuContext } from '../hooks/useMenuContext';

type MenuOptionsProps = {
  customStyles: any;
  style: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const MenuOptions = (props: MenuOptionsProps) => {
  const ctx = useMenuContext();

  function updateCustomStyles(_props: MenuOptionsProps) {
    const { customStyles } = _props;
    const menu = ctx.menuActions._getOpenedMenu();
    if (!menu) return;
    const menuName = menu.instance.getName();
    ctx.menuRegistry.setOptionsCustomStyles(menuName, customStyles);
  }

  useEffect(() => {
    updateCustomStyles(props);
  }, []);

  useEffect(() => {
    updateCustomStyles(props);
  }, [props]);
  const { customStyles = {}, style, children } = props;

  return <View style={[customStyles.optionsWrapper, style]}>{children}</View>;
};

export default withCtx(MenuOptions);
