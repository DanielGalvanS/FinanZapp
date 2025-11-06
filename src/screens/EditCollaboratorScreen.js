import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, CARD_STYLES, ICON_SIZE, LAYOUT } from '../constants';
import { Header } from '../components/ui';
import { CollaboratorItem } from '../components/projects';

const ROLES = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Puede gestionar colaboradores y configuración',
    icon: 'shield-checkmark',
    color: COLORS.warning,
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Puede agregar y editar gastos',
    icon: 'create',
    color: COLORS.success,
  },
  {
    id: 'viewer',
    name: 'Visualizador',
    description: 'Solo puede ver gastos',
    icon: 'eye',
    color: COLORS.textSecondary,
  },
];

// Datos de ejemplo - En producción vendrían de un store o API
const COLLABORATOR_DATA = {
  id: 3,
  name: 'Juan Pérez',
  email: 'juan@example.com',
  role: 'editor',
  avatar: null,
  joinedAt: '15/09/2025',
};

export default function EditCollaboratorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedRole, setSelectedRole] = useState(
    ROLES.find(r => r.id === COLLABORATOR_DATA.role) || ROLES[1]
  );

  const handleBack = () => {
    router.back();
  };

  const handleSaveRole = () => {
    if (selectedRole.id === COLLABORATOR_DATA.role) {
      router.back();
      return;
    }

    console.log('Updating collaborator role:', {
      projectId: params.projectId,
      collaboratorId: params.collaboratorId,
      newRole: selectedRole.id,
    });

    Alert.alert(
      'Rol Actualizado',
      `El rol de ${COLLABORATOR_DATA.name} se ha actualizado a ${selectedRole.name}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleRemoveCollaborator = () => {
    Alert.alert(
      'Remover Colaborador',
      `¿Estás seguro de que deseas remover a ${COLLABORATOR_DATA.name} del proyecto?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            console.log('Removing collaborator:', COLLABORATOR_DATA.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Editar Colaborador"
        onBack={handleBack}
        rightText="Guardar"
        onRightPress={handleSaveRole}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Collaborator Info */}
        <View style={LAYOUT.section}>
          <View style={[CARD_STYLES.minimal, styles.collaboratorCard]}>
            <CollaboratorItem
              collaborator={COLLABORATOR_DATA}
              showRole={false}
            />
            <View style={styles.divider} />
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={ICON_SIZE.sm} color={COLORS.textSecondary} />
              <Text style={[TYPOGRAPHY.caption, styles.metaText]}>
                Se unió el {COLLABORATOR_DATA.joinedAt}
              </Text>
            </View>
          </View>
        </View>

        {/* Role Selection */}
        <View style={LAYOUT.section}>
          <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>
            Cambiar Rol
          </Text>
          <Text style={[TYPOGRAPHY.body, styles.sectionSubtitle]}>
            Actualiza los permisos de este colaborador
          </Text>

          <View style={styles.rolesContainer}>
            {ROLES.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  selectedRole?.id === role.id && styles.roleCardSelected,
                ]}
                onPress={() => setSelectedRole(role)}
                activeOpacity={0.7}
              >
                <View style={styles.roleHeader}>
                  <View style={[styles.roleIconContainer, { backgroundColor: role.color + '20' }]}>
                    <Ionicons
                      name={role.icon}
                      size={ICON_SIZE.md}
                      color={role.color}
                    />
                  </View>
                  {selectedRole?.id === role.id && (
                    <Ionicons name="checkmark-circle" size={ICON_SIZE.md} color={COLORS.primary} />
                  )}
                </View>
                <Text style={[TYPOGRAPHY.bodyBold, styles.roleName]}>
                  {role.name}
                </Text>
                <Text style={[TYPOGRAPHY.caption, styles.roleDescription]}>
                  {role.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={LAYOUT.section}>
          <Text style={[TYPOGRAPHY.h3, styles.sectionTitle, styles.dangerTitle]}>
            Zona de Peligro
          </Text>

          <TouchableOpacity
            style={[CARD_STYLES.minimal, styles.dangerCard]}
            onPress={handleRemoveCollaborator}
            activeOpacity={0.7}
          >
            <View style={styles.dangerContent}>
              <View style={styles.dangerIconContainer}>
                <Ionicons name="person-remove" size={ICON_SIZE.md} color={COLORS.error} />
              </View>
              <View style={styles.dangerInfo}>
                <Text style={[TYPOGRAPHY.bodyBold, styles.dangerTitle]}>
                  Remover del Proyecto
                </Text>
                <Text style={[TYPOGRAPHY.caption, styles.dangerDescription]}>
                  Perderá acceso a todos los gastos
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={ICON_SIZE.sm} color={COLORS.error} />
            </View>
          </TouchableOpacity>
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
  collaboratorCard: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  metaText: {
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  rolesContainer: {
    gap: SPACING.md,
  },
  roleCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '05',
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleName: {
    marginBottom: SPACING.xs,
  },
  roleDescription: {
    color: COLORS.textSecondary,
  },
  dangerCard: {
    borderColor: COLORS.error + '30',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  dangerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  dangerInfo: {
    flex: 1,
  },
  dangerTitle: {
    color: COLORS.error,
    marginBottom: SPACING.xs,
  },
  dangerDescription: {
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
});
