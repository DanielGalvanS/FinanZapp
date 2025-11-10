import { useCallback } from 'react';

export default function useCurrency(currency = 'MXN', locale = 'es-MX') {
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(Math.abs(amount));
  }, [currency, locale]);

  const formatAmount = useCallback((amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '$0.00';
    return formatCurrency(num);
  }, [formatCurrency]);

  const parseCurrency = useCallback((text) => {
    return text.replace(/[^0-9.]/g, '');
  }, []);

  return {
    formatCurrency,
    formatAmount,
    parseCurrency,
  };
}
