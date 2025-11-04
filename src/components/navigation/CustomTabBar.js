import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const TABS = [
  {
    name: 'home',
    label: 'Home',
    icon: 'home-outline',
    iconActive: 'home',
    route: '/',
  },
  {
    name: 'expenses',
    label: 'Gastos',
    icon: 'list-outline',
    iconActive: 'list',
    route: '/expenses',
  },
  {
    name: 'add-expense',
    label: 'Agregar',
    icon: 'add',
    route: '/add-expense',
    isSpecial: true,
  },
  {
    name: 'insights',
    label: 'Insights',
    icon: 'stats-chart-outline',
    iconActive: 'stats-chart',
    route: '/insights',
  },
  {
    name: 'profile',
    label: 'Perfil',
    icon: 'person-outline',
    iconActive: 'person',
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
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {TABS.map((tab) => {
        const active = isActive(tab.route);

        if (tab.isSpecial) {
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.specialTab}
              onPress={() => router.push(tab.route)}
              activeOpacity={0.7}
            >
              <View style={styles.specialButton}>
                <Ionicons name={tab.icon} size={28} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
              <Ionicons
                name={active ? tab.iconActive : tab.icon}
                size={24}
                color={active ? COLORS.text : COLORS.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.label,
                active && styles.labelActive,
              ]}
            >
              {tab.label}
            </Text>
            {active && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  specialTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  iconContainerActive: {
    backgroundColor: COLORS.gray100,
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  specialButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
