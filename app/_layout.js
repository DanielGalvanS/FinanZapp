import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomTabBar from '../src/components/navigation/CustomTabBar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Slot />
      <CustomTabBar />
    </SafeAreaProvider>
  );
}
