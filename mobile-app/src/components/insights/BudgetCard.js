import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, CARD_STYLES } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
import ProgressBar from './ProgressBar';

export default function BudgetCard({
  name,
  spent,
  total,
  currency = 'MXN',
  onPress = null,
}) {
  const remaining = total - spent;
  const percentage = (spent / total) * 100;

  // Determine color based on percentage
  let progressColor = COLORS.primary;
  if (percentage >= 90) {
    progressColor = COLORS.error;
  } else if (percentage >= 70) {
    progressColor = COLORS.warning;
  }

  return (
    <View style={[CARD_STYLES.minimal, styles.container]}>
      <View style={styles.header}>
        <Text style={[TYPOGRAPHY.bodyBold, styles.name]}>
          {name}
        </Text>
        <Text style={[TYPOGRAPHY.body, styles.amount]}>
          {formatCurrency(spent, currency)} / {formatCurrency(total, currency)}
        </Text>
      </View>
      <ProgressBar percentage={percentage} color={progressColor} />
      <Text style={[TYPOGRAPHY.caption, styles.status]}>
        Quedan {formatCurrency(remaining, currency)} • {Math.round(percentage)}% usado
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  name: {
    color: COLORS.text,
  },
  amount: {
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  status: {
    color: COLORS.textSecondary,
  },
});
