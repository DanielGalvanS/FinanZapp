import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PieChart({
  data = [],
  title = null,
  height = 220,
  showLegend = true,
}) {
  // Format data for the chart
  const chartData = data.map((item, index) => ({
    name: item.name,
    population: item.value,
    color: item.color || COLORS.primary,
    legendFontColor: COLORS.textSecondary,
    legendFontSize: 12,
  }));

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[TYPOGRAPHY.bodyBold, styles.title]}>{title}</Text>
      )}
      {chartData.length > 0 ? (
        <RNPieChart
          data={chartData}
          width={SCREEN_WIDTH - SPACING.xl * 2}
          height={height}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft={showLegend ? '0' : '50'}
          center={showLegend ? undefined : [10, 0]}
          absolute={false}
          hasLegend={showLegend}
          style={styles.chart}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[TYPOGRAPHY.body, styles.emptyText]}>
            No hay datos para mostrar
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  title: {
    marginBottom: SPACING.md,
  },
  chart: {
    borderRadius: RADIUS.lg,
  },
  emptyState: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
  },
  emptyText: {
    color: COLORS.textSecondary,
  },
});
