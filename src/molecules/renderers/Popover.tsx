import { I18nManager, Animated, Easing, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';

import React, { useEffect, useRef } from 'react';

import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION, USE_NATIVE_DRIVER } from '../constants';

const popoverPadding = 7;
const anchorSize = 15;
const anchorHyp = Math.sqrt(anchorSize * anchorSize + anchorSize * anchorSize);
const anchorOffset = (anchorHyp + anchorSize) / 2 - popoverPadding;

// left/top placement
function axisNegativeSideProperties({ oDim, tPos }: any) {
  return { position: tPos - oDim };
}

// right/bottom placement
function axisPositiveSideProperties({ tPos, tDim }: any) {
  // substract also anchor placeholder from the beginning
  return { position: tPos + tDim - anchorSize };
}

type Aligment = {
  oDim: number;
  wDim: number;
  tPos: number;
  tDim: number;
};

// computes offsets (off screen overlap) of popover when trying to align it to the center
function centeringProperties({ oDim, wDim, tPos, tDim }: Aligment) {
  const center = Math.round(tPos + tDim / 2);
  const leftOffset = oDim / 2 - center;
  const rightOffset = center + oDim / 2 - wDim;
  return { center, leftOffset, rightOffset };
}

/**
 * Computes position and offset of popover when trying to align it to the triger center.
 * It consideres window boundaries.
 * Returns object with keys:
 *   - position: <Number> Absolute position - top/left,
 *   - offset: <Number> window overlapping size if window boundaries were not considered
 */
function axisCenteredPositionProperties(options: Aligment) {
  const { oDim, wDim } = options;
  const { center, leftOffset, rightOffset } = centeringProperties(options);
  if (leftOffset > 0 || rightOffset > 0) {
    // right/bottom position is better
    if (leftOffset < rightOffset) {
      return { offset: rightOffset, position: wDim - oDim };
    }
    // left/top position is better
    if (rightOffset < leftOffset) {
      return { offset: -leftOffset, position: 0 };
    }
  }
  // centered position
  return { offset: 0, position: center - oDim / 2 };
}

/* Evaluate centering placement */
function getCenteringPrice(options: Aligment) {
  const { leftOffset, rightOffset } = centeringProperties(options);
  // TODO: currently shifted popovers have higher price,
  // popover shift could be taken into account with the same price
  return Math.max(0, leftOffset) + Math.max(0, rightOffset);
}

/* Evaluate top placement */
function getTopPrice(hOptions: Aligment, vOptions: Aligment) {
  const centerOffset = getCenteringPrice(vOptions);
  const sideOffset = Math.max(0, hOptions.oDim - hOptions.tPos);
  return centerOffset + sideOffset;
}

/* Evaluate bottom placement */
function getBottomPrice(hOptions: Aligment, vOptions: Aligment) {
  const centerOffset = getCenteringPrice(vOptions);
  const sideOffset = Math.max(0, hOptions.tPos + hOptions.tDim + hOptions.oDim - hOptions.wDim);
  return centerOffset + sideOffset;
}

/* Evaluate left placement */
function getLeftPrice(hOptions: Aligment, vOptions: Aligment) {
  const centerOffset = getCenteringPrice(hOptions);
  const sideOffset = Math.max(0, vOptions.oDim - vOptions.tPos);
  return centerOffset + sideOffset;
}

/* Evaluate right placement */
function getRightPrice(hOptions: Aligment, vOptions: Aligment) {
  const centerOffset = getCenteringPrice(hOptions);
  const sideOffset = Math.max(0, vOptions.tPos + vOptions.tDim + vOptions.oDim - vOptions.wDim);
  return centerOffset + sideOffset;
}

function getStartPosKey(isRTL: boolean) {
  return isRTL ? 'right' : 'left';
}

function topProperties(hOptions: Aligment, vOptions: Aligment, isRTL: boolean) {
  const centered = axisCenteredPositionProperties(vOptions);
  const side = axisNegativeSideProperties(hOptions);
  return {
    position: {
      top: side.position,
      [getStartPosKey(isRTL)]: centered.position
    },
    offset: centered.offset,
    placement: 'top'
  };
}

function bottomProperties(hOptions: any, vOptions: any, isRTL: any) {
  const centered = axisCenteredPositionProperties(vOptions);
  const side = axisPositiveSideProperties(hOptions);
  return {
    position: {
      top: side.position,
      [getStartPosKey(isRTL)]: centered.position
    },
    offset: centered.offset,
    placement: 'bottom'
  };
}

function rightProperties(hOptions: any, vOptions: any, isRTL: any) {
  const centered = axisCenteredPositionProperties(hOptions);
  const side = axisPositiveSideProperties(vOptions);
  return {
    position: {
      top: centered.position,
      [getStartPosKey(isRTL)]: side.position
    },
    offset: centered.offset,
    placement: 'right'
  };
}

function leftProperties(hOptions: any, vOptions: any, isRTL: any) {
  const centered = axisCenteredPositionProperties(hOptions);
  const side = axisNegativeSideProperties(vOptions);
  return {
    position: {
      top: centered.position,
      [getStartPosKey(isRTL)]: side.position
    },
    offset: centered.offset,
    placement: 'left'
  };
}

// maps placement to function which computes correct properties
const propertiesByPlacement = {
  top: topProperties,
  bottom: bottomProperties,
  left: leftProperties,
  right: rightProperties
};

/**
 * Computes properties needed for drawing popover.
 * Returns object with keys:
 *   - position: <Object> { top: Number, left: Number } - popover absolute position
 *   - placement: <Enum> top|left|top|bottom - position to the trigger
 *   - offset: <Number> value by which must be anchor shifted
 */

export function computeProperties(
  { windowLayout, triggerLayout, optionsLayout }: any,
  placement: Placement,
  preferredPlacement: string,
  isRTL: any
) {
  const { x: wX, y: wY, width: wWidth, height: wHeight } = windowLayout;
  const { x: tX, y: tY, height: tHeight, width: tWidth } = triggerLayout;
  const { height: oHeight, width: oWidth } = optionsLayout;
  const hOptions = {
    oDim: oHeight + popoverPadding * 2,
    wDim: wHeight,
    tPos: tY - wY,
    tDim: tHeight
  };
  const vOptions = {
    oDim: oWidth + popoverPadding * 2,
    wDim: wWidth,
    tPos: tX - wX,
    tDim: tWidth
  };

  if (placement !== 'auto' && propertiesByPlacement[placement]) {
    return propertiesByPlacement[placement](hOptions, vOptions, isRTL);
  }

  const prices = {
    top: getTopPrice(hOptions, vOptions),
    bottom: getBottomPrice(hOptions, vOptions),
    right: getRightPrice(hOptions, vOptions),
    left: getLeftPrice(hOptions, vOptions)
  };

  const bestPrice = Object.values(prices).sort((a: number, b: number) => a - b)[0];

  const bestPlacement =
    prices[preferredPlacement as keyof typeof prices] === bestPrice
      ? preferredPlacement
      : Object.keys(prices).find((pl) => prices[pl as keyof typeof prices] === bestPrice);

  return propertiesByPlacement[bestPlacement as keyof typeof propertiesByPlacement](hOptions, vOptions, isRTL);
}

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto';
type PopoverProps = {
  style: ViewStyle;
  children: React.ReactNode;
  layouts: any;
  anchorStyle: ViewStyle;
  preferredPlacement: Placement;
  openAnimationDuration: number;
  closeAnimationDuration: number;
  placement: Placement;
};

const Popover = (props: PopoverProps) => {
  const scaleAnim = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      duration: props.openAnimationDuration !== undefined ? props.openAnimationDuration : OPEN_ANIM_DURATION,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER
    }).start();
  });

  const {
    style,
    children,
    layouts,
    anchorStyle,
    preferredPlacement,
    openAnimationDuration,
    closeAnimationDuration,
    placement: userPlacement,
    ...other
  } = props;
  const isRTL = I18nManager.isRTL;
  const animation = {
    transform: [{ scale: scaleAnim }],
    opacity: scaleAnim
  };
  const { position, placement, offset } = computeProperties(layouts, userPlacement, preferredPlacement, isRTL);

  return (
    <Animated.View
      style={[styles.animated, animation, position, getContainerStyle({ placement, isRTL }) as ViewStyle]}
      pointerEvents='box-none'
    >
      <View style={[styles.anchor, dynamicAnchorStyle({ placement, offset, isRTL }), anchorStyle]} />

      <View
        {...other}
        style={[styles.options, style]}
      >
        {children}
      </View>
    </Animated.View>
  );
};

const getContainerStyle = ({ placement, isRTL }: { placement: string; isRTL: boolean }) =>
  ({
    left: {
      flexDirection: isRTL ? 'row' : 'row-reverse'
    },
    right: {
      flexDirection: isRTL ? 'row-reverse' : 'row'
    },
    top: {
      flexDirection: 'column-reverse'
    },
    bottom: {
      flexDirection: 'column'
    }
  })[placement];

const dynamicAnchorStyle = ({ offset, placement, isRTL }: any) => {
  const start = getStartPosKey(isRTL);
  switch (placement) {
    case 'right':
      return {
        top: offset,
        transform: [{ translateX: anchorOffset }, { rotate: '45deg' }]
      };
    case 'left':
      return {
        top: offset,
        transform: [{ translateX: -anchorOffset }, { rotate: '45deg' }]
      };
    case 'top':
      return {
        [start]: offset,
        transform: [{ translateY: -anchorOffset }, { rotate: '45deg' }]
      };
    case 'bottom':
      return {
        [start]: offset,
        transform: [{ translateY: anchorOffset }, { rotate: '45deg' }]
      };
  }
};

export default Popover;

export const styles = StyleSheet.create({
  animated: {
    padding: popoverPadding,
    backgroundColor: 'transparent',
    position: 'absolute',
    alignItems: 'center'
  },
  options: {
    borderRadius: 2,
    minWidth: anchorHyp,
    minHeight: anchorHyp,
    backgroundColor: 'white',

    // Shadow only works on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,

    // This will elevate the view on Android, causing shadow to be drawn.
    elevation: 5
  },
  anchor: {
    width: anchorSize,
    height: anchorSize,
    backgroundColor: 'white',
    elevation: 5
  }
});
