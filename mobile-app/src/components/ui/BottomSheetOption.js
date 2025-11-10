import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE } from '../../constants';

export default function BottomSheetOption({
  icon,
  iconColor = COLORS.text,
  label,
  onPress,
  variant = 'default', // 'default' | 'danger' | 'warning'
  showDivider = false,
  style,
}) {
  const getIconColor = () => {
    if (iconColor !== COLORS.text) return iconColor;
    if (variant === 'danger') return COLORS.error;
    if (variant === 'warning') return COLORS.warning;
    return iconColor;
  };

  const getLabelColor = () => {
    if (variant === 'danger') return COLORS.error;
    if (variant === 'warning') return COLORS.warning;
    return COLORS.text;
  };

  return (
    <TouchableOpacity
      style={[
        styles.option,
        showDivider && styles.optionWithDivider,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        { backgroundColor: getIconColor() + '15' },
      ]}>
        <Ionicons
          name={icon}
          size={ICON_SIZE.md}
          color={getIconColor()}
        />
      </View>

      <Text style={[styles.label, { color: getLabelColor() }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.lg,
  },
  optionWithDivider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
});
