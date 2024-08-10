import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Backdrop from './Backdrop';
import { debug } from './logger.js';

interface MenuPlaceholderProps {
    ctx: any;
    backdropStyles: any;
    ref: any;
}

const MenuPlaceholder = ({ ctx, backdropStyles }: MenuPlaceholderProps) => {
    const shouldRenderMenu = ctx?.isMenuOpen() && ctx?._isInitialized();
    debug('MenuPlaceholder should render', shouldRenderMenu);
    if (!shouldRenderMenu) {
        return null;
    }
    return (
        <View style={styles.placeholder}>
            <Backdrop
                onPress={ctx._onBackdropPress}
                style={backdropStyles}
                ref={ctx.onBackdropRef}
            />
            {ctx._makeOptions()}
        </View>
    );
};

export default React.memo(MenuPlaceholder);

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
