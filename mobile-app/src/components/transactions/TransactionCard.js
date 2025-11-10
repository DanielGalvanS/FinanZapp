import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE, CARD_STYLES, LAYOUT } from '../../constants';

export default function TransactionCard({
  transaction,
  onPress,
  showTime = false,
  style,
}) {
  const { name, category, amount, date, icon, color, time } = transaction;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(Math.abs(amount));
  };

  return (
    <TouchableOpacity
      style={[CARD_STYLES.minimal, styles.card, style]}
      activeOpacity={0.7}
      onPress={() => onPress && onPress(transaction)}
    >
      <View style={LAYOUT.rowBetween}>
        <View style={LAYOUT.row}>
          <View style={[styles.icon, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={ICON_SIZE.md} color={color} />
          </View>
          <View style={styles.info}>
            <Text style={TYPOGRAPHY.bodyBold}>{name}</Text>
            <Text style={[TYPOGRAPHY.caption, styles.category]}>
              {showTime && time ? `${category} • ${time}` : category}
            </Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[TYPOGRAPHY.bodyBold, styles.amount]}>
            {amount < 0 ? '-' : '+'}{formatCurrency(amount)}
          </Text>
          <Text style={[TYPOGRAPHY.tiny, styles.date]}>
            {date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginLeft: SPACING.md,
  },
  category: {
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    color: COLORS.error,
  },
  date: {
    marginTop: 2,
  },
});
