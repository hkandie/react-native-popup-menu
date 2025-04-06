import React from 'react';

import { Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';

/**
 * Promisifies measure's callback function and returns layout object.
 */
export const measure = (ref: any) =>
  new Promise((resolve) => {
    ref.measure((x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
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
export function iterator2array(it: any) {
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

/**
 * Higher order component to deprecate usage of component.
 * message - deprecate warning message
 * methods - array of method names to be delegated to deprecated component
 */
export function deprecatedComponent(message: any, methods = []) {
  return function deprecatedComponentHOC(Component: any) {
    return class DeprecatedComponent extends React.Component {
      props: any;
      ref: any;
      constructor(...args: any[]) {
        super(...args);
        methods.forEach((name) => {
          // delegate methods to the component

                    this[name] = (...args: any[]) => this.ref && this.ref[name](...args);
        });
      }

      render() {
        return (
                    <Component
            {...this.props}
            ref={this.onRef}
          />
        );
      }

      onRef = (ref: any) => (this.ref = ref);

      componentDidMount() {
        console.warn(message);
      }
    };
  };
}
