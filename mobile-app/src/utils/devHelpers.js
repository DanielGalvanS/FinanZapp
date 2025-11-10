/**
 * Utilidades de desarrollo para facilitar las pruebas
 * NO usar en producción
 */

import useExpenseStore from '../store/expenseStore';
import { COLORS } from '../constants';

/**
 * Crea gastos de ejemplo para testing
 */
export const createSampleExpenses = () => {
  const addExpense = useExpenseStore.getState().addExpense;

  const sampleExpenses = [
    {
      name: 'Uber a la oficina',
      amount: 120.50,
      categoryId: 2,
      categoryName: 'Transporte',
      categoryIcon: 'car-outline',
      categoryColor: COLORS.categoryTransport,
      projectId: 1,
      projectName: 'Personal',
      description: 'Viaje matutino con tráfico pesado',
      date: new Date(2025, 0, 27, 14, 30).toISOString(),
      receipts: [],
      comments: [],
    },
    {
      name: 'Comida en restaurante',
      amount: 450,
      categoryId: 1,
      categoryName: 'Comida',
      categoryIcon: 'restaurant-outline',
      categoryColor: COLORS.categoryFood,
      projectId: 1,
      projectName: 'Personal',
      description: 'Almuerzo de negocios',
      date: new Date(2025, 0, 26, 13, 45).toISOString(),
      receipts: [],
      comments: [],
    },
    {
      name: 'Netflix',
      amount: 199,
      categoryId: 3,
      categoryName: 'Entretenimiento',
      categoryIcon: 'game-controller-outline',
      categoryColor: COLORS.categoryEntertainment,
      projectId: 1,
      projectName: 'Personal',
      description: 'Suscripción mensual',
      date: new Date(2025, 0, 25, 8, 0).toISOString(),
      receipts: [],
      comments: [],
    },
    {
      name: 'Compras en Amazon',
      amount: 1250,
      categoryId: 4,
      categoryName: 'Compras',
      categoryIcon: 'cart-outline',
      categoryColor: COLORS.categoryShopping,
      projectId: 1,
      projectName: 'Personal',
      description: 'Artículos de oficina',
      date: new Date(2025, 0, 24, 16, 30).toISOString(),
      receipts: [],
      comments: [],
    },
    {
      name: 'Consulta médica',
      amount: 800,
      categoryId: 5,
      categoryName: 'Salud',
      categoryIcon: 'medkit-outline',
      categoryColor: COLORS.categoryHealth,
      projectId: 1,
      projectName: 'Personal',
      description: 'Chequeo general',
      date: new Date(2025, 0, 23, 10, 0).toISOString(),
      receipts: [],
      comments: [],
    },
  ];

  sampleExpenses.forEach(expense => addExpense(expense));

  console.log('✅ Se crearon', sampleExpenses.length, 'gastos de ejemplo');
  return sampleExpenses.length;
};

/**
 * Limpia todos los gastos del store
 */
export const clearAllData = () => {
  const clearAllExpenses = useExpenseStore.getState().clearAllExpenses;
  clearAllExpenses();
  console.log('🗑️ Todos los datos han sido eliminados');
};

/**
 * Muestra estadísticas del store
 */
export const showStoreStats = () => {
  const expenses = useExpenseStore.getState().expenses;
  const total = useExpenseStore.getState().getTotalExpenses();

  console.log('📊 Estadísticas del Store:');
  console.log('  Total de gastos:', expenses.length);
  console.log('  Monto total:', `$${total.toLocaleString('es-MX')}`);
  console.log('  Promedio:', expenses.length > 0 ? `$${(total / expenses.length).toLocaleString('es-MX')}` : '$0');

  if (expenses.length > 0) {
    console.log('  Último gasto:', expenses[0].name, '-', `$${expenses[0].amount}`);
  }

  return { count: expenses.length, total, average: expenses.length > 0 ? total / expenses.length : 0 };
};

/**
 * Hook de utilidades de desarrollo
 * Usar en componentes para acceder fácilmente a funciones de desarrollo
 */
export const useDevTools = () => {
  return {
    createSampleExpenses,
    clearAllData,
    showStoreStats,
    store: useExpenseStore,
  };
};

// Exportar funciones globalmente en modo desarrollo
if (__DEV__) {
  global.devTools = {
    createSampleExpenses,
    clearAllData,
    showStoreStats,
    getStore: () => useExpenseStore.getState(),
  };

  console.log('🛠️ Dev Tools disponibles:');
  console.log('  devTools.createSampleExpenses() - Crea gastos de ejemplo');
  console.log('  devTools.clearAllData() - Limpia todos los datos');
  console.log('  devTools.showStoreStats() - Muestra estadísticas');
  console.log('  devTools.getStore() - Accede al store directamente');
}

export default {
  createSampleExpenses,
  clearAllData,
  showStoreStats,
  useDevTools,
};
