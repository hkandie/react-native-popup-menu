import React, { ReactNode } from 'react';
import MenuOptions from './MenuOptions';
import MenuTrigger from './MenuTrigger';
import { MenuProps } from './Menu.v2';

export const isRegularComponent = (c: any) => c.type !== MenuOptions && c.type !== MenuTrigger;
export const isTrigger = (c: any) => c.type === MenuTrigger;
export const isMenuOptions = (c: any) => c.type === MenuOptions;

export function validateChildren(menuChildren: ReactNode) {
  const children = React.Children.toArray(menuChildren);
  const options = children.find(isMenuOptions);
  if (!options) {
    console.warn('Menu has to contain MenuOptions component');
  }
  const trigger = children.find(isTrigger);
  if (!trigger) {
    console.warn('Menu has to contain MenuTrigger component');
  }
  return options && trigger;
}


