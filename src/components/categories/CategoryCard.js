import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE, CARD_STYLES, LAYOUT } from '../../constants';

export default function CategoryCard({
  category,
  onPress,
  style,
}) {
  const { name, amount, icon, color, percentage } = category;

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
      onPress={() => onPress && onPress(category)}
    >
      <View style={LAYOUT.row}>
        <View style={[styles.icon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={ICON_SIZE.md} color={color} />
        </View>
        <View style={styles.info}>
          <Text style={TYPOGRAPHY.bodyBold}>{name}</Text>
          <Text style={[TYPOGRAPHY.caption, styles.percentage]}>
            {percentage}% del total
          </Text>
        </View>
        <Text style={[TYPOGRAPHY.bodyBold, styles.amount]}>
          {formatCurrency(amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  percentage: {
    marginTop: SPACING.xs,
  },
  amount: {
    color: COLORS.text,
  },
});
