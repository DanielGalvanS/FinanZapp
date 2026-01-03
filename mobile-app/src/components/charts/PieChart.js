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
        <View>
          <View style={styles.chartContainer}>
            <RNPieChart
              data={chartData}
              width={SCREEN_WIDTH - SPACING.xl * 2}
              height={height}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[SCREEN_WIDTH / 4, 0]}
              absolute={false}
              hasLegend={false}
              style={styles.chart}
            />
          </View>

          {showLegend && (
            <View style={styles.legendContainer}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText} numberOfLines={1}>
                    {item.name} ({Math.round((item.population / data.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%)
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
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
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: RADIUS.lg,
  },
  legendContainer: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
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
