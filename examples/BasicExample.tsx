import React from 'react';
import { Text } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from '@shared/index';

const BasicExample = (): React.ReactNode => (
    <MenuProvider style={{ flexDirection: 'column', padding: 30 }}>
        <Text>Hello world!</Text>
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
