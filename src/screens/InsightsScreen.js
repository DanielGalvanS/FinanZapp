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
            <View style={[CARD_STYLES.dark, styles.dashboardCard, styles.dashboardCardPrimary]}>
              <Text style={[TYPOGRAPHY.caption, styles.dashboardLabel]}>Balance Total</Text>
              <Text style={[TYPOGRAPHY.h2, styles.dashboardAmount]}>$651,972</Text>
              <View style={styles.dashboardTrend}>
                <Ionicons name="trending-up" size={ICON_SIZE.sm} color={COLORS.white} />
                <Text style={[TYPOGRAPHY.body, styles.trendText]}>+12.5%</Text>
              </View>
            </View>
          </View>

          <View style={styles.dashboardRow}>
            <View style={[CARD_STYLES.minimal, styles.dashboardCard]}>
              <Text style={[TYPOGRAPHY.caption, styles.dashboardLabelSecondary]}>Ingresos</Text>
              <Text style={[TYPOGRAPHY.h3, styles.dashboardAmountSmall]}>$85,420</Text>
              <Text style={[TYPOGRAPHY.body, styles.dashboardChange]}>+8.2%</Text>
            </View>
            <View style={[CARD_STYLES.minimal, styles.dashboardCard]}>
              <Text style={[TYPOGRAPHY.caption, styles.dashboardLabelSecondary]}>Gastos</Text>
              <Text style={[TYPOGRAPHY.h3, styles.dashboardAmountSmall]}>$42,330</Text>
              <Text style={[TYPOGRAPHY.body, styles.dashboardChange, styles.dashboardChangeNegative]}>-3.1%</Text>
            </View>
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

          <View style={[CARD_STYLES.minimal, styles.budgetCard]}>
            <View style={styles.budgetHeader}>
              <Text style={[TYPOGRAPHY.bodyBold, styles.budgetName]}>Comida</Text>
              <Text style={[TYPOGRAPHY.body, styles.budgetAmount]}>$8,450 / $10,000</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '84.5%' }]} />
            </View>
            <Text style={[TYPOGRAPHY.caption, styles.budgetStatus]}>Quedan $1,550 • 85% usado</Text>
          </View>

          <View style={[CARD_STYLES.minimal, styles.budgetCard]}>
            <View style={styles.budgetHeader}>
              <Text style={[TYPOGRAPHY.bodyBold, styles.budgetName]}>Transporte</Text>
              <Text style={[TYPOGRAPHY.body, styles.budgetAmount]}>$4,200 / $5,000</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '84%' }, styles.progressFillWarning]} />
            </View>
            <Text style={[TYPOGRAPHY.caption, styles.budgetStatus]}>Quedan $800 • 84% usado</Text>
          </View>

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

          <View style={[CARD_STYLES.minimal, styles.goalCard]}>
            <Text style={[TYPOGRAPHY.bodyBold, styles.goalName]}>Vacaciones 2025</Text>
            <Text style={[TYPOGRAPHY.body, styles.goalProgress]}>$12,500 / $20,000</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '62.5%' }, styles.progressFillGoal]} />
            </View>
            <Text style={[TYPOGRAPHY.caption, styles.goalStatus]}>62% completado • Faltan $7,500</Text>
          </View>

          <View style={[CARD_STYLES.minimal, styles.goalCard]}>
            <Text style={[TYPOGRAPHY.bodyBold, styles.goalName]}>Fondo de Emergencia</Text>
            <Text style={[TYPOGRAPHY.body, styles.goalProgress]}>$45,000 / $50,000</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '90%' }, styles.progressFillGoal]} />
            </View>
            <Text style={[TYPOGRAPHY.caption, styles.goalStatus]}>90% completado • Faltan $5,000</Text>
          </View>

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

          <View style={[CARD_STYLES.minimal, styles.approvalCard]}>
            <View style={styles.approvalHeader}>
              <View style={styles.approvalIconContainer}>
                <Ionicons name="restaurant-outline" size={ICON_SIZE.md} color={COLORS.categoryFood} />
              </View>
              <View style={styles.approvalInfo}>
                <Text style={[TYPOGRAPHY.bodyBold, styles.approvalName]}>Comida en Restaurante</Text>
                <Text style={[TYPOGRAPHY.caption, styles.approvalUser]}>Por Juan Pérez</Text>
              </View>
              <Text style={[TYPOGRAPHY.lg, styles.approvalAmount]}>$850</Text>
            </View>
            <View style={styles.approvalActions}>
              <TouchableOpacity style={styles.rejectButton} activeOpacity={0.7}>
                <Text style={[TYPOGRAPHY.bodyBold, styles.rejectButtonText]}>Rechazar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.approveButton} activeOpacity={0.7}>
                <Text style={[TYPOGRAPHY.bodyBold, styles.approveButtonText]}>Aprobar</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  dashboardCard: {
    flex: 1,
  },
  dashboardCardPrimary: {
    marginBottom: 0,
  },
  dashboardLabel: {
    color: COLORS.white,
    opacity: 0.7,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  dashboardLabelSecondary: {
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  dashboardAmount: {
    color: COLORS.white,
    marginBottom: SPACING.sm,
    letterSpacing: -1,
  },
  dashboardAmountSmall: {
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  dashboardTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  trendText: {
    fontWeight: '600',
    color: COLORS.white,
  },
  dashboardChange: {
    fontWeight: '600',
    color: COLORS.success,
  },
  dashboardChangeNegative: {
    color: COLORS.error,
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
  budgetCard: {
    marginBottom: SPACING.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  budgetName: {
    color: COLORS.text,
  },
  budgetAmount: {
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xs,
  },
  progressFillWarning: {
    backgroundColor: COLORS.warning,
  },
  progressFillGoal: {
    backgroundColor: COLORS.success,
  },
  budgetStatus: {
    color: COLORS.textSecondary,
  },
  goalCard: {
    marginBottom: SPACING.md,
  },
  goalName: {
    marginBottom: SPACING.sm,
  },
  goalProgress: {
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  goalStatus: {
    color: COLORS.textSecondary,
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
  approvalCard: {
    marginBottom: SPACING.md,
  },
  approvalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  approvalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.categoryFood + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  approvalInfo: {
    flex: 1,
  },
  approvalName: {
    marginBottom: SPACING.xs,
  },
  approvalUser: {
    color: COLORS.textSecondary,
  },
  approvalAmount: {
    fontWeight: '700',
  },
  approvalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  rejectButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: COLORS.text,
  },
  approveButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  approveButtonText: {
    color: COLORS.white,
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
