import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { formatCurrency } from '../utils/formatters';
import { ReceiptGallery, ReceiptViewer } from '../components/receipts';
import { CommentInput } from '../components/comments';
import useExpenseStore from '../store/expenseStore';
import useDataStore from '../store/dataStore';
import dataService from '../services/dataService';

// Datos de ejemplo - En producción vendrían como parámetros de navegación
const EXPENSE_DATA = {
  id: '1',
  name: 'Uber a la oficina',
  amount: 120.50,
  category: { name: 'Transporte', icon: 'car-outline', color: '#4ECDC4' },
  project: { name: 'Renta Depa', id: 'renta-depa' },
  date: '27/10/2025',
  time: '14:30',
  description: 'Viaje del hogar a la oficina en la mañana. Tráfico pesado en Insurgentes.',
  receipts: [],
  createdBy: {
    id: '1',
    name: 'Leon Fernandez',
  },
  createdAt: '27/10/2025 14:35',
  isSharedProject: true,
  comments: [
    {
      id: 1,
      user: { id: '2', name: 'Juan Pérez', avatar: null },
      userId: '2',
      text: '¿Esto incluye propina?',
      time: '14:40',
      createdAt: '2025-10-27T14:40:00',
    },
    {
      id: 2,
      user: { id: '1', name: 'Leon Fernandez', avatar: null },
      userId: '1',
      text: 'Sí, ya incluye propina',
      time: '14:42',
      createdAt: '2025-10-27T14:42:00',
    },
  ],
};

export default function ExpenseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const getExpenseById = useExpenseStore((state) => state.getExpenseById);
  const updateExpense = useExpenseStore((state) => state.updateExpense);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const addComment = useExpenseStore((state) => state.addComment);
  const deleteComment = useExpenseStore((state) => state.deleteComment);
  const categories = useDataStore((state) => state.categories);

  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  // Intentar cargar expense desde store o Supabase
  useEffect(() => {
    loadExpense();
  }, [id]);

  const loadExpense = async () => {
    try {
      setIsLoading(true);

      // Primero intentar del store local
      const expenseFromStore = getExpenseById(id);

      if (expenseFromStore) {
        console.log('[ExpenseDetail] Expense encontrado en store:', expenseFromStore);
        setExpense(expenseFromStore);
        setIsLoading(false);
        return;
      }

      // Si no está en el store, cargar desde Supabase
      console.log('[ExpenseDetail] Cargando expense desde Supabase, ID:', id);
      const expenses = await dataService.getExpenses();
      const foundExpense = expenses.find(exp => exp.id === id);

      if (foundExpense) {
        // Transformar a formato que usa la app
        const category = categories.find(cat => cat.id === foundExpense.category_id);
        const expenseFormatted = {
          id: foundExpense.id,
          name: foundExpense.name,
          amount: foundExpense.amount,
          categoryId: foundExpense.category_id,
          categoryName: category?.name || 'Sin categoría',
          categoryIcon: category?.icon || 'pricetag-outline',
          categoryColor: category?.color || COLORS.textSecondary,
          category: category ? {
            name: category.name,
            icon: category.icon,
            color: category.color,
          } : null,
          projectId: foundExpense.project_id,
          description: foundExpense.description,
          date: foundExpense.date,
          receipts: foundExpense.receipts || [],
          comments: foundExpense.comments || [],
        };

        console.log('[ExpenseDetail] Expense cargado desde Supabase:', expenseFormatted);
        setExpense(expenseFormatted);
      } else {
        console.warn('[ExpenseDetail] Expense no encontrado:', id);
        setExpense(null);
      }
    } catch (error) {
      console.error('[ExpenseDetail] Error al cargar expense:', error);
      setExpense(null);
    } finally {
      setIsLoading(false);
    }
  };

  const [mentionUser, setMentionUser] = useState(null);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    console.log('Edit expense:', expense.id);
    router.push(`/edit-expense/${expense.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Gasto',
      '¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteExpense(expense.id);
            Alert.alert('Gasto Eliminado', 'El gasto ha sido eliminado exitosamente');
            router.back();
          },
        },
      ]
    );
  };

  const handleDuplicate = () => {
    console.log('Duplicate expense:', expense.id);
    Alert.alert('Duplicar', 'Gasto duplicado exitosamente');
  };

  const handleShare = () => {
    console.log('Share expense:', expense.id);
    Alert.alert('Compartir', 'Funcionalidad de compartir');
  };

  const handleSendComment = (text) => {
    const newComment = {
      user: { id: '1', name: 'Leon Fernandez', avatar: null },
      userId: '1',
      text: mentionUser ? `@${mentionUser.name} ${text}` : text,
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    };

    addComment(expense.id, newComment);
    setMentionUser(null);
  };

  const handleDeleteComment = (comment) => {
    Alert.alert(
      'Eliminar Comentario',
      '¿Estás seguro de que deseas eliminar este comentario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteComment(expense.id, comment.id);
          },
        },
      ]
    );
  };

  const handleMentionUser = (user) => {
    setMentionUser(user);
  };

  const handleAddReceipt = (uri) => {
    const newReceipt = {
      id: Date.now().toString(),
      uri,
      createdAt: new Date().toISOString(),
    };
    updateExpense(expense.id, {
      receipts: [...(expense.receipts || []), newReceipt],
    });
  };

  const handleRemoveReceipt = (receipt) => {
    Alert.alert(
      'Eliminar Recibo',
      '¿Estás seguro de que deseas eliminar este recibo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            updateExpense(expense.id, {
              receipts: expense.receipts.filter(r => r.id !== receipt.id),
            });
          },
        },
      ]
    );
  };

  const handleViewReceipt = (receipt) => {
    setViewingReceipt(receipt);
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Gasto</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.infoValue, { marginTop: 16, color: COLORS.textSecondary }]}>
            Cargando detalles...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar error si no se encuentra
  if (!expense) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Gasto</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.textTertiary} />
          <Text style={[styles.amount, { fontSize: 20, marginTop: 16 }]}>
            Gasto no encontrado
          </Text>
          <Text style={[styles.infoValue, { marginTop: 8, color: COLORS.textSecondary }]}>
            No se pudo cargar la información del gasto
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Gasto</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Monto</Text>
          <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
          <Text style={styles.currency}>MXN</Text>
        </View>

        {/* Expense Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{expense.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoría</Text>
              {expense.category ? (
                <View style={styles.categoryBadge}>
                  <View style={[styles.categoryIcon, { backgroundColor: expense.category.color + '20' }]}>
                    <Ionicons name={expense.category.icon} size={18} color={expense.category.color} />
                  </View>
                  <Text style={styles.categoryName}>{expense.category.name}</Text>
                </View>
              ) : (
                <Text style={styles.infoValue}>Sin categoría</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Proyecto</Text>
              <Text style={styles.infoValue}>{expense.project?.name || 'Sin proyecto'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{expense.date} • {expense.time}</Text>
            </View>

            {expense.description && (
              <View style={[styles.infoRow, styles.infoRowColumn]}>
                <Text style={styles.infoLabel}>Descripción</Text>
                <Text style={styles.descriptionText}>{expense.description}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Receipts */}
        <View style={styles.section}>
          <ReceiptGallery
            receipts={expense.receipts}
            onAddReceipt={handleAddReceipt}
            onRemoveReceipt={handleRemoveReceipt}
            onViewReceipt={handleViewReceipt}
            label="Recibos"
            editable={true}
          />
        </View>

        {/* Created By (Solo si es proyecto compartido) */}
        {expense.isSharedProject && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Creado Por</Text>
            <View style={styles.creatorCard}>
              <Text style={styles.creatorAvatar}>{expense.createdBy.avatar}</Text>
              <View style={styles.creatorInfo}>
                <Text style={styles.creatorName}>{expense.createdBy.name}</Text>
                <Text style={styles.createdDate}>{expense.createdAt}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Comments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comentarios ({expense.comments.length})</Text>

          <View style={styles.commentsContainer}>
            {expense.comments.map((comment) => {
              const CommentItemComponent = require('../components/comments').CommentItem;
              return (
                <CommentItemComponent
                  key={comment.id}
                  comment={comment}
                  currentUserId="1"
                  onDelete={handleDeleteComment}
                  onMention={handleMentionUser}
                />
              );
            })}

            {expense.comments.length === 0 && (
              <Text style={styles.noCommentsText}>
                No hay comentarios aún. Sé el primero en comentar.
              </Text>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color={COLORS.text} />
            <Text style={styles.actionLabel}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDuplicate}>
            <Ionicons name="copy-outline" size={20} color={COLORS.text} />
            <Text style={styles.actionLabel}>Duplicar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={COLORS.text} />
            <Text style={styles.actionLabel}>Compartir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.actionButtonDanger]} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            <Text style={[styles.actionLabel, styles.actionLabelDanger]}>Eliminar</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Comment Input - Fixed at bottom */}
      {expense.isSharedProject && (
        <CommentInput
          onSend={handleSendComment}
          mentionUser={mentionUser}
          onClearMention={() => setMentionUser(null)}
        />
      )}
    </KeyboardAvoidingView>

      {/* Receipt Viewer Modal */}
      <ReceiptViewer
        visible={!!viewingReceipt}
        receipt={viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        onDelete={(receipt) => {
          const index = expense.receipts.findIndex(r => r.id === receipt.id);
          if (index !== -1) {
            setExpense(prev => ({
              ...prev,
              receipts: prev.receipts.filter((_, i) => i !== index),
            }));
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
  commentsContainer: {
    paddingTop: 8,
  },
  noCommentsText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    paddingVertical: 24,
    fontStyle: 'italic',
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
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  amountCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: COLORS.black,
    opacity: 0.7,
    fontWeight: '500',
    marginBottom: 8,
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.black,
    letterSpacing: -2,
  },
  currency: {
    fontSize: 16,
    color: COLORS.black,
    opacity: 0.7,
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  infoRowColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  descriptionText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    marginTop: 8,
  },
  receiptCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  addReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderStyle: 'dashed',
  },
  addReceiptIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  addReceiptText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    padding: 16,
  },
  creatorAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  commentsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  commentTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  commentText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  commentInput: {
    flex: 1,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  sendIcon: {
    fontSize: 18,
    color: COLORS.black,
  },
  actionsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  actionButtonDanger: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.white,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionLabelDanger: {
    color: COLORS.error,
  },
  bottomPadding: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
});
