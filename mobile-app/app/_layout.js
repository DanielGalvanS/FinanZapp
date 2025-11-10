import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomTabBar from '../src/components/navigation/CustomTabBar';

// Cargar dev tools en modo desarrollo
if (__DEV__) {
  require('../src/utils/devHelpers');
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Slot />
      <CustomTabBar />
    </SafeAreaProvider>
  );
}
