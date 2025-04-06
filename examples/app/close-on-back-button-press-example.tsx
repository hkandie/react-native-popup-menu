import React, { Component } from 'react';
import { Text, Button } from 'react-native';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const CloseOnBackExample: React.FC = () => {
  const [customBack, setCustomBack] = React.useState(false);
  const [additionalMenu, setAdditionalMenu] = React.useState(false);

  const customBackHandler = (instance: any) => {
    alert(`Back button was pressed. Current menu state: ${instance.isMenuOpen() ? 'opened' : 'closed'}`);
    return true;
  };

  return (
        <MenuProvider
      style={{ flexDirection: 'column', padding: 50 }}
      backHandler={customBack ? customBackHandler : true}
    >
            <Button
        title={customBack ? 'Change to default' : 'Change to custom'}
        onPress={() => setCustomBack(!customBack)}
      />

            <Menu>
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

            <Button
        title={additionalMenu ? 'Remove 2nd menu' : 'Add 2nd menu'}
        onPress={() => setAdditionalMenu(!additionalMenu)}
      />
      {additionalMenu && (
                <Menu>
                    <MenuTrigger text='Select option 2' />

                    <MenuOptions>
                        <MenuOption
              value={1}
              text='One'
            />

                        <MenuOption
              value={2}
              text='Two'
            />
          </MenuOptions>
        </Menu>
      )}
    </MenuProvider>
  );
};

export default CloseOnBackExample;
