import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.neutral.black : theme.colors.neutral.white}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },

  // Variants
  button_primary: {
    backgroundColor: theme.colors.primary.main,
  },
  button_secondary: {
    backgroundColor: theme.colors.neutral.black,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.neutral.black,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  button_small: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    minHeight: 36,
  },
  button_medium: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 48,
  },
  button_large: {
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 56,
  },

  // Disabled
  button_disabled: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    ...theme.textStyles.button,
    textAlign: 'center',
  },
  text_primary: {
    color: theme.colors.neutral.black,
  },
  text_secondary: {
    color: theme.colors.neutral.white,
  },
  text_outline: {
    color: theme.colors.neutral.black,
  },
  text_ghost: {
    color: theme.colors.neutral.black,
  },
  text_small: {
    fontSize: theme.typography.fontSize.sm,
  },
  text_medium: {
    fontSize: theme.typography.fontSize.base,
  },
  text_large: {
    fontSize: theme.typography.fontSize.lg,
  },
  text_disabled: {
    opacity: 1,
  },
});
