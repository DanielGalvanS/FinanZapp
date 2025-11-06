import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { formatCurrency } from '../utils/formatters';

// Datos de ejemplo - En producción vendrían como parámetros de navegación
const EXPENSE_DATA = {
  id: '1',
  name: 'Uber a la oficina',
  amount: 120.50,
  category: { name: 'Transporte', icon: 'car-outline', color: '#4ECDC4' },
  project: { name: 'Personal', id: 'personal' },
  date: '27/10/2025',
  time: '14:30',
  description: 'Viaje del hogar a la oficina en la mañana. Tráfico pesado en Insurgentes.',
  receipt: null, // URL de la foto del ticket
  createdBy: {
    name: 'Leon Fernandez',
  },
  createdAt: '27/10/2025 14:35',
  isSharedProject: false,
  comments: [
    { id: 1, user: 'Juan Pérez', text: '¿Esto incluye propina?', time: '14:40' },
    { id: 2, user: 'Leon Fernandez', text: 'Sí, ya incluye propina', time: '14:42' },
  ],
};

export default function ExpenseDetailScreen() {
  const router = useRouter();
  const [commentText, setCommentText] = useState('');
  const [expense, setExpense] = useState(EXPENSE_DATA);

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
            console.log('Delete expense:', expense.id);
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

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: expense.comments.length + 1,
      user: 'Leon Fernandez',
      avatar: '👤',
      text: commentText,
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    };

    setExpense(prev => ({
      ...prev,
      comments: [...prev.comments, newComment],
    }));
    setCommentText('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
              <View style={styles.categoryBadge}>
                <View style={[styles.categoryIcon, { backgroundColor: expense.category.color + '20' }]}>
                  <Ionicons name={expense.category.icon} size={18} color={expense.category.color} />
                </View>
                <Text style={styles.categoryName}>{expense.category.name}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Proyecto</Text>
              <Text style={styles.infoValue}>{expense.project.name}</Text>
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

        {/* Receipt Photo */}
        {expense.receipt ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comprobante</Text>
            <TouchableOpacity style={styles.receiptCard}>
              <Image source={{ uri: expense.receipt }} style={styles.receiptImage} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <TouchableOpacity style={styles.addReceiptButton}>
              <Ionicons name="camera-outline" size={24} color={COLORS.textSecondary} />
              <Text style={styles.addReceiptText}>Agregar Comprobante</Text>
            </TouchableOpacity>
          </View>
        )}

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

          <View style={styles.commentsCard}>
            {expense.comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Text style={styles.commentAvatar}>{comment.avatar}</Text>
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                    <Text style={styles.commentTime}>{comment.time}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))}

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Agregar un comentario..."
                placeholderTextColor={COLORS.textSecondary}
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
                onPress={handleAddComment}
                disabled={!commentText.trim()}
              >
                <Ionicons name="send" size={18} color={COLORS.black} />
              </TouchableOpacity>
            </View>
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
});
