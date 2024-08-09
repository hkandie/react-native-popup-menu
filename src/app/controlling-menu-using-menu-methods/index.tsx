import React, { Component, useState } from 'react';

import { Text, TouchableOpacity } from 'react-native';
import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger, withMenuContext } from '../../molecules';

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
  const [menu, setMenu] = useState(null);

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
    setMenu(r);
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

      <TouchableOpacity
        style={{ paddingTop: 50 }}
        onPress={() => openMenu()}
      >
        <Text>Open menu from outside</Text>
      </TouchableOpacity>

      <ContextOpenner />
    </MenuProvider>
  );
};

export default ControlledExample;
