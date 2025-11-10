import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, CARD_STYLES, ICON_SIZE, LAYOUT } from '../constants';
import { Header, Input } from '../components/ui';
import { required, email, compose } from '../utils/validators';

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

export default function AddCollaboratorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES[1]); // Editor por defecto
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    const newErrors = {};

    const emailValidator = compose(required, email);
    const emailError = emailValidator(collaboratorEmail);
    if (emailError) {
      newErrors.email = emailError;
    }

    if (!selectedRole) {
      Alert.alert('Error', 'Por favor selecciona un rol');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCollaborator = () => {
    if (!validateForm()) {
      return;
    }

    console.log('Adding collaborator:', {
      projectId: params.id,
      email: collaboratorEmail.trim(),
      role: selectedRole.id,
    });

    Alert.alert(
      'Invitación Enviada',
      `Se ha enviado una invitación a ${collaboratorEmail}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Agregar Colaborador"
        onBack={handleBack}
        rightText="Enviar"
        onRightPress={handleAddCollaborator}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Info Card */}
          <View style={LAYOUT.section}>
            <View style={[CARD_STYLES.minimal, styles.infoCard]}>
              <Ionicons name="information-circle" size={ICON_SIZE.md} color={COLORS.primary} />
              <Text style={[TYPOGRAPHY.body, styles.infoText]}>
                El colaborador recibirá una invitación por correo para unirse al proyecto.
              </Text>
            </View>
          </View>

          {/* Email Input */}
          <View style={LAYOUT.section}>
            <Input
              label="Correo Electrónico"
              value={collaboratorEmail}
              onChangeText={setCollaboratorEmail}
              placeholder="nombre@ejemplo.com"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus={true}
            />
          </View>

          {/* Role Selection */}
          <View style={LAYOUT.section}>
            <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>
              Seleccionar Rol
            </Text>
            <Text style={[TYPOGRAPHY.body, styles.sectionSubtitle]}>
              Define los permisos del colaborador
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
                        color={selectedRole?.id === role.id ? role.color : role.color}
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

          {/* Permissions Info */}
          <View style={LAYOUT.section}>
            <View style={[CARD_STYLES.minimal, styles.permissionsCard]}>
              <Text style={[TYPOGRAPHY.bodyBold, styles.permissionsTitle]}>
                Permisos de {selectedRole.name}
              </Text>

              <View style={styles.permissionsList}>
                {selectedRole.id === 'admin' && (
                  <>
                    <View style={styles.permissionItem}>
                      <Ionicons name="checkmark" size={ICON_SIZE.sm} color={COLORS.success} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText]}>
                        Ver todos los gastos
                      </Text>
                    </View>
                    <View style={styles.permissionItem}>
                      <Ionicons name="checkmark" size={ICON_SIZE.sm} color={COLORS.success} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText]}>
                        Agregar y editar gastos
                      </Text>
                    </View>
                    <View style={styles.permissionItem}>
                      <Ionicons name="checkmark" size={ICON_SIZE.sm} color={COLORS.success} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText]}>
                        Gestionar colaboradores
                      </Text>
                    </View>
                    <View style={styles.permissionItem}>
                      <Ionicons name="checkmark" size={ICON_SIZE.sm} color={COLORS.success} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText]}>
                        Cambiar configuración
                      </Text>
                    </View>
                  </>
                )}

                {selectedRole.id === 'editor' && (
                  <>
                    <View style={styles.permissionItem}>
                      <Ionicons name="checkmark" size={ICON_SIZE.sm} color={COLORS.success} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText]}>
                        Ver todos los gastos
                      </Text>
                    </View>
                    <View style={styles.permissionItem}>
                      <Ionicons name="checkmark" size={ICON_SIZE.sm} color={COLORS.success} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText]}>
                        Agregar gastos
                      </Text>
                    </View>
                    <View style={styles.permissionItem}>
                      <Ionicons name="checkmark" size={ICON_SIZE.sm} color={COLORS.success} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText]}>
                        Editar sus propios gastos
                      </Text>
                    </View>
                    <View style={styles.permissionItem}>
                      <Ionicons name="close" size={ICON_SIZE.sm} color={COLORS.error} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText, styles.permissionDisabled]}>
                        No puede gestionar colaboradores
                      </Text>
                    </View>
                  </>
                )}

                {selectedRole.id === 'viewer' && (
                  <>
                    <View style={styles.permissionItem}>
                      <Ionicons name="checkmark" size={ICON_SIZE.sm} color={COLORS.success} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText]}>
                        Ver todos los gastos
                      </Text>
                    </View>
                    <View style={styles.permissionItem}>
                      <Ionicons name="close" size={ICON_SIZE.sm} color={COLORS.error} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText, styles.permissionDisabled]}>
                        No puede agregar gastos
                      </Text>
                    </View>
                    <View style={styles.permissionItem}>
                      <Ionicons name="close" size={ICON_SIZE.sm} color={COLORS.error} />
                      <Text style={[TYPOGRAPHY.body, styles.permissionText, styles.permissionDisabled]}>
                        No puede editar gastos
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary + '30',
  },
  infoText: {
    flex: 1,
    color: COLORS.text,
    lineHeight: 20,
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
  permissionsCard: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  permissionsTitle: {
    marginBottom: SPACING.lg,
  },
  permissionsList: {
    gap: SPACING.md,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  permissionText: {
    flex: 1,
    color: COLORS.text,
  },
  permissionDisabled: {
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
});
