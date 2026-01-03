import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import useDataStore from '../store/dataStore';
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

  // Obtener proyecto actual, categorías y showAllProjects del store
  const currentProject = useDataStore((state) => state.currentProject);
  const categories = useDataStore((state) => state.categories);
  const projects = useDataStore((state) => state.projects);
  const showAllProjects = useDataStore((state) => state.showAllProjects);
  const setShowAllProjects = useDataStore((state) => state.setShowAllProjects);
  const setCurrentProject = useDataStore((state) => state.setCurrentProject);

  // Obtener expenses del store de gastos
  const expenses = useExpenseStore((state) => state.expenses);
  const loadExpenses = useExpenseStore((state) => state.loadExpenses);
  const isLoading = useExpenseStore((state) => state.isLoading);

  // Cargar todos los expenses (sin filtro de proyecto)
  useEffect(() => {
    loadExpenses(); // Cargar todos los expenses
  }, []);

  const handleTransactionPress = (transactionId) => {
    router.push(`/expense-detail/${transactionId}`);
  };

  // Obtener el nombre del proyecto por ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Sin proyecto';
  };

  // Handler para seleccionar un proyecto específico
  const handleSelectProject = (projectId) => {
    if (projectId === 'all') {
      setShowAllProjects(true);
    } else {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
    }
  };

  // Transformar expenses para el formato esperado por TransactionCard
  const transformedExpenses = expenses.map((expense) => {
    const category = categories.find(cat => cat.id === expense.category_id);
    return {
      id: expense.id,
      name: expense.name,
      category: category?.name || 'Sin categoría',
      amount: -parseFloat(expense.amount),
      date: formatDate(expense.date, 'short'),
      time: new Date(expense.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      icon: category?.icon || 'cash-outline',
      color: CATEGORY_COLORS[category?.name] || COLORS.textSecondary,
      project: getProjectName(expense.project_id),
      projectId: expense.project_id,
    };
  });

  // Filtrar transacciones por proyecto, categoría y búsqueda
  const filteredTransactions = transformedExpenses.filter((transaction) => {
    const matchesProject = showAllProjects || transaction.projectId === currentProject?.id;
    const matchesFilter = selectedFilter === 'Todo' || transaction.category === selectedFilter;
    const matchesSearch = transaction.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesFilter && matchesSearch;
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

        {/* Project Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.projectSelector}
          contentContainerStyle={styles.projectSelectorContent}
        >
          <TouchableOpacity
            style={[
              styles.projectPill,
              showAllProjects && styles.projectPillActive
            ]}
            onPress={() => handleSelectProject('all')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="apps"
              size={14}
              color={showAllProjects ? COLORS.white : COLORS.textSecondary}
            />
            <Text style={[
              styles.projectPillText,
              showAllProjects && styles.projectPillTextActive
            ]}>
              Todos
            </Text>
          </TouchableOpacity>

          {projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={[
                styles.projectPill,
                !showAllProjects && currentProject?.id === project.id && styles.projectPillActive
              ]}
              onPress={() => handleSelectProject(project.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.projectDot,
                { backgroundColor: !showAllProjects && currentProject?.id === project.id ? COLORS.white : (project.color || COLORS.primary) }
              ]} />
              <Text style={[
                styles.projectPillText,
                !showAllProjects && currentProject?.id === project.id && styles.projectPillTextActive
              ]}>
                {project.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={[TYPOGRAPHY.body, { marginTop: SPACING.md, color: COLORS.textSecondary }]}>
                Cargando gastos...
              </Text>
            </View>
          ) : filteredTransactions.length > 0 ? (
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
                  : `Comienza agregando gastos al proyecto "${currentProject?.name}"`}
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  bottomPadding: {
    height: 100,
  },
  projectSelector: {
    marginBottom: SPACING.lg,
  },
  projectSelectorContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  projectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  projectPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  projectPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  projectPillTextActive: {
    color: COLORS.white,
  },
  projectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
