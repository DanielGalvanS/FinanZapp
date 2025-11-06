import React from 'react';
import { View, Image, StyleSheet, Modal, TouchableOpacity, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, ICON_SIZE } from '../../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ReceiptViewer({
  visible = false,
  receipt = null,
  onClose,
  onDelete = null,
}) {
  if (!receipt) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={ICON_SIZE.lg} color={COLORS.white} />
          </TouchableOpacity>

          <Text style={[TYPOGRAPHY.h3, styles.headerTitle]}>
            Recibo
          </Text>

          {onDelete && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                onDelete(receipt);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={ICON_SIZE.lg} color={COLORS.white} />
            </TouchableOpacity>
          )}

          {!onDelete && <View style={styles.headerButton} />}
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: receipt.uri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 100,
  },
});
