import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../../constants';

const TABS = [
  {
    name: 'home',
    label: 'Home',
    icon: 'home-outline',
    iconFilled: 'home',
    route: '/',
  },
  {
    name: 'expenses',
    label: 'Gastos',
    icon: 'receipt-outline',
    iconFilled: 'receipt',
    route: '/expenses',
  },
  {
    name: 'add-expense',
    label: '',
    icon: 'add',
    route: '/add-expense',
    isSpecial: true,
  },
  {
    name: 'insights',
    label: 'Análisis',
    icon: 'stats-chart-outline',
    iconFilled: 'stats-chart',
    route: '/insights',
  },
  {
    name: 'profile',
    label: 'Perfil',
    icon: 'person-outline',
    iconFilled: 'person',
    route: '/profile',
  },
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (route) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname === route || pathname.startsWith(route + '/');
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, SPACING.sm) }]}>
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const active = isActive(tab.route);

          // Special FAB Button (Add Expense)
          if (tab.isSpecial) {
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.fabContainer}
                onPress={() => router.push(tab.route)}
                activeOpacity={0.8}
              >
                <View style={styles.fabButton}>
                  <Ionicons name={tab.icon} size={28} color={COLORS.white} />
                </View>
              </TouchableOpacity>
            );
          }

          // Regular Tabs - Clean and Elegant
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => router.push(tab.route)}
              activeOpacity={0.6}
            >
              <Ionicons
                name={active ? tab.iconFilled : tab.icon}
                size={24}
                color={active ? COLORS.black : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: active ? COLORS.black : COLORS.textSecondary },
                  active && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    fontWeight: '600',
  },
  fabContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: -32,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
});
