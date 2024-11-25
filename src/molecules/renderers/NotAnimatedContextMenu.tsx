import React from 'react';

import { I18nManager, StyleProp, View, ViewStyle } from 'react-native';

import { styles } from './ContextMenu';
import { computePosition } from '../position';
import { MenuLayout } from '../menuRegistry';

/**
Simplified version of ContextMenu without animation.
*/

type NotAnimatedContextMenuProps = {
  style: StyleProp<ViewStyle>;
  children: React.ReactNode;
  layouts: MenuLayout;
};
const NotAnimatedContextMenu = (props: NotAnimatedContextMenuProps) => {
  const { style, children, layouts, ...other } = props;
  const position = computePosition(layouts, I18nManager.isRTL);
  return (
    <View
      {...other}
      style={[styles.options, style, position]}
    >
      {children}
    </View>
  );
};

export default NotAnimatedContextMenu;
