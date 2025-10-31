import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import { AddExpenseScreen } from '../screens';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
        />
        <Stack.Screen
          name="AddExpenseModal"
          component={AddExpenseScreen}
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Agregar Gasto',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
