// App constants

// Currency format (Mexican Peso)
export const CURRENCY = {
  code: 'MXN',
  symbol: '$',
  locale: 'es-MX',
};

// Date format
export const DATE_FORMAT = {
  display: 'DD/MM/YYYY', // Mexican format
  api: 'YYYY-MM-DD', // ISO format for API
  displayWithTime: 'DD/MM/YYYY HH:mm',
};

// Project types
export const PROJECT_TYPES = {
  PERSONAL: 'personal',
  SHARED: 'shared',
  RENTAL_PROPERTY: 'rental_property',
  BUSINESS: 'business',
};

// User roles in projects
export const USER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

// Expense categories (default)
export const DEFAULT_CATEGORIES = [
  { name: 'Alimentos', icon: '🍔', color: '#FF6B6B' },
  { name: 'Transporte', icon: '🚗', color: '#4ECDC4' },
  { name: 'Vivienda', icon: '🏠', color: '#45B7D1' },
  { name: 'Servicios', icon: '💡', color: '#FFA07A' },
  { name: 'Entretenimiento', icon: '🎬', color: '#98D8C8' },
  { name: 'Salud', icon: '⚕️', color: '#F7DC6F' },
  { name: 'Educación', icon: '📚', color: '#BB8FCE' },
  { name: 'Compras', icon: '🛍️', color: '#85C1E2' },
  { name: 'Otros', icon: '📌', color: '#95A5A6' },
];

// Storage keys (AsyncStorage)
export const STORAGE_KEYS = {
  USER_TOKEN: '@finanzapp:user_token',
  USER_DATA: '@finanzapp:user_data',
  SELECTED_PROJECT: '@finanzapp:selected_project',
  THEME_MODE: '@finanzapp:theme_mode',
  ONBOARDING_COMPLETED: '@finanzapp:onboarding_completed',
};

// API endpoints (will be configured with env variables)
export const API_ENDPOINTS = {
  AUTH: '/auth',
  PROJECTS: '/projects',
  EXPENSES: '/expenses',
  RECEIPTS: '/receipts',
  CATEGORIES: '/categories',
  USERS: '/users',
};

// App config
export const APP_CONFIG = {
  name: 'FinanzApp',
  version: '1.0.0',
  supportEmail: 'soporte@finanzapp.mx',
};

// Validation rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PROJECT_NAME_LENGTH: 100,
  MAX_EXPENSE_AMOUNT: 999999999.99,
  MIN_EXPENSE_AMOUNT: 0.01,
};
