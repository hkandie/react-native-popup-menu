import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import BasicExample from './BasicExample';
import { Button } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const demos = [{ Component: BasicExample, name: 'Basic example' }];

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
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
                    name='index'
                    options={{ headerShown: true, title: 'Examples' }}
                />
                {demos.map((demo) => (
                    <Stack.Screen
                        key={demo.name}
                        name={demo.Component.name.replace(' ', '')}
                        options={{
                            headerTitle: demo.name,
                            headerRight: () => (
                                <Button
                                    onPress={() => console.log('Update count')}
                                    title='Update count'
                                />
                            ),
                        }}
                    />
                ))}
                <Stack.Screen name='+not-found' />
            </Stack>
        </ThemeProvider>
    );
}
