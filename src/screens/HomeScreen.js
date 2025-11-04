import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// Datos de ejemplo
const SPENDING_CATEGORIES = [
  { id: 1, name: 'Comida', amount: 12450, icon: 'restaurant-outline', color: '#FF6B6B', percentage: 30 },
  { id: 2, name: 'Transporte', amount: 8320, icon: 'car-outline', color: '#4ECDC4', percentage: 20 },
  { id: 3, name: 'Entretenimiento', amount: 5670, icon: 'game-controller-outline', color: '#95E1D3', percentage: 14 },
  { id: 4, name: 'Compras', amount: 15890, icon: 'cart-outline', color: '#F38181', percentage: 36 },
];

const RECENT_TRANSACTIONS = [
  { id: 1, name: 'Uber', category: 'Transporte', amount: -120, date: '27/10/2025', icon: 'car-outline', color: '#4ECDC4' },
  { id: 2, name: 'Oxxo', category: 'Comida', amount: -85.50, date: '27/10/2025', icon: 'restaurant-outline', color: '#FF6B6B' },
  { id: 3, name: 'Netflix', category: 'Entretenimiento', amount: -199, date: '26/10/2025', icon: 'game-controller-outline', color: '#95E1D3' },
  { id: 4, name: 'Amazon', category: 'Compras', amount: -1250, date: '26/10/2025', icon: 'cart-outline', color: '#F38181' },
  { id: 5, name: 'Starbucks', category: 'Comida', amount: -145, date: '25/10/2025', icon: 'restaurant-outline', color: '#FF6B6B' },
];

const PERIODS = [
  { id: 'month', label: 'Este Mes' },
  { id: 'last-month', label: 'Mes Pasado' },
  { id: 'year', label: 'Este Año' },
];

const QUICK_ACTIONS = [
  { id: 'add', label: 'Agregar', icon: 'add-circle-outline', color: '#C8FF00', route: '/add-expense' },
  { id: 'scan', label: 'Escanear', icon: 'camera-outline', color: '#4ECDC4', route: null },
  { id: 'insights', label: 'Análisis', icon: 'stats-chart-outline', color: null, route: '/insights' },
  { id: 'cards', label: 'Tarjetas', icon: 'card-outline', color: null, route: '/cards' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(Math.abs(amount));
  };

  const handleTransactionPress = (transactionId) => {
    router.push(`/expense-detail/${transactionId}`);
  };

  const handleQuickAction = (action) => {
    if (action.route) {
      router.push(action.route);
    } else {
      console.log('Quick action:', action.id);
    }
  };

  const handleViewAllExpenses = () => {
    router.push('/expenses');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, Bienvenido</Text>
            <Text style={styles.name}>Leon Fernandez</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {PERIODS.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.id && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance Total</Text>
          <Text style={styles.balanceAmount}>$651,972.00</Text>
          <Text style={styles.balanceCurrency}>MXN</Text>

          <View style={styles.balanceStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Ingresos</Text>
              <Text style={styles.statAmount}>+$85,420</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Gastos</Text>
              <Text style={styles.statAmount}>-$42,330</Text>
            </View>
          </View>

          {/* Comparison */}
          <View style={styles.comparisonContainer}>
            <Text style={styles.comparisonText}>↓ 12% menos que el mes pasado</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => handleQuickAction(action)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, action.color && { backgroundColor: action.color }]}>
                <Ionicons
                  name={action.icon}
                  size={28}
                  color={action.color ? COLORS.black : COLORS.text}
                />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Resumen de Gastos</Text>
            <TouchableOpacity onPress={handleViewAllExpenses}>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesContainer}>
            {SPENDING_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                activeOpacity={0.7}
              >
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryIconSmall, { backgroundColor: category.color + '20' }]}>
                    <Ionicons name={category.icon} size={24} color={category.color} />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryNameLarge}>{category.name}</Text>
                    <Text style={styles.categoryPercentage}>{category.percentage}% del total</Text>
                  </View>
                </View>
                <Text style={styles.categoryAmountLarge}>{formatCurrency(category.amount)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
            <TouchableOpacity onPress={handleViewAllExpenses}>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {RECENT_TRANSACTIONS.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              activeOpacity={0.7}
              onPress={() => handleTransactionPress(transaction.id)}
            >
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon, { backgroundColor: transaction.color + '20' }]}>
                  <Ionicons name={transaction.icon} size={22} color={transaction.color} />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={[
                  styles.transactionAmount,
                  transaction.amount < 0 ? styles.expenseAmount : styles.incomeAmount
                ]}>
                  {transaction.amount < 0 ? '-' : '+'}{formatCurrency(transaction.amount)}
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
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  periodButtonTextActive: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.black,
    opacity: 0.7,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 8,
    letterSpacing: -1,
  },
  balanceCurrency: {
    fontSize: 16,
    color: COLORS.black,
    opacity: 0.7,
    marginTop: 4,
    fontWeight: '600',
  },
  balanceStats: {
    flexDirection: 'row',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.black,
    opacity: 0.6,
    fontWeight: '500',
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 16,
  },
  comparisonContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  comparisonText: {
    fontSize: 13,
    color: COLORS.black,
    opacity: 0.7,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryNameLarge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  categoryPercentage: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  categoryAmountLarge: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  transactionCategory: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expenseAmount: {
    color: COLORS.error,
  },
  incomeAmount: {
    color: COLORS.success,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
});
