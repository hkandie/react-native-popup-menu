import React from 'react';
import { Platform, TouchableHighlight } from 'react-native';

/**
 * Promisifies measure's callback function and returns layout object.
 */
export const measure = (ref: {
    measure: (arg0: (x: any, y: any, width: any, height: any, pageX: any, pageY: any) => void) => void;
}) =>
    new Promise((resolve) => {
        ref.measure((x, y, width, height, pageX, pageY) => {
            resolve({
                x: pageX,
                y: pageY,
                width,
                height,
            });
        });
    });

/**
 * Create unique menu name across all menu instances.
 */
export const makeName = (() => {
    let nextID = 1;
    return () => `menu-${nextID++}`;
})();

/**
 * Create touchable component based on passed parameter and platform.
 * It also returns default props for specific touchable types.
 */
export function makeTouchable(TouchableComponent?: typeof TouchableHighlight) {
    const Touchable =
        TouchableComponent ||
        Platform.select({
            android: TouchableHighlight, // Change TouchableNativeFeedback to TouchableHighlight
            ios: TouchableHighlight,
            default: TouchableHighlight,
        });
    let defaultTouchableProps = {};
    if (Touchable === TouchableHighlight) {
        defaultTouchableProps = { underlayColor: 'rgba(0, 0, 0, 0.1)' };
    }
    return { Touchable, defaultTouchableProps };
}

function includes<T>(arr: T[], value: T) {
    return arr.indexOf(value) > -1;
}

/**
Log object - prepares object for logging by stripping all "private" or excluding fields
*/
export function lo(object: Object, ...excluding: string[]) {
    const exc = Array.from(excluding);
    function isObject(obj: Object) {
        return obj === Object(obj);
    }
    function withoutPrivate(obj: { [key: string]: any }) {
        // Add index signature to allow indexing with a string
        if (!isObject(obj)) return obj;
        const res: { [key: string]: any } = {}; // Add index signature to allow indexing with a string
        for (let property in obj) {
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
export function iterator2array(it: { next: () => any }) {
    // workaround around https://github.com/instea/react-native-popup-menu/issues/41#issuecomment-340290127
    const arr = [];
    for (let next = it.next(); !next.done; next = it.next()) {
        arr.push(next.value);
    }
    return arr;
}

/** checks if component is class component */
export function isClassComponent(component: { prototype: { render: any } }) {
    return component.prototype && !!component.prototype.render;
}
