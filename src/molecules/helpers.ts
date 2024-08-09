import React, { FunctionComponentElement } from 'react';

import { Platform, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native';

/**
 * Promisifies measure's callback function and returns layout object.
 */
export const measure = (ref: View) =>
  new Promise((resolve) => {
    ref.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      resolve({
        x: pageX,
        y: pageY,
        width,
        height
      });
    });
  });

/**
 * Create unique menu name across all menu instances.
 */
export const makeName = (function () {
  let nextID = 1;
  return () => `menu-${nextID++}`;
})();

/**
 * Create touchable component based on passed parameter and platform.
 * It also returns default props for specific touchable types.
 */
export function makeTouchable(TouchableComponent: any) {
  const Touchable =
    TouchableComponent ||
    Platform.select({
      android: TouchableNativeFeedback,
      ios: TouchableHighlight,
      default: TouchableHighlight
    });
  let defaultTouchableProps = {};
  if (Touchable === TouchableHighlight) {
    defaultTouchableProps = { underlayColor: 'rgba(0, 0, 0, 0.1)' };
  }
  return { Touchable, defaultTouchableProps };
}

function includes(arr: any, value: any) {
  return arr.indexOf(value) > -1;
}

/**
Log object - prepares object for logging by stripping all "private" or excluding fields
*/
export function lo(object: any, ...excluding: any[]) {
  const exc = Array.from(excluding);
  function isObject(obj: any) {
    return obj === Object(obj);
  }
  function withoutPrivate(obj: any) {
    if (!isObject(obj)) return obj;
    const res = {};
    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (!property.startsWith('_') && !includes(exc, property)) {
          res[property] = withoutPrivate(obj[property]);
        }
      }
    }
    return res;
  }
  return withoutPrivate(object);
}

/**
Converts iterator to array
*/
export function iterator2array(it: MapIterator<any>) {
  // workaround around https://github.com/instea/react-native-popup-menu/issues/41#issuecomment-340290127
  const arr = [];
  for (let next = it.next(); !next.done; next = it.next()) {
    arr.push(next.value);
  }
  return arr;
}

/** checks if component is class component */
export function isClassComponent(component: any) {
  return component.prototype && !!component.prototype.render;
}
