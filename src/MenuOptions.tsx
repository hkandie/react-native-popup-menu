import React, { useEffect } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { withCtx } from './MenuProvider';
import { MenuOptionsCustomStyle } from './types';

interface MenuOptionsProps {
    customStyles: MenuOptionsCustomStyle;
    style: StyleProp<ViewStyle>;
    children: React.ReactNode;
    renderOptionsContainer: Function;
    ctx: any;
    optionsContainerStyle: StyleProp<ViewStyle> | StyleProp<ViewStyle>[] | number;
}

const MenuOptions = ({ ctx, customStyles = {}, style, children }: MenuOptionsProps) => {
    function updateCustomStyles(customStyles: MenuOptionsCustomStyle) {
        const menu = ctx.menuActions._getOpenedMenu();
        // FIXME react 16.3 workaround for ControlledExample!
        if (!menu) return;
        const menuName = menu.instance.getName();
        ctx.menuRegistry.setOptionsCustomStyles(menuName, customStyles);
    }

    useEffect(() => {
        updateCustomStyles(customStyles);
    }, [customStyles]);

    return <View style={[customStyles.optionsWrapper, style]}>{children}</View>;
};

export default withCtx(MenuOptions);
