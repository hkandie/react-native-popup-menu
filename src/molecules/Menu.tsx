import { StyleProp, View, ViewStyle } from 'react-native';
import React, { useEffect } from 'react';
import { useMenuContext } from '../hooks/useMenuContext';
import { debug } from './logger';
import { Instance } from './instance';
import { validateChildren } from './menu-helpers';
import ContextMenu from './renderers/ContextMenu';

export interface MenuProps {
  name?: string;
  renderer?: React.PropsWithChildren<any>;
  rendererProps?: {};
  onSelect: (value: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  opened?: boolean;
  onBackdropPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const defaultProps = {
  renderer: ContextMenu,
  rendererProps: {},
  onSelect: () => {},
  onOpen: () => {},
  onClose: () => {},
  onBackdropPress: () => {}
};
const Menu = (props: MenuProps) => {
  const ctx = useMenuContext();
  const propsWithDefaults = {
    ...defaultProps,
    ...props
  };
  const instance = new Instance(ctx, propsWithDefaults);
  console.log('Menu instance', instance);

  useEffect(() => {
    if (!validateChildren(propsWithDefaults.children)) {
      return;
    }
    debug('subscribing menu', instance.name);
    ctx.menuRegistry.subscribe(instance);
    ctx.menuActions._notify();
  }, []);

  useEffect(() => {
    if (propsWithDefaults.name !== instance.name) {
      console.warn('Menu name cannot be changed');
    }
    // force update if menu is opened as its content might have changed
    const force = instance.isOpen();
    debug('component did update', instance.name, force);
    ctx.menuActions._notify(force);
    return () => {
      debug('unsubscribing menu', instance.name);
      if (instance.isOpen()) {
        instance.forceClose = true;
        ctx.menuActions._notify();
      }
      ctx.menuRegistry.unsubscribe(instance);
    };
  }, [propsWithDefaults.name]);
  const { style } = propsWithDefaults;
  const children = instance.reduceChildren();
  return <View style={style}>{children}</View>;
};

export default Menu;
