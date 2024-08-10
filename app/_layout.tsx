import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import BasicExample from './BasicExample';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const demos = [{ Component: BasicExample, name: 'Basic example' }];

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={DefaultTheme}>
            <Stack>
                <Stack.Screen
                    name='demo'
                    options={{ headerShown: false }}
                />
                {demos.map((demo) => (
                    <Stack.Screen
                        key={demo.name}
                        name={demo.name.toLowerCase().replace(' ', '-')}
                    />
                ))}
                <Stack.Screen name='+not-found' />
            </Stack>
        </ThemeProvider>
    );
}
