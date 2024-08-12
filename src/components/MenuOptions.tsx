import { useEffect } from 'react';
import { usePopupMenu } from './MenuProvider';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useMenuRegister } from './MenuRegisterProvider';
import { CustomStyles } from '../types';

interface MenuOptionsProps {
    children: React.ReactNode;
    customStyles?: CustomStyles;
    style?: StyleProp<ViewStyle>;
    optionsContainerStyle?: StyleProp<ViewStyle>;
}

const MenuOptions = (props: MenuOptionsProps) => {
    const { menuCtx } = usePopupMenu();
    const { menuName } = useMenuRegister();

    const { customStyles, style, children } = props;
    function updateCustomStyles() {
        const menu = menuCtx.menuRegistry.getMenu(menuName);
        // FIXME react 16.3 workaround for ControlledExample!
        if (!menu) return;
        console.log('menuName', menuName);
        menuCtx?.menuRegistry?.setOptionsCustomStyles?.(menuName, customStyles);
    }
    useEffect(() => {
        updateCustomStyles();
    }, [customStyles]);

    return <View style={[customStyles?.optionsWrapper, style]}>{children}</View>;
};

export default MenuOptions;
