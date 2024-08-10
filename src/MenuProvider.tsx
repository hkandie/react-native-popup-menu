import React, { Component, createContext, useEffect } from 'react';
import { View, BackHandler, SafeAreaView, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { withContext } from './with-context.js';
import makeMenuRegistry from './menuRegistry.js';
import MenuPlaceholder from './MenuPlaceholder.js';
import { measure, isClassComponent } from './helpers.js';
import { debug } from './logger.js';
import MenuOutside from './renderers/MenuOutside.js';

const defaultOptionsContainerRenderer = (options) => options;
const layoutsEqual = (a, b) => a === b || (a && b && a.width === b.width && a.height === b.height);

if (!React.forwardRef) {
    throw new Error('This version of popup-menu requires RN 0.55+. Check our compatibility table.');
}
export const PopupMenuContext = createContext({});
export const withCtx = withContext(PopupMenuContext, 'ctx');

// count of MenuProvider instances
let instanceCount = 0;

interface MenuProviderProps {
    style?: StyleProp<ViewStyle>;
    customStyles?: {
        menuProviderWrapper?: StyleProp<ViewStyle>;
        backdrop?: StyleProp<ViewStyle>;
    };
    backHandler?: boolean | Function;
    skipInstanceCheck?: boolean;
    children: React.ReactNode;
}

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
const MenuProvider = ({
    customStyles = {},
    backHandler = false,
    skipInstanceCheck = false,
    style,
    children,
}: MenuProviderProps) => {
    const _menuRegistry = makeMenuRegistry();
    const _isMenuClosing = false;
    const _isBackHandlerRegistered = false;
    const menuActions = {
        openMenu: (name: string) => openMenu(name),
        closeMenu: () => closeMenu(),
        toggleMenu: (name: string) => toggleMenu(name),
        isMenuOpen: () => isMenuOpen(),
        _getOpenedMenu: () => _getOpenedMenu(),
        _notify: (force: string) => _notify(force),
    };
    const menuCtx = { menuRegistry: _menuRegistry, menuActions };

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
            return backHandler(this);
        }

        return false;
    };

    useEffect(() => {
        if (customStyles?.menuContextWrapper) {
            console.warn(
                'menuContextWrapper custom style is deprecated and it might be removed in future releases, use menuProviderWrapper instead.'
            );
        }
        if (!skipInstanceCheck) {
            instanceCount++;
        }
        if (instanceCount > 1) {
            console.warn(
                'In most cases you should not have more MenuProviders in your app (see API documentation). In other cases use skipInstanceCheck prop.'
            );
        }
        return () => {
            if (isBackHandlerRegistered) {
                BackHandler.removeEventListener('hardwareBackPress', _handleBackButton);
            }
            if (!skipInstanceCheck) {
                instanceCount--;
            }
        };
    }, []);

    const isMenuOpen = () => {
        return !!_getOpenedMenu();
    };
    const openMenu = (name: string) => {
        const menu = _menuRegistry.getMenu(name);
        if (!menu) {
            console.warn(`menu with name ${name} does not exist`);
            return Promise.resolve();
        }
        debug('open menu', name);
        if (!_isBackHandlerRegistered) {
            // delay menu registration until the menu is really opened (and thus this back handler will be called "sooner")
            // too soon registration can cause another back handlers (e.g. react navigation) to be called instead of our back handler
            BackHandler.addEventListener('hardwareBackPress', _handleBackButton);
            _isBackHandlerRegistered = true;
        }
        menu.instance._setOpened(true);
        return _notify();
    };
    const closeMenu = () => {
        // has no effect on controlled menus
        debug('close menu');
        _menuRegistry
            .getAll()
            .filter((menu) => menu.instance._getOpened())
            .forEach((menu) => menu.instance._setOpened(false));
        return _notify();
    };

    const _invalidateTriggerLayouts = () => {
        // invalidate layouts for closed menus,
        // both controlled and uncontrolled menus
        _menuRegistry
            .getAll()
            .filter((menu) => !menu.instance.isOpen())
            .forEach((menu) => {
                _menuRegistry.updateLayoutInfo(menu.name, {
                    triggerLayout: undefined,
                });
            });
    };

    const _beforeClose = (menu: { name: any }) => {
        debug('before close', menu.name);
        const hideMenu = (optionsRef && optionsRef.close && optionsRef.close()) || Promise.resolve();
        const hideBackdrop = backdropRef && backdropRef.close();
        _invalidateTriggerLayouts();
        _isMenuClosing = true;
        return Promise.all([hideMenu, hideBackdrop])
            .then(() => {
                _isMenuClosing = false;
            })
            .catch((err) => {
                _isMenuClosing = false;
                throw err;
            });
    };

    const toggleMenu = (name: string) => {
        const menu = _menuRegistry.getMenu(name);
        if (!menu) {
            console.warn(`menu with name ${name} does not exist`);
            return Promise.resolve();
        }
        debug('toggle menu', name);
        if (menu.instance._getOpened()) {
            return closeMenu();
        } else {
            return openMenu(name);
        }
    };

    const _notify = (forceUpdate) => {
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
            _placeholderRef.setState({ openedMenuName: openedMenu && openedMenu.name }, afterSetState);
            debug('notify ended');
        });
    };

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
    debug('render menu', isMenuOpen(), _ownLayout);

    const onBackdropRef = (r) => {
        backdropRef = r;
    };

    const onOptionsRef = (r) => {
        optionsRef = r;
    };

    const _onPlaceholderRef = (r) => (_placeholderRef = r);

    const _getOpenedMenu = () => {
        const name = _placeholderRef && _placeholderRef.state.openedMenuName;
        const menu = name ? _menuRegistry.getMenu(name) : undefined;
        debug('_getOpenedMenu', name, !!menu);
        return menu;
    };

    const _onBackdropPress = () => {
        debug('on backdrop press');
        const menu = _getOpenedMenu();
        if (menu) {
            menu.instance.props.onBackdropPress();
        }
        closeMenu();
    };

    const _isInitialized = () => {
        return !!_ownLayout;
    };

    function _initOpen(menu) {
        debug('opening', menu.name);
        const trigger = menu.instance._getTrigger();
        measure(trigger).then((triggerLayout) => {
            debug('got trigger measurements', triggerLayout);
            _menuRegistry.updateLayoutInfo(menu.name, { triggerLayout });
            backdropRef && backdropRef.open();
            _notify();
        });
    }

    function _onOptionsLayout(e, name, isOutside) {
        const optionsLayout = e.nativeEvent.layout;
        optionsLayout.isOutside = isOutside;
        debug('got options layout', optionsLayout);
        _menuRegistry.updateLayoutInfo(name, { optionsLayout });
        _notify();
    }

    function _makeOptions() {
        const { instance, triggerLayout, optionsLayout } = _getOpenedMenu();
        const options = instance._getOptions();
        const { renderer, rendererProps } = instance.props;
        const windowLayout = _ownLayout;
        const safeAreaLayout = _safeAreaLayout;
        const { optionsContainerStyle, renderOptionsContainer, customStyles } = options.props;
        const optionsRenderer = renderOptionsContainer || defaultOptionsContainerRenderer;
        const isOutside = !triggerLayout || !optionsLayout;
        const onLayout = (e) => _onOptionsLayout(e, instance.getName(), isOutside);
        const style = [optionsContainerStyle, customStyles.optionsContainer];
        const layouts = {
            windowLayout,
            triggerLayout,
            optionsLayout,
            safeAreaLayout,
        };
        const props = { ...rendererProps, style, onLayout, layouts };
        const optionsType = isOutside ? MenuOutside : renderer;
        if (isClassComponent(optionsType)) {
            props.ref = onOptionsRef;
        }
        return React.createElement(optionsType, props, optionsRenderer(options));
    }
    const _ownLayout = layout;
    const _onLayout = ({ nativeEvent: { layout } }) => {
        if (layoutsEqual(_ownLayout, layout)) {
            return;
        }

        debug('context layout has changed', _ownLayout);
        if (!isMenuOpen()) {
            return;
        }
        const { instance } = _getOpenedMenu();
        const trigger = instance._getTrigger();
        measure(trigger).then((triggerLayout) => {
            debug('got trigger measurements after context layout change', triggerLayout);
            _menuRegistry.updateLayoutInfo(instance.getName(), {
                triggerLayout,
            });
            // force update as own layout has changed
            _notify(true);
        });
    };

    const _onSafeAreaLayout = ({ nativeEvent: { layout } }) => {
        const _safeAreaLayout = layout;
        debug('safeArea layout has changed', _safeAreaLayout);
        if (!isMenuOpen()) {
            return;
        }
        if (layoutsEqual(_safeAreaLayout, layout)) {
            return;
        }

        _notify(true);
    };
    return (
        <PopupMenuContext.Provider value={menuCtx}>
            <View
                style={styles.flex1}
                onLayout={_onLayout}
            >
                <View style={[styles.flex1, customStyles.menuContextWrapper, customStyles.menuProviderWrapper, style]}>
                    {children}
                </View>
                <SafeAreaView
                    style={styles.safeArea}
                    pointerEvents='box-none'
                >
                    <View
                        style={styles.flex1}
                        collapsable={false}
                        pointerEvents='box-none'
                        onLayout={_onSafeAreaLayout}
                    />
                    <MenuPlaceholder
                        ctx={this}
                        backdropStyles={customStyles.backdrop}
                        ref={_onPlaceholderRef}
                    />
                </SafeAreaView>
            </View>
        </PopupMenuContext.Provider>
    );
};

export default MenuProvider;