import React from 'react';
import { View, Text } from 'react-native';
import { debug } from './logger';
import { makeTouchable } from './helpers';
import { withCtx } from './MenuProvider';

interface MenuTriggerProps {
  disabled?: boolean;
  text?: string;
  onPress?: () => void;
  onAlternativeAction?: () => void;
  customStyles?: any;
  triggerOnLongPress?: boolean;
  testID?: string;
  menuName?: string;
  onRef?: (ref: any) => void;
  ctx?: any; // Context provided by withCtx
  style?: any;
  children?: React.ReactNode;
}

const MenuTrigger = ({
  onRef,
  text,
  children,
  style,
  disabled = false,
  customStyles = {},
  testID = undefined,
  menuName,
  triggerOnLongPress,
  onAlternativeAction,
  ...other
}: MenuTriggerProps) => {
  const onPress = () => {
    debug('trigger onPress');
    if (!disabled) {
      other.onPress && other.onPress();
      other.ctx.menuActions.openMenu(menuName);
    }
  };
  const { Touchable, defaultTouchableProps } = makeTouchable(customStyles.TriggerTouchableComponent);
  return (
    <View
      ref={onRef}
      collapsable={false}
      style={customStyles.triggerOuterWrapper}
    >
      <Touchable
        testID={testID}
        onPress={triggerOnLongPress ? onAlternativeAction : onPress}
        onLongPress={triggerOnLongPress ? onPress : onAlternativeAction}
        disabled={disabled}
        {...defaultTouchableProps}
        {...customStyles.triggerTouchable}
      >
        <View
          {...other}
          style={[customStyles.triggerWrapper, style]}
        >
          {text ? <Text style={customStyles.triggerText}>{text}</Text> : children}
        </View>
      </Touchable>
    </View>
  );
};

export default withCtx(MenuTrigger);
