import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  SHADOWS,
  BUTTON_STYLES,
  ICON_SIZE,
  INPUT_STYLES,
} from '../constants';

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
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(PROJECT_ICONS[0]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    if (!projectName.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un nombre para el proyecto');
      return;
    }

    console.log('Creating project:', {
      name: projectName,
      description,
      icon: selectedIcon,
    });

    Alert.alert(
      'Proyecto Creado',
      `Proyecto "${projectName}" creado exitosamente`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={ICON_SIZE.md} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={TYPOGRAPHY.h3}>Nuevo Proyecto</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Project Name */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Nombre del Proyecto</Text>
            <TextInput
              style={[INPUT_STYLES.base, styles.nameInput]}
              value={projectName}
              onChangeText={setProjectName}
              placeholder="Ej: Renta Depa, Vacaciones..."
              placeholderTextColor={COLORS.textSecondary}
              maxLength={50}
            />
            <Text style={styles.charCount}>{projectName.length}/50</Text>
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Icono del Proyecto</Text>
            <View style={styles.iconsGrid}>
              {PROJECT_ICONS.map((iconItem) => (
                <TouchableOpacity
                  key={iconItem.id}
                  style={[
                    styles.iconItem,
                    selectedIcon?.id === iconItem.id && [
                      styles.iconItemSelected,
                      { borderColor: iconItem.color },
                    ],
                  ]}
                  onPress={() => setSelectedIcon(iconItem)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: iconItem.color + '20' },
                      selectedIcon?.id === iconItem.id && { backgroundColor: iconItem.color },
                    ]}
                  >
                    <Ionicons
                      name={iconItem.icon}
                      size={ICON_SIZE.md}
                      color={selectedIcon?.id === iconItem.id ? COLORS.white : iconItem.color}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Descripción (opcional)</Text>
            <TextInput
              style={[INPUT_STYLES.base, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ej: Gastos compartidos del departamento..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={200}
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              BUTTON_STYLES.accent,
              styles.saveButton,
              !projectName.trim() && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!projectName.trim()}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={ICON_SIZE.md} color={COLORS.white} />
            <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.white, marginLeft: SPACING.sm }]}>
              Crear Proyecto
            </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  sectionLabel: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.md,
  },
  nameInput: {
    fontSize: 16,
  },
  charCount: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center'
  },
  iconItem: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconItemSelected: {
    borderWidth: 3,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionInput: {
    minHeight: 100,
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
