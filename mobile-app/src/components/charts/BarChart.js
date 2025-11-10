import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart as RNBarChart } from 'react-native-chart-kit';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BarChart({
  data = [],
  labels = [],
  title = null,
  yAxisSuffix = '',
  height = 220,
  showValues = true,
}) {
  const chartData = {
    labels,
    datasets: [{ data: data.length > 0 ? data : [0] }],
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
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: COLORS.border,
      strokeWidth: 1,
    },
    barPercentage: 0.7,
  };

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[TYPOGRAPHY.bodyBold, styles.title]}>{title}</Text>
      )}
      <RNBarChart
        data={chartData}
        width={SCREEN_WIDTH - SPACING.xl * 2}
        height={height}
        chartConfig={chartConfig}
        style={styles.chart}
        yAxisSuffix={yAxisSuffix}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        showValuesOnTopOfBars={showValues}
        fromZero={true}
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
