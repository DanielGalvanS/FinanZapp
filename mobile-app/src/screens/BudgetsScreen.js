import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  ICON_SIZE,
  LAYOUT,
} from '../constants';
import { Header } from '../components/ui';
import { BudgetCard } from '../components/insights';

// Datos de ejemplo
import useDataStore from '../store/dataStore';
import useExpenseStore from '../store/expenseStore';
import { useEffect } from 'react';

export default function BudgetsScreen() {
  const router = useRouter();
  const budgets = useDataStore((state) => state.budgets);
  const loadBudgets = useDataStore((state) => state.loadBudgets);
  const expenses = useExpenseStore((state) => state.expenses);
  const loadExpenses = useExpenseStore((state) => state.loadExpenses);

  useEffect(() => {
    loadBudgets();
    loadExpenses();
  }, []);

  // Calcular gastos por categoría para el período actual (mes)
  const spentByCategory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryTotals = {};

    console.log('[Budgets] Total expenses:', expenses.length);
    console.log('[Budgets] Current month:', currentMonth + 1, 'Year:', currentYear);

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      // Filtrar solo gastos del mes actual
      if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
        const categoryId = expense.category_id;
        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = 0;
        }
        categoryTotals[categoryId] += parseFloat(expense.amount) || 0;
      }
    });

    console.log('[Budgets] Category totals:', categoryTotals);
    return categoryTotals;
  }, [expenses]);

  // Presupuestos con gastos calculados dinámicamente
  const budgetsWithSpent = useMemo(() => {
    console.log('[Budgets] Budgets:', budgets.map(b => ({ id: b.id, categoryId: b.category?.id, categoryName: b.category?.name })));
    return budgets.map(budget => {
      const spent = spentByCategory[budget.category?.id] || 0;
      console.log('[Budgets] Budget category:', budget.category?.id, 'spent:', spent);
      return {
        ...budget,
        spent: spent,
      };
    });
  }, [budgets, spentByCategory]);

  const handleBack = () => {
    router.back();
  };

  const handleCreateBudget = () => {
    router.push('/create-budget');
  };

  const handleBudgetPress = (budget) => {
    router.push(`/edit-budget/${budget.id}`);
  };

  const getTotalSpent = () => {
    return budgetsWithSpent.reduce((sum, budget) => sum + budget.spent, 0);
  };

  const getTotalBudget = () => {
    return budgetsWithSpent.reduce((sum, budget) => sum + budget.total, 0);
  };

  const getOverallPercentage = () => {
    const total = getTotalBudget();
    const spent = getTotalSpent();
    return total > 0 ? Math.round((spent / total) * 100) : 0;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Presupuestos"
        onBack={handleBack}
        rightIcon="add"
        onRightPress={handleCreateBudget}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Card */}
        <View style={LAYOUT.section}>
          <View style={styles.summaryCard}>
            <Text style={[TYPOGRAPHY.caption, styles.summaryLabel]}>
              Total Presupuestado
            </Text>
            <Text style={[TYPOGRAPHY.h2, styles.summaryAmount]}>
              ${getTotalBudget().toLocaleString('es-MX')}
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStatItem}>
                <Text style={[TYPOGRAPHY.caption, styles.summaryStatLabel]}>
                  Gastado
                </Text>
                <Text style={[TYPOGRAPHY.bodyBold, styles.summaryStatValue]}>
                  ${getTotalSpent().toLocaleString('es-MX')}
                </Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={[TYPOGRAPHY.caption, styles.summaryStatLabel]}>
                  Disponible
                </Text>
                <Text style={[TYPOGRAPHY.bodyBold, styles.summaryStatValue]}>
                  ${(getTotalBudget() - getTotalSpent()).toLocaleString('es-MX')}
                </Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={[TYPOGRAPHY.caption, styles.summaryStatLabel]}>
                  Uso
                </Text>
                <Text style={[TYPOGRAPHY.bodyBold, styles.summaryStatValue]}>
                  {getOverallPercentage()}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Budgets List */}
        <View style={LAYOUT.section}>
          <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>
            Mis Presupuestos ({budgetsWithSpent.length})
          </Text>

          {budgetsWithSpent.length > 0 ? (
            budgetsWithSpent.map((budget) => (
              <TouchableOpacity
                key={budget.id}
                onPress={() => handleBudgetPress(budget)}
                activeOpacity={0.7}
              >
                <BudgetCard
                  name={budget.category?.name || 'Sin categoría'}
                  spent={budget.spent}
                  total={budget.total}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={64} color={COLORS.textSecondary} />
              <Text style={[TYPOGRAPHY.h3, styles.emptyTitle]}>
                No hay presupuestos
              </Text>
              <Text style={[TYPOGRAPHY.body, styles.emptyText]}>
                Crea tu primer presupuesto para controlar tus gastos
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleCreateBudget}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={ICON_SIZE.sm} color={COLORS.white} />
                <Text style={[TYPOGRAPHY.bodyBold, styles.emptyButtonText]}>
                  Crear Presupuesto
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Padding */}
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
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  summaryCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: SPACING.xl,
  },
  summaryLabel: {
    color: COLORS.white,
    opacity: 0.8,
    fontWeight: '500',
  },
  summaryAmount: {
    color: COLORS.white,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  summaryStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  summaryStatItem: {
    flex: 1,
  },
  summaryStatLabel: {
    color: COLORS.white,
    opacity: 0.7,
    marginBottom: SPACING.xs,
  },
  summaryStatValue: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: COLORS.white,
  },
  bottomPadding: {
    height: 40,
  },
});
