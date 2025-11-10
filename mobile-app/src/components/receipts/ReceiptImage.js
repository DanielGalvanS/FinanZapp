import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, ICON_SIZE } from '../../constants';

export default function ReceiptImage({
  uri,
  size = 100,
  onPress = null,
  onRemove = null,
  showRemove = true,
}) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={!onPress}
      >
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {showRemove && onRemove && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle" size={ICON_SIZE.md} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageWrapper: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.round,
    padding: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
