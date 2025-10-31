import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';

const FILTER_OPTIONS = ['Todo', 'Comida', 'Transporte', 'Entretenimiento', 'Compras'];

const TRANSACTIONS_DATA = [
  { id: 1, name: 'Uber', category: 'Transporte', amount: -120, date: '27/10/2025', time: '14:30', icon: '🚗', project: 'Personal' },
  { id: 2, name: 'Oxxo', category: 'Comida', amount: -85.50, date: '27/10/2025', time: '12:15', icon: '🍔', project: 'Personal' },
  { id: 3, name: 'Netflix', category: 'Entretenimiento', amount: -199, date: '26/10/2025', time: '08:00', icon: '🎮', project: 'Personal' },
  { id: 4, name: 'Amazon', category: 'Compras', amount: -1250, date: '26/10/2025', time: '16:45', icon: '🛍️', project: 'Personal' },
  { id: 5, name: 'Starbucks', category: 'Comida', amount: -145, date: '25/10/2025', time: '09:30', icon: '🍔', project: 'Personal' },
  { id: 6, name: 'Gasolina', category: 'Transporte', amount: -800, date: '24/10/2025', time: '18:00', icon: '🚗', project: 'Personal' },
  { id: 7, name: 'Restaurante', category: 'Comida', amount: -450, date: '23/10/2025', time: '20:30', icon: '🍔', project: 'Personal' },
  { id: 8, name: 'Cine', category: 'Entretenimiento', amount: -280, date: '22/10/2025', time: '19:00', icon: '🎮', project: 'Personal' },
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
          <Text style={styles.title}>Gastos</Text>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportIcon}>📊</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total del Mes</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(42330)}</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Transacciones</Text>
              <Text style={styles.summaryStatValue}>128</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Promedio</Text>
              <Text style={styles.summaryStatValue}>{formatCurrency(330)}</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar transacciones..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTER_OPTIONS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                selectedFilter === filter && styles.filterPillActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>
              {filteredTransactions.length} Transacciones
            </Text>
            <Text style={styles.transactionsTotal}>
              {formatCurrency(totalExpenses)}
            </Text>
          </View>

          {filteredTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              activeOpacity={0.7}
              onPress={() => handleTransactionPress(transaction.id)}
            >
              <View style={styles.transactionLeft}>
                <View style={styles.transactionIcon}>
                  <Text style={styles.transactionEmoji}>{transaction.icon}</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={styles.transactionMeta}>
                    {transaction.category} • {transaction.time}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>
                  -{formatCurrency(transaction.amount)}
                </Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportIcon: {
    fontSize: 20,
  },
  summaryCard: {
    backgroundColor: COLORS.gray900,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 24,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.7,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 8,
    letterSpacing: -1,
  },
  summaryStats: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  summaryStatItem: {
    flex: 1,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.6,
    fontWeight: '500',
  },
  summaryStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.textSecondary,
    paddingLeft: 8,
  },
  filtersScroll: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  filterTextActive: {
    color: COLORS.black,
  },
  transactionsContainer: {
    paddingHorizontal: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  transactionsTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  transactionMeta: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
});
