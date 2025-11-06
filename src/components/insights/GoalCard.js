import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, CARD_STYLES } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
import ProgressBar from './ProgressBar';

export default function GoalCard({
  name,
  current,
  target,
  currency = 'MXN',
  onPress = null,
}) {
  const remaining = target - current;
  const percentage = (current / target) * 100;

  return (
    <View style={[CARD_STYLES.minimal, styles.container]}>
      <Text style={[TYPOGRAPHY.bodyBold, styles.name]}>
        {name}
      </Text>
      <Text style={[TYPOGRAPHY.body, styles.progress]}>
        {formatCurrency(current, currency)} / {formatCurrency(target, currency)}
      </Text>
      <ProgressBar percentage={percentage} color={COLORS.success} />
      <Text style={[TYPOGRAPHY.caption, styles.status]}>
        {Math.round(percentage)}% completado • Faltan {formatCurrency(remaining, currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  name: {
    marginBottom: SPACING.sm,
  },
  progress: {
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  status: {
    color: COLORS.textSecondary,
  },
});
