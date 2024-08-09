import Menu, { MenuOption, MenuOptions, MenuProvider, MenuTrigger } from '@/src/molecules';
import { Link, Stack } from 'expo-router';
import { Image, Text, View, StyleSheet } from 'react-native';

const Page = () => (
  <View style={{ flexDirection: 'column', padding: 70 }}>
    <Text>Hello world with react-native-router-flux!</Text>

    <Menu>
      <MenuTrigger text='Select option' />

      <MenuOptions>
        <MenuOption
          onSelect={() => Actions.login()}
          text='Login'
        />

        <MenuOption
          onSelect={() => Actions.register()}
          text='Register'
        />

        <MenuOption
          onSelect={() => Actions.home()}
          text='Home'
        />
      </MenuOptions>
    </Menu>
  </View>
);
const NavigatorMenu = () => (
  <Menu>
    <MenuTrigger text='Options' />

    <MenuOptions>
      <MenuOption
        onSelect={() => Actions.login()}
        text='Navigation Login'
      />

      <MenuOption
        onSelect={() => Actions.register()}
        text='Navigation Register'
      />

      <MenuOption
        onSelect={() => Actions.home()}
        text='Navigation Home'
      />
    </MenuOptions>
  </Menu>
);

export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My home',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          },

          headerLeft: () => (
            <MenuProvider>
              <NavigatorMenu />
            </MenuProvider>
          ),

          headerRight: () => (
            <MenuProvider>
              <Page />
            </MenuProvider>
          )
        }}
      />
      <Text>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 50,
    height: 50
  }
});
