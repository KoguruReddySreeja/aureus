import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Percent, ArrowRight } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import TransactionBadge from '../components/ui/TransactionBadge.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { CHART_COLORS, CATEGORY_COLORS, TOOLTIP_STYLE } from '../constants/index.js';

function getMonthlyData(transactions, monthsBack = 6) {
  const now = new Date();
  const months = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
      income: 0,
      expense: 0,
      balance: 0,
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

  let cumulative = 0;
  months.forEach(m => {
    cumulative += m.income - m.expense;
    m.balance = cumulative;
  });

  return months;
}

function getTrend(transactions) {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

  const calc = (month, type) =>
    transactions.filter(t => t.date.startsWith(month) && (type === 'all' || t.type === type))
      .reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);

  const calcSum = (month, type) =>
    transactions.filter(t => t.date.startsWith(month) && t.type === type)
      .reduce((s, t) => s + t.amount, 0);

  const thisIncome = calcSum(thisMonth, 'income');
  const lastIncome = calcSum(lastMonthKey, 'income');
  const thisExpense = calcSum(thisMonth, 'expense');
  const lastExpense = calcSum(lastMonthKey, 'expense');
  const thisBalance = thisIncome - thisExpense;
  const lastBalance = lastIncome - lastExpense;

  const pct = (curr, prev) => prev === 0 ? 0 : ((curr - prev) / Math.abs(prev)) * 100;

  return {
    income: { value: pct(thisIncome, lastIncome), direction: thisIncome >= lastIncome ? 'positive' : 'negative' },
    expense: { value: pct(thisExpense, lastExpense), direction: thisExpense <= lastExpense ? 'positive' : 'negative' },
    balance: { value: pct(thisBalance, lastBalance), direction: thisBalance >= lastBalance ? 'positive' : 'negative' },
  };
}

function getCategoryData(transactions) {
  const expenseMap = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
  });
  return Object.entries(expenseMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2">
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { transactions, totals, loading } = useTransactions();
  const navigate = useNavigate();

  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const trend = useMemo(() => getTrend(transactions), [transactions]);
  const categoryData = useMemo(() => getCategoryData(transactions), [transactions]);
  const recentTransactions = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [transactions]
  );
  const totalExpenses = useMemo(() => categoryData.reduce((s, c) => s + c.value, 0), [categoryData]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(totals.balance)}
          icon={DollarSign}
          trend={trend.balance.direction}
          trendValue={`${Math.abs(trend.balance.value).toFixed(1)}%`}
          primary
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(totals.income)}
          icon={TrendingUp}
          trend={trend.income.direction}
          trendValue={`${Math.abs(trend.income.value).toFixed(1)}%`}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totals.expenses)}
          icon={TrendingDown}
          trend={trend.expense.direction}
          trendValue={`${Math.abs(trend.expense.value).toFixed(1)}%`}
        />
        <StatCard
          title="Net Margin"
          value={`${totals.margin.toFixed(1)}%`}
          icon={Percent}
          trend={totals.margin >= 0 ? 'positive' : 'negative'}
          trendValue={`${Math.abs(totals.margin).toFixed(1)}%`}
        />
      </div>

      {/* Balance Trend Chart */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h3 className="text-sm font-medium text-text-secondary mb-4">Balance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
            <XAxis dataKey="label" tick={{ fill: '#8b949e', fontSize: 12 }} />
            <YAxis tick={{ fill: '#8b949e', fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke={CHART_COLORS.accent}
              strokeWidth={2}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Monthly Income vs Expenses */}
        <div className="xl:col-span-3 rounded-lg border border-border bg-surface p-5">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Monthly Income vs Expenses</h3>
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

        {/* Spending by Category */}
        <div className="xl:col-span-2 rounded-lg border border-border bg-surface p-5">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#8b949e'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#8b949e' }}
                  />
                  <span className="text-text-secondary">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text-muted">{totalExpenses > 0 ? ((cat.value / totalExpenses) * 100).toFixed(1) : 0}%</span>
                  <span className="font-mono text-text-primary">{formatCurrency(cat.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="text-sm font-medium text-text-secondary">Recent Transactions</h3>
          <button
            onClick={() => navigate('/transactions')}
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Description</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Category</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(t => (
                <tr key={t.id} className="border-t border-border hover:bg-elevated/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-text-secondary whitespace-nowrap">{formatDate(t.date)}</td>
                  <td className="px-5 py-3 text-text-primary font-medium">{t.description}</td>
                  <td className="px-5 py-3"><TransactionBadge type="category" label={t.category} /></td>
                  <td className={`px-5 py-3 font-mono text-right ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-5 py-3"><TransactionBadge type={t.type} label={t.type} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
