import { format, parseISO } from 'date-fns';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export function formatDate(dateStr) {
  return format(parseISO(dateStr), 'MMM dd, yyyy');
}

export function formatMonth(dateStr) {
  return format(parseISO(dateStr), 'MMMM yyyy');
}

export function formatMonthShort(dateStr) {
  return format(parseISO(dateStr), 'MMM yyyy');
}

export function formatPercentage(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
