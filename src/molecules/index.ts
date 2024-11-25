import './polyfills';

import Menu from './Menu';

import MenuProvider, { withCtx } from './MenuProvider';

import MenuOption from './MenuOption';

import MenuOptions from './MenuOptions';

import MenuTrigger from './MenuTrigger';

import ContextMenu from './renderers/ContextMenu';

import NotAnimatedContextMenu from './renderers/NotAnimatedContextMenu';

import SlideInMenu from './renderers/SlideInMenu';

import Popover from './renderers/Popover';
const renderers = { ContextMenu, SlideInMenu, NotAnimatedContextMenu, Popover };

export {
  Menu as default,
  Menu,
  MenuProvider,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
  withCtx as withMenuContext
};
