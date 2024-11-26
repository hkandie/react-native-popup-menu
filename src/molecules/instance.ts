import React from 'react';
import { makeName } from '../helpers';
import { MenuProps } from './Menu.v2';
import { isMenuOptions, isRegularComponent, isTrigger } from './menu-helpers';
import { IMenuProvider } from './MenuProvider';
import ContextMenu from './renderers/ContextMenu';

export class Instance {
  name: string | undefined = '';
  props: MenuProps = {
    name: '',
    renderer: ContextMenu,
    rendererProps: {},
    onSelect: (_: string) => {},
    onOpen: () => {},
    onClose: () => {},
    onBackdropPress: () => {}
  };
  forceClose: boolean = false;
  opened: boolean = false;
  trigger: React.ReactNode;
  ctx: IMenuProvider;
  constructor(ctx: IMenuProvider, props: MenuProps) {
    this.name = props?.name || makeName();
    this.props = {
      ...this.props,
      ...props
    };
    this.ctx = ctx;
  }
  getName() {
    return this.name;
  }
  isOpen() {
    if (this.forceClose) {
      return false;
    }
    return this.props.hasOwnProperty('opened') ? this.props.opened : this.opened;
  }
  open() {
    return this.ctx.menuActions.openMenu(this.name);
  }

  close() {
    return this.ctx.menuActions.closeMenu();
  }
  _getTrigger() {
    return this.trigger;
  }
  _getOptions() {
    return React.Children.toArray(this.props.children).find(isMenuOptions);
  }

  _getOpened() {
    return this.opened;
  }

  _setOpened(opened: boolean) {
    this.opened = opened;
  }

  reduceChildren() {
    return React.Children.toArray(this.props.children).reduce((r: any, child: any) => {
      if (isTrigger(child)) {
        r.push(
          React.cloneElement(child, {
            key: null,
            menuName: this.name,
            onRef: (t: React.ReactNode) => (this.trigger = t)
          })
        );
      }
      if (isRegularComponent(child)) {
        r.push(child);
      }
      return r;
    }, []);
  }
}
