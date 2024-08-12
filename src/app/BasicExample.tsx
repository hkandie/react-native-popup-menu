import { Text } from 'react-native';
import MenuProvider from '../components/MenuProvider';
import Menu from '../components/Menu';
import { useState } from 'react';
import MenuTrigger from '../components/MenuTrigger';
import MenuOptions from '../components/MenuOptions';
import MenuOption from '../components/MenuOption';

export default function BasicExample() {
    const [selectedOption, setSelectedOption] = useState<string | undefined>();
    return (
        <MenuProvider style={{ flexDirection: 'column', padding: 30 }}>
            <Text>Hello world! </Text>
            <Text>Selected number: {selectedOption}</Text>
            <Menu onSelect={(selectedOption: string) => setSelectedOption(selectedOption)}>
                <MenuTrigger text='Select option' />

                <MenuOptions>
                    <Text>Hello world! </Text>
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
            <Menu onSelect={(selectedOption: string) => setSelectedOption(selectedOption)}>
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
}
