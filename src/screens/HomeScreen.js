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
import { SectionHeader, BottomSheet, BottomSheetOption, Avatar } from '../components/ui';
import { ProjectCard } from '../components/projects';
import { TransactionCard } from '../components/transactions';
import { CategoryCard } from '../components/categories';
import { BalanceCard, QuickActions, ProjectSelector } from '../components/home';

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

// Datos de proyectos (ejemplo)
const AVAILABLE_PROJECTS = [
  {
    id: 1,
    name: 'Personal',
    isShared: false,
    collaborators: [],
    totalExpenses: 42330,
  },
  {
    id: 2,
    name: 'Renta Depa',
    isShared: true,
    collaborators: [
      { id: 1, name: 'María García', avatar: null },
      { id: 2, name: 'Juan Pérez', avatar: null },
      { id: 3, name: 'Ana López', avatar: null },
    ],
    totalExpenses: 18500,
  },
  {
    id: 3,
    name: 'Negocio',
    isShared: true,
    collaborators: [
      { id: 4, name: 'Carlos Ruiz', avatar: null },
    ],
    totalExpenses: 156780,
  },
  {
    id: 4,
    name: 'Vacaciones',
    isShared: false,
    collaborators: [],
    totalExpenses: 8920,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [currentProject, setCurrentProject] = useState(AVAILABLE_PROJECTS[1]);
  const [isProjectSelectorExpanded, setIsProjectSelectorExpanded] = useState(false);
  const [isProjectOptionsModalVisible, setIsProjectOptionsModalVisible] = useState(false);
  const [selectedProjectForOptions, setSelectedProjectForOptions] = useState(null);

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
    setCurrentProject(project);
    setIsProjectSelectorExpanded(false);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Project Selector */}
        <ProjectSelector
          currentProject={currentProject}
          projects={AVAILABLE_PROJECTS}
          isExpanded={isProjectSelectorExpanded}
          onToggleExpanded={handleProjectPress}
          onSelectProject={handleSelectProject}
          onCreateProject={handleCreateProject}
          onProjectOptions={handleOpenProjectOptions}
        />

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

        {/* Balance Card */}
        <BalanceCard
          balance={651972}
          income={85420}
          expenses={42330}
          comparison="12% menos que el mes pasado"
          comparisonTrend="down"
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

          <View style={styles.categoriesContainer}>
            {SPENDING_CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => console.log('Category pressed:', category.name)}
              />
            ))}
          </View>
        </View>

        {/* Recent Transactions Section */}
        <View style={LAYOUT.section}>
          <SectionHeader
            title="Transacciones Recientes"
            actionText="Ver todo"
            onActionPress={handleViewAllExpenses}
          />

          {RECENT_TRANSACTIONS.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onPress={() => handleTransactionPress(transaction.id)}
            />
          ))}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

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
    backgroundColor: COLORS.background,
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
});
