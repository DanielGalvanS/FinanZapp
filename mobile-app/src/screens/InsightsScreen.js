import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  ICON_SIZE,
  LAYOUT,
} from '../constants';
import { StatCard, BudgetCard, GoalCard } from '../components/insights';
import { LineChart, BarChart, PieChart } from '../components/charts';
import useDataStore from '../store/dataStore';
import useExpenseStore from '../store/expenseStore';
import { formatCurrency, formatDate } from '../utils/formatters';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PERIODS = [
  { id: 'week', label: 'Semana', icon: 'calendar-outline' },
  { id: 'month', label: 'Mes', icon: 'calendar' },
  { id: 'year', label: 'Año', icon: 'calendar-sharp' },
];



export default function InsightsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Store hooks
  const allExpenses = useExpenseStore((state) => state.expenses);
  const loadExpenses = useExpenseStore((state) => state.loadExpenses);

  // Data Store hooks
  const goals = useDataStore((state) => state.goals || []);
  const loadGoals = useDataStore((state) => state.loadGoals);
  const budgets = useDataStore((state) => state.budgets || []);
  const loadBudgets = useDataStore((state) => state.loadBudgets);
  const categories = useDataStore((state) => state.categories);
  const currentProject = useDataStore((state) => state.currentProject);
  const showAllProjects = useDataStore((state) => state.showAllProjects);

  // Filter expenses based on project selection - memoized to prevent infinite loops
  const expenses = useMemo(() => {
    return showAllProjects
      ? allExpenses
      : allExpenses.filter(e => e.project_id === currentProject?.id);
  }, [allExpenses, showAllProjects, currentProject?.id]);

  // Calcular gastos por categoría para el mes actual (para presupuestos)
  const spentByCategory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryTotals = {};

    allExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
        const categoryId = expense.category_id;
        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = 0;
        }
        categoryTotals[categoryId] += parseFloat(expense.amount) || 0;
      }
    });

    return categoryTotals;
  }, [allExpenses]);

  // Presupuestos con gastos calculados dinámicamente
  const budgetsWithSpent = useMemo(() => {
    return budgets.map(budget => ({
      ...budget,
      spent: spentByCategory[budget.category?.id] || 0,
    }));
  }, [budgets, spentByCategory]);

  // State for metrics
  const [periodTotal, setPeriodTotal] = useState(0);
  const [previousPeriodTotal, setPreviousPeriodTotal] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

  // Get date range based on selected period
  const getDateRange = useCallback((period, offset = 0) => {
    const now = new Date();
    let startDate, endDate;

    if (period === 'week') {
      // Get start of week (Monday)
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(now);
      startDate.setDate(now.getDate() - diffToMonday - (offset * 7));
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === 'month') {
      const year = now.getFullYear();
      const month = now.getMonth() - offset;
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
    } else if (period === 'year') {
      const year = now.getFullYear() - offset;
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    }

    return { startDate, endDate };
  }, []);

  const calculateMetrics = useCallback(() => {
    // Get current period range
    const { startDate: currentStart, endDate: currentEnd } = getDateRange(selectedPeriod, 0);
    // Get previous period range
    const { startDate: prevStart, endDate: prevEnd } = getDateRange(selectedPeriod, 1);

    // Filter expenses for current period
    const currentPeriodExpenses = expenses.filter(e => {
      const eDate = new Date(e.date);
      return eDate >= currentStart && eDate <= currentEnd;
    });
    const currentTotal = currentPeriodExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    // Filter expenses for previous period
    const previousPeriodExpenses = expenses.filter(e => {
      const eDate = new Date(e.date);
      return eDate >= prevStart && eDate <= prevEnd;
    });
    const prevTotal = previousPeriodExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    setPeriodTotal(currentTotal);
    setPreviousPeriodTotal(prevTotal);

    // Calculate category breakdown with category info from dataStore
    const breakdownMap = {};
    currentPeriodExpenses.forEach(expense => {
      const categoryId = expense.category_id || 'unknown';
      const category = categories.find(c => c.id === categoryId);

      if (!breakdownMap[categoryId]) {
        breakdownMap[categoryId] = {
          id: categoryId,
          name: category?.name || 'Sin categoría',
          color: category?.color || '#9E9E9E',
          icon: category?.icon || 'pricetag-outline',
          total: 0,
          count: 0,
        };
      }
      breakdownMap[categoryId].total += parseFloat(expense.amount || 0);
      breakdownMap[categoryId].count += 1;
    });

    const breakdown = Object.values(breakdownMap).sort((a, b) => b.total - a.total);
    setCategoryData(breakdown);
  }, [expenses, categories, selectedPeriod, getDateRange]);

  // Load data on mount
  useEffect(() => {
    loadExpenses(); // Load all expenses
    loadGoals();
    loadBudgets();
  }, []);

  // Recalculate metrics when expenses or period change
  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    calculateMetrics();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleExport = () => {
    Alert.alert(
      'Exportar Reporte',
      'Selecciona el formato de exportación',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'PDF', onPress: () => Alert.alert('Exportando', 'Generando reporte en PDF...') },
        { text: 'Excel', onPress: () => Alert.alert('Exportando', 'Generando reporte en Excel...') },
      ]
    );
  };

  const handleCreateBudget = () => {
    router.push('/create-budget');
  };

  const handleCreateGoal = () => {
    router.push('/create-goal');
  };

  const getPercentageChange = () => {
    if (previousPeriodTotal === 0) return periodTotal > 0 ? '+100%' : '0%';
    const change = ((periodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const getPeriodLabel = () => {
    if (selectedPeriod === 'week') return 'vs semana anterior';
    if (selectedPeriod === 'month') return 'vs mes anterior';
    return 'vs año anterior';
  };

  // Prepare data for PieChart based on real category data
  const pieData = categoryData.map(cat => ({
    name: cat.name,
    value: cat.total,
    color: cat.color,
    legendFontColor: COLORS.textSecondary,
    legendFontSize: 12
  }));

  const getTrendData = () => {
    const now = new Date();
    let labels = [];
    let dataPoints = [];

    if (selectedPeriod === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        // Label: Day name (e.g., "Lun")
        const dayName = d.toLocaleDateString('es-MX', { weekday: 'short' });
        labels.push(dayName.charAt(0).toUpperCase() + dayName.slice(1));

        // Sum expenses for this day
        const dayTotal = expenses
          .filter(e => e.date.startsWith(dateStr))
          .reduce((sum, e) => sum + parseFloat(e.amount), 0);

        dataPoints.push(dayTotal);
      }
    } else if (selectedPeriod === 'month') {
      // Days of current month (grouped by week or every 5 days to fit screen)
      // For better mobile view, let's show last 30 days or current month days
      // Let's do current month days
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // To avoid overcrowding, we can show labels every 5 days, but calculate all points
      // Or better: Show last 4 weeks

      // Let's stick to "Current Month" view, grouping by 5-day intervals or weeks if too many days
      // Actually, for a line chart on mobile, 30 points is too tight.
      // Let's aggregate by weeks of the month (approx 4-5 points)

      labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'];
      dataPoints = [0, 0, 0, 0, 0];

      expenses.forEach(e => {
        const eDate = new Date(e.date);
        if (eDate.getMonth() === month && eDate.getFullYear() === year) {
          const day = eDate.getDate();
          const weekIndex = Math.floor((day - 1) / 7);
          if (weekIndex < 5) {
            dataPoints[weekIndex] += parseFloat(e.amount);
          }
        }
      });

      // Trim empty weeks at the end if we are not there yet? 
      // No, let's show full month structure.

    } else if (selectedPeriod === 'year') {
      // Months of current year
      const year = now.getFullYear();
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

      labels = monthNames;
      dataPoints = new Array(12).fill(0);

      expenses.forEach(e => {
        const eDate = new Date(e.date);
        if (eDate.getFullYear() === year) {
          const m = eDate.getMonth();
          dataPoints[m] += parseFloat(e.amount);
        }
      });
    }

    // If no data at all, show 0 line
    if (dataPoints.every(v => v === 0)) {
      return {
        labels: labels.length > 0 ? labels : ['Sin datos'],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels,
      datasets: [{
        data: dataPoints
      }]
    };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={TYPOGRAPHY.h2}>Análisis</Text>
          <View style={styles.projectIndicator}>
            <Ionicons
              name={showAllProjects ? "apps" : "folder"}
              size={14}
              color={COLORS.primary}
            />
            <Text style={styles.projectIndicatorText}>
              {showAllProjects ? 'Todos los proyectos' : currentProject?.name || 'Sin proyecto'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Ionicons name="download-outline" size={ICON_SIZE.sm} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Period Selector */}
        <View style={LAYOUT.section}>
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
                <Ionicons
                  name={period.icon}
                  size={ICON_SIZE.sm}
                  color={selectedPeriod === period.id ? COLORS.white : COLORS.textSecondary}
                />
                <Text
                  style={[
                    TYPOGRAPHY.bodyBold,
                    styles.periodButtonText,
                    selectedPeriod === period.id && styles.periodButtonTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={LAYOUT.section}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="arrow-down-circle" size={ICON_SIZE.md} color={COLORS.error} />
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>Gastos</Text>
              <Text style={[TYPOGRAPHY.h3, styles.statValue]}>
                {formatCurrency(periodTotal)}
              </Text>
              <Text style={[TYPOGRAPHY.tiny, { color: COLORS.error }]}>
                {getPercentageChange()} {getPeriodLabel()}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="arrow-up-circle" size={ICON_SIZE.md} color={COLORS.success} />
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>Ingresos</Text>
              <Text style={[TYPOGRAPHY.h3, styles.statValue]}>
                $0.00
              </Text>
              <Text style={[TYPOGRAPHY.tiny, { color: COLORS.textSecondary }]}>
                Sin registros
              </Text>
            </View>
          </View>
        </View>

        {/* Charts Section */}
        <View style={LAYOUT.section}>
          <View style={styles.chartCard}>
            <LineChart
              data={getTrendData()}
              labels={getTrendData().labels}
              title="Tendencia de Gastos"
              yAxisSuffix=""
              height={220}
            />
          </View>
        </View>

        {/* Category Breakdown (Pie Chart) */}
        {pieData.length > 0 && (
          <View style={LAYOUT.section}>
            <View style={styles.chartCard}>
              <PieChart
                data={pieData}
                title="Distribución por Categoría"
                height={220}
                showLegend={true}
              />
            </View>
          </View>
        )}

        {/* Budgets Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="wallet-outline" size={ICON_SIZE.sm} color={COLORS.text} />
              <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>Presupuestos</Text>
            </View>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={handleCreateBudget}>
              <Ionicons name="add" size={ICON_SIZE.sm} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {budgetsWithSpent.length > 0 ? (
            budgetsWithSpent.map((budget) => (
              <TouchableOpacity
                key={budget.id}
                activeOpacity={0.7}
                onPress={() => router.push(`/budget-detail/${budget.id}`)}
              >
                <BudgetCard
                  name={budget.category?.name || 'Sin categoría'}
                  spent={budget.spent}
                  total={budget.total}
                  icon={budget.category?.icon || 'wallet-outline'}
                  color={budget.category?.color || COLORS.primary}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No hay presupuestos activos</Text>
          )}
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="flag-outline" size={ICON_SIZE.sm} color={COLORS.text} />
              <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>Metas Financieras</Text>
            </View>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={handleCreateGoal}>
              <Ionicons name="add" size={ICON_SIZE.sm} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                name={goal.name}
                current={goal.current}
                target={goal.target}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No hay metas activas</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  exportButton: {
    padding: SPACING.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xs,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  periodButtonTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
  },
  statLabel: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  addButton: {
    padding: SPACING.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    padding: 20,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 100,
  },
  projectIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  projectIndicatorText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
