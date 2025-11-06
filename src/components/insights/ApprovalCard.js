import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, CARD_STYLES, ICON_SIZE } from '../../constants';
import { formatCurrency } from '../../utils/formatters';

export default function ApprovalCard({
  name,
  userName,
  amount,
  icon = 'help-circle-outline',
  iconColor = COLORS.primary,
  currency = 'MXN',
  onApprove,
  onReject,
}) {
  return (
    <View style={[CARD_STYLES.minimal, styles.container]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={ICON_SIZE.md} color={iconColor} />
        </View>
        <View style={styles.info}>
          <Text style={[TYPOGRAPHY.bodyBold, styles.name]}>
            {name}
          </Text>
          <Text style={[TYPOGRAPHY.caption, styles.user]}>
            Por {userName}
          </Text>
        </View>
        <Text style={[TYPOGRAPHY.lg, styles.amount]}>
          {formatCurrency(amount, currency)}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={onReject}
          activeOpacity={0.7}
        >
          <Text style={[TYPOGRAPHY.bodyBold, styles.rejectButtonText]}>
            Rechazar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={onApprove}
          activeOpacity={0.7}
        >
          <Text style={[TYPOGRAPHY.bodyBold, styles.approveButtonText]}>
            Aprobar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  name: {
    marginBottom: SPACING.xs,
  },
  user: {
    color: COLORS.textSecondary,
  },
  amount: {
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  rejectButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: COLORS.text,
  },
  approveButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  approveButtonText: {
    color: COLORS.white,
  },
});
