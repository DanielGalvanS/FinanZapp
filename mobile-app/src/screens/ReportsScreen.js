import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  ICON_SIZE,
  LAYOUT,
} from '../constants';
import { Header } from '../components/ui';
import { LineChart, BarChart, PieChart } from '../components/charts';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PERIODS = [
  { id: 'week', label: 'Semana', icon: 'calendar-outline' },
  { id: 'month', label: 'Mes', icon: 'calendar' },
  { id: 'year', label: 'Año', icon: 'calendar-sharp' },
];

// Mock data para las gráficas
const MOCK_TREND_DATA = {
  week: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{ data: [450, 680, 320, 890, 560, 920, 430] }],
  },
  month: {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [{ data: [3200, 4100, 2800, 3900] }],
  },
  year: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{ data: [12000, 15000, 11000, 18000, 14000, 16000, 13000, 19000, 15000, 17000, 14000, 16000] }],
  },
};

const MOCK_CATEGORY_BAR_DATA = {
  week: {
    labels: ['Comida', 'Trans', 'Enter', 'Compras'],
    datasets: [{ data: [1200, 800, 450, 680] }],
  },
  month: {
    labels: ['Comida', 'Trans', 'Enter', 'Compras', 'Salud'],
    datasets: [{ data: [5400, 3200, 1800, 2100, 1500] }],
  },
  year: {
    labels: ['Comida', 'Trans', 'Enter', 'Compras', 'Salud', 'Edu'],
    datasets: [{ data: [65000, 38000, 22000, 25000, 18000, 12000] }],
  },
};

const MOCK_CATEGORY_PIE_DATA = {
  week: [
    { name: 'Comida', value: 1200, color: COLORS.categoryFood },
    { name: 'Transporte', value: 800, color: COLORS.categoryTransport },
    { name: 'Entretenimiento', value: 450, color: COLORS.categoryEntertainment },
    { name: 'Compras', value: 680, color: COLORS.categoryShopping },
  ],
  month: [
    { name: 'Comida', value: 5400, color: COLORS.categoryFood },
    { name: 'Transporte', value: 3200, color: COLORS.categoryTransport },
    { name: 'Entretenimiento', value: 1800, color: COLORS.categoryEntertainment },
    { name: 'Compras', value: 2100, color: COLORS.categoryShopping },
    { name: 'Salud', value: 1500, color: COLORS.categoryHealth },
  ],
  year: [
    { name: 'Comida', value: 65000, color: COLORS.categoryFood },
    { name: 'Transporte', value: 38000, color: COLORS.categoryTransport },
    { name: 'Entretenimiento', value: 22000, color: COLORS.categoryEntertainment },
    { name: 'Compras', value: 25000, color: COLORS.categoryShopping },
    { name: 'Salud', value: 18000, color: COLORS.categoryHealth },
    { name: 'Educación', value: 12000, color: COLORS.categoryEducation },
  ],
};

const MOCK_STATS = {
  week: {
    total: 4330,
    average: 618,
    highest: 920,
    lowest: 320,
    transactions: 35,
  },
  month: {
    total: 14000,
    average: 3500,
    highest: 4100,
    lowest: 2800,
    transactions: 142,
  },
  year: {
    total: 180000,
    average: 15000,
    highest: 19000,
    lowest: 11000,
    transactions: 1456,
  },
};

export default function ReportsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const handleBack = () => {
    router.back();
  };

  const handleExport = () => {
    Alert.alert(
      'Exportar Reporte',
      'Selecciona el formato de exportación',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'PDF', onPress: () => Alert.alert('Exportando', 'Generando reporte en PDF...') },
        { text: 'Excel', onPress: () => Alert.alert('Exportando', 'Generando reporte en Excel...') },
      ]
    );
  };

  const stats = MOCK_STATS[selectedPeriod];
  const trendData = MOCK_TREND_DATA[selectedPeriod];
  const barData = MOCK_CATEGORY_BAR_DATA[selectedPeriod];
  const pieData = MOCK_CATEGORY_PIE_DATA[selectedPeriod];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Reportes"
        onBack={handleBack}
        rightIcon="download-outline"
        onRightPress={handleExport}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Period Selector */}
        <View style={LAYOUT.section}>
          <View style={styles.periodSelector}>
            {PERIODS.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.id && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={period.icon}
                  size={ICON_SIZE.sm}
                  color={selectedPeriod === period.id ? COLORS.white : COLORS.textSecondary}
                />
                <Text
                  style={[
                    TYPOGRAPHY.bodyBold,
                    styles.periodButtonText,
                    selectedPeriod === period.id && styles.periodButtonTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Cards */}
        <View style={LAYOUT.section}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="cash" size={ICON_SIZE.md} color={COLORS.primary} />
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>
                Total Gastado
              </Text>
              <Text style={[TYPOGRAPHY.h3, styles.statValue]}>
                ${stats.total.toLocaleString('es-MX')}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={ICON_SIZE.md} color={COLORS.success} />
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>
                Promedio
              </Text>
              <Text style={[TYPOGRAPHY.h3, styles.statValue]}>
                ${stats.average.toLocaleString('es-MX')}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="arrow-up-circle" size={ICON_SIZE.md} color={COLORS.error} />
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>
                Más Alto
              </Text>
              <Text style={[TYPOGRAPHY.h3, styles.statValue]}>
                ${stats.highest.toLocaleString('es-MX')}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="arrow-down-circle" size={ICON_SIZE.md} color={COLORS.warning} />
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>
                Más Bajo
              </Text>
              <Text style={[TYPOGRAPHY.h3, styles.statValue]}>
                ${stats.lowest.toLocaleString('es-MX')}
              </Text>
            </View>
          </View>
        </View>

        {/* Spending Trend Chart */}
        <View style={LAYOUT.section}>
          <View style={styles.chartCard}>
            <LineChart
              data={trendData}
              labels={trendData.labels}
              title="Tendencia de Gastos"
              yAxisSuffix=""
              height={220}
            />
          </View>
        </View>

        {/* Category Comparison Bar Chart */}
        <View style={LAYOUT.section}>
          <View style={styles.chartCard}>
            <BarChart
              data={barData}
              labels={barData.labels}
              title="Comparación por Categoría"
              yAxisSuffix=""
              height={220}
              showValues={false}
            />
          </View>
        </View>

        {/* Category Distribution Pie Chart */}
        <View style={LAYOUT.section}>
          <View style={styles.chartCard}>
            <PieChart
              data={pieData}
              title="Distribución por Categoría"
              height={220}
              showLegend={true}
            />
          </View>
        </View>

        {/* Additional Stats */}
        <View style={LAYOUT.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={[TYPOGRAPHY.body, styles.infoLabel]}>
                Total de transacciones
              </Text>
              <Text style={[TYPOGRAPHY.bodyBold, styles.infoValue]}>
                {stats.transactions}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[TYPOGRAPHY.body, styles.infoLabel]}>
                Gasto diario promedio
              </Text>
              <Text style={[TYPOGRAPHY.bodyBold, styles.infoValue]}>
                ${Math.round(stats.total / (selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365)).toLocaleString('es-MX')}
              </Text>
            </View>
          </View>
        </View>

        {/* Insights Card */}
        <View style={LAYOUT.section}>
          <View style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <Ionicons name="bulb" size={ICON_SIZE.md} color={COLORS.warning} />
              <Text style={[TYPOGRAPHY.bodyBold, styles.insightsTitle]}>
                Análisis
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="checkmark-circle" size={ICON_SIZE.sm} color={COLORS.success} />
              <Text style={[TYPOGRAPHY.body, styles.insightText]}>
                Tu categoría más alta es Comida, representa el{' '}
                {Math.round((pieData[0].value / stats.total) * 100)}% del total
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="alert-circle" size={ICON_SIZE.sm} color={COLORS.warning} />
              <Text style={[TYPOGRAPHY.body, styles.insightText]}>
                Has gastado {stats.transactions} veces en este período
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="trending-up" size={ICON_SIZE.sm} color={COLORS.primary} />
              <Text style={[TYPOGRAPHY.body, styles.insightText]}>
                Tu gasto promedio diario es de ${Math.round(stats.total / (selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365)).toLocaleString('es-MX')}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xs,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    color: COLORS.textSecondary,
  },
  periodButtonTextActive: {
    color: COLORS.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  statValue: {
    color: COLORS.text,
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoLabel: {
    color: COLORS.textSecondary,
  },
  infoValue: {
    color: COLORS.text,
  },
  insightsCard: {
    backgroundColor: COLORS.warning + '10',
    borderColor: COLORS.warning + '30',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  insightsTitle: {
    color: COLORS.text,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  insightText: {
    flex: 1,
    lineHeight: 20,
    color: COLORS.text,
  },
  bottomPadding: {
    height: 40,
  },
});
