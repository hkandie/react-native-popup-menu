import { StyleProp, View, ViewStyle } from 'react-native';
import React, { useEffect } from 'react';
import { useMenuContext } from '../hooks/useMenuContext';
import { debug } from './logger';
import { Instance } from './instance';
import { validateChildren } from './menu-helpers';

export interface MenuProps {
  name: string;
  renderer: React.PropsWithChildren<any>;
  rendererProps: {};
  onSelect: (value: string) => void;
  onOpen: () => void;
  onClose: () => void;
  opened?: boolean;
  onBackdropPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Menu = (props: MenuProps) => {
  const ctx = useMenuContext();
  const instance = new Instance(ctx, props);
  console.log('Menu instance', instance);

  useEffect(() => {
    if (!validateChildren(props.children)) {
      return;
    }
    debug('subscribing menu', instance.name);
    ctx.menuRegistry.subscribe(instance);
    ctx.menuActions._notify();
  }, []);

  useEffect(() => {
    if (props.name !== instance.name) {
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
  }, [props.name]);
  const { style } = props;
  const children = instance.reduceChildren();
  return <View style={style}>{children}</View>;
};

export default Menu;
