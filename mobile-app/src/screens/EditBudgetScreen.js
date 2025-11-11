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
import useDataStore from '../store/dataStore';

// Mock data - En producción vendría de una API o estado global
const MOCK_BUDGETS = {
  '1': { id: 1, name: 'Comida', amount: 10000, categoryId: 1, spent: 8450 },
  '2': { id: 2, name: 'Transporte', amount: 5000, categoryId: 2, spent: 4200 },
  '3': { id: 3, name: 'Entretenimiento', amount: 3000, categoryId: 3, spent: 2300 },
  '4': { id: 4, name: 'Compras', amount: 8000, categoryId: 4, spent: 1500 },
};

export default function EditBudgetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Datos desde el store global
  const categories = useDataStore((state) => state.categories);

  // Cargar datos del presupuesto existente
  const existingBudget = MOCK_BUDGETS[id];
  const existingCategory = categories.find(cat => cat.id === existingBudget?.categoryId);

  const [amount, setAmount] = useState(existingBudget?.amount.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState(existingCategory || null);
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    const newErrors = {};

    const amountValidator = compose(required, positiveNumber);
    const amountError = amountValidator(amount);
    if (amountError) {
      newErrors.amount = amountError;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Por favor selecciona una categoría');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    console.log('Updating budget:', {
      id,
      amount: parseFloat(amount),
      category: selectedCategory,
    });

    Alert.alert(
      'Presupuesto Actualizado',
      `Presupuesto actualizado a $${parseFloat(amount).toLocaleString('es-MX')} para ${selectedCategory.name}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Presupuesto',
      `¿Estás seguro de que deseas eliminar el presupuesto de ${selectedCategory?.name}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting budget:', id);
            Alert.alert(
              'Presupuesto Eliminado',
              'El presupuesto ha sido eliminado correctamente',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          },
        },
      ]
    );
  };

  if (!existingBudget) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Editar Presupuesto" onBack={handleBack} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.textSecondary} />
          <Text style={[TYPOGRAPHY.h3, styles.errorTitle]}>
            Presupuesto no encontrado
          </Text>
          <Text style={[TYPOGRAPHY.body, styles.errorText]}>
            No se pudo encontrar el presupuesto solicitado
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Editar Presupuesto"
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
          {/* Amount Input */}
          <View style={LAYOUT.section}>
            <Input
              label="Monto del Presupuesto"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.amount}
            />
          </View>

          {/* Current Spending Info */}
          <View style={LAYOUT.section}>
            <View style={styles.spendingCard}>
              <View style={styles.spendingRow}>
                <Text style={[TYPOGRAPHY.body, styles.spendingLabel]}>
                  Gastado hasta ahora
                </Text>
                <Text style={[TYPOGRAPHY.bodyBold, styles.spendingAmount]}>
                  ${existingBudget.spent.toLocaleString('es-MX')}
                </Text>
              </View>
              <View style={styles.spendingRow}>
                <Text style={[TYPOGRAPHY.body, styles.spendingLabel]}>
                  Porcentaje utilizado
                </Text>
                <Text style={[TYPOGRAPHY.bodyBold, styles.spendingPercentage]}>
                  {Math.round((existingBudget.spent / existingBudget.amount) * 100)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Category Selection */}
          <View style={LAYOUT.section}>
            <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>
              Categoría
            </Text>
            <Text style={[TYPOGRAPHY.body, styles.sectionSubtitle]}>
              Selecciona para qué categoría es este presupuesto
            </Text>

            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    selectedCategory?.id === category.id && styles.categoryCardSelected,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
                    <Ionicons
                      name={category.icon}
                      size={ICON_SIZE.lg}
                      color={category.color}
                    />
                  </View>
                  <Text style={[TYPOGRAPHY.bodyBold, styles.categoryName]}>
                    {category.name}
                  </Text>
                  {selectedCategory?.id === category.id && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={ICON_SIZE.sm} color={COLORS.white} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info Card */}
          <View style={LAYOUT.section}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={ICON_SIZE.md} color={COLORS.primary} />
              <Text style={[TYPOGRAPHY.body, styles.infoText]}>
                Recibirás notificaciones cuando alcances el 80% y 100% de tu presupuesto.
              </Text>
            </View>
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
                Eliminar Presupuesto
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
  spendingCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  spendingLabel: {
    color: COLORS.textSecondary,
  },
  spendingAmount: {
    color: COLORS.text,
  },
  spendingPercentage: {
    color: COLORS.primary,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
  },
  categoryCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '05',
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryName: {
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
