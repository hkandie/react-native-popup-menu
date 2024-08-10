import React, { Component, ReactNode, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import MenuOptions from './MenuOptions';
import MenuTrigger from './MenuTrigger';
import ContextMenu from './renderers/ContextMenu';
import { makeName } from './helpers';
import { debug, CFG } from './logger';
import { withCtx } from './MenuProvider';

const isRegularComponent = (c) => c.type !== MenuOptions && c.type !== MenuTrigger;
const isTrigger = (c) => c.type === MenuTrigger;
const isMenuOptions = (c) => c.type === MenuOptions;

interface MenuProps {
    name?: string;
    renderer?: () => ReactNode;
    rendererProps?: any;
    onSelect?: Function;
    onOpen?: Function;
    onClose?: Function;
    opened?: boolean;
    onBackdropPress?: Function;
    style?: any;
    ctx: any;
}
const Menu = (props: MenuProps) => {
    const _name = props.name || makeName();
    const [forceClose, setForceClose] = useState(false);
    const [prevProps, setPrevProps] = useState(props);
    const [_opened, setOpened] = useState(props.opened);

    const { ctx } = props;
    if (!(ctx && ctx.menuActions)) {
        throw new Error('Menu component must be ancestor of MenuProvider');
    }

    useEffect(() => {
        if (!_validateChildren()) {
            return;
        }
        debug('subscribing menu', _name);
        props.ctx.menuRegistry.subscribe(this);
        props.ctx.menuActions._notify();
    }, []);

    useEffect(() => {
        if (props.name !== prevProps.name) {
            console.warn('Menu name cannot be changed');
        }
        // force update if menu is opened as its content might have changed
        const force = isOpen();
        debug('component did update', _name, force);
        props.ctx.menuActions._notify(force);
        return () => {
            debug('unsubscribing menu', _name);
            if (isOpen()) {
                setForceClose(true);
                props.ctx.menuActions._notify();
            }
            props.ctx.menuRegistry.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (props.opened !== prevProps.opened) {
            if (props.opened) {
                open();
            } else {
                close();
            }
        }
    }, [props.opened]);

    function open() {
        return props.ctx.menuActions.openMenu(_name);
    }

    function close() {
        return props.ctx.menuActions.closeMenu();
    }

    function isOpen() {
        if (forceClose) {
            return false;
        }
        return props.hasOwnProperty('opened') ? props.opened : _opened;
    }

    function getName() {
        return _name;
    }

    const { style } = props;
    const children = _reduceChildren();

    function _reduceChildren() {
        return React.Children.toArray(props.children).reduce((r: ReactNode[], child) => {
            if (isTrigger(child)) {
                r.push(
                    React.cloneElement(child, {
                        key: null,
                        menuName: _name,
                        onRef: (t) => (_trigger = t),
                    })
                );
            }
            if (isRegularComponent(child)) {
                r.push(child);
            }
            return r;
        }, []);
    }

    function _getTrigger() {
        return _trigger;
    }

    function _getOptions() {
        return React.Children.toArray(props.children).find(isMenuOptions);
    }

    function _validateChildren() {
        const children = React.Children.toArray(props.children);
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
    return <View style={style}>{children}</View>;
};

Menu.propTypes = {
    name: PropTypes.string,
    renderer: PropTypes.func,
    rendererProps: PropTypes.object,
    onSelect: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    opened: PropTypes.bool,
    onBackdropPress: PropTypes.func,
};

Menu.defaultProps = {
    renderer: ContextMenu,
    rendererProps: {},
    onSelect: () => {},
    onOpen: () => {},
    onClose: () => {},
    onBackdropPress: () => {},
};

const MenuExternal = withCtx(Menu);
Object.defineProperty(MenuExternal, 'debug', {
    get: function () {
        return CFG.debug;
    },
    set: function (val) {
        CFG.debug = val;
    },
});
MenuExternal.setDefaultRenderer = (renderer) => {
    Menu.defaultProps.renderer = renderer;
};
MenuExternal.setDefaultRendererProps = (rendererProps) => {
    Menu.defaultProps.rendererProps = rendererProps;
};
export default MenuExternal;
