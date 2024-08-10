import React from 'react';
import { View, StyleSheet } from 'react-native';

export const computePosition = ({ windowLayout }: { windowLayout: any }) => ({
    top: windowLayout.height,
    left: windowLayout.width,
});

type MenuOutsideProps = {
    style?: any;
    children?: any;
    layouts: {
        windowLayout: any;
    };
};

const MenuOutside = (props: MenuOutsideProps) => {
    const { style, children, layouts, ...other } = props;
    const position = computePosition(layouts);
    return (
        <View
            {...other}
            style={[styles.options, style, position]}
            collapsable={false}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    options: {
        position: 'absolute',
    },
});

export default MenuOutside;
