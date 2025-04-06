import React from 'react';
import { Text } from 'react-native';
import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const ControlledExample = () => {
  const [opened, setOpened] = React.useState(true);

  const onOptionSelect = (value: any) => {
    alert(`Selected number: ${value}`);
    setOpened(false);
  };

  const onTriggerPress = () => {
    setOpened(true);
  };

  const onBackdropPress = () => {
    setOpened(false);
  };
  console.log('ControlledExample - opened', opened);
  return (
        <MenuProvider style={{ flexDirection: 'column', padding: 30 }}>
            <Text>Controlled Example</Text>

            <Menu
        opened={opened}
        onBackdropPress={onBackdropPress}
        onSelect={onOptionSelect}
      >
                <MenuTrigger
          onPress={onTriggerPress}
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
