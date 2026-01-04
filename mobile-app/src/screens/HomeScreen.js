import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
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
import { SectionHeader, BottomSheet, BottomSheetOption, Avatar } from '../components/ui';
import { ProjectCard } from '../components/projects';
import { TransactionCard } from '../components/transactions';
import { CategoryCard } from '../components/categories';
import { BalanceCard, QuickActions } from '../components/home';
import useDataStore from '../store/dataStore';
import dataService from '../services/dataService';

const PERIODS = [
  { id: 'all', label: 'Todo' },
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
  const insets = useSafeAreaInsets();

  // Datos desde el store global
  const projects = useDataStore((state) => state.projects);
  const categories = useDataStore((state) => state.categories);
  const currentProject = useDataStore((state) => state.currentProject);
  const setCurrentProject = useDataStore((state) => state.setCurrentProject);
  const isLoadingProjects = useDataStore((state) => state.isLoadingProjects);
  const showAllProjects = useDataStore((state) => state.showAllProjects);
  const setShowAllProjects = useDataStore((state) => state.setShowAllProjects);

  // Estado local
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isProjectSelectorExpanded, setIsProjectSelectorExpanded] = useState(false);
  const [isProjectOptionsModalVisible, setIsProjectOptionsModalVisible] = useState(false);
  const [selectedProjectForOptions, setSelectedProjectForOptions] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Estado para datos cargados desde Supabase
  const [expenses, setExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Cargar expenses cuando cambia el proyecto o período o showAllProjects o categorías
  useEffect(() => {
    loadExpenses();
  }, [currentProject, selectedPeriod, showAllProjects, categories]);

  // Get date range based on selected period
  const getDateRange = (period) => {
    const now = new Date();
    let startDate, endDate;

    if (period === 'all') {
      // Todo - no filter
      return { startDate: null, endDate: null };
    } else if (period === 'month') {
      // Este mes
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'last-month') {
      // Mes pasado
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (period === 'year') {
      // Este año
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    return { startDate, endDate };
  };

  const loadExpenses = async () => {
    // Si showAllProjects es false y no hay currentProject, no cargar nada
    if (!showAllProjects && !currentProject) return;

    try {
      setIsLoadingExpenses(true);

      // Obtener expenses - sin filtro de proyecto si showAllProjects es true
      const filters = showAllProjects ? {} : { projectId: currentProject.id };
      const expensesData = await dataService.getExpenses(filters);

      // Filtrar por período seleccionado (si no es 'all')
      const { startDate, endDate } = getDateRange(selectedPeriod);
      const filteredExpenses = (startDate && endDate)
        ? expensesData.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate && expenseDate <= endDate;
        })
        : expensesData; // 'all' - no filter

      setExpenses(filteredExpenses);

      // Calcular gastos por categoría (solo del período filtrado)
      calculateSpendingByCategory(filteredExpenses);

      // Obtener transacciones recientes (últimas 5 del período filtrado)
      const recent = filteredExpenses.slice(0, 5).map(expense => {
        const category = categories.find(cat => cat.id === expense.category_id);
        return {
          id: expense.id,
          name: expense.name,
          category: category?.name || 'Sin categoría',
          amount: -expense.amount, // Negativo para gastos
          date: new Date(expense.date).toLocaleDateString('es-MX'),
          icon: category?.icon || 'pricetag-outline',
          color: category?.color || COLORS.textSecondary,
        };
      });
      setRecentTransactions(recent);

      // Calcular total de gastos (solo del período filtrado)
      const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalExpenses(total);

    } catch (error) {
      console.error('[HomeScreen] Error al cargar expenses:', error);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const calculateSpendingByCategory = (expensesData) => {
    // Agrupar gastos por categoría
    const categoryTotals = {};
    let total = 0;

    expensesData.forEach(expense => {
      const categoryId = expense.category_id;
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += expense.amount;
      total += expense.amount;
    });

    // Convertir a array con información de categoría
    const spending = Object.entries(categoryTotals).map(([categoryId, amount]) => {
      const category = categories.find(cat => cat.id === categoryId);
      const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;

      return {
        id: categoryId,
        name: category?.name || 'Sin categoría',
        amount: amount,
        icon: category?.icon || 'pricetag-outline',
        color: category?.color || COLORS.textSecondary,
        percentage: percentage,
      };
    });

    // Ordenar por monto (mayor a menor)
    spending.sort((a, b) => b.amount - a.amount);

    setSpendingByCategory(spending);
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

  const handleProjectPress = () => {
    setIsProjectSelectorExpanded(!isProjectSelectorExpanded);
  };

  const handleSelectProject = (project) => {
    setShowAllProjects(false);
    setCurrentProject(project);
    setIsProjectSelectorExpanded(false);
  };

  const handleSelectAllProjects = () => {
    setShowAllProjects(true);
    setIsProjectSelectorExpanded(false);
  };

  const handleRefresh = () => {
    if (currentProject) {
      loadExpenses();
    }
  };

  const handleCreateProject = () => {
    setIsProjectSelectorExpanded(false);
    router.push('/create-project');
  };

  const handleOpenProjectOptions = (project, event) => {
    event.stopPropagation();
    setSelectedProjectForOptions(project);
    setIsProjectOptionsModalVisible(true);
  };

  const handleCloseProjectOptions = () => {
    setIsProjectOptionsModalVisible(false);
    setTimeout(() => {
      setSelectedProjectForOptions(null);
    }, 300);
  };

  const handleShareProject = () => {
    handleCloseProjectOptions();
    // Implementar lógica de compartir
    console.log('Compartir proyecto:', selectedProjectForOptions?.name);
  };

  const handleLeaveProject = () => {
    handleCloseProjectOptions();
    // Implementar lógica de salir del proyecto
    console.log('Salir del proyecto:', selectedProjectForOptions?.name);
  };

  const handleMuteProject = () => {
    handleCloseProjectOptions();
    // Implementar lógica de silenciar
    console.log('Silenciar proyecto:', selectedProjectForOptions?.name);
  };

  const handleDeleteProject = () => {
    handleCloseProjectOptions();
    // Implementar lógica de eliminar
    console.log('Eliminar proyecto:', selectedProjectForOptions?.name);
  };

  const handleProjectSettings = () => {
    handleCloseProjectOptions();
    if (selectedProjectForOptions) {
      router.push(`/project-settings/${selectedProjectForOptions.id}`);
    }
  };

  const handleEditProject = (project) => {
    setIsProjectSelectorExpanded(false);
    router.push(`/edit-project/${project.id}`);
  };

  const handleDeleteProjectSwipe = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalVisible(true);
    setIsProjectSelectorExpanded(false);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      console.log('Eliminando proyecto:', projectToDelete.name);

      // Eliminar de Supabase
      await dataService.deleteProject(projectToDelete.id);

      // Actualizar el store (esto también maneja cambiar el currentProject si es necesario)
      useDataStore.getState().deleteProject(projectToDelete.id);

      // Cerrar modal
      setIsDeleteModalVisible(false);
      setProjectToDelete(null);

      console.log('[HomeScreen] ✅ Proyecto eliminado exitosamente');
    } catch (error) {
      console.error('[HomeScreen] ❌ Error al eliminar proyecto:', error);
      // TODO: Mostrar error al usuario con un Toast o Alert
      alert('Error al eliminar el proyecto. Por favor intenta de nuevo.');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setProjectToDelete(null);
  };

  // Calcular posición del dropdown basado en safe area
  const dropdownTop = insets.top + SPACING.md + 44 + SPACING.xs;

  const renderRightActions = (progress, dragX, project) => {
    const translateX = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-80, -40, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.swipeActionsContainer,
          {
            transform: [{ translateX }],
            opacity,
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.swipeAction, { backgroundColor: '#FF3B30', width: 80 }]}
          onPress={() => handleDeleteProjectSwipe(project)}
        >
          <Ionicons name="trash-outline" size={ICON_SIZE.md} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Mostrar loading mientras se cargan proyectos
  if (isLoadingProjects) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[TYPOGRAPHY.body, { marginTop: SPACING.md, color: COLORS.textSecondary }]}>
            Cargando proyectos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar mensaje si no hay proyectos
  if (!isLoadingProjects && projects.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyStateContainer}>
          <Ionicons name="folder-open-outline" size={80} color={COLORS.textTertiary} />
          <Text style={[TYPOGRAPHY.h2, { marginTop: SPACING.xl, marginBottom: SPACING.sm }]}>
            Sin proyectos
          </Text>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl }]}>
            Crea tu primer proyecto para empezar a rastrear tus gastos
          </Text>
          <TouchableOpacity
            style={[BUTTON_STYLES.accent, { paddingHorizontal: SPACING.xxl }]}
            onPress={() => router.push('/create-project')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={ICON_SIZE.md} color={COLORS.white} style={{ marginRight: SPACING.sm }} />
            <Text style={[TYPOGRAPHY.tiny, { color: COLORS.white }]}>
              Crear Proyecto
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar loading si no hay proyecto seleccionado (no debería pasar)
  if (!currentProject) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const handleMenuPress = () => {
    // TODO: Implementar menú
    console.log('Menu pressed');
  };

  const handleSharePress = () => {
    // TODO: Implementar compartir proyecto
    console.log('Share pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header con 3 elementos horizontales */}
        <View style={styles.header}>
          {/* Botón de menú (3 puntos) - Izquierda */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-horizontal" size={ICON_SIZE.md} color={COLORS.text} />
          </TouchableOpacity>

          {/* Selector de Proyecto - Centro */}
          <TouchableOpacity
            style={styles.projectSelectorButton}
            onPress={handleProjectPress}
            activeOpacity={0.7}
          >
            <View style={styles.projectInfo}>
              <Ionicons
                name={showAllProjects ? "apps" : "folder-outline"}
                size={ICON_SIZE.sm}
                color={COLORS.text}
                style={{ marginRight: SPACING.xs }}
              />
              <Text style={[TYPOGRAPHY.bodyBold, styles.projectName]} numberOfLines={1}>
                {showAllProjects ? 'Todos' : currentProject.name}
              </Text>
              <Ionicons
                name={isProjectSelectorExpanded ? "chevron-up" : "chevron-down"}
                size={ICON_SIZE.xs}
                color={COLORS.textSecondary}
              />
            </View>
          </TouchableOpacity>

          {/* Botón de compartir - Derecha */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSharePress}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={ICON_SIZE.md} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Saludo y nombre del usuario */}
        <View style={styles.welcomeSection}>
          <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
            Hola, Bienvenido
          </Text>
          <View style={styles.userRow}>
            <Text style={[TYPOGRAPHY.h3, { marginTop: SPACING.xs }]}>
              Leon Fernandez
            </Text>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={ICON_SIZE.md} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Period Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelectorScroll}
          contentContainerStyle={styles.periodSelectorContent}
        >
          {PERIODS.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodPill,
                selectedPeriod === period.id && styles.periodPillActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  styles.periodPillText,
                  selectedPeriod === period.id && styles.periodPillTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Balance Card */}
        <BalanceCard
          balance={-totalExpenses} // Negativo porque son gastos (sin ingresos por ahora)
          income={0} // TODO: Implementar ingresos reales
          expenses={totalExpenses}
          comparison="" // TODO: Implementar comparación con período anterior
          comparisonTrend={totalExpenses > 0 ? "down" : "neutral"}
          currency="MXN"
        />

        {/* Quick Actions */}
        <QuickActions
          actions={QUICK_ACTIONS}
          onActionPress={handleQuickAction}
        />

        {/* Spending Categories Section */}
        <View style={LAYOUT.section}>
          <SectionHeader
            title="Resumen de Gastos"
            actionText="Ver todo"
            onActionPress={handleViewAllExpenses}
          />

          {isLoadingExpenses ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={[TYPOGRAPHY.body, { marginTop: SPACING.sm, color: COLORS.textSecondary }]}>
                Cargando gastos...
              </Text>
            </View>
          ) : spendingByCategory.length > 0 ? (
            <View style={styles.categoriesContainer}>
              {spendingByCategory.slice(0, 4).map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onPress={() => console.log('Category pressed:', category.name)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={COLORS.textTertiary} />
              <Text style={[TYPOGRAPHY.body, { marginTop: SPACING.md, color: COLORS.textSecondary }]}>
                No hay gastos en este proyecto
              </Text>
            </View>
          )}
        </View>

        {/* Recent Transactions Section */}
        <View style={LAYOUT.section}>
          <SectionHeader
            title="Transacciones Recientes"
            actionText="Ver todo"
            onActionPress={handleViewAllExpenses}
          />

          {isLoadingExpenses ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={48} color={COLORS.textTertiary} />
              <Text style={[TYPOGRAPHY.body, { marginTop: SPACING.md, color: COLORS.textSecondary }]}>
                No hay transacciones recientes
              </Text>
            </View>
          )}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Project Dropdown Overlay */}
      {isProjectSelectorExpanded && (
        <>
          {/* Backdrop invisible para cerrar */}
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={handleProjectPress}
          />
          {/* Dropdown */}
          <View style={[styles.projectDropdown, { top: dropdownTop }]}>
            {/* Opción "Todos" */}
            <TouchableOpacity
              style={[
                styles.projectDropdownItem,
                showAllProjects && styles.projectDropdownItemActive
              ]}
              onPress={handleSelectAllProjects}
              activeOpacity={0.7}
            >
              <Ionicons
                name="apps"
                size={ICON_SIZE.sm}
                color={showAllProjects ? COLORS.primary : COLORS.textSecondary}
                style={{ marginRight: SPACING.sm }}
              />
              <Text style={[
                TYPOGRAPHY.body,
                { color: showAllProjects ? COLORS.primary : COLORS.text, fontWeight: showAllProjects ? '600' : '400' }
              ]}>
                Todos los proyectos
              </Text>
              {showAllProjects && (
                <Ionicons
                  name="checkmark"
                  size={ICON_SIZE.sm}
                  color={COLORS.primary}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </TouchableOpacity>

            {/* Separador */}
            <View style={styles.dropdownDivider} />

            {/* Proyectos individuales */}
            {projects.map((project) => (
              <Swipeable
                key={project.id}
                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, project)}
                overshootRight={false}
                friction={2}
              >
                <TouchableOpacity
                  style={[
                    styles.projectDropdownItem,
                    !showAllProjects && currentProject?.id === project.id && styles.projectDropdownItemActive
                  ]}
                  onPress={() => handleSelectProject(project)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={project.icon || 'folder-outline'}
                    size={ICON_SIZE.sm}
                    color={!showAllProjects && currentProject?.id === project.id ? COLORS.primary : COLORS.textSecondary}
                    style={{ marginRight: SPACING.sm }}
                  />
                  <Text style={[
                    TYPOGRAPHY.body,
                    {
                      color: !showAllProjects && currentProject?.id === project.id ? COLORS.primary : COLORS.text,
                      fontWeight: !showAllProjects && currentProject?.id === project.id ? '600' : '400'
                    }
                  ]}>
                    {project.name}
                  </Text>
                  {!showAllProjects && currentProject?.id === project.id && (
                    <Ionicons
                      name="checkmark"
                      size={ICON_SIZE.sm}
                      color={COLORS.primary}
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              </Swipeable>
            ))}

            {/* Crear Proyecto */}
            <TouchableOpacity
              style={styles.createProjectDropdownItem}
              onPress={handleCreateProject}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add-circle-outline"
                size={ICON_SIZE.md}
                color={COLORS.primary}
                style={{ marginRight: SPACING.sm }}
              />
              <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.primary }]}>Crear Proyecto</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Project Options Bottom Sheet Modal */}
      <BottomSheet
        visible={isProjectOptionsModalVisible}
        onClose={handleCloseProjectOptions}
        title={selectedProjectForOptions?.name}
      >
        <BottomSheetOption
          icon="share-outline"
          iconColor={COLORS.primary}
          label="Compartir Proyecto"
          onPress={handleShareProject}
        />

        <BottomSheetOption
          icon="settings-outline"
          label="Configuración"
          onPress={handleProjectSettings}
        />

        <BottomSheetOption
          icon="notifications-off-outline"
          label="Silenciar Notificaciones"
          onPress={handleMuteProject}
        />

        {selectedProjectForOptions?.isShared && (
          <BottomSheetOption
            icon="exit-outline"
            label="Salir del Proyecto"
            variant="warning"
            onPress={handleLeaveProject}
          />
        )}

        <BottomSheetOption
          icon="trash-outline"
          label="Eliminar Proyecto"
          variant="danger"
          showDivider={true}
          onPress={handleDeleteProject}
        />

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.modalCancelButton}
          onPress={handleCloseProjectOptions}
          activeOpacity={0.7}
        >
          <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.text }]}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </BottomSheet>

      {/* Delete Confirmation Bottom Sheet Modal */}
      <BottomSheet
        visible={isDeleteModalVisible}
        onClose={handleCancelDelete}
        title="Eliminar Proyecto"
      >
        <View style={styles.deleteModalContent}>
          <Ionicons name="warning-outline" size={48} color="#FF3B30" />
          <Text style={[TYPOGRAPHY.body, styles.deleteModalText]}>
            ¿Estás seguro de que deseas eliminar el proyecto "{projectToDelete?.name}"?
          </Text>
          <Text style={[TYPOGRAPHY.caption, styles.deleteModalSubtext]}>
            Esta acción no se puede deshacer. Se eliminarán todos los gastos asociados a este proyecto.
          </Text>
        </View>

        {/* Buttons Row */}
        <View style={styles.deleteModalButtonsRow}>
          <TouchableOpacity
            style={styles.deleteModalCancelButton}
            onPress={handleCancelDelete}
            activeOpacity={0.7}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.text }]}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteModalDeleteButton}
            onPress={handleConfirmDelete}
            activeOpacity={0.7}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.white }]}>
              Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
  projectSelectorButton: {
    width: 200,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  projectName: {
    marginLeft: SPACING.xs,
    marginRight: SPACING.xs,
  },
  projectDropdown: {
    position: 'absolute',
    // top se calcula dinámicamente con useSafeAreaInsets
    left: '50%',
    marginLeft: -110, // La mitad del width (220/2)
    width: 220,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 1001,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  currentProjectDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xs,
    marginVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  projectDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  projectDropdownItemActive: {
    backgroundColor: COLORS.primaryAlpha10,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
  },
  checkmark: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeAction: {
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createProjectDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  welcomeSection: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelectorScroll: {
    marginBottom: SPACING.lg,
  },
  periodSelectorContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  periodPill: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodPillText: {
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  periodPillTextActive: {
    color: COLORS.white,
    fontWeight: '700',
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
  // Modal Cancel Button
  modalCancelButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: SPACING.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  deleteModalContent: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  deleteModalText: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    color: COLORS.text,
    lineHeight: 22,
  },
  deleteModalSubtext: {
    textAlign: 'center',
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  deleteModalButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  deleteModalCancelButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  deleteModalDeleteButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    backgroundColor: '#FF3B30',
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
});
