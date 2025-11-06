/**
 * Validate required field
 */
export const required = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'Este campo es requerido';
  }
  return null;
};

/**
 * Validate email format
 */
export const email = (value) => {
  if (!value) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Ingresa un correo válido';
  }
  return null;
};

/**
 * Validate phone number
 */
export const phone = (value) => {
  if (!value) return null;

  const phoneRegex = /^[\d\s\-\(\)]+$/;
  if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
    return 'Ingresa un teléfono válido (10 dígitos)';
  }
  return null;
};

/**
 * Validate minimum length
 */
export const minLength = (min) => (value) => {
  if (!value) return null;

  if (value.length < min) {
    return `Mínimo ${min} caracteres`;
  }
  return null;
};

/**
 * Validate maximum length
 */
export const maxLength = (max) => (value) => {
  if (!value) return null;

  if (value.length > max) {
    return `Máximo ${max} caracteres`;
  }
  return null;
};

/**
 * Validate minimum value
 */
export const minValue = (min) => (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 'Ingresa un número válido';

  if (num < min) {
    return `El valor mínimo es ${min}`;
  }
  return null;
};

/**
 * Validate maximum value
 */
export const maxValue = (max) => (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 'Ingresa un número válido';

  if (num > max) {
    return `El valor máximo es ${max}`;
  }
  return null;
};

/**
 * Validate number format
 */
export const number = (value) => {
  if (!value) return null;

  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Ingresa un número válido';
  }
  return null;
};

/**
 * Validate positive number
 */
export const positiveNumber = (value) => {
  if (!value) return null;

  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Ingresa un número válido';
  }

  if (num <= 0) {
    return 'El valor debe ser mayor a 0';
  }
  return null;
};

/**
 * Validate URL format
 */
export const url = (value) => {
  if (!value) return null;

  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlRegex.test(value)) {
    return 'Ingresa una URL válida';
  }
  return null;
};

/**
 * Validate password strength
 */
export const password = (value) => {
  if (!value) return null;

  if (value.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }

  if (!/[A-Z]/.test(value)) {
    return 'La contraseña debe incluir al menos una mayúscula';
  }

  if (!/[a-z]/.test(value)) {
    return 'La contraseña debe incluir al menos una minúscula';
  }

  if (!/[0-9]/.test(value)) {
    return 'La contraseña debe incluir al menos un número';
  }

  return null;
};

/**
 * Validate matching fields (e.g., confirm password)
 */
export const match = (fieldName, otherValue) => (value) => {
  if (value !== otherValue) {
    return `${fieldName} no coincide`;
  }
  return null;
};

/**
 * Compose multiple validators
 */
export const compose = (...validators) => (value) => {
  for (let validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};
