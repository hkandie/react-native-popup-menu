import React, { createContext } from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';

export const PopupMenuContext = createContext({});
interface MenuProviderProp {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const MenuProvider = ({ children }: MenuProviderProp) => {
    return <PopupMenuContext.Provider value={{}}>{children}</PopupMenuContext.Provider>;
};

export default MenuProvider;
