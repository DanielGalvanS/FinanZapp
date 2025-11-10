import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],

      // Agregar un nuevo gasto
      addExpense: (expense) => {
        const newExpense = {
          ...expense,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));

        return newExpense;
      },

      // Actualizar un gasto existente
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

      // Eliminar un gasto
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
          filtered = filtered.filter((expense) => expense.projectId === filters.projectId);
        }

        // Filtrar por categoría
        if (filters.categoryId) {
          filtered = filtered.filter((expense) => expense.categoryId === filters.categoryId);
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
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useExpenseStore;
