import React, { useEffect } from 'react';

import { StyleProp, View, ViewStyle } from 'react-native';

import { withCtx } from './MenuProvider';
import { useMenuContext } from '../hooks/useMenuContext';

type MenuOptionsProps = {
  customStyles: {
    optionsWrapper: StyleProp<ViewStyle>;
  };
  style: StyleProp<ViewStyle>;
  children: React.ReactNode;
};
const MenuOptions = (props: MenuOptionsProps) => {
  const ctx = useMenuContext();
  function updateCustomStyles(_props: any) {
    const { customStyles } = _props;
    const menu = ctx.menuActions._getOpenedMenu();
    if (!menu) return;
    const menuName = menu.instance.getName();
    ctx.menuRegistry.setOptionsCustomStyles(menuName, customStyles);
  }

  useEffect(() => {
    updateCustomStyles(props);
  }, [props]);

  const {
    customStyles = {
      optionsWrapper: {}
    },
    style,
    children
  } = props;
  return <View style={[customStyles.optionsWrapper, style]}>{children}</View>;
};

export default withCtx(MenuOptions);
