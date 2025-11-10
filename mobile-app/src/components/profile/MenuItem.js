import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, ICON_SIZE } from '../../constants';

export default function MenuItem({
  label,
  value = null,
  subtitle = null,
  badge = null,
  danger = false,
  action = 'navigate',
  toggleValue = false,
  onToggle = null,
  onPress = null,
  isLast = false,
}) {
  const handlePress = () => {
    if (action === 'toggle' && onToggle) {
      onToggle();
    } else if (onPress) {
      onPress();
    }
  };

  const textColor = danger ? COLORS.error : COLORS.text;

  return (
    <TouchableOpacity
      style={[styles.container, !isLast && styles.borderBottom]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={action === 'view'}
    >
      <View style={styles.left}>
        <Text style={[TYPOGRAPHY.body, { color: textColor }]}>{label}</Text>
        {subtitle && (
          <Text style={[TYPOGRAPHY.caption, styles.subtitle]}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.right}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}

        {value && action !== 'toggle' && (
          <Text style={[TYPOGRAPHY.body, styles.value]}>{value}</Text>
        )}

        {action === 'toggle' ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        ) : action !== 'view' ? (
          <Ionicons
            name="chevron-forward"
            size={ICON_SIZE.sm}
            color={COLORS.textSecondary}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  left: {
    flex: 1,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  value: {
    color: COLORS.textSecondary,
  },
  badge: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.white,
    fontWeight: '700',
  },
});
