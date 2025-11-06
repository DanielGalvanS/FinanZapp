import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import ReceiptImage from './ReceiptImage';
import ImagePickerButton from './ImagePickerButton';

export default function ReceiptGallery({
  receipts = [],
  onAddReceipt,
  onRemoveReceipt,
  onViewReceipt,
  maxReceipts = 5,
  editable = true,
  label = 'Recibos',
}) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[TYPOGRAPHY.h3, styles.label]}>
          {label}
          {receipts.length > 0 && (
            <Text style={styles.count}> ({receipts.length})</Text>
          )}
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {receipts.map((receipt, index) => (
          <ReceiptImage
            key={receipt.id || index}
            uri={receipt.uri}
            onPress={() => onViewReceipt && onViewReceipt(receipt, index)}
            onRemove={editable ? () => onRemoveReceipt(receipt, index) : null}
            showRemove={editable}
          />
        ))}

        {editable && (
          <ImagePickerButton
            onImageSelected={onAddReceipt}
            maxImages={maxReceipts}
            currentImagesCount={receipts.length}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  count: {
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  scrollContent: {
    gap: SPACING.md,
  },
});
