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
import useDataStore from '../store/dataStore';

export default function CreateBudgetScreen() {
  const router = useRouter();

  // Datos desde el store global
  const categories = useDataStore((state) => state.categories);

  const addBudget = useDataStore((state) => state.addBudget);
  const [isSaving, setIsSaving] = useState(false);

  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      const budgetData = {
        amount: parseFloat(amount),
        period: 'monthly', // Default to monthly for now
        categoryId: selectedCategory.id,
        projectId: '11111111-1111-1111-1111-111111111111', // Default project ID
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
      };

      await addBudget(budgetData);

      Alert.alert(
        'Presupuesto Creado',
        `Presupuesto de $${parseFloat(amount).toLocaleString('es-MX')} creado para ${selectedCategory.name}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error creating budget:', error);
      Alert.alert('Error', 'No se pudo crear el presupuesto. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Nuevo Presupuesto"
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
          keyboardShouldPersistTaps="handled"
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
                    selectedCategory?.id === category.id && [
                      styles.categoryCardSelected,
                      { borderColor: category.color, backgroundColor: category.color + '10' },
                    ],
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.categoryIconContainer,
                      { backgroundColor: category.color + '20' },
                      selectedCategory?.id === category.id && { backgroundColor: category.color },
                    ]}
                  >
                    <Ionicons
                      name={category.icon}
                      size={ICON_SIZE.lg}
                      color={selectedCategory?.id === category.id ? COLORS.white : category.color}
                    />
                  </View>
                  <Text
                    style={[
                      TYPOGRAPHY.bodyBold,
                      styles.categoryName,
                      selectedCategory?.id === category.id && styles.categoryNameSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: 'transparent',
    elevation: 0,
  },
  categoryCardSelected: {
    borderWidth: 2,
    // Color set dynamically
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
    color: COLORS.text,
    fontWeight: '600',
  },
  categoryNameSelected: {
    fontWeight: '700',
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
