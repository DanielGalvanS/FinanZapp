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
  SHADOWS,
  CARD_STYLES,
  BUTTON_STYLES,
  ICON_SIZE,
  LAYOUT,
} from '../constants';

// Datos de ejemplo
const SPENDING_CATEGORIES = [
  { id: 1, name: 'Comida', amount: 12450, icon: 'restaurant-outline', color: COLORS.categoryFood, percentage: 30 },
  { id: 2, name: 'Transporte', amount: 8320, icon: 'car-outline', color: COLORS.categoryTransport, percentage: 20 },
  { id: 3, name: 'Entretenimiento', amount: 5670, icon: 'game-controller-outline', color: COLORS.categoryEntertainment, percentage: 14 },
  { id: 4, name: 'Compras', amount: 15890, icon: 'cart-outline', color: COLORS.categoryShopping, percentage: 36 },
];

const RECENT_TRANSACTIONS = [
  { id: 1, name: 'Uber', category: 'Transporte', amount: -120, date: '27/10/2025', icon: 'car-outline', color: COLORS.categoryTransport },
  { id: 2, name: 'Oxxo', category: 'Comida', amount: -85.50, date: '27/10/2025', icon: 'restaurant-outline', color: COLORS.categoryFood },
  { id: 3, name: 'Netflix', category: 'Entretenimiento', amount: -199, date: '26/10/2025', icon: 'game-controller-outline', color: COLORS.categoryEntertainment },
  { id: 4, name: 'Amazon', category: 'Compras', amount: -1250, date: '26/10/2025', icon: 'cart-outline', color: COLORS.categoryShopping },
  { id: 5, name: 'Starbucks', category: 'Comida', amount: -145, date: '25/10/2025', icon: 'restaurant-outline', color: COLORS.categoryFood },
];

const PERIODS = [
  { id: 'month', label: 'Este Mes' },
  { id: 'last-month', label: 'Mes Pasado' },
  { id: 'year', label: 'Este Año' },
];

const QUICK_ACTIONS = [
  { id: 'add', label: 'Agregar', icon: 'add-circle-outline', route: '/add-expense' },
  { id: 'scan', label: 'Escanear', icon: 'camera-outline', route: null },
  { id: 'insights', label: 'Análisis', icon: 'stats-chart-outline', route: '/insights' },
  { id: 'cards', label: 'Tarjetas', icon: 'card-outline', route: '/cards' },
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
    }
  };

  const handleViewAllExpenses = () => {
    router.push('/expenses');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
              Hola, Bienvenido
            </Text>
            <Text style={[TYPOGRAPHY.h3, { marginTop: SPACING.xs }]}>
              Leon Fernandez
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={ICON_SIZE.md} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {PERIODS.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                selectedPeriod === period.id ? BUTTON_STYLES.pillActive : BUTTON_STYLES.pill,
                styles.periodButton,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  {
                    color: selectedPeriod === period.id ? COLORS.white : COLORS.textSecondary,
                    fontWeight: selectedPeriod === period.id ? '700' : '500',
                  },
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Balance Card - Dark Elegant Style */}
        <View style={[CARD_STYLES.dark, styles.balanceCard]}>
          <Text style={[TYPOGRAPHY.caption, styles.balanceLabel]}>
            Balance Total
          </Text>
          <Text style={[TYPOGRAPHY.h1, styles.balanceAmount]}>
            $651,972.00
          </Text>
          <Text style={[TYPOGRAPHY.caption, styles.balanceCurrency]}>
            MXN
          </Text>

          <View style={styles.balanceStats}>
            <View style={styles.statItem}>
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>Ingresos</Text>
              <Text style={[TYPOGRAPHY.h4, styles.statAmount]}>+$85,420</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>Gastos</Text>
              <Text style={[TYPOGRAPHY.h4, styles.statAmount]}>-$42,330</Text>
            </View>
          </View>

          <View style={styles.comparisonContainer}>
            <Ionicons name="trending-down" size={ICON_SIZE.sm} color={COLORS.white} />
            <Text style={[TYPOGRAPHY.caption, styles.comparisonText]}>
              12% menos que el mes pasado
            </Text>
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
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon} size={ICON_SIZE.lg} color={COLORS.text} />
              </View>
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.text, fontWeight: '600' }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spending Categories Section */}
        <View style={LAYOUT.section}>
          <View style={LAYOUT.sectionHeader}>
            <Text style={TYPOGRAPHY.h3}>Resumen de Gastos</Text>
            <TouchableOpacity onPress={handleViewAllExpenses} activeOpacity={0.7}>
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.primary, fontWeight: '600' }]}>
                Ver todo
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesContainer}>
            {SPENDING_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[CARD_STYLES.minimal, styles.categoryCard]}
                activeOpacity={0.7}
              >
                <View style={LAYOUT.row}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <Ionicons name={category.icon} size={ICON_SIZE.md} color={category.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={TYPOGRAPHY.bodyBold}>{category.name}</Text>
                    <Text style={[TYPOGRAPHY.caption, { marginTop: SPACING.xs }]}>
                      {category.percentage}% del total
                    </Text>
                  </View>
                  <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.text }]}>
                    {formatCurrency(category.amount)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions Section */}
        <View style={LAYOUT.section}>
          <View style={LAYOUT.sectionHeader}>
            <Text style={TYPOGRAPHY.h3}>Transacciones Recientes</Text>
            <TouchableOpacity onPress={handleViewAllExpenses} activeOpacity={0.7}>
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.primary, fontWeight: '600' }]}>
                Ver todo
              </Text>
            </TouchableOpacity>
          </View>

          {RECENT_TRANSACTIONS.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={[CARD_STYLES.minimal, styles.transactionCard]}
              activeOpacity={0.7}
              onPress={() => handleTransactionPress(transaction.id)}
            >
              <View style={LAYOUT.rowBetween}>
                <View style={LAYOUT.row}>
                  <View style={[styles.transactionIcon, { backgroundColor: transaction.color + '20' }]}>
                    <Ionicons name={transaction.icon} size={ICON_SIZE.md} color={transaction.color} />
                  </View>
                  <View style={{ marginLeft: SPACING.md }}>
                    <Text style={TYPOGRAPHY.bodyBold}>{transaction.name}</Text>
                    <Text style={[TYPOGRAPHY.caption, { marginTop: 2 }]}>
                      {transaction.category}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.error }]}>
                    {transaction.amount < 0 ? '-' : '+'}{formatCurrency(transaction.amount)}
                  </Text>
                  <Text style={[TYPOGRAPHY.tiny, { marginTop: 2 }]}>
                    {transaction.date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
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
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  periodButton: {
    flex: 1,
  },
  balanceCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  balanceLabel: {
    color: COLORS.white,
    opacity: 0.7,
    fontWeight: '500',
  },
  balanceAmount: {
    color: COLORS.white,
    marginTop: SPACING.sm,
    letterSpacing: -2,
  },
  balanceCurrency: {
    color: COLORS.white,
    opacity: 0.7,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  balanceStats: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: COLORS.white,
    opacity: 0.6,
    fontWeight: '500',
  },
  statAmount: {
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: SPACING.lg,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  comparisonText: {
    color: COLORS.white,
    opacity: 0.7,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxxl,
    gap: SPACING.md,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    gap: SPACING.md,
  },
  categoryCard: {
    marginBottom: 0,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionCard: {
    marginBottom: SPACING.md,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
