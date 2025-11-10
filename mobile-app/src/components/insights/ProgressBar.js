import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants';

export default function ProgressBar({
  percentage = 0,
  color = COLORS.primary,
  height = 8,
}) {
  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, percentage))}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.xs,
  },
});
