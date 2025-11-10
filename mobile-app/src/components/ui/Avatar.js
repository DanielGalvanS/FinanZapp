import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../constants';

export default function Avatar({
  size = 40,
  name = '',
  image = null,
  backgroundColor = COLORS.primary,
  textColor = COLORS.white,
  style,
}) {
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
  };

  const textStyle = {
    color: textColor,
    fontSize: size * 0.4,
  };

  return (
    <View style={[styles.avatar, avatarStyle, style]}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={[styles.text, textStyle]}>{getInitials(name)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontWeight: '700',
  },
});
