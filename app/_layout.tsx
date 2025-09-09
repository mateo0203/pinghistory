import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8f9fa',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Send Ping',
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="history" 
          options={{ 
            title: 'Ping History',
            headerShown: true 
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}

