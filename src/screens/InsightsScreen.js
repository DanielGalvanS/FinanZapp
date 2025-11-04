import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function InsightsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
          <TouchableOpacity style={styles.periodSelector}>
            <Text style={styles.periodText}>Este Mes</Text>
            <Text style={styles.periodIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Dashboard Cards */}
        <View style={styles.dashboardSection}>
          <View style={styles.dashboardRow}>
            <View style={[styles.dashboardCard, styles.dashboardCardPrimary]}>
              <Text style={styles.dashboardLabel}>Balance Total</Text>
              <Text style={styles.dashboardAmount}>$651,972</Text>
              <View style={styles.dashboardTrend}>
                <Ionicons name="trending-up" size={16} color={COLORS.black} />
                <Text style={styles.trendText}>+12.5%</Text>
              </View>
            </View>
          </View>

          <View style={styles.dashboardRow}>
            <View style={styles.dashboardCard}>
              <Text style={styles.dashboardLabel}>Ingresos</Text>
              <Text style={styles.dashboardAmountSmall}>$85,420</Text>
              <Text style={styles.dashboardChange}>+8.2%</Text>
            </View>
            <View style={styles.dashboardCard}>
              <Text style={styles.dashboardLabel}>Gastos</Text>
              <Text style={styles.dashboardAmountSmall}>$42,330</Text>
              <Text style={[styles.dashboardChange, styles.dashboardChangeNegative]}>-3.1%</Text>
            </View>
          </View>
        </View>

        {/* Presupuestos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="wallet-outline" size={20} color={COLORS.text} />
              <Text style={styles.sectionTitle}>Presupuestos</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetName}>Comida</Text>
              <Text style={styles.budgetAmount}>$8,450 / $10,000</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '84.5%' }]} />
            </View>
            <Text style={styles.budgetStatus}>Quedan $1,550 • 85% usado</Text>
          </View>

          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetName}>Transporte</Text>
              <Text style={styles.budgetAmount}>$4,200 / $5,000</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '84%' }, styles.progressFillWarning]} />
            </View>
            <Text style={styles.budgetStatus}>Quedan $800 • 84% usado</Text>
          </View>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Crear Presupuesto</Text>
          </TouchableOpacity>
        </View>

        {/* Metas Financieras */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="flag-outline" size={20} color={COLORS.text} />
              <Text style={styles.sectionTitle}>Metas Financieras</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goalCard}>
            <Text style={styles.goalName}>Vacaciones 2025</Text>
            <Text style={styles.goalProgress}>$12,500 / $20,000</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '62.5%' }, styles.progressFillGoal]} />
            </View>
            <Text style={styles.goalStatus}>62% completado • Faltan $7,500</Text>
          </View>

          <View style={styles.goalCard}>
            <Text style={styles.goalName}>Fondo de Emergencia</Text>
            <Text style={styles.goalProgress}>$45,000 / $50,000</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '90%' }, styles.progressFillGoal]} />
            </View>
            <Text style={styles.goalStatus}>90% completado • Faltan $5,000</Text>
          </View>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Crear Meta</Text>
          </TouchableOpacity>
        </View>

        {/* Reportes Rápidos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.text} />
              <Text style={styles.sectionTitle}>Reportes</Text>
            </View>
          </View>

          <View style={styles.reportsGrid}>
            <TouchableOpacity style={styles.reportCard}>
              <Ionicons name="calendar-outline" size={32} color={COLORS.text} />
              <Text style={styles.reportLabel}>Mensual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportCard}>
              <Ionicons name="calendar" size={32} color={COLORS.text} />
              <Text style={styles.reportLabel}>Anual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportCard}>
              <Ionicons name="folder-outline" size={32} color={COLORS.text} />
              <Text style={styles.reportLabel}>Por Proyecto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportCard}>
              <Ionicons name="settings-outline" size={32} color={COLORS.text} />
              <Text style={styles.reportLabel}>Personalizado</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Aprobaciones Pendientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.text} />
              <Text style={styles.sectionTitle}>Aprobaciones</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.approvalCard}>
            <View style={styles.approvalHeader}>
              <View style={styles.approvalIconContainer}>
                <Ionicons name="restaurant-outline" size={24} color="#FF6B6B" />
              </View>
              <View style={styles.approvalInfo}>
                <Text style={styles.approvalName}>Comida en Restaurante</Text>
                <Text style={styles.approvalUser}>Por Juan Pérez</Text>
              </View>
              <Text style={styles.approvalAmount}>$850</Text>
            </View>
            <View style={styles.approvalActions}>
              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.rejectButtonText}>Rechazar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.approveButton}>
                <Text style={styles.approveButtonText}>Aprobar</Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 4,
  },
  periodIcon: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  dashboardSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dashboardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dashboardCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  dashboardCardPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dashboardLabel: {
    fontSize: 13,
    color: COLORS.black,
    opacity: 0.7,
    fontWeight: '500',
    marginBottom: 8,
  },
  dashboardAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  dashboardAmountSmall: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  dashboardTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  dashboardChange: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  dashboardChangeNegative: {
    color: COLORS.error,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
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
  budgetCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  budgetAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressFillWarning: {
    backgroundColor: '#FF9800',
  },
  progressFillGoal: {
    backgroundColor: '#4CAF50',
  },
  budgetStatus: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  goalCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  goalStatus: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderStyle: 'dashed',
  },
  addButtonIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  reportCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    alignItems: 'center',
    margin: '1%',
    marginBottom: 12,
  },
  reportIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  reportLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  approvalCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginBottom: 12,
  },
  approvalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  approvalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  approvalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  approvalInfo: {
    flex: 1,
  },
  approvalName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  approvalUser: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  approvalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  approvalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  approveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  approveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  bottomPadding: {
    height: 100,
  },
});
