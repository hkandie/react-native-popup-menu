import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface MenuOptionCustomStyle {
    optionWrapper?: StyleProp<ViewStyle>;
    optionText?: StyleProp<TextStyle>;
    optionTouchable?: {};
    OptionTouchableComponent?: Function;
}

export interface MenuOptionsCustomStyle extends MenuOptionCustomStyle {
    optionsWrapper?: StyleProp<ViewStyle>;
    optionsContainer?: StyleProp<ViewStyle>;
}
