import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dataService from '../services/dataService';

/**
 * Store global para categorías y proyectos
 * - Persistencia automática en AsyncStorage
 * - Carga rápida con datos en caché
 * - Auto-refresh en background
 */
const useDataStore = create(
  persist(
    (set, get) => ({
      // ========================================
      // STATE
      // ========================================
      categories: [],
      projects: [],
      goals: [], // New goals state
      budgets: [], // New budgets state
      currentProject: null, // Proyecto seleccionado actualmente
      isLoadingCategories: false,
      isLoadingProjects: false,
      lastCategoriesUpdate: null,
      lastProjectsUpdate: null,
      error: null,

      // ========================================
      // ACTIONS - CATEGORIES
      // ========================================
      loadCategories: async (force = false) => {
        const state = get();

        // Si ya tenemos datos y no es force, skip
        if (!force && state.categories.length > 0 && state.lastCategoriesUpdate) {
          const timeSinceUpdate = Date.now() - state.lastCategoriesUpdate;
          // Si fue hace menos de 5 minutos, usar caché
          if (timeSinceUpdate < 5 * 60 * 1000) {
            console.log('[DataStore] Usando categorías en caché');
            return;
          }
        }

        set({ isLoadingCategories: true, error: null });

        try {
          const categories = await dataService.getCategories();
          set({
            categories,
            lastCategoriesUpdate: Date.now(),
            isLoadingCategories: false,
          });
          console.log(`[DataStore] ✅ Categorías cargadas: ${categories.length}`);
        } catch (error) {
          console.error('[DataStore] ❌ Error al cargar categorías:', error);
          set({
            error: error.message,
            isLoadingCategories: false,
          });
          // Si falla pero tenemos caché, mantener datos
        }
      },

      refreshCategories: async () => {
        await get().loadCategories(true);
      },

      // ========================================
      // ACTIONS - PROJECTS
      // ========================================
      loadProjects: async (force = false) => {
        const state = get();

        // Si ya tenemos datos y no es force, skip
        if (!force && state.projects.length > 0 && state.lastProjectsUpdate) {
          const timeSinceUpdate = Date.now() - state.lastProjectsUpdate;
          // Proyectos se actualizan más seguido (2 minutos)
          if (timeSinceUpdate < 2 * 60 * 1000) {
            console.log('[DataStore] Usando proyectos en caché');
            return;
          }
        }

        set({ isLoadingProjects: true, error: null });

        try {
          const projects = await dataService.getProjects();
          set({
            projects,
            lastProjectsUpdate: Date.now(),
            isLoadingProjects: false,
          });
          console.log(`[DataStore] ✅ Proyectos cargados: ${projects.length}`);
        } catch (error) {
          console.error('[DataStore] ❌ Error al cargar proyectos:', error);
          set({
            error: error.message,
            isLoadingProjects: false,
          });
        }
      },

      refreshProjects: async () => {
        await get().loadProjects(true);
      },

      addProject: (project) => {
        set((state) => ({
          projects: [project, ...state.projects],
          // Si no hay proyecto actual, seleccionar el nuevo
          currentProject: state.currentProject || project,
        }));
      },

      deleteProject: (projectId) => {
        set((state) => {
          const updatedProjects = state.projects.filter(p => p.id !== projectId);
          let newCurrentProject = state.currentProject;

          // Si el proyecto eliminado es el actual, cambiar al siguiente disponible
          if (state.currentProject?.id === projectId) {
            newCurrentProject = updatedProjects.length > 0 ? updatedProjects[0] : null;
          }

          return {
            projects: updatedProjects,
            currentProject: newCurrentProject,
          };
        });
        console.log('[DataStore] Proyecto eliminado');
      },

      setCurrentProject: (project) => {
        set({ currentProject: project });
        console.log('[DataStore] Proyecto actual cambiado a:', project?.name);
      },

      // ========================================
      // ACTIONS - GOALS
      // ========================================
      loadGoals: async (force = false) => {
        const state = get();
        if (!force && state.goals.length > 0) return;

        try {
          const goals = await dataService.getGoals();
          set({ goals });
          console.log(`[DataStore] ✅ Metas cargadas: ${goals.length}`);
        } catch (error) {
          console.error('[DataStore] ❌ Error al cargar metas:', error);
        }
      },

      addGoal: async (goalData) => {
        try {
          // Optimistic update (optional, but good for UX)
          // For now, we wait for server response to get the ID
          const newGoal = await dataService.createGoal(goalData);
          set((state) => ({
            goals: [...state.goals, newGoal],
          }));
          return newGoal;
        } catch (error) {
          console.error('[DataStore] Error al agregar meta:', error);
          throw error;
        }
      },

      updateGoal: async (id, updates) => {
        try {
          const updatedGoal = await dataService.updateGoal(id, updates);
          set((state) => ({
            goals: state.goals.map((g) => (g.id === id ? updatedGoal : g)),
          }));
          return updatedGoal;
        } catch (error) {
          console.error('[DataStore] Error al actualizar meta:', error);
          throw error;
        }
      },

      deleteGoal: async (id) => {
        try {
          await dataService.deleteGoal(id);
          set((state) => ({
            goals: state.goals.filter((g) => g.id !== id),
          }));
        } catch (error) {
          console.error('[DataStore] Error al eliminar meta:', error);
          throw error;
        }
      },

      // ========================================
      // ACTIONS - BUDGETS
      // ========================================
      loadBudgets: async (force = false) => {
        const state = get();
        if (!force && state.budgets.length > 0) return;

        try {
          const budgets = await dataService.getBudgets();
          set({ budgets });
          console.log(`[DataStore] ✅ Presupuestos cargados: ${budgets.length}`);
        } catch (error) {
          console.error('[DataStore] ❌ Error al cargar presupuestos:', error);
        }
      },

      addBudget: async (budgetData) => {
        try {
          const newBudget = await dataService.createBudget(budgetData);
          set((state) => ({
            budgets: [...state.budgets, newBudget],
          }));
          return newBudget;
        } catch (error) {
          console.error('[DataStore] Error al agregar presupuesto:', error);
          throw error;
        }
      },

      updateBudget: async (id, updates) => {
        try {
          const updatedBudget = await dataService.updateBudget(id, updates);
          set((state) => ({
            budgets: state.budgets.map((b) => (b.id === id ? updatedBudget : b)),
          }));
          return updatedBudget;
        } catch (error) {
          console.error('[DataStore] Error al actualizar presupuesto:', error);
          throw error;
        }
      },

      deleteBudget: async (id) => {
        try {
          await dataService.deleteBudget(id);
          set((state) => ({
            budgets: state.budgets.filter((b) => b.id !== id),
          }));
        } catch (error) {
          console.error('[DataStore] Error al eliminar presupuesto:', error);
          throw error;
        }
      },

      // ========================================
      // ACTIONS - INICIALIZACIÓN
      // ========================================
      initialize: async () => {
        console.log('[DataStore] 🚀 Inicializando...');
        const state = get();

        // Si ya hay datos en caché, mostrarlos primero
        if (state.categories.length > 0 || state.projects.length > 0) {
          console.log('[DataStore] Datos en caché disponibles');
        }

        // Cargar en paralelo (usa caché si es reciente)
        await Promise.all([
          get().loadCategories(),
          get().loadProjects(),
          get().loadGoals(),
          get().loadBudgets(),
        ]);

        // Si no hay proyecto seleccionado, seleccionar el primero
        const updatedState = get();
        if (!updatedState.currentProject && updatedState.projects.length > 0) {
          set({ currentProject: updatedState.projects[0] });
          console.log('[DataStore] Proyecto inicial seleccionado:', updatedState.projects[0].name);
        }

        console.log('[DataStore] ✅ Inicialización completa');
      },

      // ========================================
      // HELPERS
      // ========================================
      getCategoryById: (id) => {
        return get().categories.find(cat => cat.id === id);
      },

      getProjectById: (id) => {
        return get().projects.find(proj => proj.id === id);
      },

      isDataReady: () => {
        const state = get();
        return state.categories.length > 0 && state.projects.length > 0;
      },

      getGoalById: (id) => {
        return get().goals.find(g => g.id === id);
      },

      getBudgetById: (id) => {
        return get().budgets.find(b => b.id === id);
      },

      // Reset (útil para logout)
      reset: () => {
        set({
          categories: [],
          projects: [],
          goals: [],
          budgets: [],
          currentProject: null,
          lastCategoriesUpdate: null,
          lastProjectsUpdate: null,
          error: null,
        });
      },
    }),
    {
      name: 'data-storage', // nombre para AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir datos, no loading states
      partialize: (state) => ({
        categories: state.categories,
        projects: state.projects,
        goals: state.goals,
        budgets: state.budgets,
        currentProject: state.currentProject,
        lastCategoriesUpdate: state.lastCategoriesUpdate,
        lastProjectsUpdate: state.lastProjectsUpdate,
      }),
    }
  )
);

export default useDataStore;
