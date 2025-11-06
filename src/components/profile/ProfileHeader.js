import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants';
import Avatar from '../ui/Avatar';

export default function ProfileHeader({
  name,
  email,
  avatar = null,
  onEditPress = null,
}) {
  return (
    <View style={styles.container}>
      <Avatar
        size={80}
        name={name}
        image={avatar}
        backgroundColor={COLORS.primary}
      />
      <View style={styles.info}>
        <Text style={[TYPOGRAPHY.h3, styles.name]}>{name}</Text>
        <Text style={[TYPOGRAPHY.body, styles.email]}>{email}</Text>
      </View>
      {onEditPress && (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress} activeOpacity={0.7}>
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  info: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  name: {
    marginBottom: SPACING.xs,
  },
  email: {
    color: COLORS.textSecondary,
  },
  editButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.round,
  },
  editText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
