import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
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
import { ReceiptGallery, ReceiptViewer } from '../components/receipts';
import useExpenseStore from '../store/expenseStore';
import useDataStore from '../store/dataStore';
import ocrService from '../services/ocrService';
import dataService from '../services/dataService';
import { showImagePickerOptions } from '../utils/imagePickerHelper';

export default function AddExpenseScreen() {
  const router = useRouter();
  const addExpense = useExpenseStore((state) => state.addExpense);

  // Datos desde el store global (con caché y persistencia)
  const categories = useDataStore((state) => state.categories);
  const projects = useDataStore((state) => state.projects);
  const isLoadingCategories = useDataStore((state) => state.isLoadingCategories);
  const isLoadingProjects = useDataStore((state) => state.isLoadingProjects);

  // Estados del formulario
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(projects[0] || null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('es-MX'));
  const [receipts, setReceipts] = useState([]);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ocrData, setOcrData] = useState(null);

  // Loading state combinado
  const isLoadingData = isLoadingCategories || isLoadingProjects;

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

  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      Alert.alert('Campos requeridos', 'Por favor ingresa el monto y selecciona una categoría');
      return;
    }

    try {
      setIsSaving(true);

      // Convertir fecha de formato dd/mm/yyyy a ISO
      const dateParts = date.split('/');
      const isoDate = dateParts.length === 3
        ? new Date(dateParts[2], dateParts[1] - 1, dateParts[0]).toISOString()
        : new Date().toISOString();

      // Guardar en Supabase primero
      const expenseData = {
        name: description || selectedCategory.name,
        amount: parseFloat(amount),
        categoryId: selectedCategory.id,
        projectId: selectedProject.id,
        description: description,
        date: isoDate,
      };

      const savedExpense = await dataService.saveExpense(expenseData);

      console.log('[AddExpense] Gasto guardado en Supabase:', savedExpense);

      // Agregar al store local con datos completos
      const expenseForStore = {
        ...savedExpense,
        categoryName: selectedCategory.name,
        categoryIcon: selectedCategory.icon,
        categoryColor: selectedCategory.color,
        projectName: selectedProject.name,
        receipts: receipts,
        comments: [],
      };

      addExpense(expenseForStore);

      Alert.alert(
        'Gasto Guardado',
        `Gasto de ${getFormattedAmount()} guardado exitosamente`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('[AddExpense] Error al guardar gasto:', error);
      Alert.alert(
        'Error',
        'No se pudo guardar el gasto. Intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleScanReceipt = async () => {
    try {
      // Mostrar opciones de cámara/galería
      const image = await showImagePickerOptions();

      if (!image) {
        return; // Usuario canceló
      }

      setIsScanning(true);

      // Escanear recibo con el backend usando el proyecto seleccionado
      if (!selectedProject) {
        Alert.alert('Error', 'Por favor selecciona un proyecto primero');
        setIsScanning(false);
        return;
      }

      const response = await ocrService.scanAndCreateExpense(image.uri, selectedProject.id);

      console.log('[OCR] Respuesta:', response);

      if (response.success && response.ocr_data) {
        const extracted = response.ocr_data.extracted;

        // Prellenar formulario con datos extraídos
        if (extracted.total_amount) {
          setAmount(extracted.total_amount.toString());
        }

        if (extracted.merchant_name) {
          setDescription(extracted.merchant_name);
        }

        if (extracted.date) {
          // Convertir fecha ISO a formato dd/mm/yyyy
          const dateObj = new Date(extracted.date);
          const formattedDate = dateObj.toLocaleDateString('es-MX');
          setDate(formattedDate);
        }

        // Buscar categoría sugerida en las categorías cargadas desde Supabase
        const suggestedCategory = response.ocr_data.suggested_category;
        if (suggestedCategory && suggestedCategory !== 'Sin categoría' && suggestedCategory !== 'Otros') {
          const category = categories.find(c => c.name === suggestedCategory);
          if (category) {
            setSelectedCategory(category);
          }
        }

        // Agregar imagen del recibo
        handleAddReceipt(image.uri);

        // Guardar datos OCR para referencia
        setOcrData(response.ocr_data);

        // Mostrar información del escaneo
        Alert.alert(
          'Recibo Escaneado',
          `Se detectó:\n\n` +
          `💰 Monto: ${extracted.total_amount ? formatCurrency(extracted.total_amount, 'MXN') : 'No detectado'}\n` +
          `🏪 Comercio: ${extracted.merchant_name || 'No detectado'}\n` +
          `📅 Fecha: ${extracted.receipt_date || 'No detectada'}\n\n` +
          `${response.ocr_data.rfc_validation?.valid ? '✅ RFC válido' : '⚠️ Sin RFC'}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('[AddExpense] Error al escanear:', error);
      Alert.alert(
        'Error al Escanear',
        error.message || 'No se pudo escanear el recibo. Intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddReceipt = (uri) => {
    const newReceipt = {
      id: Date.now().toString(),
      uri,
      createdAt: new Date().toISOString(),
    };
    setReceipts(prev => [...prev, newReceipt]);
  };

  const handleRemoveReceipt = (receipt, index) => {
    Alert.alert(
      'Eliminar Recibo',
      '¿Estás seguro de que deseas eliminar este recibo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setReceipts(prev => prev.filter((_, i) => i !== index)),
        },
      ]
    );
  };

  const handleViewReceipt = (receipt) => {
    setViewingReceipt(receipt);
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
            rightIcon={isScanning ? null : "camera-outline"}
            onRightPress={isScanning ? null : handleScanReceipt}
            rightElement={isScanning ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : null}
          />

          {/* Loading State */}
          {isLoadingData ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={[TYPOGRAPHY.body, { marginTop: SPACING.md, color: COLORS.textSecondary }]}>
                Cargando datos...
              </Text>
            </View>
          ) : (
            <>
              {/* Scanning Indicator */}
              {isScanning && (
                <View style={styles.scanningBanner}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={[TYPOGRAPHY.body, { marginLeft: SPACING.md, color: COLORS.primary }]}>
                    Escaneando recibo...
                  </Text>
                </View>
              )}

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
              {categories.map((category) => (
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
              {projects.map((project) => (
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

          {/* Receipts */}
          <View style={styles.section}>
            <ReceiptGallery
              receipts={receipts}
              onAddReceipt={handleAddReceipt}
              onRemoveReceipt={handleRemoveReceipt}
              onViewReceipt={handleViewReceipt}
              label="Recibos (opcional)"
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
              (!amount || !selectedCategory || isSaving) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!amount || !selectedCategory || isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <>
                <ActivityIndicator size="small" color={COLORS.white} style={{ marginRight: SPACING.sm }} />
                <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.white }]}>
                  Guardando...
                </Text>
              </>
            ) : (
              <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.white }]}>
                Guardar Gasto
              </Text>
            )}
          </TouchableOpacity>

              {/* Bottom padding for tab bar */}
              <View style={styles.bottomPadding} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Receipt Viewer Modal */}
      <ReceiptViewer
        visible={!!viewingReceipt}
        receipt={viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        onDelete={(receipt) => {
          const index = receipts.findIndex(r => r.id === receipt.id);
          if (index !== -1) {
            setReceipts(prev => prev.filter((_, i) => i !== index));
          }
        }}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  scanningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.primaryAlpha10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
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
    justifyContent: 'center',
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
