import { format, parseISO } from 'date-fns';

/**
 * Format a number as USD currency.
 * @param {number} amount
 * @returns {string} e.g. "$1,234.56"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format an ISO date string to a human-readable form.
 * @param {string} dateStr  — e.g. "2026-03-28"
 * @returns {string}        — e.g. "Mar 28, 2026"
 */
export function formatDate(dateStr) {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

/**
 * Generate a simple incremental ID (for new transactions).
 * @param {Array} transactions
 * @returns {number}
 */
export function nextId(transactions) {
  if (transactions.length === 0) return 1;
  return Math.max(...transactions.map((t) => t.id)) + 1;
}
