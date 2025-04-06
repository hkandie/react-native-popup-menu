import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger, withMenuContext } from 'react-native-popup-menu';

const Openner = (props: any) => (
  <TouchableOpacity
    style={{ paddingTop: 50 }}
    onPress={() => props.ctx.menuActions.openMenu('menu-1')}
  >
    <Text>Open menu from context</Text>
  </TouchableOpacity>
);

const ContextOpenner = withMenuContext(Openner);

const ControlledExample = () => {
  return (
    <MenuProvider style={{ flexDirection: 'column', padding: 30 }}>
      <Text>Controlled Example</Text>

      <Menu
        name='menu-1'
        onSelect={(value: any) => alert(`Selected number: ${value}`)}
      >
        <MenuTrigger text='Select option' />

        <MenuOptions>
          <MenuOption
            value={1}
            text='One'
          />

          <MenuOption value={2}>
            <Text style={{ color: 'red' }}>Two (not closing)</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>

      <ContextOpenner />
    </MenuProvider>
  );
};
export default ControlledExample;
