import { createContext, useContext } from 'react';

export interface IMenuRegisterContext {
    menuName: string;
}

export interface MenuRegisterProviderProps {
    menuName: string;
    children: React.ReactNode;
}

const MenuRegisterContext = createContext<IMenuRegisterContext>({
    menuName: '',
});

const MenuRegisterProvider = ({ children, menuName }: MenuRegisterProviderProps) => {
    const menu = {
        menuName,
    };

    return <MenuRegisterContext.Provider value={menu}>{children}</MenuRegisterContext.Provider>;
};

export default MenuRegisterProvider;

export const useMenuRegister = () => useContext(MenuRegisterContext);
