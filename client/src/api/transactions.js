/**
 * API service layer — re-exports mock API functions so that the rest of
 * the app can keep importing from this file without changes.
 *
 * Previously this file used axios to call the Express backend.
 * Now all data is served from the in-memory mock-api layer.
 */
export {
  fetchTransactions,
  fetchStats,
  fetchTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions,
} from '../mock-api/transactions.js';
