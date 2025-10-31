import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

const CATEGORIES = [
  { id: 1, name: 'Comida', icon: '🍔', color: '#FF6B6B' },
  { id: 2, name: 'Transporte', icon: '🚗', color: '#4ECDC4' },
  { id: 3, name: 'Entretenimiento', icon: '🎮', color: '#95E1D3' },
  { id: 4, name: 'Compras', icon: '🛍️', color: '#F38181' },
  { id: 5, name: 'Salud', icon: '⚕️', color: '#A8E6CF' },
  { id: 6, name: 'Educación', icon: '📚', color: '#FFD3B6' },
];

const PROJECTS = [
  { id: 1, name: 'Personal' },
  { id: 2, name: 'Negocio' },
  { id: 3, name: 'Renta Depa' },
];

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('es-MX'));

  const handleAmountChange = (text) => {
    const numericValue = text.replace(/[^0-9.]/g, '');
    setAmount(numericValue);
  };

  const formatAmount = () => {
    if (!amount) return '$0.00';
    const num = parseFloat(amount);
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(num);
  };

  const handleSave = () => {
    console.log('Saving expense:', {
      amount,
      category: selectedCategory,
      project: selectedProject,
      description,
      date,
    });
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
            <Text style={styles.title}>Nuevo Gasto</Text>
            <TouchableOpacity style={styles.scanButton}>
              <Text style={styles.scanIcon}>📸</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Cantidad</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                placeholderTextColor={COLORS.gray400}
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>
            <Text style={styles.amountFormatted}>{formatAmount()} MXN</Text>
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
                    selectedCategory?.id === category.id && styles.categoryItemSelected,
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
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                  </View>
                  <Text
                    style={[
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
            <Text style={styles.sectionLabel}>Descripción (opcional)</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Ej: Comida en restaurante..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Date */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Fecha</Text>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateIcon}>📅</Text>
              <Text style={styles.dateText}>{date}</Text>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!amount || !selectedCategory) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!amount || !selectedCategory}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Guardar Gasto</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scanButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanIcon: {
    fontSize: 24,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: COLORS.gray50,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  amountInput: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 120,
    textAlign: 'center',
  },
  amountFormatted: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: '1.5%',
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray200,
  },
  categoryItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  categoryNameSelected: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  projectsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  projectButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    alignItems: 'center',
  },
  projectButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  projectText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  projectTextSelected: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  descriptionInput: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: 16,
    padding: 16,
  },
  dateIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.gray300,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  bottomPadding: {
    height: 100,
  },
});
