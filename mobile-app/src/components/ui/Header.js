import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE } from '../../constants';

export default function Header({
  title,
  onBack = null,
  onClose = null,
  rightText = null,
  rightAction = null,
  rightIcon = null,
  onRightPress = null,
  style,
}) {
  return (
    <View style={[styles.header, style]}>
      {/* Left Button */}
      {onBack || onClose ? (
        <TouchableOpacity
          onPress={onBack || onClose}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={onBack ? 'chevron-back' : 'close'}
            size={ICON_SIZE.md}
            color={COLORS.text}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Title */}
      <Text style={TYPOGRAPHY.h3} numberOfLines={1}>
        {title}
      </Text>

      {/* Right Button */}
      {rightText || rightAction || rightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          style={[
            rightIcon ? styles.iconButton : styles.textButton,
            rightAction && styles.rightActionButton
          ]}
          activeOpacity={0.7}
        >
          {rightIcon ? (
            <Ionicons name={rightIcon} size={ICON_SIZE.md} color={COLORS.text} />
          ) : rightText ? (
            <Text style={TYPOGRAPHY.bodyBold}>{rightText}</Text>
          ) : (
            rightAction
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActionButton: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
  },
  placeholder: {
    width: 40,
  },
  textButton: {
    padding: SPACING.sm,
  },
});
