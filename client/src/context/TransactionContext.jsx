import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as api from '../api/transactions.js';

const TransactionContext = createContext(null);

const DEFAULT_FILTERS = {
  search: '',
  type: 'all',
  category: 'all',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortOrder: 'desc',
  groupBy: 'none',
};

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFiltersState] = useState(DEFAULT_FILTERS);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [txData, statsData] = await Promise.all([
        api.fetchTransactions(),
        api.fetchStats(),
      ]);
      setTransactions(txData);
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const setFilters = useCallback((partial) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const addTransaction = useCallback(async (data) => {
    try {
      await api.createTransaction(data);
      toast.success('Transaction added');
      await fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add transaction');
      throw err;
    }
  }, [fetchAll]);

  const updateTransaction = useCallback(async (id, data) => {
    try {
      await api.updateTransaction(id, data);
      toast.success('Transaction updated');
      await fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update transaction');
      throw err;
    }
  }, [fetchAll]);

  const deleteTransaction = useCallback(async (id) => {
    try {
      await api.deleteTransaction(id);
      toast.success('Transaction deleted');
      await fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete transaction');
      throw err;
    }
  }, [fetchAll]);

  const resetData = useCallback(async () => {
    try {
      await api.deleteAllTransactions();
      toast.success('Data reset to seed');
      await fetchAll();
    } catch (err) {
      toast.error('Failed to reset data');
      throw err;
    }
  }, [fetchAll]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(search)
      );
    }

    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    if (filters.dateFrom) {
      result = result.filter(t => t.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter(t => t.date <= filters.dateTo);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === 'date') {
        cmp = new Date(a.date) - new Date(b.date);
      } else if (filters.sortBy === 'amount') {
        cmp = a.amount - b.amount;
      } else if (filters.sortBy === 'category') {
        cmp = a.category.localeCompare(b.category);
      }
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [transactions, filters]);

  const totals = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = income - expenses;
    const margin = income > 0 ? ((income - expenses) / income) * 100 : 0;
    return { income, expenses, balance, margin };
  }, [transactions]);

  const value = useMemo(() => ({
    transactions,
    filteredTransactions,
    stats,
    totals,
    loading,
    statsLoading,
    error,
    filters,
    setFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetData,
    refetch: fetchAll,
  }), [transactions, filteredTransactions, stats, totals, loading, statsLoading, error, filters, setFilters, addTransaction, updateTransaction, deleteTransaction, resetData, fetchAll]);

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);
