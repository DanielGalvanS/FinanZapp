import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE } from '../../constants';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onClear = null,
  style,
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChangeText('');
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search-outline" size={ICON_SIZE.sm} color={COLORS.textSecondary} />
      <TextInput
        style={[TYPOGRAPHY.body, styles.input]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={ICON_SIZE.sm} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.text,
  },
});
