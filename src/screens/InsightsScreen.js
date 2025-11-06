import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  CARD_STYLES,
  ICON_SIZE,
} from '../constants';
import { StatCard, BudgetCard, GoalCard, ApprovalCard } from '../components/insights';

// Datos de ejemplo
const BUDGETS = [
  { id: 1, name: 'Comida', spent: 8450, total: 10000 },
  { id: 2, name: 'Transporte', spent: 4200, total: 5000 },
];

const GOALS = [
  { id: 1, name: 'Vacaciones 2025', current: 12500, target: 20000 },
  { id: 2, name: 'Fondo de Emergencia', current: 45000, target: 50000 },
];

const APPROVALS = [
  {
    id: 1,
    name: 'Comida en Restaurante',
    userName: 'Juan Pérez',
    amount: 850,
    icon: 'restaurant-outline',
    iconColor: COLORS.categoryFood,
  },
];

export default function InsightsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={TYPOGRAPHY.h2}>Insights</Text>
          <TouchableOpacity style={styles.periodSelector} activeOpacity={0.7}>
            <Text style={[TYPOGRAPHY.body, styles.periodText]}>Este Mes</Text>
            <Ionicons name="chevron-down" size={ICON_SIZE.xs} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Dashboard Cards */}
        <View style={styles.dashboardSection}>
          <View style={styles.dashboardRow}>
            <StatCard
              label="Balance Total"
              amount={651972}
              change="+12.5%"
              changeIcon="trending-up"
              variant="primary"
            />
          </View>

          <View style={styles.dashboardRow}>
            <StatCard
              label="Ingresos"
              amount={85420}
              change="+8.2%"
            />
            <StatCard
              label="Gastos"
              amount={42330}
              change="-3.1%"
            />
          </View>
        </View>

        {/* Presupuestos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="wallet-outline" size={ICON_SIZE.sm} color={COLORS.text} />
              <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>Presupuestos</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[TYPOGRAPHY.body, styles.seeAllText]}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {BUDGETS.map((budget) => (
            <BudgetCard
              key={budget.id}
              name={budget.name}
              spent={budget.spent}
              total={budget.total}
            />
          ))}

          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Ionicons name="add" size={ICON_SIZE.sm} color={COLORS.textSecondary} />
            <Text style={[TYPOGRAPHY.bodyBold, styles.addButtonText]}>Crear Presupuesto</Text>
          </TouchableOpacity>
        </View>

        {/* Metas Financieras */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="flag-outline" size={ICON_SIZE.sm} color={COLORS.text} />
              <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>Metas Financieras</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[TYPOGRAPHY.body, styles.seeAllText]}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {GOALS.map((goal) => (
            <GoalCard
              key={goal.id}
              name={goal.name}
              current={goal.current}
              target={goal.target}
            />
          ))}

          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Ionicons name="add" size={ICON_SIZE.sm} color={COLORS.textSecondary} />
            <Text style={[TYPOGRAPHY.bodyBold, styles.addButtonText]}>Crear Meta</Text>
          </TouchableOpacity>
        </View>

        {/* Reportes Rápidos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="document-text-outline" size={ICON_SIZE.sm} color={COLORS.text} />
              <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>Reportes</Text>
            </View>
          </View>

          <View style={styles.reportsGrid}>
            <TouchableOpacity style={[CARD_STYLES.minimal, styles.reportCard]} activeOpacity={0.7}>
              <Ionicons name="calendar-outline" size={ICON_SIZE.xl} color={COLORS.text} />
              <Text style={[TYPOGRAPHY.bodyBold, styles.reportLabel]}>Mensual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[CARD_STYLES.minimal, styles.reportCard]} activeOpacity={0.7}>
              <Ionicons name="calendar" size={ICON_SIZE.xl} color={COLORS.text} />
              <Text style={[TYPOGRAPHY.bodyBold, styles.reportLabel]}>Anual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[CARD_STYLES.minimal, styles.reportCard]} activeOpacity={0.7}>
              <Ionicons name="folder-outline" size={ICON_SIZE.xl} color={COLORS.text} />
              <Text style={[TYPOGRAPHY.bodyBold, styles.reportLabel]}>Por Proyecto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[CARD_STYLES.minimal, styles.reportCard]} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={ICON_SIZE.xl} color={COLORS.text} />
              <Text style={[TYPOGRAPHY.bodyBold, styles.reportLabel]}>Personalizado</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Aprobaciones Pendientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="checkmark-circle-outline" size={ICON_SIZE.sm} color={COLORS.text} />
              <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>Aprobaciones</Text>
              <View style={styles.badge}>
                <Text style={[TYPOGRAPHY.tiny, styles.badgeText]}>3</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[TYPOGRAPHY.body, styles.seeAllText]}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {APPROVALS.map((approval) => (
            <ApprovalCard
              key={approval.id}
              name={approval.name}
              userName={approval.userName}
              amount={approval.amount}
              icon={approval.icon}
              iconColor={approval.iconColor}
              onApprove={() => console.log('Aprobar:', approval.id)}
              onReject={() => console.log('Rechazar:', approval.id)}
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
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  periodText: {
    fontWeight: '600',
  },
  dashboardSection: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  dashboardRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxxl,
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
  seeAllText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    gap: SPACING.sm,
  },
  addButtonText: {
    color: COLORS.textSecondary,
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  reportCard: {
    width: '47%',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  reportLabel: {
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  badgeText: {
    fontWeight: '700',
    color: COLORS.white,
  },
  bottomPadding: {
    height: 100,
  },
});
