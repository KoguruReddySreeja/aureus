/**
 * Stats computation — mirrors the backend's GET /api/transactions/stats
 * endpoint. Computes all statistics from the in-memory store.
 */
import { getTransactions } from './store.js';

export function computeStats() {
  const transactions = getTransactions();
  const now = new Date();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const netMargin =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // ── Expenses by category ──────────────────────────────────────
  const catMap = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!catMap[t.category])
        catMap[t.category] = { category: t.category, total: 0, count: 0 };
      catMap[t.category].total += t.amount;
      catMap[t.category].count += 1;
    });
  const byCategory = Object.values(catMap).sort((a, b) => b.total - a.total);

  // ── Income / expenses by month (last 6 months) ───────────────
  const byMonth = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    let income = 0;
    let expenses = 0;
    transactions.forEach((t) => {
      if (t.date.startsWith(key)) {
        if (t.type === 'income') income += t.amount;
        else expenses += t.amount;
      }
    });
    byMonth.push({ month: label, income, expenses, balance: income - expenses });
  }

  // ── Current vs last month totals ──────────────────────────────
  const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastKey = `${lastDate.getFullYear()}-${String(lastDate.getMonth() + 1).padStart(2, '0')}`;

  const sumByKey = (key, type) =>
    transactions
      .filter((t) => t.date.startsWith(key) && t.type === type)
      .reduce((s, t) => s + t.amount, 0);

  const currentMonthIncome = sumByKey(thisKey, 'income');
  const currentMonthExpenses = sumByKey(thisKey, 'expense');
  const lastMonthIncome = sumByKey(lastKey, 'income');
  const lastMonthExpenses = sumByKey(lastKey, 'expense');

  // ── Biggest single expense ────────────────────────────────────
  const expenses = transactions.filter((t) => t.type === 'expense');
  const biggestExpense =
    expenses.length > 0
      ? expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0])
      : null;

  // ── Top spending category ─────────────────────────────────────
  const topCat = byCategory[0] || null;
  const topSpendingCategory = topCat
    ? {
        category: topCat.category,
        total: topCat.total,
        percentage: totalExpenses > 0 ? (topCat.total / totalExpenses) * 100 : 0,
      }
    : null;

  return {
    totalIncome,
    totalExpenses,
    balance,
    netMargin,
    byCategory,
    byMonth,
    currentMonthIncome,
    currentMonthExpenses,
    lastMonthIncome,
    lastMonthExpenses,
    biggestExpense,
    topSpendingCategory,
  };
}
