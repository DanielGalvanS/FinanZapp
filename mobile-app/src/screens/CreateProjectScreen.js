import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BUTTON_STYLES,
  ICON_SIZE,
  TYPOGRAPHY,
} from '../constants';
import { Header, Input, IconPicker } from '../components/ui';
import dataService from '../services/dataService';
import useDataStore from '../store/dataStore';

const PROJECT_ICONS = [
  { id: 1, icon: 'folder-outline', color: COLORS.primary },
  { id: 2, icon: 'briefcase-outline', color: COLORS.categoryTransport },
  { id: 3, icon: 'home-outline', color: COLORS.categoryFood },
  { id: 4, icon: 'airplane-outline', color: COLORS.categoryEntertainment },
  { id: 5, icon: 'cart-outline', color: COLORS.categoryShopping },
  { id: 6, icon: 'fitness-outline', color: COLORS.categoryHealth },
  { id: 7, icon: 'book-outline', color: COLORS.categoryEducation },
  { id: 8, icon: 'gift-outline', color: '#E91E63' },
];

export default function CreateProjectScreen() {
  const router = useRouter();
  const addProject = useDataStore((state) => state.addProject);
  const refreshProjects = useDataStore((state) => state.refreshProjects);

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(PROJECT_ICONS[0]);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!projectName.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un nombre para el proyecto');
      return;
    }

    try {
      setIsSaving(true);

      // Crear proyecto en Supabase
      const newProject = await dataService.createProject({
        name: projectName.trim(),
        description: description.trim(),
        icon: selectedIcon.icon,
        color: selectedIcon.color,
        isShared: false,
      });

      console.log('[CreateProject] Proyecto creado:', newProject);

      // Agregar al store local inmediatamente
      addProject(newProject);

      // Refrescar proyectos desde Supabase para sincronizar
      await refreshProjects();

      Alert.alert(
        'Proyecto Creado',
        `Proyecto "${projectName}" creado exitosamente`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('[CreateProject] Error al crear proyecto:', error);
      Alert.alert(
        'Error',
        'No se pudo crear el proyecto. Intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Header
            title="Nuevo Proyecto"
            onBack={handleBack}
          />

          {/* Project Name */}
          <View style={styles.section}>
            <Input
              label="Nombre del Proyecto"
              value={projectName}
              onChangeText={setProjectName}
              placeholder="Ej: Renta Depa, Vacaciones..."
              maxLength={50}
              showCharCount={true}
            />
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <IconPicker
              label="Icono del Proyecto"
              icons={PROJECT_ICONS}
              selectedIcon={selectedIcon}
              onSelect={setSelectedIcon}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Input
              label="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Ej: Gastos compartidos del departamento..."
              maxLength={200}
              showCharCount={true}
              multiline={true}
              numberOfLines={3}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              BUTTON_STYLES.accent,
              styles.saveButton,
              (!projectName.trim() || isSaving) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!projectName.trim() || isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <>
                <ActivityIndicator size="small" color={COLORS.white} />
                <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.white, marginLeft: SPACING.sm }]}>
                  Creando...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={ICON_SIZE.md} color={COLORS.white} />
                <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.white, marginLeft: SPACING.sm }]}>
                  Crear Proyecto
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Bottom padding */}
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
  section: {
    paddingHorizontal: SPACING.xl,
  },
  saveButton: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.gray300,
    shadowOpacity: 0,
    elevation: 0,
  },
  bottomPadding: {
    height: 100,
  },
});
