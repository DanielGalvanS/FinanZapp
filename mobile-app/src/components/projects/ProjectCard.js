import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE } from '../../constants';
import Avatar from '../ui/Avatar';

export default function ProjectCard({
  project,
  onPress,
  onOptionsPress = null,
  showOptions = true,
  style,
}) {
  const { name, isShared, collaborators = [], icon = 'folder-outline' } = project;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons
          name={isShared ? 'people' : icon}
          size={ICON_SIZE.md}
          color={COLORS.text}
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[TYPOGRAPHY.bodyBold, styles.name]}>{name}</Text>
        <Text style={[TYPOGRAPHY.caption, styles.meta]}>
          {isShared && collaborators.length > 0
            ? `${collaborators.length} colaborador${collaborators.length > 1 ? 'es' : ''}`
            : 'Personal'
          }
        </Text>
      </View>

      {/* Options Button */}
      {showOptions && onOptionsPress && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onOptionsPress(project, e);
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={ICON_SIZE.sm}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  name: {
    marginBottom: 2,
  },
  meta: {
    color: COLORS.textSecondary,
  },
});
