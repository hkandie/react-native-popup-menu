import React, { useEffect, useRef, useState } from 'react';
import { debug } from '../util/logger';
import { usePopupMenu } from './MenuProvider';
import { makeName } from '../helpers/util';
import MenuRegisterProvider from './MenuRegisterProvider';
import { useMenu } from '../hooks/useMenu';
import { MenuInstance } from '../types';

interface MenuProps {
    children: React.ReactNode;
    onSelect: (option: string) => void;
    onOpen?: Function;
    onClose?: Function;
    triggerOnLongPress?: boolean;
    renderer?: Function;
    rendererProps?: Object;
    name?: string;
    opened?: boolean;
}

const isRegularComponent = (c: React.ReactNode) => true; // c.type !== MenuOptions && c.type !== MenuTrigger;
const isTrigger = (c: React.ReactNode) => true; //c.type === MenuTrigger;
const isMenuOptions = (c: React.ReactNode) => true; // c.type === MenuOptions;

const Menu = (props: MenuProps) => {
    const { menuCtx } = usePopupMenu();
    const menuName = useRef(props.name || makeName()).current;

    const [forceClose, setForceClose] = useState(false);
    const [_opened, setOpened] = useState(props.opened);
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

    useEffect(() => {
        debug('subscribing menu', menuName);
        if (!_validateChildren()) {
            return;
        }
        debug('subscribing menu', menuName);

        menuCtx?.menuRegistry?.subscribe?.({
            menuName,
            isOpen,
            _getOpened: () => _opened,
            _setOpened: (opened: boolean) => {
                setOpened(opened);
            },
            open: menuCtx.menuActions.openMenu(menuName),
            close: menuCtx.menuActions.closeMenu(menuName),
            onSelect: props.onSelect,
        } as MenuInstance);
        menuCtx.menuActions._notify();
    }, []);

    const isOpen = () => {
        if (forceClose) {
            return !forceClose;
        }
        return props.hasOwnProperty('opened') ? props.opened : _opened;
    };

    const openMenu = () => {
        menuCtx.menuActions.openMenu(menuName);
    };

    const closeMenu = () => {
        menuCtx.menuActions.closeMenu(menuName);
    };

    useEffect(() => {
        // force update if menu is opened as its content might have changed
        const force = isOpen();
        debug('component did update', menuName, force);
        menuCtx.menuActions._notify(force);
        const menu = menuCtx.menuRegistry.getMenu(menuName);
        return () => {
            console.log('unsubscribing menu', menuName);
            if (isOpen()) {
                setForceClose(true);
                menuCtx.menuActions._notify();
            }
            menuCtx.menuRegistry.unsubscribe?.(menuName);
        };
    }, [props.name]);

    useEffect(() => {
        if (props.opened) {
            openMenu();
        } else {
            closeMenu();
        }
    }, [props.opened]);

    return <MenuRegisterProvider menuName={menuName}>{props.children}</MenuRegisterProvider>;
};
export default Menu;
