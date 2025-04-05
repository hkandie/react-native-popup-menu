import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import { Menu, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const Page = () => {
  const router = useRouter();

  return (
    <View style={{ flexDirection: 'column', padding: 70 }}>
      <Text>Hello world with react-native-router-flux!</Text>

      <Menu>
        <MenuTrigger text='Select option' />

        <MenuOptions>
          <MenuOption
            onSelect={() => {
              router.push('/login');
            }}
            text='Login'
          />

          <MenuOption
            onSelect={() => {
              router.push('/register');
            }}
            text='Register'
          />

          <MenuOption
            onSelect={() => {
              router.push('/home');
            }}
            text='Home'
          />
        </MenuOptions>
      </Menu>
    </View>
  );
};
export default Page;
