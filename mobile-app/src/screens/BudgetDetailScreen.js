
import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import {
    COLORS,
    SPACING,
    RADIUS,
    TYPOGRAPHY,
    ICON_SIZE,
    LAYOUT,
    CARD_STYLES,
} from '../constants';
import { Header } from '../components/ui';
import { TransactionCard } from '../components/transactions';
import useDataStore from '../store/dataStore';
import useExpenseStore from '../store/expenseStore';
import { formatCurrency, formatDate } from '../utils/formatters';

const { width } = Dimensions.get('window');

export default function BudgetDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const scrollY = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();

    // Get data from stores
    const budgets = useDataStore((state) => state.budgets);
    const categories = useDataStore((state) => state.categories);
    const expenses = useExpenseStore((state) => state.expenses);

    // Find the budget
    const budget = budgets.find(b => b.id === id);

    // Get expenses for this category in current month
    const categoryExpenses = useMemo(() => {
        if (!budget?.category?.id) return [];

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return (
                expense.category_id === budget.category.id &&
                expenseDate.getMonth() === currentMonth &&
                expenseDate.getFullYear() === currentYear
            );
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [expenses, budget]);

    // Calculate metrics
    const totalSpent = categoryExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const percentage = budget?.total ? Math.round((totalSpent / budget.total) * 100) : 0;
    const remaining = (budget?.total || 0) - totalSpent;

    // Daily Average
    const today = new Date().getDate();
    const dailyAverage = today > 0 ? totalSpent / today : 0;

    // Projected
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const projected = dailyAverage * daysInMonth;

    const handleBack = () => {
        router.back();
    };

    const handleExpensePress = (expense) => {
        router.push(`/expense-detail/${expense.id}`);
    };

    const handleEdit = () => {
        router.push(`/edit-budget/${id}`);
    };

    if (!budget) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <Header title="Detalle" onBack={handleBack} />
                <View style={styles.emptyContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={COLORS.textTertiary} />
                    <Text style={[TYPOGRAPHY.h3, styles.emptyTitle]}>Presupuesto no encontrado</Text>
                </View>
            </View>
        );
    }

    const getStatusColor = () => {
        if (percentage >= 100) return COLORS.error;
        if (percentage >= 80) return COLORS.warning;
        return COLORS.success;
    };

    const statusColor = getStatusColor();
    const categoryColor = budget.category?.color || COLORS.primary;

    // Header Animation
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            {/* Background Gradient */}
            <View style={[styles.backgroundHeader, { backgroundColor: categoryColor }]} />

            <View style={styles.contentContainer}>
                <Animated.ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingTop: 80 + insets.top, paddingBottom: insets.bottom + SPACING.xl }
                    ]}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                >
                    {/* Main Card */}
                    <View style={styles.mainCard}>
                        <View style={styles.iconContainer}>
                            <View style={[styles.iconCircle, { backgroundColor: categoryColor + '20' }]}>
                                <Ionicons
                                    name={budget.category?.icon || 'wallet-outline'}
                                    size={40}
                                    color={categoryColor}
                                />
                            </View>
                        </View>

                        <Text style={styles.categoryName}>{budget.category?.name || 'Sin categoría'}</Text>

                        <View style={styles.balanceContainer}>
                            <Text style={styles.balanceLabel}>Disponible</Text>
                            <Text style={[styles.balanceAmount, { color: remaining < 0 ? COLORS.error : COLORS.text }]}>
                                {formatCurrency(remaining)}
                            </Text>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressSection}>
                            <View style={styles.progressLabels}>
                                <Text style={styles.progressLabel}>
                                    {percentage}% usado
                                </Text>
                                <Text style={styles.progressLabel}>
                                    {formatCurrency(totalSpent)} de {formatCurrency(budget.total)}
                                </Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${Math.min(percentage, 100)}% `,
                                            backgroundColor: statusColor
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Metrics Grid */}
                    <View style={styles.metricsGrid}>
                        <View style={styles.metricCard}>
                            <View style={[styles.metricIcon, { backgroundColor: COLORS.blue + '20' }]}>
                                <Ionicons name="calendar-outline" size={20} color={COLORS.blue} />
                            </View>
                            <Text style={styles.metricLabel}>Promedio Diario</Text>
                            <Text style={styles.metricValue}>{formatCurrency(dailyAverage)}</Text>
                        </View>

                        <View style={styles.metricCard}>
                            <View style={[styles.metricIcon, { backgroundColor: COLORS.purple + '20' }]}>
                                <Ionicons name="trending-up-outline" size={20} color={COLORS.purple} />
                            </View>
                            <Text style={styles.metricLabel}>Proyección Mes</Text>
                            <Text style={styles.metricValue}>{formatCurrency(projected)}</Text>
                        </View>
                    </View>

                    {/* Expenses List */}
                    <View style={styles.expensesSection}>
                        <Text style={styles.sectionTitle}>Movimientos del Mes</Text>

                        {categoryExpenses.length > 0 ? (
                            categoryExpenses.map((expense) => {
                                const category = categories.find(c => c.id === expense.category_id);
                                return (
                                    <TransactionCard
                                        key={expense.id}
                                        transaction={{
                                            id: expense.id,
                                            name: expense.name,
                                            category: category?.name || 'Sin categoría',
                                            amount: -expense.amount,
                                            date: formatDate(expense.date, 'short'),
                                            icon: category?.icon || 'pricetag-outline',
                                            color: category?.color || COLORS.textSecondary,
                                        }}
                                        onPress={() => handleExpensePress(expense)}
                                        style={styles.expenseCard}
                                    />
                                );
                            })
                        ) : (
                            <View style={styles.emptyExpenses}>
                                <Ionicons name="receipt-outline" size={48} color={COLORS.textTertiary} />
                                <Text style={styles.emptyExpensesText}>
                                    No hay gastos registrados este mes
                                </Text>
                            </View>
                        )}
                    </View>
                </Animated.ScrollView>

                {/* Absolute Header with Gradient Fade */}
                <View style={[styles.absoluteHeader, { paddingTop: insets.top }]}>
                    {/* Gradient Background that fades in */}
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                opacity: headerOpacity,
                                borderBottomLeftRadius: 20,
                                borderBottomRightRadius: 20,
                                overflow: 'hidden',
                                backgroundColor: COLORS.white, // Ensure background is white for the gradient to sit on top if needed, or just let gradient handle it. 
                                // Actually, the gradient goes from background to background opacity 0.9. 
                                // If I want a visible curve, the background needs to be visible.
                            }
                        ]}
                    >
                        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                            <Defs>
                                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor={COLORS.background} stopOpacity="1" />
                                    <Stop offset="1" stopColor={COLORS.background} stopOpacity="0.95" />
                                </LinearGradient>
                            </Defs>
                            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
                        </Svg>
                        {/* Bottom border line that also fades in */}
                        <View style={styles.headerBorder} />
                    </Animated.View>

                    <Header
                        title="Presupuesto"
                        onBack={handleBack}
                        style={styles.header}
                        rightIcon="create-outline"
                        onRightPress={handleEdit}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    safeArea: {
        flex: 1,
    },
    backgroundHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        opacity: 0.1,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    header: {
        paddingHorizontal: SPACING.xl,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xxl,
    },
    mainCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginTop: SPACING.sm,
        ...CARD_STYLES.shadow,
    },
    iconContainer: {
        marginBottom: SPACING.md,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryName: {
        ...TYPOGRAPHY.h2,
        marginBottom: SPACING.xl,
        textAlign: 'center',
    },
    balanceContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    balanceLabel: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: '700',
        color: COLORS.text,
        letterSpacing: -1,
    },
    progressSection: {
        width: '100%',
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xs,
    },
    progressLabel: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    progressBarBg: {
        height: 12,
        backgroundColor: COLORS.gray100,
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
    },
    metricsGrid: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.lg,
    },
    metricCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        ...CARD_STYLES.shadow,
    },
    metricIcon: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.round,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    metricLabel: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    metricValue: {
        ...TYPOGRAPHY.h4,
        color: COLORS.text,
    },
    expensesSection: {
        marginTop: SPACING.xl,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        marginBottom: SPACING.md,
        marginLeft: SPACING.xs,
    },
    expenseCard: {
        marginBottom: SPACING.sm,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        borderWidth: 0,
        ...CARD_STYLES.shadow,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        marginTop: SPACING.md,
        color: COLORS.textSecondary,
    },
    emptyExpenses: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emptyExpensesText: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginTop: SPACING.sm,
    },
    absoluteHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerBorder: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: COLORS.border,
    },
    contentContainer: {
        flex: 1,
    },
});
