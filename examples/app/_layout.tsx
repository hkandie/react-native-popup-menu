import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/useColorScheme';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)'
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen
          name='index'
          options={{ headerShown: true, title: 'Home', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='basic-example'
          options={{ title: 'Basic Example', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='advanced-example'
          options={{ title: 'Advanced Example', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='controlled-example'
          options={{ title: 'Controlled Example', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='controlling-menu-using-menu-methods'
          options={{ title: 'Controlling Menu Methods', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='extensions-example'
          options={{ title: 'Extensions Example', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='modal-example'
          options={{
            title: 'Modal Example',
            headerTitleAlign: 'center',
            presentation: 'modal', // This makes it a modal
            headerShown: true,
          }}
        />
        <Stack.Screen
          name='styling-example'
          options={{ title: 'Styling Example', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='touchable-example'
          options={{ title: 'Touchable Config Example', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='non-root-example'
          options={{ title: 'Non Root Example', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='close-on-back-example'
          options={{ title: 'Close on Back Button Press Example', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='flatlist-example'
          options={{ title: 'Using FlatList', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='menu-in-flatlist-example'
          options={{ title: 'Menu in FlatList Example', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name='popover-renderer-example'
          options={{ title: 'Popover Renderer Example', headerTitleAlign: 'center' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
