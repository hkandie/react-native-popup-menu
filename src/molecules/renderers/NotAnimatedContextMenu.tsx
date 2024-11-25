import React from 'react';

import { I18nManager, View } from 'react-native';

import { styles } from './ContextMenu';
import { computePosition } from '../position';

/**
Simplified version of ContextMenu without animation.
*/

type NotAnimatedContextMenuProps = {
  style: any;
  children: any;
  layouts: any;
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
