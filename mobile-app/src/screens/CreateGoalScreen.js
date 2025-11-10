import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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

export default function CreateGoalScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
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

    // Validar que la fecha límite sea futura
    if (deadline) {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.deadline = 'La fecha debe ser futura';
      }
    }

    // Validar que el monto actual no sea mayor al objetivo
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

    console.log('Creating goal:', {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline,
      description,
      icon: selectedIcon,
    });

    Alert.alert(
      'Meta Creada',
      `Meta "${name}" creada con objetivo de $${parseFloat(targetAmount).toLocaleString('es-MX')}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const getEstimatedMonthlyContribution = () => {
    if (!targetAmount || !deadline || !currentAmount) return null;

    const target = parseFloat(targetAmount);
    const current = currentAmount ? parseFloat(currentAmount) : 0;
    const remaining = target - current;

    const deadlineDate = new Date(deadline);
    const today = new Date();
    const monthsRemaining = Math.max(1, Math.round((deadlineDate - today) / (1000 * 60 * 60 * 24 * 30)));

    const monthlyContribution = remaining / monthsRemaining;
    return monthlyContribution;
  };

  const monthlyContribution = getEstimatedMonthlyContribution();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Nueva Meta"
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
            <Text style={[TYPOGRAPHY.body, styles.sectionSubtitle]}>
              Selecciona un ícono que represente tu meta
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
              label="Monto Actual (opcional)"
              value={currentAmount}
              onChangeText={setCurrentAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.currentAmount}
              helperText="Si ya tienes ahorrado algo para esta meta"
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

          {/* Estimated Monthly Contribution */}
          {monthlyContribution && (
            <View style={LAYOUT.section}>
              <View style={styles.estimateCard}>
                <Ionicons name="calculator" size={ICON_SIZE.md} color={COLORS.primary} />
                <View style={styles.estimateContent}>
                  <Text style={[TYPOGRAPHY.caption, styles.estimateLabel]}>
                    Aportación mensual estimada
                  </Text>
                  <Text style={[TYPOGRAPHY.h3, styles.estimateAmount]}>
                    ${monthlyContribution.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={[TYPOGRAPHY.caption, styles.estimateHelp]}>
                    Para alcanzar tu meta en el tiempo establecido
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Info Card */}
          <View style={LAYOUT.section}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={ICON_SIZE.md} color={COLORS.primary} />
              <Text style={[TYPOGRAPHY.body, styles.infoText]}>
                Podrás actualizar el progreso de tu meta en cualquier momento desde la pantalla de edición.
              </Text>
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
  sectionTitle: {
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
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
  estimateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary + '30',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  estimateContent: {
    flex: 1,
  },
  estimateLabel: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  estimateAmount: {
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  estimateHelp: {
    color: COLORS.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary + '30',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  infoText: {
    flex: 1,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
