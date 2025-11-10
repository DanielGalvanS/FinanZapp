import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE } from '../../constants';

export default function QuickActions({ actions, onActionPress }) {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionButton}
          onPress={() => onActionPress(action)}
          activeOpacity={0.7}
        >
          <View style={styles.actionIcon}>
            <Ionicons name={action.icon} size={ICON_SIZE.lg} color={COLORS.text} />
          </View>
          <Text style={[TYPOGRAPHY.caption, styles.actionLabel]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxxl,
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: COLORS.text,
    fontWeight: '600',
  },
});
