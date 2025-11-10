import { CURRENCY, DATE_FORMAT } from '../constants';

// Format currency in Mexican Peso format
export const formatCurrency = (amount, options = {}) => {
  const {
    showSymbol = true,
    showDecimals = true,
    locale = CURRENCY.locale,
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: CURRENCY.code,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return formatter.format(amount);
};

// Format date in Mexican format (DD/MM/YYYY)
export const formatDate = (date, format = DATE_FORMAT.display) => {
  if (!date) return '';

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if (format === DATE_FORMAT.display) {
    return `${day}/${month}/${year}`;
  }

  if (format === DATE_FORMAT.api) {
    return `${year}-${month}-${day}`;
  }

  return d.toLocaleDateString(CURRENCY.locale);
};

// Parse currency string to number
export const parseCurrency = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  // Remove currency symbols, spaces, and convert comma to dot
  const cleaned = value
    .toString()
    .replace(/[^0-9.,]/g, '')
    .replace(',', '.');

  return parseFloat(cleaned) || 0;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Truncate text
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID (for temporary items)
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Sort by date
export const sortByDate = (array, dateKey = 'date', ascending = false) => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
