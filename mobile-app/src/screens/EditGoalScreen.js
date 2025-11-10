import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  ICON_SIZE,
  LAYOUT,
} from '../constants';
import { Header, Input } from '../components/ui';
import { required, positiveNumber, compose } from '../utils/validators';

const GOAL_ICONS = [
  { id: 1, name: 'Vacaciones', icon: 'airplane', color: COLORS.primary },
  { id: 2, name: 'Emergencia', icon: 'shield-checkmark', color: COLORS.success },
  { id: 3, name: 'Electrónica', icon: 'laptop', color: COLORS.warning },
  { id: 4, name: 'Auto', icon: 'car-sport', color: COLORS.categoryTransport },
  { id: 5, name: 'Casa', icon: 'home', color: COLORS.categoryFood },
  { id: 6, name: 'Educación', icon: 'school', color: COLORS.categoryEducation },
  { id: 7, name: 'Salud', icon: 'fitness', color: COLORS.categoryHealth },
  { id: 8, name: 'Inversión', icon: 'trending-up', color: COLORS.success },
  { id: 9, name: 'Regalo', icon: 'gift', color: COLORS.error },
  { id: 10, name: 'Otro', icon: 'flag', color: COLORS.textSecondary },
];

// Mock data
const MOCK_GOALS = {
  '1': { id: 1, name: 'Vacaciones Europa', current: 45000, target: 80000, icon: 'airplane', color: COLORS.primary, deadline: '2025-12-31', description: 'Viaje familiar por 2 semanas' },
  '2': { id: 2, name: 'Fondo de Emergencia', current: 28000, target: 50000, icon: 'shield-checkmark', color: COLORS.success, deadline: '2025-06-30', description: 'Para emergencias médicas y situaciones inesperadas' },
  '3': { id: 3, name: 'Laptop Nueva', current: 12000, target: 30000, icon: 'laptop', color: COLORS.warning, deadline: '2025-08-15', description: '' },
  '4': { id: 4, name: 'Auto', current: 150000, target: 300000, icon: 'car-sport', color: COLORS.categoryTransport, deadline: '2026-12-31', description: 'Enganche para auto nuevo' },
};

export default function EditGoalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const existingGoal = MOCK_GOALS[id];
  const existingIconObj = existingGoal ? GOAL_ICONS.find(i => i.icon === existingGoal.icon) : null;

  const [name, setName] = useState(existingGoal?.name || '');
  const [targetAmount, setTargetAmount] = useState(existingGoal?.target.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(existingGoal?.current.toString() || '');
  const [deadline, setDeadline] = useState(existingGoal?.deadline || '');
  const [description, setDescription] = useState(existingGoal?.description || '');
  const [selectedIcon, setSelectedIcon] = useState(existingIconObj || null);
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    const newErrors = {};

    const nameError = required(name);
    if (nameError) {
      newErrors.name = nameError;
    }

    const targetValidator = compose(required, positiveNumber);
    const targetError = targetValidator(targetAmount);
    if (targetError) {
      newErrors.targetAmount = targetError;
    }

    const currentValidator = positiveNumber;
    const currentError = currentValidator(currentAmount);
    if (currentError && currentAmount !== '') {
      newErrors.currentAmount = currentError;
    }

    const deadlineError = required(deadline);
    if (deadlineError) {
      newErrors.deadline = deadlineError;
    }

    if (!selectedIcon) {
      Alert.alert('Error', 'Por favor selecciona un ícono para tu meta');
      return false;
    }

    if (deadline) {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.deadline = 'La fecha debe ser futura';
      }
    }

    if (targetAmount && currentAmount) {
      const target = parseFloat(targetAmount);
      const current = parseFloat(currentAmount);
      if (current > target) {
        newErrors.currentAmount = 'No puede ser mayor al objetivo';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    console.log('Updating goal:', {
      id,
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline,
      description,
      icon: selectedIcon,
    });

    Alert.alert(
      'Meta Actualizada',
      `Meta "${name}" actualizada correctamente`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleAddContribution = () => {
    Alert.prompt(
      'Añadir Aportación',
      'Ingresa el monto que deseas añadir a esta meta',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Añadir',
          onPress: (contributionText) => {
            const contribution = parseFloat(contributionText);
            if (isNaN(contribution) || contribution <= 0) {
              Alert.alert('Error', 'Ingresa un monto válido');
              return;
            }
            const newCurrent = parseFloat(currentAmount) + contribution;
            const target = parseFloat(targetAmount);
            if (newCurrent > target) {
              Alert.alert(
                'Atención',
                `La aportación excede tu meta. ¿Deseas actualizar el monto actual a $${target.toLocaleString('es-MX')}?`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Sí', onPress: () => setCurrentAmount(target.toString()) },
                ]
              );
            } else {
              setCurrentAmount(newCurrent.toString());
              Alert.alert('Éxito', `Se añadieron $${contribution.toLocaleString('es-MX')} a tu meta`);
            }
          },
        },
      ],
      'plain-text',
      '',
      'decimal-pad'
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Meta',
      `¿Estás seguro de que deseas eliminar la meta "${name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting goal:', id);
            Alert.alert(
              'Meta Eliminada',
              'La meta ha sido eliminada correctamente',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          },
        },
      ]
    );
  };

  const getProgress = () => {
    if (!currentAmount || !targetAmount) return 0;
    const current = parseFloat(currentAmount);
    const target = parseFloat(targetAmount);
    return Math.min(100, Math.round((current / target) * 100));
  };

  const getRemaining = () => {
    if (!currentAmount || !targetAmount) return 0;
    const current = parseFloat(currentAmount);
    const target = parseFloat(targetAmount);
    return Math.max(0, target - current);
  };

  if (!existingGoal) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Editar Meta" onBack={handleBack} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.textSecondary} />
          <Text style={[TYPOGRAPHY.h3, styles.errorTitle]}>
            Meta no encontrada
          </Text>
          <Text style={[TYPOGRAPHY.body, styles.errorText]}>
            No se pudo encontrar la meta solicitada
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Editar Meta"
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
          {/* Progress Card */}
          <View style={LAYOUT.section}>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={[TYPOGRAPHY.caption, styles.progressLabel]}>
                  Progreso Actual
                </Text>
                <Text style={[TYPOGRAPHY.h2, styles.progressPercentage]}>
                  {getProgress()}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${getProgress()}%` }]} />
              </View>
              <View style={styles.progressStats}>
                <View style={styles.progressStatItem}>
                  <Text style={[TYPOGRAPHY.caption, styles.progressStatLabel]}>
                    Actual
                  </Text>
                  <Text style={[TYPOGRAPHY.bodyBold, styles.progressStatValue]}>
                    ${parseFloat(currentAmount || 0).toLocaleString('es-MX')}
                  </Text>
                </View>
                <View style={styles.progressStatItem}>
                  <Text style={[TYPOGRAPHY.caption, styles.progressStatLabel]}>
                    Falta
                  </Text>
                  <Text style={[TYPOGRAPHY.bodyBold, styles.progressStatValue]}>
                    ${getRemaining().toLocaleString('es-MX')}
                  </Text>
                </View>
                <View style={styles.progressStatItem}>
                  <Text style={[TYPOGRAPHY.caption, styles.progressStatLabel]}>
                    Meta
                  </Text>
                  <Text style={[TYPOGRAPHY.bodyBold, styles.progressStatValue]}>
                    ${parseFloat(targetAmount || 0).toLocaleString('es-MX')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Add Contribution Button */}
          <View style={LAYOUT.section}>
            <TouchableOpacity
              style={styles.contributionButton}
              onPress={handleAddContribution}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={ICON_SIZE.md} color={COLORS.white} />
              <Text style={[TYPOGRAPHY.bodyBold, styles.contributionButtonText]}>
                Añadir Aportación
              </Text>
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <View style={LAYOUT.section}>
            <Input
              label="Nombre de la Meta"
              value={name}
              onChangeText={setName}
              placeholder="Ej: Vacaciones en Europa"
              error={errors.name}
            />
          </View>

          {/* Icon Selection */}
          <View style={LAYOUT.section}>
            <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>
              Ícono
            </Text>

            <View style={styles.iconsGrid}>
              {GOAL_ICONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.iconCard,
                    selectedIcon?.id === item.id && styles.iconCardSelected,
                  ]}
                  onPress={() => setSelectedIcon(item)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <Ionicons
                      name={item.icon}
                      size={ICON_SIZE.lg}
                      color={item.color}
                    />
                  </View>
                  <Text style={[TYPOGRAPHY.caption, styles.iconName]}>
                    {item.name}
                  </Text>
                  {selectedIcon?.id === item.id && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={ICON_SIZE.xs} color={COLORS.white} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amount Inputs */}
          <View style={LAYOUT.section}>
            <Input
              label="Monto Objetivo"
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.targetAmount}
            />
          </View>

          <View style={LAYOUT.section}>
            <Input
              label="Monto Actual"
              value={currentAmount}
              onChangeText={setCurrentAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.currentAmount}
            />
          </View>

          {/* Deadline Input */}
          <View style={LAYOUT.section}>
            <Input
              label="Fecha Límite"
              value={deadline}
              onChangeText={setDeadline}
              placeholder="AAAA-MM-DD"
              error={errors.deadline}
              helperText="Formato: 2025-12-31"
            />
          </View>

          {/* Description Input */}
          <View style={LAYOUT.section}>
            <Input
              label="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              placeholder="¿Por qué es importante esta meta?"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Delete Button */}
          <View style={LAYOUT.section}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={ICON_SIZE.md} color={COLORS.error} />
              <Text style={[TYPOGRAPHY.bodyBold, styles.deleteButtonText]}>
                Eliminar Meta
              </Text>
            </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorTitle: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: SPACING.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  progressLabel: {
    color: COLORS.white,
    opacity: 0.8,
    fontWeight: '500',
  },
  progressPercentage: {
    color: COLORS.white,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  progressStatItem: {
    flex: 1,
  },
  progressStatLabel: {
    color: COLORS.white,
    opacity: 0.7,
    marginBottom: SPACING.xs,
  },
  progressStatValue: {
    color: COLORS.white,
  },
  contributionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  contributionButtonText: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  iconCard: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '05',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconName: {
    textAlign: 'center',
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.error + '10',
    borderWidth: 1,
    borderColor: COLORS.error + '30',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  deleteButtonText: {
    color: COLORS.error,
  },
  bottomPadding: {
    height: 100,
  },
});
