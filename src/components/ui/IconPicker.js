import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE } from '../../constants';

export default function IconPicker({
  label = null,
  icons = [],
  selectedIcon = null,
  onSelect,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.iconsGrid}>
        {icons.map((iconItem) => (
          <TouchableOpacity
            key={iconItem.id}
            style={[
              styles.iconItem,
              selectedIcon?.id === iconItem.id && [
                styles.iconItemSelected,
                { borderColor: iconItem.color },
              ],
            ]}
            onPress={() => onSelect(iconItem)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: iconItem.color + '20' },
                selectedIcon?.id === iconItem.id && { backgroundColor: iconItem.color },
              ]}
            >
              <Ionicons
                name={iconItem.icon}
                size={ICON_SIZE.md}
                color={selectedIcon?.id === iconItem.id ? COLORS.white : iconItem.color}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.md,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  iconItem: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconItemSelected: {
    borderWidth: 3,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
