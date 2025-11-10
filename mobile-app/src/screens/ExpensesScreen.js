import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  CARD_STYLES,
  ICON_SIZE,
} from '../constants';
import { SearchBar, FilterPills } from '../components/ui';
import { TransactionCard } from '../components/transactions';
import useExpenseStore from '../store/expenseStore';
import { formatCurrency, formatDate } from '../utils/formatters';

const FILTER_OPTIONS = ['Todo', 'Comida', 'Transporte', 'Entretenimiento', 'Compras', 'Salud', 'Educación'];

const CATEGORY_COLORS = {
  'Comida': COLORS.categoryFood,
  'Transporte': COLORS.categoryTransport,
  'Entretenimiento': COLORS.categoryEntertainment,
  'Compras': COLORS.categoryShopping,
  'Salud': COLORS.categoryHealth,
  'Educación': COLORS.categoryEducation,
};

export default function ExpensesScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');

  // Obtener gastos del store
  const expenses = useExpenseStore((state) => state.expenses);

  const handleTransactionPress = (transactionId) => {
    router.push(`/expense-detail/${transactionId}`);
  };

  // Transformar expenses para el formato esperado por TransactionCard
  const transformedExpenses = expenses.map((expense) => ({
    id: expense.id,
    name: expense.name,
    category: expense.categoryName || 'Sin categoría',
    amount: -parseFloat(expense.amount),
    date: formatDate(expense.date, 'short'),
    time: new Date(expense.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    icon: expense.categoryIcon || 'cash-outline',
    color: CATEGORY_COLORS[expense.categoryName] || COLORS.textSecondary,
    project: expense.projectName || 'Personal',
  }));

  // Filtrar transacciones
  const filteredTransactions = transformedExpenses.filter((transaction) => {
    const matchesFilter = selectedFilter === 'Todo' || transaction.category === selectedFilter;
    const matchesSearch = transaction.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalExpenses = filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const averageExpense = filteredTransactions.length > 0 ? totalExpenses / filteredTransactions.length : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={TYPOGRAPHY.h2}>Gastos</Text>
          <TouchableOpacity style={styles.exportButton} activeOpacity={0.7}>
            <Ionicons name="bar-chart-outline" size={ICON_SIZE.sm} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={[CARD_STYLES.dark, styles.summaryCard]}>
          <Text style={[TYPOGRAPHY.caption, styles.summaryLabel]}>Total de Gastos</Text>
          <Text style={[TYPOGRAPHY.h1, styles.summaryAmount]}>{formatCurrency(totalExpenses, 'MXN')}</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={[TYPOGRAPHY.caption, styles.summaryStatLabel]}>Transacciones</Text>
              <Text style={[TYPOGRAPHY.lg, styles.summaryStatValue]}>{filteredTransactions.length}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={[TYPOGRAPHY.caption, styles.summaryStatLabel]}>Promedio</Text>
              <Text style={[TYPOGRAPHY.lg, styles.summaryStatValue]}>{formatCurrency(averageExpense, 'MXN')}</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar transacciones..."
          style={styles.searchBar}
        />

        {/* Filter Pills */}
        <FilterPills
          options={FILTER_OPTIONS}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
          style={styles.filtersScroll}
        />

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={[TYPOGRAPHY.bodyBold, styles.transactionsTitle]}>
              {filteredTransactions.length} Transacciones
            </Text>
            <Text style={[TYPOGRAPHY.bodyBold, styles.transactionsTotal]}>
              {formatCurrency(totalExpenses, 'MXN')}
            </Text>
          </View>

          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction.id)}
                showTime={true}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color={COLORS.textSecondary} />
              <Text style={[TYPOGRAPHY.h3, styles.emptyTitle]}>
                No hay gastos
              </Text>
              <Text style={[TYPOGRAPHY.body, styles.emptyText]}>
                {searchQuery || selectedFilter !== 'Todo'
                  ? 'No se encontraron gastos con los filtros aplicados'
                  : 'Comienza agregando tu primer gasto'}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom padding for tab bar */}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  summaryLabel: {
    color: COLORS.white,
    opacity: 0.7,
    fontWeight: '500',
  },
  summaryAmount: {
    color: COLORS.white,
    marginTop: SPACING.sm,
    letterSpacing: -2,
  },
  summaryStats: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  summaryStatItem: {
    flex: 1,
  },
  summaryStatLabel: {
    color: COLORS.white,
    opacity: 0.6,
    fontWeight: '500',
  },
  summaryStatValue: {
    fontWeight: '700',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: SPACING.lg,
  },
  searchBar: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  filtersScroll: {
    marginBottom: SPACING.xl,
  },
  transactionsContainer: {
    paddingHorizontal: SPACING.xl,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  transactionsTitle: {
    color: COLORS.textSecondary,
  },
  transactionsTotal: {
    color: COLORS.text,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  bottomPadding: {
    height: 100,
  },
});
