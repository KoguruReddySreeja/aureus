import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { PieChart as PieChartIcon, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { CHART_COLORS, CATEGORY_COLORS, TOOLTIP_STYLE } from '../constants/index.js';

function getMonthlyComparison(transactions, monthsBack = 6) {
  const now = new Date();
  const months = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
      fullLabel: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      income: 0,
      expense: 0,
      isCurrent: i === 0,
    });
  }

  transactions.forEach(t => {
    const tMonth = t.date.slice(0, 7);
    const entry = months.find(m => m.key === tMonth);
    if (entry) {
      if (t.type === 'income') entry.income += t.amount;
      else entry.expense += t.amount;
    }
  });

  return months;
}

function getCategoryBreakdown(transactions) {
  const expenseMap = {};
  const countMap = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
    countMap[t.category] = (countMap[t.category] || 0) + 1;
  });

  const total = Object.values(expenseMap).reduce((s, v) => s + v, 0);
  const monthsWithData = new Set(transactions.filter(t => t.type === 'expense').map(t => t.date.slice(0, 7))).size || 1;

  return Object.entries(expenseMap)
    .map(([category, totalSpent]) => ({
      category,
      totalSpent,
      percentage: total > 0 ? (totalSpent / total) * 100 : 0,
      avgPerMonth: totalSpent / monthsWithData,
      count: countMap[category],
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2">
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm" style={{ color: p.color || p.fill }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Insights() {
  const { transactions, totals, loading } = useTransactions();

  const monthlyData = useMemo(() => getMonthlyComparison(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(transactions), [transactions]);

  const topCategory = useMemo(() => categoryBreakdown[0] || null, [categoryBreakdown]);

  const biggestExpense = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return null;
    return expenses.reduce((max, t) => t.amount > max.amount ? t : max, expenses[0]);
  }, [transactions]);

  const ratio = useMemo(() => {
    if (totals.expenses === 0) return 0;
    return totals.income / totals.expenses;
  }, [totals]);

  const monthlySummaries = useMemo(() => {
    const last3 = monthlyData.slice(-3).reverse();
    return last3.map((m, i, arr) => {
      const net = m.income - m.expense;
      const prev = arr[i + 1];
      let trendPct = 0;
      if (prev) {
        const prevNet = prev.income - prev.expense;
        trendPct = prevNet === 0 ? 0 : ((net - prevNet) / Math.abs(prevNet)) * 100;
      }
      return { ...m, net, trendPct };
    });
  }, [monthlyData]);

  if (loading) return <LoadingSpinner />;

  if (transactions.length < 5) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Not enough data"
        description="Add more transactions to see meaningful insights."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top Spending Category */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <PieChartIcon className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">Top Spending Category</span>
          </div>
          {topCategory ? (
            <>
              <div className="text-lg font-semibold text-text-primary mb-1">{topCategory.category}</div>
              <div className="font-mono text-xl text-text-primary">{formatCurrency(topCategory.totalSpent)}</div>
              <div className="text-xs text-text-muted mt-1">{topCategory.percentage.toFixed(1)}% of total expenses</div>
            </>
          ) : (
            <div className="text-sm text-text-muted">No expense data</div>
          )}
        </div>

        {/* Biggest Single Expense */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">Biggest Single Expense</span>
          </div>
          {biggestExpense ? (
            <>
              <div className="text-sm font-medium text-text-primary mb-1 line-clamp-2">{biggestExpense.description}</div>
              <div className="font-mono text-xl text-danger">{formatCurrency(biggestExpense.amount)}</div>
              <div className="text-xs text-text-muted mt-1">{biggestExpense.date}</div>
            </>
          ) : (
            <div className="text-sm text-text-muted">No expense data</div>
          )}
        </div>

        {/* Income vs Expense Ratio */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">Income vs Expense Ratio</span>
          </div>
          <div className={`font-mono text-2xl font-semibold ${ratio >= 1 ? 'text-success' : 'text-danger'}`}>
            {ratio.toFixed(2)}×
          </div>
          <div className="text-xs text-text-muted mt-1">
            You earn ${ratio.toFixed(2)} for every $1.00 spent
          </div>
        </div>
      </div>

      {/* Month-over-Month Chart */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h3 className="text-sm font-medium text-text-secondary mb-4">Month-over-Month Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
            <XAxis dataKey="label" tick={{ fill: '#8b949e', fontSize: 12 }} />
            <YAxis tick={{ fill: '#8b949e', fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Income" fill={CHART_COLORS.income} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expenses" fill={CHART_COLORS.expense} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="p-5 pb-3">
          <h3 className="text-sm font-medium text-text-secondary">Category Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Category</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Total Spent</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider w-36">% of Expenses</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Avg/Month</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map(row => (
                <tr key={row.category} className="border-b border-border hover:bg-elevated/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[row.category] || '#8b949e' }}
                      />
                      <span className="text-text-primary font-medium">{row.category}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-right text-text-primary">{formatCurrency(row.totalSpent)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-muted font-mono w-10 text-right">{row.percentage.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-right text-text-secondary">{formatCurrency(row.avgPerMonth)}</td>
                  <td className="px-5 py-3 font-mono text-right text-text-secondary">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Summary Cards */}
      <div>
        <h3 className="text-sm font-medium text-text-secondary mb-3">Monthly Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthlySummaries.map(m => (
            <div key={m.key} className="rounded-lg border border-border bg-surface p-5">
              <h4 className="text-base font-semibold text-text-primary mb-3">{m.fullLabel}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Income</span>
                  <span className="font-mono text-success">{formatCurrency(m.income)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Expenses</span>
                  <span className="font-mono text-danger">{formatCurrency(m.expense)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-sm">
                  <span className="text-text-secondary font-medium">Net</span>
                  <span className={`font-mono font-semibold ${m.net >= 0 ? 'text-success' : 'text-danger'}`}>
                    {m.net >= 0 ? '+' : ''}{formatCurrency(m.net)}
                  </span>
                </div>
                {m.trendPct !== 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    {m.trendPct >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-danger" />
                    )}
                    <span className={m.trendPct >= 0 ? 'text-success' : 'text-danger'}>
                      {Math.abs(m.trendPct).toFixed(1)}% vs previous month
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
