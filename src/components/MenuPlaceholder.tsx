import React, { Component, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Backdrop from './Backdrop';
import { usePopupMenu } from './MenuProvider';
import { debug } from '../util/logger';

interface MenuPlaceholderProps {
    backdropStyles?: {};
}

const MenuPlaceholder = (props: MenuPlaceholderProps) => {
    const { menuCtx } = usePopupMenu();

    useEffect(() => {
        return () => {
            debug('unmounting menu');
            !menuCtx._isMenuClosing;
        };
    }, []);

    const { backdropStyles } = props;
    const shouldRenderMenu = menuCtx.isMenuOpen() && menuCtx._isInitialized();
    debug('MenuPlaceholder should render', shouldRenderMenu);
    if (!shouldRenderMenu) {
        return null;
    }
    return (
        <View style={styles.placeholder}>
            <Backdrop
                onPress={menuCtx._onBackdropPress}
                style={backdropStyles}
                ref={menuCtx.onBackdropRef}
            />
            {menuCtx._makeOptions()}
        </View>
    );
};

const styles = StyleSheet.create({
    placeholder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
});

export default MenuPlaceholder;