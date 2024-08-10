import MenuProvider from '@/components/MenuProvider';
import { Text } from 'react-native';

export default function BasicExample() {
    return (
        <MenuProvider style={{ flexDirection: 'column', padding: 30 }}>
            <Text>Hello world!</Text>
            {/* <Menu onSelect={(value) => alert(`Selected number: ${value}`)}>
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
            </Menu> */}
        </MenuProvider>
    );
}
