import { Stack } from 'expo-router';

function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='login'
        options={{ title: 'Login', headerTitleAlign: 'center' }}
      />

      <Stack.Screen
        name='register'
        options={{ title: 'Register', headerTitleAlign: 'center' }}
      />

      <Stack.Screen
        name='home'
        options={{ title: 'Home', headerTitleAlign: 'center' }}
      />
    </Stack>
  );
}
