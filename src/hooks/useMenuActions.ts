import { debug } from '@/src/util/logger';
import { useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { MenuRegistry, MenuType } from '../types';

let _isBackHandlerRegistered = false;

interface PlaceholderType {
    openedMenuName: string;
    callback?: () => void;
}
export const useMenuActions = (
    _menuRegistry: MenuRegistry,
    backHandler?: boolean | (() => boolean | null | undefined),
    openedMenu: MenuType | undefined = undefined
) => {
    const _placeholderRef = useRef<PlaceholderType>({
        openedMenuName: '',
        callback: undefined,
    });
    const [isMenuClosing, setIsMenuClosing] = useState(false);

    /**
Compares states of opened menu to determine if rerender is needed.
*/
    const _isRenderNeeded = (prev: { name: any }, next: { name?: any; triggerLayout?: any; optionsLayout?: any }) => {
        if (prev === next) {
            debug('_isRenderNeeded: skipping - no change');
            return false;
        }
        if (prev.name !== next.name) {
            return true;
        }
        const { triggerLayout, optionsLayout } = next;
        if (!triggerLayout || !optionsLayout) {
            debug('_isRenderNeeded: skipping - no trigger or options layout');
            return false;
        }
        return true;
    };
    const _beforeClose = (menu: MenuType) => {
        debug('before close', menu.name);
        const hideMenu = (optionsRef && optionsRef.close && optionsRef.close()) || Promise.resolve();
        const hideBackdrop = backdropRef && backdropRef.close();
        _invalidateTriggerLayouts();

        setIsMenuClosing(true);
        return Promise.all([hideMenu, hideBackdrop])
            .then(() => {
                setIsMenuClosing(false);
            })
            .catch((err) => {
                setIsMenuClosing(false);
                throw err;
            });
    };
    const _notify = (forceUpdate: boolean = false) => {
        const NULL = {};
        const prev = openedMenu || NULL;
        const next = _menuRegistry.getAll().find((menu) => menu.instance.isOpen()) || NULL;
        // set newly opened menu before any callbacks are called
        openedMenu = next === NULL ? undefined : next;
        if (!forceUpdate && !_isRenderNeeded(prev, next)) {
            return Promise.resolve();
        }
        debug('notify: next menu:', next.name, ' prev menu:', prev.name);
        let afterSetState = undefined;
        let beforeSetState = () => Promise.resolve();
        if (prev.name !== next.name) {
            if (prev !== NULL && !prev.instance.isOpen()) {
                beforeSetState = () => _beforeClose(prev).then(() => prev.instance.props.onClose());
            }
            if (next !== NULL) {
                next.instance.props.onOpen();
                afterSetState = () => _initOpen(next);
            }
        }
        return beforeSetState().then(() => {
            if (!_placeholderRef) {
                debug('setState ignored - maybe the context was unmounted');
                return;
            }
            _placeholderRef.current = {
                openedMenuName: openedMenu && openedMenu.name,
                callback: afterSetState,
            };
            debug('notify ended');
        });
    };
    const isMenuOpen = () => {
        return !!_getOpenedMenu();
    };
    const _getOpenedMenu = () => {
        const name = _placeholderRef && _placeholderRef.current.openedMenuName;
        const menu = name ? _menuRegistry?.getMenu(name) : undefined;
        debug('_getOpenedMenu', name, !!menu);
        return menu;
    };
    const closeMenu = () => {
        // has no effect on controlled menus
        debug('close menu');
        _menuRegistry
            ?.getAll()
            .filter((menu) => menu?.instance?._getOpened())
            .forEach((menu) => menu?.instance?._setOpened(false));
        return _notify();
    };
    const _handleBackButton = () => {
        debug('_handleBackButton called', backHandler);

        // Default handler if true is passed
        if (backHandler === true) {
            if (isMenuOpen()) {
                closeMenu();
                return true;
            }
        }

        // Custom handler called with MenuProvider instance id function is passed
        if (typeof backHandler === 'function') {
            return backHandler();
        }

        return false;
    };
    const openMenu = (name: string) => {
        const menu = _menuRegistry?.getMenu(name);
        if (!menu) {
            console.warn(`menu with name ${name} does not exist`);
            return Promise.resolve();
        }
        if (!_isBackHandlerRegistered) {
            // delay menu registration until the menu is really opened (and thus this back handler will be called "sooner")
            // too soon registration can cause another back handlers (e.g. react navigation) to be called instead of our back handler
            BackHandler.addEventListener('hardwareBackPress', _handleBackButton);
            _isBackHandlerRegistered = true;
        }
        menu?.instance?._setOpened(true);
        return _notify();
    };

    return {
        openMenu,
        closeMenu,
        toggleMenu: (name: string) => {},
        isMenuOpen,
        _getOpenedMenu,
        _notify,
        _handleBackButton,
    };
};
