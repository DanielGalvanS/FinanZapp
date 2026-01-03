import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, CARD_STYLES, ICON_SIZE } from '../../constants';
import { formatCurrency } from '../../utils/formatters';

export default function StatCard({
  label,
  amount,
  change = null,
  changeIcon = null,
  variant = 'default', // 'default' | 'primary'
  currency = 'MXN',
  showCurrency = false,
}) {
  const isPrimary = variant === 'primary';
  const isPositive = change && parseFloat(change) > 0;
  const isNegative = change && parseFloat(change) < 0;

  return (
    <View style={[
      isPrimary ? CARD_STYLES.dark : CARD_STYLES.minimal,
      styles.container,
      isPrimary && styles.containerPrimary
    ]}>
      <Text style={[
        TYPOGRAPHY.caption,
        isPrimary ? styles.labelPrimary : styles.labelSecondary
      ]}>
        {label}
      </Text>
      <Text
        style={[
          isPrimary ? TYPOGRAPHY.h2 : TYPOGRAPHY.h3,
          isPrimary ? styles.amountPrimary : styles.amountSecondary
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {showCurrency ? formatCurrency(amount, currency) : `$${amount.toLocaleString('es-MX')}`}
      </Text>

      {change && (
        <View style={styles.changeContainer}>
          {changeIcon && (
            <Ionicons
              name={changeIcon}
              size={ICON_SIZE.sm}
              color={isPrimary ? COLORS.white : (isNegative ? COLORS.error : COLORS.success)}
            />
          )}
          <Text style={[
            TYPOGRAPHY.body,
            isPrimary ? styles.changePrimary : styles.changeSecondary,
            isNegative && !isPrimary && styles.changeNegative
          ]}>
            {change}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerPrimary: {
    marginBottom: 0,
  },
  labelPrimary: {
    color: COLORS.white,
    opacity: 0.7,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  labelSecondary: {
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  amountPrimary: {
    color: COLORS.white,
    marginBottom: SPACING.sm,
    letterSpacing: -1,
  },
  amountSecondary: {
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  changePrimary: {
    fontWeight: '600',
    color: COLORS.white,
  },
  changeSecondary: {
    fontWeight: '600',
    color: COLORS.success,
  },
  changeNegative: {
    color: COLORS.error,
  },
});
