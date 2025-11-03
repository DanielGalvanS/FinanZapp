import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';

// Datos de ejemplo - En producción vendrían del estado global
const INITIAL_CATEGORIES = [
  { id: 1, name: 'Comida', icon: '🍔', color: '#FF6B6B', expenseCount: 28, totalAmount: 8420.50, isDefault: true },
  { id: 2, name: 'Transporte', icon: '🚗', color: '#4ECDC4', expenseCount: 15, totalAmount: 3200.00, isDefault: true },
  { id: 3, name: 'Entretenimiento', icon: '🎮', color: '#95E1D3', expenseCount: 12, totalAmount: 2500.00, isDefault: true },
  { id: 4, name: 'Compras', icon: '🛍️', color: '#F38181', expenseCount: 22, totalAmount: 6800.00, isDefault: true },
  { id: 5, name: 'Salud', icon: '⚕️', color: '#A8E6CF', expenseCount: 8, totalAmount: 4200.00, isDefault: true },
  { id: 6, name: 'Educación', icon: '📚', color: '#FFD3B6', expenseCount: 5, totalAmount: 1950.00, isDefault: true },
];

const AVAILABLE_ICONS = [
  '🍔', '🚗', '🎮', '🛍️', '⚕️', '📚', '✈️', '🏠', '💼', '🎬',
  '🏋️', '🐕', '🎨', '💰', '🔧', '📱', '☕', '🌳', '🎵', '🏖️',
];

const AVAILABLE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#A8E6CF', '#FFD3B6',
  '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B',
];

export default function ManageCategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const handleBack = () => {
    router.back();
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setSelectedIcon(AVAILABLE_ICONS[0]);
    setSelectedColor(AVAILABLE_COLORS[0]);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    if (category.isDefault) {
      Alert.alert(
        'Categoría Predeterminada',
        'Las categorías predeterminadas no pueden ser editadas. Puedes crear una nueva categoría personalizada.',
        [{ text: 'OK' }]
      );
      return;
    }
    setEditingCategory(category);
    setCategoryName(category.name);
    setSelectedIcon(category.icon);
    setSelectedColor(category.color);
    setShowModal(true);
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la categoría');
      return;
    }

    if (editingCategory) {
      // Editar categoría existente
      setCategories(prev => prev.map(c =>
        c.id === editingCategory.id
          ? { ...c, name: categoryName, icon: selectedIcon, color: selectedColor }
          : c
      ));
      Alert.alert('Éxito', 'Categoría actualizada correctamente');
    } else {
      // Crear nueva categoría
      const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: categoryName,
        icon: selectedIcon,
        color: selectedColor,
        expenseCount: 0,
        totalAmount: 0,
        isDefault: false,
      };
      setCategories(prev => [...prev, newCategory]);
      Alert.alert('Éxito', 'Categoría creada correctamente');
    }

    setShowModal(false);
    setCategoryName('');
    setEditingCategory(null);
  };

  const handleDeleteCategory = (category) => {
    if (category.isDefault) {
      Alert.alert(
        'Categoría Predeterminada',
        'Las categorías predeterminadas no pueden ser eliminadas.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (category.expenseCount > 0) {
      Alert.alert(
        'No se puede eliminar',
        `Esta categoría tiene ${category.expenseCount} gastos asociados. Debes reasignar estos gastos a otra categoría antes de eliminarla.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Eliminar Categoría',
      `¿Estás seguro de que deseas eliminar "${category.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setCategories(prev => prev.filter(c => c.id !== category.id));
            Alert.alert('Éxito', 'Categoría eliminada correctamente');
          },
        },
      ]
    );
  };

  const defaultCategories = categories.filter(c => c.isDefault);
  const customCategories = categories.filter(c => !c.isDefault);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gestionar Categorías</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateCategory}>
          <Text style={styles.createButtonIcon}>+</Text>
          <Text style={styles.createButtonText}>Crear Nueva Categoría</Text>
        </TouchableOpacity>

        {/* Default Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías Predeterminadas ({defaultCategories.length})</Text>
          <Text style={styles.sectionSubtitle}>
            Estas categorías no pueden ser editadas ni eliminadas
          </Text>

          <View style={styles.categoriesGrid}>
            {defaultCategories.map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIconContainer, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.categoryStats}>
                  <Text style={styles.categoryStat}>
                    {category.expenseCount} {category.expenseCount === 1 ? 'gasto' : 'gastos'}
                  </Text>
                  <Text style={styles.categoryAmount}>{formatCurrency(category.totalAmount)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Custom Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías Personalizadas ({customCategories.length})</Text>

          {customCategories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📁</Text>
              <Text style={styles.emptyStateText}>No tienes categorías personalizadas</Text>
              <Text style={styles.emptyStateSubtext}>Crea una para organizar tus gastos</Text>
            </View>
          ) : (
            <View style={styles.categoriesGrid}>
              {customCategories.map((category) => (
                <View key={category.id} style={styles.categoryCard}>
                  <View style={[styles.categoryIconContainer, { backgroundColor: category.color }]}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <View style={styles.categoryStats}>
                    <Text style={styles.categoryStat}>
                      {category.expenseCount} {category.expenseCount === 1 ? 'gasto' : 'gastos'}
                    </Text>
                    <Text style={styles.categoryAmount}>{formatCurrency(category.totalAmount)}</Text>
                  </View>
                  <View style={styles.categoryActions}>
                    <TouchableOpacity
                      style={styles.categoryActionButton}
                      onPress={() => handleEditCategory(category)}
                    >
                      <Text style={styles.categoryActionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.categoryActionButton}
                      onPress={() => handleDeleteCategory(category)}
                    >
                      <Text style={styles.categoryActionIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </Text>

            {/* Name Input */}
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Nombre de la Categoría</Text>
              <TextInput
                style={styles.modalInput}
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Ej: Mascotas, Hobbies..."
                placeholderTextColor={COLORS.textSecondary}
                autoFocus
                maxLength={20}
              />
            </View>

            {/* Icon Selector */}
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Icono</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.iconScroll}
              >
                {AVAILABLE_ICONS.map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.iconOption,
                      selectedIcon === icon && styles.iconOptionSelected,
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Text style={styles.iconOptionText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Color Selector */}
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Color</Text>
              <View style={styles.colorGrid}>
                {AVAILABLE_COLORS.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Text style={styles.colorCheckmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Vista Previa</Text>
              <View style={styles.previewCard}>
                <View style={[styles.previewIcon, { backgroundColor: selectedColor }]}>
                  <Text style={styles.previewIconText}>{selectedIcon}</Text>
                </View>
                <Text style={styles.previewName}>{categoryName || 'Categoría'}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowModal(false);
                  setCategoryName('');
                  setEditingCategory(null);
                }}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalSaveButton,
                  !categoryName.trim() && styles.modalSaveButtonDisabled,
                ]}
                onPress={handleSaveCategory}
                disabled={!categoryName.trim()}
              >
                <Text style={styles.modalSaveButtonText}>
                  {editingCategory ? 'Guardar' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: COLORS.text,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonIcon: {
    fontSize: 24,
    color: COLORS.black,
    marginRight: 8,
    fontWeight: 'bold',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    padding: 16,
    marginHorizontal: '1.5%',
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryStats: {
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryStat: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  categoryActionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryActionIcon: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 24,
  },
  modalInputContainer: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: COLORS.gray50,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  iconScroll: {
    flexGrow: 0,
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  iconOptionText: {
    fontSize: 28,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: COLORS.text,
  },
  colorCheckmark: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  previewCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    minWidth: 150,
  },
  previewIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewIconText: {
    fontSize: 32,
  },
  previewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
});
