import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, LAYOUT } from '../constants';
import { Header, Input, IconPicker } from '../components/ui';

// Datos de ejemplo - En producción vendrían de un store o API
const PROJECT_DATA = {
  id: 2,
  name: 'Renta Depa',
  description: 'Gastos compartidos del departamento',
  icon: 'home',
  color: COLORS.primary,
};

export default function EditProjectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [name, setName] = useState(PROJECT_DATA.name);
  const [description, setDescription] = useState(PROJECT_DATA.description);
  const [selectedIcon, setSelectedIcon] = useState({
    icon: PROJECT_DATA.icon,
    color: PROJECT_DATA.color,
  });
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    if (name !== PROJECT_DATA.name || description !== PROJECT_DATA.description ||
        selectedIcon.icon !== PROJECT_DATA.icon || selectedIcon.color !== PROJECT_DATA.color) {
      Alert.alert(
        'Descartar Cambios',
        '¿Estás seguro de que deseas descartar los cambios?',
        [
          { text: 'Seguir Editando', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!selectedIcon.icon) {
      Alert.alert('Error', 'Por favor selecciona un ícono');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    console.log('Saving project:', {
      id: PROJECT_DATA.id,
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon.icon,
      color: selectedIcon.color,
    });

    Alert.alert(
      'Proyecto Actualizado',
      'Los cambios se han guardado exitosamente',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Editar Proyecto"
        onBack={handleBack}
        rightText="Guardar"
        onRightPress={handleSave}
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
          {/* Name Input */}
          <View style={LAYOUT.section}>
            <Input
              label="Nombre del Proyecto"
              value={name}
              onChangeText={setName}
              placeholder="Ej: Renta Depa"
              error={errors.name}
              maxLength={50}
              showCharCount={true}
              autoFocus={false}
            />
          </View>

          {/* Icon Picker */}
          <View style={LAYOUT.section}>
            <IconPicker
              label="Ícono"
              selected={selectedIcon}
              onSelect={setSelectedIcon}
            />
          </View>

          {/* Description Input */}
          <View style={LAYOUT.section}>
            <Input
              label="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Ej: Gastos compartidos del departamento"
              multiline={true}
              numberOfLines={4}
              maxLength={200}
              showCharCount={true}
            />
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
  bottomPadding: {
    height: 100,
  },
});
