import supabase from '../config/supabase';

/**
 * Servicio para obtener datos desde Supabase
 */
class DataService {
  /**
   * Obtiene todas las categorías del sistema
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_system', true)
        .order('name');

      if (error) throw error;

      // Transformar a formato que usa la app
      return data.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon || 'pricetag-outline',
        color: cat.color || '#9E9E9E',
      }));
    } catch (error) {
      console.error('[DataService] Error al obtener categorías:', error);
      // Devolver categorías por defecto si falla
      return this.getDefaultCategories();
    }
  }

  /**
   * Obtiene proyectos del usuario
   * TODO: Filtrar por user_id cuando implementemos auth
   */
  async getProjects(userId = null) {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      // Si tenemos userId, filtrar por owner o miembro
      if (userId) {
        // Por ahora solo obtenemos todos los proyectos
        // TODO: Implementar filtro por user_id cuando tengamos auth
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transformar a formato que usa la app
      return data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        icon: project.icon,
        color: project.color,
        isShared: project.is_shared,
        collaborators: [], // TODO: Cargar colaboradores reales cuando implementemos esa funcionalidad
      }));
    } catch (error) {
      console.error('[DataService] Error al obtener proyectos:', error);
      // Devolver proyectos por defecto si falla
      return this.getDefaultProjects();
    }
  }

  /**
   * Crea un nuevo proyecto
   */
  async createProject(projectData) {
    try {
      // TODO: Obtener user_id real del contexto de auth
      const tempUserId = '00000000-0000-0000-0000-000000000000';

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name: projectData.name,
            description: projectData.description,
            icon: projectData.icon || 'folder-outline',
            color: projectData.color || '#4ECDC4',
            owner_id: tempUserId,
            is_shared: projectData.isShared || false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        isShared: data.is_shared,
        collaborators: [],
      };
    } catch (error) {
      console.error('[DataService] Error al crear proyecto:', error);
      throw error;
    }
  }

  /**
   * Guarda un expense en Supabase (no en local)
   */
  async saveExpense(expenseData) {
    try {
      // TODO: Obtener user_id real del contexto de auth
      const tempUserId = '00000000-0000-0000-0000-000000000000';

      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            user_id: tempUserId,
            project_id: expenseData.projectId,
            category_id: expenseData.categoryId,
            name: expenseData.name,
            description: expenseData.description,
            amount: expenseData.amount,
            date: expenseData.date,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('[DataService] Error al guardar expense:', error);
      throw error;
    }
  }

  /**
   * Obtiene expenses desde Supabase
   */
  async getExpenses(filters = {}) {
    try {
      let query = supabase
        .from('expenses')
        .select('*, receipts(*), comments(*)')
        .order('date', { ascending: false });

      if (filters.projectId) {
        query = query.eq('project_id', filters.projectId);
      }

      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('[DataService] Error al obtener expenses:', error);
      return [];
    }
  }

  // ========================================
  // FALLBACKS - Datos por defecto si falla Supabase
  // ========================================

  getDefaultCategories() {
    return [
      { id: 1, name: 'Comida', icon: 'restaurant-outline', color: '#FF6B6B' },
      { id: 2, name: 'Transporte', icon: 'car-outline', color: '#4ECDC4' },
      { id: 3, name: 'Entretenimiento', icon: 'game-controller-outline', color: '#95E1D3' },
      { id: 4, name: 'Compras', icon: 'cart-outline', color: '#F38181' },
      { id: 5, name: 'Salud', icon: 'medkit-outline', color: '#A8E6CF' },
      { id: 6, name: 'Educación', icon: 'book-outline', color: '#FFD3B6' },
    ];
  }

  getDefaultProjects() {
    return [
      { id: 1, name: 'Personal', description: 'Gastos personales', isShared: false, collaborators: [] },
      { id: 2, name: 'Negocio', description: 'Gastos del negocio', isShared: false, collaborators: [] },
    ];
  }
}

export default new DataService();
