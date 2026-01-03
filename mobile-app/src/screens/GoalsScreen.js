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
  ICON_SIZE,
  LAYOUT,
} from '../constants';
import { Header } from '../components/ui';
import { GoalCard } from '../components/insights';

// Datos de ejemplo
import useDataStore from '../store/dataStore';
import { useEffect } from 'react';

export default function GoalsScreen() {
  const router = useRouter();
  const goals = useDataStore((state) => state.goals);
  const loadGoals = useDataStore((state) => state.loadGoals);

  useEffect(() => {
    loadGoals();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleCreateGoal = () => {
    router.push('/create-goal');
  };

  const handleGoalPress = (goal) => {
    router.push(`/edit-goal/${goal.id}`);
  };

  const getTotalCurrent = () => {
    return goals.reduce((sum, goal) => sum + goal.current, 0);
  };

  const getTotalTarget = () => {
    return goals.reduce((sum, goal) => sum + goal.target, 0);
  };

  const getOverallPercentage = () => {
    const total = getTotalTarget();
    const current = getTotalCurrent();
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  const getGoalStatus = (goal) => {
    const percentage = Math.round((goal.current / goal.target) * 100);
    if (percentage >= 100) return { label: 'Completada', color: COLORS.success };
    if (percentage >= 75) return { label: 'Casi lista', color: COLORS.warning };
    return { label: 'En progreso', color: COLORS.primary };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Metas Financieras"
        onBack={handleBack}
        rightIcon="add"
        onRightPress={handleCreateGoal}
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
              Progreso Total
            </Text>
            <Text style={[TYPOGRAPHY.h2, styles.summaryAmount]}>
              ${getTotalCurrent().toLocaleString('es-MX')}
            </Text>
            <Text style={[TYPOGRAPHY.body, styles.summaryTarget]}>
              de ${getTotalTarget().toLocaleString('es-MX')}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${getOverallPercentage()}%` }]} />
            </View>
            <Text style={[TYPOGRAPHY.bodyBold, styles.summaryPercentage]}>
              {getOverallPercentage()}% completado
            </Text>
          </View>
        </View>

        {/* Goals List */}
        <View style={LAYOUT.section}>
          <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>
            Mis Metas ({goals.length})
          </Text>

          {goals.length > 0 ? (
            goals.map((goal) => {
              const status = getGoalStatus(goal);
              const percentage = Math.round((goal.current / goal.target) * 100);

              return (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalItem}
                  onPress={() => handleGoalPress(goal)}
                  activeOpacity={0.7}
                >
                  <View style={styles.goalHeader}>
                    <View style={styles.goalIconWrapper}>
                      <View style={[styles.goalIconContainer, { backgroundColor: goal.color + '20' }]}>
                        <Ionicons name={goal.icon} size={ICON_SIZE.md} color={goal.color} />
                      </View>
                      <View style={styles.goalInfo}>
                        <Text style={[TYPOGRAPHY.bodyBold, styles.goalName]}>
                          {goal.name}
                        </Text>
                        <View style={styles.goalDeadline}>
                          <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                          <Text style={[TYPOGRAPHY.caption, styles.goalDeadlineText]}>
                            {formatDate(goal.deadline)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                      <Text style={[TYPOGRAPHY.caption, { color: status.color, fontWeight: '600' }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  <GoalCard
                    name={goal.name}
                    current={goal.current}
                    target={goal.target}
                    showName={false}
                  />

                  <View style={styles.goalFooter}>
                    <Text style={[TYPOGRAPHY.caption, styles.goalFooterText]}>
                      Faltan ${(goal.target - goal.current).toLocaleString('es-MX')} para completar
                    </Text>
                    <Ionicons name="chevron-forward" size={ICON_SIZE.sm} color={COLORS.textSecondary} />
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="flag-outline" size={64} color={COLORS.textSecondary} />
              <Text style={[TYPOGRAPHY.h3, styles.emptyTitle]}>
                No hay metas
              </Text>
              <Text style={[TYPOGRAPHY.body, styles.emptyText]}>
                Crea tu primera meta financiera para empezar a ahorrar
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleCreateGoal}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={ICON_SIZE.sm} color={COLORS.white} />
                <Text style={[TYPOGRAPHY.bodyBold, styles.emptyButtonText]}>
                  Crear Meta
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tips Card */}
        {goals.length > 0 && (
          <View style={LAYOUT.section}>
            <View style={styles.tipsCard}>
              <Ionicons name="bulb" size={ICON_SIZE.md} color={COLORS.warning} />
              <View style={styles.tipsContent}>
                <Text style={[TYPOGRAPHY.bodyBold, styles.tipsTitle]}>
                  Consejo
                </Text>
                <Text style={[TYPOGRAPHY.body, styles.tipsText]}>
                  Establece aportaciones automáticas para alcanzar tus metas más rápido.
                </Text>
              </View>
            </View>
          </View>
        )}

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
    alignItems: 'center',
  },
  summaryLabel: {
    color: COLORS.white,
    opacity: 0.8,
    fontWeight: '500',
  },
  summaryAmount: {
    color: COLORS.white,
    marginTop: SPACING.sm,
  },
  summaryTarget: {
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: SPACING.lg,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
  summaryPercentage: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  goalItem: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  goalIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    marginBottom: SPACING.xs,
  },
  goalDeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goalDeadlineText: {
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  goalFooterText: {
    color: COLORS.textSecondary,
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
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.warning + '10',
    borderColor: COLORS.warning + '30',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    marginBottom: SPACING.xs,
  },
  tipsText: {
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 40,
  },
});
