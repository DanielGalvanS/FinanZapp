import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import dataService from '../services/dataService';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      isLoading: false,
      error: null,

      // Cargar gastos desde el backend
      loadExpenses: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
          const expenses = await dataService.getExpenses(filters);
          set({ expenses, isLoading: false });
        } catch (error) {
          console.error('[ExpenseStore] Error al cargar gastos:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // Agregar un nuevo gasto
      addExpense: async (expenseData) => {
        try {
          const newExpense = await dataService.saveExpense(expenseData);
          set((state) => ({
            expenses: [newExpense, ...state.expenses],
          }));
          return newExpense;
        } catch (error) {
          console.error('[ExpenseStore] Error al agregar gasto:', error);
          throw error;
        }
      },

      // Agregar gasto al store local sin guardar en BD (para cuando ya se guardó en Supabase)
      addExpenseToStore: (expense) => {
        set((state) => ({
          expenses: [expense, ...state.expenses],
        }));
      },

      // Actualizar un gasto existente (TODO: Implementar update en backend)
      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id
              ? {
                ...expense,
                ...updates,
                updatedAt: new Date().toISOString()
              }
              : expense
          ),
        }));
      },

      // Eliminar un gasto (TODO: Implementar delete en backend)
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },

      // Obtener un gasto por ID
      getExpenseById: (id) => {
        return get().expenses.find((expense) => expense.id === id);
      },

      // Obtener gastos filtrados
      getExpensesByFilters: (filters = {}) => {
        let filtered = get().expenses;

        // Filtrar por proyecto
        if (filters.projectId) {
          filtered = filtered.filter((expense) => expense.project_id === filters.projectId);
        }

        // Filtrar por categoría
        if (filters.categoryId) {
          filtered = filtered.filter((expense) => expense.category_id === filters.categoryId);
        }

        // Filtrar por rango de fechas
        if (filters.startDate) {
          filtered = filtered.filter(
            (expense) => new Date(expense.date) >= new Date(filters.startDate)
          );
        }

        if (filters.endDate) {
          filtered = filtered.filter(
            (expense) => new Date(expense.date) <= new Date(filters.endDate)
          );
        }

        // Filtrar por búsqueda de texto
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(
            (expense) =>
              expense.name.toLowerCase().includes(searchLower) ||
              expense.description?.toLowerCase().includes(searchLower)
          );
        }

        return filtered;
      },

      // Obtener total de gastos
      getTotalExpenses: (filters = {}) => {
        const expenses = get().getExpensesByFilters(filters);
        return expenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
      },

      // Agregar comentario a un gasto
      addComment: (expenseId, comment) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === expenseId
              ? {
                ...expense,
                comments: [
                  ...(expense.comments || []),
                  {
                    ...comment,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
              : expense
          ),
        }));
      },

      // Eliminar comentario
      deleteComment: (expenseId, commentId) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === expenseId
              ? {
                ...expense,
                comments: expense.comments.filter((comment) => comment.id !== commentId),
              }
              : expense
          ),
        }));
      },

      // Limpiar todos los gastos (útil para desarrollo)
      clearAllExpenses: () => {
        set({ expenses: [] });
      },

      // Obtener desglose por categoría
      getCategoryBreakdown: (filters = {}) => {
        const expenses = get().getExpensesByFilters(filters);
        const breakdown = {};

        expenses.forEach((expense) => {
          const categoryId = expense.category_id || 'unknown';
          if (!breakdown[categoryId]) {
            breakdown[categoryId] = {
              id: categoryId,
              name: 'Sin categoría', // Will be populated by the component using categories from dataStore
              color: '#9E9E9E',
              icon: 'pricetag-outline',
              total: 0,
              count: 0,
            };
          }
          breakdown[categoryId].total += parseFloat(expense.amount || 0);
          breakdown[categoryId].count += 1;
        });

        return Object.values(breakdown).sort((a, b) => b.total - a.total);
      },

      // Obtener total mensual
      getMonthlyTotal: (date = new Date()) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const startDate = new Date(year, month, 1).toISOString();
        const endDate = new Date(year, month + 1, 0).toISOString(); // Último día del mes

        return get().getTotalExpenses({ startDate, endDate });
      },
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useExpenseStore;
