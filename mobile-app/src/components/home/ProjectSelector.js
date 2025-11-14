import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE, SHADOWS } from '../../constants';

export default function ProjectSelector({
  currentProject,
  projects = [],
  isExpanded = false,
  onToggleExpanded,
  onSelectProject,
  onCreateProject,
  onProjectOptions,
}) {
  return (
    <View style={styles.wrapper}>
      {/* Dropdown List */}
      <View style={styles.projectsList}>
        {/* Current Project (no clickable) */}
        <View style={styles.currentProjectItem}>
          <View style={styles.projectItemIcon}>
            <Ionicons
              name={currentProject.isShared ? "people" : "folder-outline"}
              size={ICON_SIZE.md}
              color={COLORS.text}
            />
          </View>
          <View style={styles.projectItemInfo}>
            <Text style={[TYPOGRAPHY.bodyBold, styles.projectItemName]}>
              {currentProject.name}
            </Text>
            <Text style={[TYPOGRAPHY.caption, styles.currentProjectLabel]}>
              Proyecto actual
            </Text>
          </View>
        </View>

        {/* Other Projects (indented) */}
        {projects
          .filter(p => p.id !== currentProject.id)
          .map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectItem}
              onPress={() => onSelectProject(project)}
              activeOpacity={0.7}
            >
              <View style={styles.projectItemIcon}>
                <Ionicons
                  name={project.isShared ? "people" : "folder-outline"}
                  size={ICON_SIZE.md}
                  color={COLORS.textSecondary}
                />
              </View>
              <View style={styles.projectItemInfo}>
                <Text style={[TYPOGRAPHY.body, styles.projectItemName]}>
                  {project.name}
                </Text>
                <Text style={[TYPOGRAPHY.caption, styles.projectItemMeta]}>
                  {project.isShared && project.collaborators?.length > 0
                    ? `${project.collaborators.length} colaborador${project.collaborators.length > 1 ? 'es' : ''}`
                    : 'Personal'
                  }
                </Text>
              </View>
              <TouchableOpacity
                onPress={(event) => onProjectOptions(project, event)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="ellipsis-horizontal" size={ICON_SIZE.sm} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

        {/* Create Project Button */}
        <TouchableOpacity
          style={styles.createProjectButton}
          onPress={onCreateProject}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={ICON_SIZE.md} color={COLORS.primary} />
          <Text style={[TYPOGRAPHY.bodyBold, styles.createProjectText]}>
            Crear Proyecto
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // Sin márgenes porque está en overlay
  },
  projectsList: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  currentProjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingLeft: SPACING.xxl, // Indentación para mostrar jerarquía
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  projectItemIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  projectItemInfo: {
    flex: 1,
  },
  projectItemName: {
    marginBottom: 2,
  },
  currentProjectLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  projectItemMeta: {
    color: COLORS.textSecondary,
  },
  createProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  createProjectText: {
    color: COLORS.primary,
  },
});
