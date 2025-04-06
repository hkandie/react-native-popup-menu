import React from 'react';
import { Text } from 'react-native';
import { Menu, MenuProvider, MenuTrigger, MenuOptions, MenuOption } from '../packages';

const BasicExample = () => (
  <MenuProvider>
    <Text>Basic Example</Text>

    <Menu onSelect={(value: any) => alert(`Selected number: ${value}`)}>
      <MenuTrigger text='Select option' />

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

export default BasicExample;
