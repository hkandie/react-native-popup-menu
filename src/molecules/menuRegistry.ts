import { StyleProp, ViewStyle } from 'react-native';
import { iterator2array } from './helpers';

type MenuInstance = {
  getName: () => string;
};

type MenuData = {
  instance: MenuInstance;
  triggerLayout?: any;
  optionsLayout?: any;
  optionsCustomStyles?: StyleProp<ViewStyle>;
};

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
  function unsubscribe(instance: MenuData['instance']) {
    menus.delete(instance.getName());
  }

  /**
   * Updates layout infomration.
   */
  function updateLayoutInfo(name: string, layouts: Partial<MenuData> = {}) {
    if (!menus.has(name)) {
      return;
    }
    const menu: MenuData = Object.assign({}, menus.get(name));
    if (layouts.hasOwnProperty('triggerLayout')) {
      menu.triggerLayout = layouts.triggerLayout;
    }
    if (layouts.hasOwnProperty('optionsLayout')) {
      menu.optionsLayout = layouts.optionsLayout;
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
