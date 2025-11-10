import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getInitials } from '../../utils/formatters';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants';

export default function CollaboratorAvatarGroup({
  collaborators = [],
  maxVisible = 3,
  size = 24,
  showCount = true,
}) {
  const visibleCollaborators = collaborators.slice(0, maxVisible);
  const remainingCount = Math.max(0, collaborators.length - maxVisible);

  if (collaborators.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarGroup}>
        {visibleCollaborators.map((collab, index) => (
          <View
            key={collab.id}
            style={[
              styles.avatarCircle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: index > 0 ? -(size / 3) : 0,
                zIndex: maxVisible - index,
              }
            ]}
          >
            <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
              {getInitials(collab.name)}
            </Text>
          </View>
        ))}
        {remainingCount > 0 && (
          <View
            style={[
              styles.avatarCircle,
              styles.avatarMore,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: -(size / 3),
              }
            ]}
          >
            <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
              +{remainingCount}
            </Text>
          </View>
        )}
      </View>
      {showCount && (
        <Text style={[TYPOGRAPHY.caption, styles.collaboratorCount]}>
          {collaborators.length} colaborador{collaborators.length > 1 ? 'es' : ''}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.backgroundSecondary,
  },
  avatarMore: {
    backgroundColor: COLORS.textSecondary,
  },
  avatarText: {
    fontWeight: '700',
    color: COLORS.white,
  },
  collaboratorCount: {
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
