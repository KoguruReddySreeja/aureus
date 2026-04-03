/**
 * Mock API functions — drop-in replacements for the real backend endpoints.
 * Each function returns a Promise with a small artificial delay to simulate
 * network latency. Data is stored in-memory via ./store.js.
 */
import { getTransactions, setTransactions } from './store.js';
import { seedIfEmpty } from './seed.js';
import { computeStats } from './stats.js';

// Simulated network delay (ms)
const DELAY = 300;

const VALID_TYPES = ['income', 'expense'];
const VALID_CATEGORIES = [
  'Payroll', 'SaaS Revenue', 'Vendor Payment', 'Infrastructure',
  'Marketing', 'Office & Admin', 'Tax', 'Consulting', 'Refund', 'Miscellaneous',
];

// Simple UUID v4 generator
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Helper — resolves after DELAY ms */
function delay(data) {
  return new Promise((resolve) => setTimeout(() => resolve(data), DELAY));
}

/** Helper — rejects after DELAY ms (mimics HTTP error responses) */
function delayError(message) {
  return new Promise((_, reject) =>
    setTimeout(() => reject({ response: { data: { error: message } } }), DELAY),
  );
}

// ── Validation (mirrors backend logic) ──────────────────────────

function validateTransaction(data, isUpdate = false) {
  const errors = [];
  if (!isUpdate || data.date !== undefined) {
    if (!data.date) errors.push('date is required');
  }
  if (!isUpdate || data.description !== undefined) {
    if (!data.description) errors.push('description is required');
  }
  if (!isUpdate || data.amount !== undefined) {
    if (data.amount === undefined || data.amount === null) {
      errors.push('amount is required');
    } else if (typeof data.amount !== 'number' || data.amount <= 0) {
      errors.push('amount must be a positive number');
    }
  }
  if (!isUpdate || data.type !== undefined) {
    if (!data.type) {
      errors.push('type is required');
    } else if (!VALID_TYPES.includes(data.type)) {
      errors.push('type must be "income" or "expense"');
    }
  }
  if (!isUpdate || data.category !== undefined) {
    if (!data.category) {
      errors.push('category is required');
    } else if (!VALID_CATEGORIES.includes(data.category)) {
      errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }
  }
  return errors;
}

// ── Ensure seed data is loaded on first import ──────────────────
seedIfEmpty();

// ── Public API (same signatures as the old axios-based layer) ───

/** GET /api/transactions — returns all transactions sorted by date desc */
export async function fetchTransactions() {
  const transactions = getTransactions();
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  return delay(transactions);
}

/** GET /api/transactions/stats */
export async function fetchStats() {
  return delay(computeStats());
}

/** GET /api/transactions/:id */
export async function fetchTransaction(id) {
  const transaction = getTransactions().find((t) => t.id === id);
  if (!transaction) return delayError('Transaction not found');
  return delay(transaction);
}

/** POST /api/transactions */
export async function createTransaction(data) {
  const errors = validateTransaction(data);
  if (errors.length > 0) return delayError(errors.join(', '));

  const transaction = {
    id: uuid(),
    date: data.date,
    description: data.description,
    amount: data.amount,
    type: data.type,
    category: data.category,
    note: data.note || '',
    createdAt: new Date().toISOString(),
  };

  const transactions = getTransactions();
  transactions.push(transaction);
  setTransactions(transactions);
  return delay(transaction);
}

/** PUT /api/transactions/:id */
export async function updateTransaction(id, data) {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return delayError('Transaction not found');

  const errors = validateTransaction(data, true);
  if (errors.length > 0) return delayError(errors.join(', '));

  const updated = { ...transactions[index], ...data, id };
  transactions[index] = updated;
  setTransactions(transactions);
  return delay(updated);
}

/** DELETE /api/transactions/:id */
export async function deleteTransaction(id) {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return delayError('Transaction not found');

  transactions.splice(index, 1);
  setTransactions(transactions);
  return delay({ message: 'Transaction deleted' });
}

/** DELETE /api/transactions/all — clears data and re-seeds */
export async function deleteAllTransactions() {
  setTransactions([]);
  seedIfEmpty();
  return delay({ message: 'Data reset to seed' });
}
