import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function Card({ children, style, variant = 'white' }) {
  return (
    <View style={[styles.card, styles[`card_${variant}`], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.base,
    ...theme.shadows.md,
  },
  card_white: {
    backgroundColor: theme.colors.card.white,
  },
  card_neonGreen: {
    backgroundColor: theme.colors.card.neonGreen,
  },
  card_dark: {
    backgroundColor: theme.colors.card.dark,
  },
  card_gray: {
    backgroundColor: theme.colors.card.gray,
  },
});
