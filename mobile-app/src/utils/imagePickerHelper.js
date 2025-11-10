import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

/**
 * Helper para manejar cámara y selección de imágenes
 */

/**
 * Solicita permisos de cámara
 */
export const requestCameraPermissions = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permiso Requerido',
        'Necesitamos acceso a tu cámara para escanear recibos.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al solicitar permisos de cámara:', error);
    return false;
  }
};

/**
 * Solicita permisos de galería
 */
export const requestMediaLibraryPermissions = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permiso Requerido',
        'Necesitamos acceso a tu galería para seleccionar recibos.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al solicitar permisos de galería:', error);
    return false;
  }
};

/**
 * Toma una foto con la cámara
 */
export const takePhoto = async () => {
  try {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Reducir calidad para acelerar subida
      base64: false,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0];
  } catch (error) {
    console.error('Error al tomar foto:', error);
    Alert.alert('Error', 'No se pudo tomar la foto');
    return null;
  }
};

/**
 * Selecciona una imagen de la galería
 */
export const pickImage = async () => {
  try {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: false,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0];
  } catch (error) {
    console.error('Error al seleccionar imagen:', error);
    Alert.alert('Error', 'No se pudo seleccionar la imagen');
    return null;
  }
};

/**
 * Muestra opciones para tomar foto o seleccionar de galería
 */
export const showImagePickerOptions = () => {
  return new Promise((resolve) => {
    Alert.alert(
      'Escanear Recibo',
      'Elige una opción',
      [
        {
          text: 'Tomar Foto',
          onPress: async () => {
            const photo = await takePhoto();
            resolve(photo);
          },
        },
        {
          text: 'Elegir de Galería',
          onPress: async () => {
            const image = await pickImage();
            resolve(image);
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true }
    );
  });
};
