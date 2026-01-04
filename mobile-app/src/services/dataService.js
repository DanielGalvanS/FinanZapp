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
   * Elimina un proyecto
   * IMPORTANTE: Esto también eliminará todos los expenses asociados (CASCADE)
   */
  async deleteProject(projectId) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('[DataService] Error al eliminar proyecto:', error);
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
  /**
   * Obtiene metas del usuario
   */
  async getGoals() {
    try {
      // TODO: Obtener user_id real del contexto de auth
      const tempUserId = '00000000-0000-0000-0000-000000000000';

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', tempUserId)
        .order('deadline', { ascending: true });

      if (error) throw error;

      return data.map(goal => ({
        id: goal.id,
        name: goal.name,
        target: goal.target_amount,
        current: goal.current_amount,
        deadline: goal.deadline,
        description: goal.description,
        icon: goal.icon || 'flag',
        color: goal.color || '#4ECDC4',
      }));
    } catch (error) {
      console.error('[DataService] Error al obtener metas:', error);
      return [];
    }
  }

  /**
   * Crea una nueva meta
   */
  async createGoal(goalData) {
    try {
      // TODO: Obtener user_id real del contexto de auth
      const tempUserId = '00000000-0000-0000-0000-000000000000';

      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: tempUserId,
            name: goalData.name,
            target_amount: goalData.targetAmount,
            current_amount: goalData.currentAmount || 0,
            deadline: goalData.deadline,
            description: goalData.description || '',
            icon: goalData.icon?.icon || 'flag',
            color: goalData.icon?.color || '#4ECDC4',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        target: data.target_amount,
        current: data.current_amount,
        deadline: data.deadline,
        description: data.description,
        icon: data.icon,
        color: data.color,
      };
    } catch (error) {
      console.error('[DataService] Error al crear meta:', error);
      throw error;
    }
  }

  /**
   * Actualiza una meta existente
   */
  async updateGoal(id, updates) {
    try {
      const dbUpdates = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.targetAmount) dbUpdates.target_amount = updates.targetAmount;
      if (updates.currentAmount !== undefined) dbUpdates.current_amount = updates.currentAmount;
      if (updates.deadline) dbUpdates.deadline = updates.deadline;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.icon) {
        dbUpdates.icon = updates.icon.icon || updates.icon;
        dbUpdates.color = updates.icon.color || updates.color;
      }

      const { data, error } = await supabase
        .from('goals')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        target: data.target_amount,
        current: data.current_amount,
        deadline: data.deadline,
        description: data.description,
        icon: data.icon,
        color: data.color,
      };
    } catch (error) {
      console.error('[DataService] Error al actualizar meta:', error);
      throw error;
    }
  }

  /**
   * Elimina una meta
   */
  /**
   * Obtiene presupuestos del usuario
   */
  async getBudgets() {
    try {
      // TODO: Obtener user_id real del contexto de auth
      const tempUserId = '00000000-0000-0000-0000-000000000000';

      const { data, error } = await supabase
        .from('budgets')
        .select('*, categories(*)')
        .eq('user_id', tempUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(budget => ({
        id: budget.id,
        total: budget.amount,
        spent: budget.spent || 0, // TODO: Calcular gasto real basado en expenses
        period: budget.period,
        projectId: budget.project_id,
        category: budget.categories ? {
          id: budget.categories.id,
          name: budget.categories.name,
          icon: budget.categories.icon,
          color: budget.categories.color
        } : null,
        startDate: budget.start_date,
        endDate: budget.end_date
      }));
    } catch (error) {
      console.error('[DataService] Error al obtener presupuestos:', error);
      return [];
    }
  }

  /**
   * Crea un nuevo presupuesto
   */
  async createBudget(budgetData) {
    try {
      // TODO: Obtener user_id real del contexto de auth
      const tempUserId = '00000000-0000-0000-0000-000000000000';

      const { data, error } = await supabase
        .from('budgets')
        .insert([
          {
            user_id: tempUserId,
            amount: budgetData.amount,
            period: budgetData.period,
            category_id: budgetData.categoryId,
            project_id: budgetData.projectId,
            start_date: budgetData.startDate,
            end_date: budgetData.endDate
          },
        ])
        .select('*, categories(*)')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        total: data.amount,
        spent: 0,
        period: data.period,
        projectId: data.project_id,
        category: data.categories ? {
          id: data.categories.id,
          name: data.categories.name,
          icon: data.categories.icon,
          color: data.categories.color
        } : null,
        startDate: data.start_date,
        endDate: data.end_date
      };
    } catch (error) {
      console.error('[DataService] Error al crear presupuesto:', error);
      throw error;
    }
  }

  /**
   * Actualiza un presupuesto
   */
  async updateBudget(id, updates) {
    try {
      const dbUpdates = {};
      if (updates.amount) dbUpdates.amount = updates.amount;
      if (updates.period) dbUpdates.period = updates.period;
      if (updates.categoryId) dbUpdates.category_id = updates.categoryId;
      if (updates.projectId) dbUpdates.project_id = updates.projectId;
      if (updates.startDate) dbUpdates.start_date = updates.startDate;
      if (updates.endDate) dbUpdates.end_date = updates.endDate;

      const { data, error } = await supabase
        .from('budgets')
        .update(dbUpdates)
        .eq('id', id)
        .select('*, categories(*)')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        total: data.amount,
        spent: data.spent || 0,
        period: data.period,
        projectId: data.project_id,
        category: data.categories ? {
          id: data.categories.id,
          name: data.categories.name,
          icon: data.categories.icon,
          color: data.categories.color
        } : null,
        startDate: data.start_date,
        endDate: data.end_date
      };
    } catch (error) {
      console.error('[DataService] Error al actualizar presupuesto:', error);
      throw error;
    }
  }

  /**
   * Elimina un presupuesto
   */
  async deleteBudget(id) {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[DataService] Error al eliminar presupuesto:', error);
      throw error;
    }
  }
}

export default new DataService();
