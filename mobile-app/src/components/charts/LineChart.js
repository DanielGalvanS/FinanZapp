import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function LineChart({
  data = [],
  labels = [],
  title = null,
  yAxisSuffix = '',
  height = 220,
  showLegend = false,
}) {
  const chartData = {
    labels,
    datasets: [{ data: data.length > 0 ? data : [0] }],
    legend: showLegend ? [title || 'Datos'] : undefined,
  };

  const chartConfig = {
    backgroundColor: COLORS.white,
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: RADIUS.lg,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: COLORS.border,
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[TYPOGRAPHY.bodyBold, styles.title]}>{title}</Text>
      )}
      <RNLineChart
        data={chartData}
        width={SCREEN_WIDTH - SPACING.xl * 2 - 20} // Reduce width to prevent clipping
        height={height}
        chartConfig={{
          ...chartConfig,
          propsForLabels: {
            fontSize: 10,
          },
        }}
        bezier
        style={{
          ...styles.chart,
          paddingRight: 40, // Ensure space for the last label/point
          paddingLeft: 0,
        }}
        yAxisSuffix={yAxisSuffix}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero
      />
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
});
