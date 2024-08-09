import React, { Component, useState } from 'react';

import { Text } from 'react-native';
import Menu, { MenuOption, MenuOptions, MenuProvider, MenuTrigger } from '../../molecules';

const ControlledExample = () => {
  const [opened, setOpened] = useState<boolean>(true);

  function onOptionSelect(value: string) {
    alert(`Selected number: ${value}`);
    setOpened(false);
  }

  function onTriggerPress() {
    setOpened(true)
  }

  function onBackdropPress() {
    setOpened(false);
  }

  console.log('ControlledExample - opened', opened);
  return (
    <MenuProvider style={{ flexDirection: 'column', padding: 30 }}>
      <Text>Hello world!</Text>

      <Menu
        opened={opened}
        onBackdropPress={() => onBackdropPress()}
        onSelect={(value: any) => onOptionSelect(value)}
      >
        <MenuTrigger
          onPress={() => onTriggerPress()}
          text='Select option'
        />

        <MenuOptions>
          <MenuOption
            value={1}
            text='One'
          />

          <MenuOption value={2}>
            <Text style={{ color: 'red' }}>Two</Text>
          </MenuOption>

          <MenuOption
            value={3}
            disabled={true}
            text='Three'
          />
        </MenuOptions>
      </Menu>
    </MenuProvider>
  );
};

export default ControlledExample;
