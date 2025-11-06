import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants';
import Avatar from './Avatar';

export default function Chip({
  label,
  avatar = null,
  avatarName = '',
  subtitle = null,
  onRemove = null,
  backgroundColor = COLORS.backgroundSecondary,
  textColor = COLORS.text,
  style,
}) {
  return (
    <View style={[styles.chip, { backgroundColor }, style]}>
      {(avatar || avatarName) && (
        <Avatar
          size={28}
          name={avatarName}
          image={avatar}
          backgroundColor={COLORS.text}
          style={styles.avatar}
        />
      )}

      <View style={styles.content}>
        <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
          {label}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.round,
    paddingVertical: SPACING.xs,
    paddingLeft: SPACING.xs,
    paddingRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    marginRight: SPACING.sm,
  },
  content: {
    flex: 1,
    maxWidth: 160,
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
  subtitle: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  removeButton: {
    marginLeft: SPACING.xs,
  },
});
