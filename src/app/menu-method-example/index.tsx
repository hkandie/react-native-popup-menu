import Menu, { MenuOption, MenuOptions, MenuProvider, MenuTrigger, withMenuContext } from '@/src/molecules';
import React, { Component } from 'react';

import { Text, TouchableOpacity } from 'react-native';

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
  function onOptionSelect(value: any) {
    alert(`Selected number: ${value}`);
    if (value === 1) {
      menu.close();
    }
    return false;
  }

  function openMenu() {
    menu.open();
  }

  const onRef = (r: any) => {
    menu = r;
  };

  return (
    <MenuProvider style={{ flexDirection: 'column', padding: 30 }}>
      <Menu
        onSelect={(value: any) => onOptionSelect(value)}
        name='menu-1'
        ref={onRef}
      >
        <MenuTrigger text='Select option' />

        <MenuOptions>
          <MenuOption
            value={1}
            text='One'
          />

          <MenuOption
            value={2}
            text='Two (not closing)'
          />
        </MenuOptions>
      </Menu>
      the full error message
      <TouchableOpacity
        style={{ paddingTop: 50 }}
        onPress={() => this.openMenu()}
      >
        <Text>Open menu from outside</Text>
      </TouchableOpacity>
      the full error message
      <ContextOpenner />
    </MenuProvider>
  );
};

export default ControlledExample;
