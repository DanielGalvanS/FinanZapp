import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function DatePickerInput({ value, onChange, label }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value.split('/').reverse().join('-')) : new Date());

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (date) {
      setSelectedDate(date);
      onChange(formatDate(date));
    }
  };

  const handlePressDate = () => {
    setShowPicker(true);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  const handleConfirm = () => {
    setShowPicker(false);
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity style={styles.dateButton} onPress={handlePressDate}>
        <Ionicons name="calendar-clear-outline" style={styles.dateIcon} />
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <View>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            locale="es-MX"
          />

          {Platform.OS === 'ios' && (
            <View style={styles.iosButtonsContainer}>
              <TouchableOpacity style={styles.iosButton} onPress={handleCancel}>
                <Text style={styles.iosButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iosButton, styles.iosButtonPrimary]}
                onPress={handleConfirm}
              >
                <Text style={[styles.iosButtonText, styles.iosButtonTextPrimary]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: 16,
    padding: 16,
  },
  dateIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  iosButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    gap: 12,
  },
  iosButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
  },
  iosButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  iosButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  iosButtonTextPrimary: {
    color: COLORS.white,
  },
});
