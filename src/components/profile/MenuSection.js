import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, CARD_STYLES, ICON_SIZE } from '../../constants';
import MenuItem from './MenuItem';

export default function MenuSection({
  title,
  icon,
  items = [],
  toggleStates = {},
  onToggle = null,
  onItemPress = null,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {/* Section Header */}
      <View style={styles.header}>
        <Ionicons name={icon} size={ICON_SIZE.sm} color={COLORS.textSecondary} />
        <Text style={[TYPOGRAPHY.caption, styles.title]}>{title}</Text>
      </View>

      {/* Section Items */}
      <View style={[CARD_STYLES.minimal, styles.itemsContainer]}>
        {items.map((item, index) => (
          <MenuItem
            key={item.id}
            label={item.label}
            value={item.value}
            subtitle={item.subtitle}
            badge={item.badge}
            danger={item.danger}
            action={item.action}
            toggleValue={toggleStates[item.id]}
            onToggle={() => onToggle && onToggle(item.id)}
            onPress={() => onItemPress && onItemPress(item)}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  title: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemsContainer: {
    marginHorizontal: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
});
