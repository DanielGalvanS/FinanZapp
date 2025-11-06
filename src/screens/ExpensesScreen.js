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

const FILTER_OPTIONS = ['Todo', 'Comida', 'Transporte', 'Entretenimiento', 'Compras'];

const TRANSACTIONS_DATA = [
  { id: 1, name: 'Uber', category: 'Transporte', amount: -120, date: '27/10/2025', time: '14:30', icon: 'car-outline', color: '#4ECDC4', project: 'Personal' },
  { id: 2, name: 'Oxxo', category: 'Comida', amount: -85.50, date: '27/10/2025', time: '12:15', icon: 'restaurant-outline', color: '#FF6B6B', project: 'Personal' },
  { id: 3, name: 'Netflix', category: 'Entretenimiento', amount: -199, date: '26/10/2025', time: '08:00', icon: 'game-controller-outline', color: '#95E1D3', project: 'Personal' },
  { id: 4, name: 'Amazon', category: 'Compras', amount: -1250, date: '26/10/2025', time: '16:45', icon: 'cart-outline', color: '#F38181', project: 'Personal' },
  { id: 5, name: 'Starbucks', category: 'Comida', amount: -145, date: '25/10/2025', time: '09:30', icon: 'restaurant-outline', color: '#FF6B6B', project: 'Personal' },
  { id: 6, name: 'Gasolina', category: 'Transporte', amount: -800, date: '24/10/2025', time: '18:00', icon: 'car-outline', color: '#4ECDC4', project: 'Personal' },
  { id: 7, name: 'Restaurante', category: 'Comida', amount: -450, date: '23/10/2025', time: '20:30', icon: 'restaurant-outline', color: '#FF6B6B', project: 'Personal' },
  { id: 8, name: 'Cine', category: 'Entretenimiento', amount: -280, date: '22/10/2025', time: '19:00', icon: 'game-controller-outline', color: '#95E1D3', project: 'Personal' },
];

export default function ExpensesScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(Math.abs(amount));
  };

  const handleTransactionPress = (transactionId) => {
    router.push(`/expense-detail/${transactionId}`);
  };

  const filteredTransactions = TRANSACTIONS_DATA.filter((transaction) => {
    const matchesFilter = selectedFilter === 'Todo' || transaction.category === selectedFilter;
    const matchesSearch = transaction.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalExpenses = filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

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
          <Text style={[TYPOGRAPHY.caption, styles.summaryLabel]}>Total del Mes</Text>
          <Text style={[TYPOGRAPHY.h1, styles.summaryAmount]}>{formatCurrency(42330)}</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={[TYPOGRAPHY.caption, styles.summaryStatLabel]}>Transacciones</Text>
              <Text style={[TYPOGRAPHY.lg, styles.summaryStatValue]}>128</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={[TYPOGRAPHY.caption, styles.summaryStatLabel]}>Promedio</Text>
              <Text style={[TYPOGRAPHY.lg, styles.summaryStatValue]}>{formatCurrency(330)}</Text>
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
              {formatCurrency(totalExpenses)}
            </Text>
          </View>

          {filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onPress={() => handleTransactionPress(transaction.id)}
              showTime={true}
            />
          ))}
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
  bottomPadding: {
    height: 100,
  },
});
