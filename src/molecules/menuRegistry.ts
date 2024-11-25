import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { iterator2array } from './helpers';
import { Menu } from './Menu';

/**
 * Types for MenuRegistry (which isn't exported)
 */
interface TriggerLayoutType {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface WindowLayoutType {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  top: number;
}

interface OptionsLayoutType {
  width: number;
  height: number;
  x: number;
  y: number;
  left: number;
  top: number;
  isOutside?: boolean;
}
interface SafeAreLayoutType {
  width: number;
  height: number;
  x: number;
  y: number;
  left: number;
  top: number;
  isOutside?: boolean;
}

export interface MenuLayout {
  windowLayout: WindowLayoutType;
  triggerLayout: TriggerLayoutType;
  optionsLayout: OptionsLayoutType;
  safeAreaLayout: SafeAreLayoutType;
}

interface MenuEntry extends MenuLayout {
  name: string;
  instance: Menu;
  optionsCustomStyles?: MenuOptionsCustomStyle;
}

interface MenuOptionCustomStyle {
  optionWrapper?: StyleProp<ViewStyle>;
  optionText?: StyleProp<TextStyle>;
  optionTouchable?: {};
  OptionTouchableComponent?: Function;
}

interface MenuOptionsCustomStyle extends MenuOptionCustomStyle {
  optionsWrapper?: StyleProp<ViewStyle>;
  optionsContainer?: StyleProp<ViewStyle>;
}
/**
 * Registry to subscribe, unsubscribe and update data of menus.
 *
 * menu data: {
 *   instance: react instance
 *   triggerLayout: Object - layout of menu trigger if known
 *   optionsLayout: Object - layout of menu options if known
 *   optionsCustomStyles: Object - custom styles of options
 * }
 */
export default function makeMenuRegistry(menus = new Map()) {
  /**
   * Subscribes menu instance.
   */
  function subscribe(instance: { getName: () => string }) {
    const name = instance.getName();
    if (menus.get(name)) {
      console.warn(`incorrect usage of popup menu - menu with name ${name} already exists`);
    }
    menus.set(name, { name, instance });
  }

  /**
   * Unsubscribes menu instance.
   */
  function unsubscribe(instance: MenuEntry['instance']) {
    menus.delete(instance.getName());
  }

  /**
   * Updates layout infomration.
   */
  function updateLayoutInfo(name: string, layouts: Partial<MenuEntry> = {}) {
    if (!menus.has(name)) {
      return;
    }
    const menu: MenuEntry = Object.assign({}, menus.get(name));
    if (layouts.hasOwnProperty('triggerLayout')) {
      menu.triggerLayout = layouts.triggerLayout!;
    }
    if (layouts.hasOwnProperty('optionsLayout')) {
      menu.optionsLayout = layouts.optionsLayout!;
    }
    menus.set(name, menu);
  }

  function setOptionsCustomStyles(name: string, optionsCustomStyles: StyleProp<ViewStyle>) {
    if (!menus.has(name)) {
      return;
    }
    const menu = { ...menus.get(name), optionsCustomStyles };
    menus.set(name, menu);
  }

  /**
   * Get `menu data` by name.
   */
  function getMenu(name: string) {
    return menus.get(name);
  }

  /**
   * Returns all subscribed menus as array of `menu data`
   */
  function getAll() {
    return iterator2array(menus.values());
  }

  return { subscribe, unsubscribe, updateLayoutInfo, getMenu, getAll, setOptionsCustomStyles };
}
