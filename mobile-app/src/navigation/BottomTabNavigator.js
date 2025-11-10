import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, ExpensesScreen, ProfileScreen, AddExpenseScreen } from '../screens';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

// Simple icon component (can be replaced with vector icons later)
const TabIcon = ({ focused, icon }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <View style={styles.icon}>
        {icon}
      </View>
    </View>
  );
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.neutral.black,
        tabBarInactiveTintColor: theme.colors.neutral.gray[400],
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<View style={styles.homeIcon} />}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<View style={styles.expensesIcon} />}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.addButton}>
              <View style={styles.addButtonInner}>
                <View style={styles.plusIcon} />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Cards"
        component={ExpensesScreen} // Placeholder, will be replaced
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<View style={styles.cardsIcon} />}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<View style={styles.profileIcon} />}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: theme.layout.tabBarHeight,
    backgroundColor: theme.colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  iconContainerFocused: {
    backgroundColor: theme.colors.neutral.gray[100],
  },
  icon: {
    width: 24,
    height: 24,
  },
  // Placeholder icon styles (will be replaced with actual icons)
  homeIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'currentColor',
    borderBottomLeftRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
  },
  expensesIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'currentColor',
    borderRadius: theme.borderRadius.sm,
  },
  cardsIcon: {
    width: 24,
    height: 20,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'currentColor',
    borderRadius: theme.borderRadius.sm,
  },
  profileIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'currentColor',
    borderRadius: theme.borderRadius.full,
  },
  // Central add button
  addButton: {
    position: 'absolute',
    top: -20,
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral.black,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  addButtonInner: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
});
