import { CATEGORY_COLORS } from '../../constants/index.js';

export default function TransactionBadge({ type, label }) {
  if (type === 'category') {
    const color = CATEGORY_COLORS[label] || '#64748b';
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: `${color}15`, color }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
    );
  }

  const styles = {
    income: 'bg-success-subtle text-success',
    expense: 'bg-danger-subtle text-danger',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || ''}`}>
      {type === 'income' ? 'Income' : 'Expense'}
    </span>
  );
}
