import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE } from '../../constants';
import { Avatar } from '../ui';

export default function CollaboratorItem({
  collaborator,
  showRole = true,
  showRemove = false,
  onRemove = null,
  onPress = null,
}) {
  const getRoleLabel = (role) => {
    const roles = {
      owner: 'Propietario',
      admin: 'Administrador',
      editor: 'Editor',
      viewer: 'Visualizador',
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      owner: COLORS.primary,
      admin: COLORS.warning,
      editor: COLORS.success,
      viewer: COLORS.textSecondary,
    };
    return colors[role] || COLORS.textSecondary;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Avatar
        name={collaborator.name}
        image={collaborator.avatar}
        size={48}
      />
      <View style={styles.info}>
        <Text style={[TYPOGRAPHY.bodyBold, styles.name]}>
          {collaborator.name}
        </Text>
        {collaborator.email && (
          <Text style={[TYPOGRAPHY.caption, styles.email]}>
            {collaborator.email}
          </Text>
        )}
        {showRole && collaborator.role && (
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(collaborator.role) + '20' }]}>
            <Text style={[TYPOGRAPHY.tiny, { color: getRoleColor(collaborator.role), fontWeight: '700' }]}>
              {getRoleLabel(collaborator.role)}
            </Text>
          </View>
        )}
      </View>
      {showRemove && onRemove && collaborator.role !== 'owner' && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={ICON_SIZE.md} color={COLORS.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  name: {
    marginBottom: SPACING.xs,
  },
  email: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xs,
  },
  removeButton: {
    padding: SPACING.xs,
  },
});
