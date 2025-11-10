import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE } from '../../constants';

export default function ImagePickerButton({
  onImageSelected,
  maxImages = 5,
  currentImagesCount = 0,
  size = 100,
}) {
  const canAddMore = currentImagesCount < maxImages;

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Permisos Necesarios',
          'Necesitamos permisos para acceder a la cámara y galería.'
        );
        return false;
      }
    }
    return true;
  };

  const showImageOptions = async () => {
    if (!canAddMore) {
      Alert.alert('Límite Alcanzado', `Solo puedes agregar hasta ${maxImages} imágenes`);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Agregar Recibo',
      'Selecciona una opción',
      [
        {
          text: 'Tomar Foto',
          onPress: handleTakePhoto,
        },
        {
          text: 'Elegir de Galería',
          onPress: handlePickImage,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: size, height: size },
        !canAddMore && styles.containerDisabled,
      ]}
      onPress={showImageOptions}
      activeOpacity={0.7}
      disabled={!canAddMore}
    >
      <Ionicons
        name="camera"
        size={ICON_SIZE.lg}
        color={canAddMore ? COLORS.primary : COLORS.textSecondary}
      />
      <Text style={[
        TYPOGRAPHY.caption,
        styles.label,
        !canAddMore && styles.labelDisabled,
      ]}>
        {canAddMore ? 'Agregar' : 'Máximo'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + '05',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  containerDisabled: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundSecondary,
  },
  label: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  labelDisabled: {
    color: COLORS.textSecondary,
  },
});
