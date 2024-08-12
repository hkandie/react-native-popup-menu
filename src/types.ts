import { StyleProp, TouchableHighlight, View, ViewStyle } from 'react-native';

export interface MenuType {
    name: string;
    renderer: Function;
    rendererProps: Object;
    onSelect: Function;
    onOpen: Function;
    onClose: Function;
    opened: boolean;
    onBackdropPress: Function;
}

export type MenuInstance = {
    menuName: string;
    isOpen: () => boolean;
    _getOpened: () => boolean;
    _setOpened: (opened: boolean) => void;
    onSelect: (option: string) => void;
};
export type MenuLayout = {
    triggerLayout: () => string;
    optionsLayout: () => string;
};
export type MenuData = {
    name?: string;
    instance?: MenuInstance;
    layout?: MenuLayout;
    triggerLayout?: () => string;
    optionsLayout?: () => string;
    optionsCustomStyles?: CustomStyles;
    onSelect?: (option: string) => void;
};

export type MenuRegistry = {
    subscribe?: (instance: MenuInstance) => void;
    unsubscribe?: (name: string) => void;
    updateLayoutInfo?: (name: string, layouts?: MenuLayout) => void;
    getMenu: (name: string) => MenuData | undefined;
    getAll: () => MenuData[];
    setOptionsCustomStyles?: (name: string, optionsCustomStyles?: CustomStyles) => void;
};

export type MenuActions = {
    openMenu: (name: string) => () => void;
    closeMenu: (name: string) => () => void;
    _notify: (forceUpdate?: boolean) => void;
};

export type CustomStyles = {
    optionsContainer?: StyleProp<ViewStyle>;
    optionsWrapper?: StyleProp<ViewStyle>;
    optionWrapper?: StyleProp<ViewStyle>;
    optionText?: StyleProp<ViewStyle>;
    optionTouchable?: {};
    OptionTouchableComponent?:  typeof TouchableHighlight;
    menuProviderWrapper?: StyleProp<ViewStyle>;
    menuContextWrapper?: StyleProp<ViewStyle>;
    backdrop?: StyleProp<ViewStyle>;
};
