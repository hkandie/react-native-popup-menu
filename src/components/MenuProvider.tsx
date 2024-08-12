import React, { createContext, useContext, useEffect, useState } from 'react';
import makeMenuRegistry from '../helpers/menu-registry';
import { useMenuActions } from '../hooks/useMenuActions';
import { debug } from '../util/logger';
import { MenuRegistry,MenuActions, CustomStyles } from '../types';
import { View, BackHandler, SafeAreaView, StyleSheet,StyleProp,, ViewStyle } from 'react-native';
import MenuPlaceholder from './MenuPlaceholder';
import { isClassComponent } from '../helpers/util';


export interface IMenuContext {
    menuCtx: {
        menuRegistry: MenuRegistry;
        menuActions: any;
    };
}

export const PopupMenuContext = createContext<IMenuContext>({
    menuCtx: {
        menuRegistry: {} as MenuRegistry,
        menuActions: {} as MenuActions,
    },
});

interface MenuProviderProps {
    style?: StyleProp<ViewStyle>;
    customStyles?: CustomStyles;
    backHandler?:  boolean | (() => boolean | null | undefined);
    skipInstanceCheck?: boolean;
    children: React.ReactNode;
}
// count of MenuProvider instances
let instanceCount = 0;

const MenuProvider = ({ children, backHandler, customStyles, skipInstanceCheck,style }: MenuProviderProps) => {
    const _menuRegistry = makeMenuRegistry();
    const menuActions = useMenuActions(_menuRegistry, backHandler);
    const [isBackHandlerRegistered, setIsBackHandlerRegistered] = useState(false);
   

    const menuCtx = { menuRegistry: _menuRegistry, menuActions };

    useEffect(() => {
        if (customStyles?.menuProviderWrapper) {
            console.warn(
                'menuContextWrapper custom style is deprecated and it might be removed in future releases, use menuProviderWrapper instead.'
            );
        }
        if (!skipInstanceCheck) {
            instanceCount++;
        }
        if (instanceCount > 1) {
            console.warn(
                'In most cases you should not have more MenuProviders in your app (see API documentation). In other cases use skipInstanceCheck prop.'
            );
        }
        return () => {
            debug('unmounting menu provider');
            if (isBackHandlerRegistered) {
                BackHandler.removeEventListener('hardwareBackPress', menuActions._handleBackButton);
            }
            if (!skipInstanceCheck) {
                instanceCount--;
            }
        };
    }, []);

    debug('render menu', this.isMenuOpen(), this._ownLayout);
    function _makeOptions() {
        const { instance, triggerLayout, optionsLayout } = menuActions._getOpenedMenu();
        const options = instance._getOptions();
        const { renderer, rendererProps } = instance.props;
        const windowLayout = this._ownLayout;
        const safeAreaLayout = this._safeAreaLayout;
        const { optionsContainerStyle, renderOptionsContainer, customStyles } = options.props;
        const optionsRenderer = renderOptionsContainer || defaultOptionsContainerRenderer;
        const isOutside = !triggerLayout || !optionsLayout;
        const onLayout = e => this._onOptionsLayout(e, instance.getName(), isOutside);
        const style = [optionsContainerStyle, customStyles.optionsContainer];
        const layouts = { windowLayout, triggerLayout, optionsLayout, safeAreaLayout };
        const props = { ...rendererProps, style, onLayout, layouts };
        const optionsType = isOutside ? MenuOutside : renderer;
        if (isClassComponent(optionsType)) {
          props.ref = this.onOptionsRef;
        }
        return React.createElement(optionsType, props, optionsRenderer(options));
      }
    return (
      <PopupMenuContext.Provider value={{ menuCtx }}>
        <View style={styles.flex1} onLayout={_onLayout}>
          <View style={[
            styles.flex1,
            customStyles?.menuContextWrapper,
            customStyles?.menuProviderWrapper,
            style,
          ]}>
            {children }
          </View>
          <SafeAreaView
            style={styles.safeArea}
            pointerEvents="box-none"
          >
            <View
              style={styles.flex1}
              collapsable={false}
              pointerEvents="box-none"
              onLayout={this._onSafeAreaLayout}/>
            <MenuPlaceholder
            //   backdropStyles={customStyles.backdrop}
            //   ref={this._onPlaceholderRef}
              />
          </SafeAreaView>
        </View>
      </PopupMenuContext.Provider>
    );
};

export default MenuProvider;

export const usePopupMenu = () => useContext(PopupMenuContext);
const styles = StyleSheet.create({
    flex1: {
      flex: 1,
    },
    safeArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });