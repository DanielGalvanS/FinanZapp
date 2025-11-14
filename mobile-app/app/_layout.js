import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomTabBar from '../src/components/navigation/CustomTabBar';
import useDataStore from '../src/store/dataStore';

// Cargar dev tools en modo desarrollo
if (__DEV__) {
  require('../src/utils/devHelpers');
}

export default function RootLayout() {
  const initialize = useDataStore((state) => state.initialize);

  // Inicializar store al arrancar la app
  useEffect(() => {
    initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Slot />
        <CustomTabBar />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
