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

      setCurrentProject: (project) => {
        set({ currentProject: project });
        console.log('[DataStore] Proyecto actual cambiado a:', project?.name);
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

      // Reset (útil para logout)
      reset: () => {
        set({
          categories: [],
          projects: [],
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
        currentProject: state.currentProject,
        lastCategoriesUpdate: state.lastCategoriesUpdate,
        lastProjectsUpdate: state.lastProjectsUpdate,
      }),
    }
  )
);

export default useDataStore;
