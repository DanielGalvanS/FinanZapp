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

const CATEGORIES = [
  { id: 1, name: 'Comida', icon: 'restaurant-outline', color: COLORS.categoryFood },
  { id: 2, name: 'Transporte', icon: 'car-outline', color: COLORS.categoryTransport },
  { id: 3, name: 'Entretenimiento', icon: 'game-controller-outline', color: COLORS.categoryEntertainment },
  { id: 4, name: 'Compras', icon: 'cart-outline', color: COLORS.categoryShopping },
  { id: 5, name: 'Salud', icon: 'medkit-outline', color: COLORS.categoryHealth },
  { id: 6, name: 'Educación', icon: 'book-outline', color: COLORS.categoryEducation },
];

export default function CreateBudgetScreen() {
  const router = useRouter();
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

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    console.log('Creating budget:', {
      amount: parseFloat(amount),
      category: selectedCategory,
    });

    Alert.alert(
      'Presupuesto Creado',
      `Presupuesto de $${parseFloat(amount).toLocaleString('es-MX')} creado para ${selectedCategory.name}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
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
              {CATEGORIES.map((category) => (
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
  bottomPadding: {
    height: 100,
  },
});
