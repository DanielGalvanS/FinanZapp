import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BUTTON_STYLES } from '../../constants';

export default function FilterPills({
  options = [],
  selected,
  onSelect,
  style,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={styles.content}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            selected === option ? BUTTON_STYLES.pillActive : BUTTON_STYLES.pill,
            styles.pill,
          ]}
          onPress={() => onSelect(option)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              TYPOGRAPHY.caption,
              {
                color: selected === option ? COLORS.white : COLORS.text,
                fontWeight: selected === option ? '700' : '600',
              },
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.xl,
  },
  pill: {
    marginRight: SPACING.sm,
  },
});
