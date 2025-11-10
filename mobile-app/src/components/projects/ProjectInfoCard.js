import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, CARD_STYLES, ICON_SIZE } from '../../constants';

export default function ProjectInfoCard({
  icon = 'briefcase',
  color = COLORS.primary,
  name,
  description = null,
  onEdit = null,
}) {
  return (
    <View style={[CARD_STYLES.minimal, styles.container]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={ICON_SIZE.xl} color={color} />
        </View>
        {onEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={ICON_SIZE.sm} color={COLORS.primary} />
            <Text style={[TYPOGRAPHY.body, styles.editText]}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={[TYPOGRAPHY.h3, styles.name]}>
        {name}
      </Text>
      {description && (
        <Text style={[TYPOGRAPHY.body, styles.description]}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderRadius: RADIUS.md,
  },
  editText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  name: {
    marginBottom: SPACING.sm,
  },
  description: {
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
