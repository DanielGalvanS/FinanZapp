import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE } from '../../constants';
import CollaboratorAvatarGroup from './CollaboratorAvatarGroup';

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
      {/* Current Project Selector */}
      <TouchableOpacity
        style={styles.selector}
        onPress={onToggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.projectInfo}>
          <View style={styles.projectHeader}>
            <Ionicons
              name={currentProject.isShared ? "people" : "folder-outline"}
              size={ICON_SIZE.sm}
              color={COLORS.textSecondary}
            />
            <Text style={[TYPOGRAPHY.caption, styles.projectLabel]}>
              {currentProject.isShared ? 'Proyecto Compartido' : 'Proyecto Personal'}
            </Text>
          </View>
          <Text style={[TYPOGRAPHY.bodyBold, styles.projectName]}>
            {currentProject.name}
          </Text>
          {currentProject.isShared && currentProject.collaborators.length > 0 && (
            <CollaboratorAvatarGroup
              collaborators={currentProject.collaborators}
              size={24}
              showCount={true}
            />
          )}
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={ICON_SIZE.sm}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      {/* Expanded Projects List */}
      {isExpanded && (
        <View style={styles.projectsList}>
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
                    color={COLORS.text}
                  />
                </View>
                <View style={styles.projectItemInfo}>
                  <Text style={[TYPOGRAPHY.bodyBold, styles.projectItemName]}>
                    {project.name}
                  </Text>
                  <Text style={[TYPOGRAPHY.caption, styles.projectItemMeta]}>
                    {project.isShared && project.collaborators.length > 0
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  projectInfo: {
    flex: 1,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  projectLabel: {
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  projectName: {
    fontSize: 18,
    marginBottom: SPACING.sm,
    alignSelf: 'stretch',
  },
  projectsList: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  projectItemIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
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
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  createProjectText: {
    color: COLORS.primary,
  },
});
