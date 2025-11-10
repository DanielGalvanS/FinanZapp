import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, CARD_STYLES, ICON_SIZE } from '../../constants';
import { formatCurrency } from '../../utils/formatters';

export default function BalanceCard({
  balance,
  income,
  expenses,
  comparison = null,
  comparisonTrend = 'down', // 'up' | 'down' | 'neutral'
  currency = 'MXN',
}) {
  const getTrendIcon = () => {
    switch (comparisonTrend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'remove-outline';
    }
  };

  return (
    <View style={[CARD_STYLES.dark, styles.container]}>
      <Text style={[TYPOGRAPHY.caption, styles.label]}>
        Balance Total
      </Text>
      <Text style={[TYPOGRAPHY.h1, styles.amount]}>
        {formatCurrency(balance, currency)}
      </Text>
      <Text style={[TYPOGRAPHY.caption, styles.currency]}>
        {currency}
      </Text>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>Ingresos</Text>
          <Text style={[TYPOGRAPHY.h4, styles.statAmount]}>
            +{formatCurrency(income, currency)}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>Gastos</Text>
          <Text style={[TYPOGRAPHY.h4, styles.statAmount]}>
            -{formatCurrency(expenses, currency)}
          </Text>
        </View>
      </View>

      {comparison && (
        <View style={styles.comparisonContainer}>
          <Ionicons name={getTrendIcon()} size={ICON_SIZE.sm} color={COLORS.white} />
          <Text style={[TYPOGRAPHY.caption, styles.comparisonText]}>
            {comparison}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  label: {
    color: COLORS.white,
    opacity: 0.7,
    fontWeight: '500',
  },
  amount: {
    color: COLORS.white,
    marginTop: SPACING.sm,
    letterSpacing: -2,
  },
  currency: {
    color: COLORS.white,
    opacity: 0.7,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  stats: {
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
});
