import { StyleProp, ViewStyle } from 'react-native';
import { iterator2array } from './util';
import { CustomStyles, MenuData, MenuInstance, MenuType } from '../types';
import { debug } from '../util/logger';

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

export default function makeMenuRegistry(menus: Map<string, MenuData> = new Map()) {
    /**
     * Subscribes menu instance.
     */
    function subscribe(instance: MenuInstance) {
        const name = instance.menuName;
        debug('subscribing menu', name);
        if (menus.get(name)) {
            console.warn(`incorrect usage of popup menu - menu with name ${name} already exists`);
        }
        menus.set(name, { name, instance });
    }

    /**
     * Unsubscribes menu instance.
     */
    function unsubscribe(menuName: string) {
        menus.delete(menuName);
    }

    /**
     * Updates layout infomration.
     */
    function updateLayoutInfo(name: string, layouts = { triggerLayout: () => '', optionsLayout: () => '' }) {
        if (!menus.has(name)) {
            return;
        }
        const menu = { ...menus.get(name) };
        if (layouts.hasOwnProperty('triggerLayout')) {
            menu.triggerLayout = layouts.triggerLayout;
        }
        if (layouts.hasOwnProperty('optionsLayout')) {
            menu.optionsLayout = layouts.optionsLayout;
        }
        menus.set(name, menu);
    }

    function setOptionsCustomStyles(name: any, optionsCustomStyles?: CustomStyles) {
        if (!menus.has(name)) {
            return;
        }
        const menu = { ...menus.get(name), optionsCustomStyles };
        menus.set(name, menu);
    }

    /**
     * Get `menu data` by name.
     */
    function getMenu(name: string): MenuData | undefined {
        return menus.get(name);
    }

    /**
     * Returns all subscribed menus as array of `menu data`
     */
    function getAll(): MenuData[] {
        return iterator2array(menus.values());
    }

    return {
        subscribe,
        unsubscribe,
        updateLayoutInfo,
        getMenu,
        getAll,
        setOptionsCustomStyles,
    };
}
