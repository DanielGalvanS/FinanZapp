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
  BUTTON_STYLES,
  ICON_SIZE,
} from '../constants';
import DatePickerInput from '../components/forms/DatePickerInput';
import { Header, Input } from '../components/ui';
import { formatCurrency } from '../utils/formatters';

const CATEGORIES = [
  { id: 1, name: 'Comida', icon: 'restaurant-outline', color: COLORS.categoryFood },
  { id: 2, name: 'Transporte', icon: 'car-outline', color: COLORS.categoryTransport },
  { id: 3, name: 'Entretenimiento', icon: 'game-controller-outline', color: COLORS.categoryEntertainment },
  { id: 4, name: 'Compras', icon: 'cart-outline', color: COLORS.categoryShopping },
  { id: 5, name: 'Salud', icon: 'medkit-outline', color: COLORS.categoryHealth },
  { id: 6, name: 'Educación', icon: 'book-outline', color: COLORS.categoryEducation },
];

const PROJECTS = [
  { id: 1, name: 'Personal' },
  { id: 2, name: 'Negocio' },
  { id: 3, name: 'Renta Depa' },
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('es-MX'));

  const handleAmountChange = (text) => {
    const numericValue = text.replace(/[^0-9.]/g, '');
    setAmount(numericValue);
  };

  const getFormattedAmount = () => {
    if (!amount) return '$0.00';
    const num = parseFloat(amount);
    if (isNaN(num)) return '$0.00';
    return formatCurrency(num, 'MXN');
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    if (!amount || !selectedCategory) {
      Alert.alert('Campos requeridos', 'Por favor ingresa el monto y selecciona una categoría');
      return;
    }

    console.log('Saving expense:', {
      amount,
      category: selectedCategory,
      project: selectedProject,
      description,
      date,
    });

    Alert.alert(
      'Gasto Guardado',
      `Gasto de ${getFormattedAmount()} guardado exitosamente`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleScanReceipt = () => {
    Alert.alert('Escanear Comprobante', 'Funcionalidad de OCR próximamente');
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
            title="Nuevo Gasto"
            onBack={handleBack}
            rightIcon="camera-outline"
            onRightPress={handleScanReceipt}
          />

          {/* Amount Input */}
          <View style={styles.amountSection}>
            <Text style={[TYPOGRAPHY.caption, styles.amountLabel]}>
              Cantidad
            </Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                placeholderTextColor={COLORS.textTertiary}
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>
            <Text style={[TYPOGRAPHY.caption, styles.amountFormatted]}>
              {getFormattedAmount()} MXN
            </Text>
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Categoría</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory?.id === category.id && [
                      styles.categoryItemSelected,
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
                      size={ICON_SIZE.md}
                      color={selectedCategory?.id === category.id ? COLORS.white : category.color}
                    />
                  </View>
                  <Text
                    style={[
                      TYPOGRAPHY.caption,
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

          {/* Project Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Proyecto</Text>
            <View style={styles.projectsRow}>
              {PROJECTS.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={[
                    styles.projectButton,
                    selectedProject?.id === project.id && styles.projectButtonSelected,
                  ]}
                  onPress={() => setSelectedProject(project)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      TYPOGRAPHY.body,
                      styles.projectText,
                      selectedProject?.id === project.id && styles.projectTextSelected,
                    ]}
                  >
                    {project.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Input
              label="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Ej: Comida en restaurante..."
              multiline={true}
              numberOfLines={3}
            />
          </View>

          {/* Date */}
          <View style={styles.section}>
            <DatePickerInput
              label="Fecha"
              value={date}
              onChange={setDate}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              BUTTON_STYLES.accent,
              styles.saveButton,
              (!amount || !selectedCategory) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!amount || !selectedCategory}
            activeOpacity={0.8}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.white }]}>
              Guardar Gasto
            </Text>
          </TouchableOpacity>

          {/* Bottom padding for tab bar */}
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
  amountSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    backgroundColor: COLORS.backgroundSecondary,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
    borderRadius: RADIUS.xl,
  },
  amountLabel: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.text,
  },
  amountInput: {
    fontSize: 56,
    fontWeight: '700',
    color: COLORS.text,
    minWidth: 120,
    textAlign: 'center',
    letterSpacing: -2,
  },
  amountFormatted: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  sectionLabel: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    padding: SPACING.md,
    marginHorizontal: '1.5%',
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  categoryItemSelected: {
    borderWidth: 2,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryName: {
    textAlign: 'center',
    fontWeight: '600',
  },
  categoryNameSelected: {
    fontWeight: '700',
  },
  projectsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  projectButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  projectButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryAlpha10,
  },
  projectText: {
    fontWeight: '600',
  },
  projectTextSelected: {
    fontWeight: '700',
  },
  saveButton: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.sm,
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
