import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  CARD_STYLES,
  ICON_SIZE,
  LAYOUT,
} from '../constants';
import { Header } from '../components/ui';
import { ProjectInfoCard, CollaboratorItem } from '../components/projects';
import { MenuItem } from '../components/profile';

// Datos de ejemplo - En producción vendrían de un store o API
const PROJECT_DATA = {
  id: 2,
  name: 'Renta Depa',
  description: 'Gastos compartidos del departamento',
  icon: 'home',
  color: COLORS.primary,
  isShared: true,
  role: 'admin', // owner, admin, editor, viewer
  collaborators: [
    { id: 1, name: 'Leon Fernandez', email: 'leon@example.com', role: 'owner', avatar: null },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'admin', avatar: null },
    { id: 3, name: 'Juan Pérez', email: 'juan@example.com', role: 'editor', avatar: null },
    { id: 4, name: 'Ana López', email: 'ana@example.com', role: 'viewer', avatar: null },
  ],
  settings: {
    notifications: true,
    requireApproval: true,
    allowExpenseEdit: true,
  },
};

export default function ProjectSettingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [project, setProject] = useState(PROJECT_DATA);

  const canEditProject = project.role === 'owner' || project.role === 'admin';
  const canManageCollaborators = project.role === 'owner' || project.role === 'admin';
  const isOwner = project.role === 'owner';

  const handleBack = () => {
    router.back();
  };

  const handleEditProject = () => {
    router.push(`/edit-project/${project.id}`);
  };

  const handleAddCollaborator = () => {
    router.push(`/add-collaborator/${project.id}`);
  };

  const handleCollaboratorPress = (collaborator) => {
    if (!canManageCollaborators) return;

    // Solo el owner puede cambiar roles o remover colaboradores
    if (isOwner || (collaborator.role !== 'owner' && collaborator.role !== 'admin')) {
      router.push(`/edit-collaborator/${project.id}/${collaborator.id}`);
    }
  };

  const handleRemoveCollaborator = (collaborator) => {
    Alert.alert(
      'Remover Colaborador',
      `¿Estás seguro de que deseas remover a ${collaborator.name} del proyecto?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            console.log('Remove collaborator:', collaborator.id);
            setProject(prev => ({
              ...prev,
              collaborators: prev.collaborators.filter(c => c.id !== collaborator.id),
            }));
          },
        },
      ]
    );
  };

  const handleToggleNotifications = () => {
    setProject(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        notifications: !prev.settings.notifications,
      },
    }));
  };

  const handleToggleRequireApproval = () => {
    if (!isOwner) {
      Alert.alert('Sin Permisos', 'Solo el propietario puede cambiar esta configuración');
      return;
    }

    setProject(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        requireApproval: !prev.settings.requireApproval,
      },
    }));
  };

  const handleLeaveProject = () => {
    if (isOwner) {
      Alert.alert(
        'No Permitido',
        'No puedes salir del proyecto siendo propietario. Transfiere la propiedad a otro colaborador primero.'
      );
      return;
    }

    Alert.alert(
      'Salir del Proyecto',
      '¿Estás seguro de que deseas salir de este proyecto? Perderás acceso a todos los gastos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            console.log('Leave project:', project.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleDeleteProject = () => {
    if (!isOwner) {
      Alert.alert('Sin Permisos', 'Solo el propietario puede eliminar el proyecto');
      return;
    }

    Alert.alert(
      'Eliminar Proyecto',
      '¿Estás seguro de que deseas eliminar este proyecto? Se eliminarán todos los gastos y colaboradores. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            console.log('Delete project:', project.id);
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Configuración"
        onBack={handleBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Project Info */}
        <View style={LAYOUT.section}>
          <ProjectInfoCard
            icon={project.icon}
            color={project.color}
            name={project.name}
            description={project.description}
            onEdit={canEditProject ? handleEditProject : null}
          />
        </View>

        {/* Collaborators Section */}
        {project.isShared && (
          <View style={LAYOUT.section}>
            <View style={styles.sectionHeader}>
              <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>
                Colaboradores ({project.collaborators.length})
              </Text>
              {canManageCollaborators && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddCollaborator}
                  activeOpacity={0.7}
                >
                  <Ionicons name="person-add" size={ICON_SIZE.sm} color={COLORS.primary} />
                  <Text style={[TYPOGRAPHY.body, styles.addButtonText]}>
                    Agregar
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={[CARD_STYLES.minimal, styles.collaboratorsCard]}>
              {project.collaborators.map((collaborator, index) => (
                <View key={collaborator.id}>
                  <CollaboratorItem
                    collaborator={collaborator}
                    showRole={true}
                    showRemove={canManageCollaborators}
                    onRemove={() => handleRemoveCollaborator(collaborator)}
                    onPress={() => handleCollaboratorPress(collaborator)}
                  />
                  {index < project.collaborators.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Settings Section */}
        <View style={LAYOUT.section}>
          <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>
            Configuración
          </Text>

          <View style={[CARD_STYLES.minimal, styles.settingsCard]}>
            <MenuItem
              icon="notifications-outline"
              title="Notificaciones"
              subtitle="Recibir alertas de nuevos gastos"
              actionType="toggle"
              toggleValue={project.settings.notifications}
              onToggle={handleToggleNotifications}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="checkmark-circle-outline"
              title="Requerir Aprobación"
              subtitle="Los gastos necesitan aprobación"
              actionType="toggle"
              toggleValue={project.settings.requireApproval}
              onToggle={handleToggleRequireApproval}
              disabled={!isOwner}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={LAYOUT.section}>
          <Text style={[TYPOGRAPHY.h3, styles.sectionTitle, styles.dangerTitle]}>
            Zona de Peligro
          </Text>

          <View style={[CARD_STYLES.minimal, styles.dangerCard]}>
            {!isOwner && (
              <>
                <MenuItem
                  icon="exit-outline"
                  title="Salir del Proyecto"
                  subtitle="Perderás acceso a los gastos"
                  actionType="navigate"
                  variant="warning"
                  onPress={handleLeaveProject}
                />
                <View style={styles.divider} />
              </>
            )}
            <MenuItem
              icon="trash-outline"
              title="Eliminar Proyecto"
              subtitle={isOwner ? "Se eliminarán todos los datos" : "Solo el propietario puede eliminar"}
              actionType="navigate"
              variant="danger"
              onPress={handleDeleteProject}
              disabled={!isOwner}
            />
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  dangerTitle: {
    color: COLORS.error,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderRadius: RADIUS.md,
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  collaboratorsCard: {
    paddingHorizontal: SPACING.lg,
  },
  settingsCard: {
    paddingHorizontal: SPACING.lg,
  },
  dangerCard: {
    paddingHorizontal: SPACING.lg,
    borderColor: COLORS.error + '30',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  bottomPadding: {
    height: 40,
  },
});
