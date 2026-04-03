import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, X, Download, FileJson, Filter } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { useRole } from '../context/RoleContext.jsx';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '../constants/index.js';
import TransactionBadge from '../components/ui/TransactionBadge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { formatCurrency, formatDate, formatMonth } from '../utils/formatters.js';
import { exportToCSV, exportToJSON } from '../utils/exportUtils.js';

function TransactionModal({ transaction, onClose, onSubmit }) {
  const isEdit = !!transaction;
  const [form, setForm] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    amount: transaction?.amount || '',
    type: transaction?.type || 'expense',
    category: transaction?.category || 'Miscellaneous',
    note: transaction?.note || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        amount: parseFloat(form.amount),
      });
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-surface border border-border rounded-lg w-full max-w-lg mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
              >
                {TRANSACTION_TYPES.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Transaction description"
              className="w-full bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="w-full bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
              >
                {TRANSACTION_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Note (optional)</label>
            <textarea
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              placeholder="Additional notes..."
              rows={2}
              className="w-full bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-border rounded-md hover:bg-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm text-white bg-accent hover:bg-accent-hover rounded-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteDialog({ transaction, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-surface border border-border rounded-lg w-full max-w-md mx-4 shadow-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-text-primary mb-2">Delete Transaction</h2>
        <p className="text-sm text-text-secondary mb-1">
          Are you sure you want to delete this transaction?
        </p>
        <p className="text-xs text-text-muted mb-5">
          "{transaction.description}" — {formatCurrency(transaction.amount)}. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary border border-border rounded-md hover:bg-elevated transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm text-white bg-danger hover:bg-red-600 rounded-md transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const { filteredTransactions, filters, setFilters, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { role } = useRole();
  const isAdmin = role === 'admin';

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const clearFilters = () => {
    setFilters({
      search: '', type: 'all', category: 'all',
      dateFrom: '', dateTo: '', sortBy: 'date',
      sortOrder: 'desc', groupBy: 'none',
    });
  };

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo;

  // Grouping logic
  const groupedTransactions = useMemo(() => {
    if (filters.groupBy === 'none') return null;

    const groups = {};
    filteredTransactions.forEach(t => {
      let key;
      if (filters.groupBy === 'category') key = t.category;
      else if (filters.groupBy === 'month') key = formatMonth(t.date);
      else if (filters.groupBy === 'type') key = t.type === 'income' ? 'Income' : 'Expenses';
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filteredTransactions, filters.groupBy]);

  if (loading) return <LoadingSpinner />;

  const renderTable = (items) => (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Description</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Category</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Type</th>
          <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Amount</th>
          <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Note</th>
          {isAdmin && <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {items.map(t => (
          <tr key={t.id} className="border-b border-border hover:bg-elevated/50 transition-colors">
            <td className="px-4 py-3 font-mono text-xs text-text-secondary whitespace-nowrap">{formatDate(t.date)}</td>
            <td className="px-4 py-3 text-text-primary font-medium max-w-xs truncate">{t.description}</td>
            <td className="px-4 py-3"><TransactionBadge type="category" label={t.category} /></td>
            <td className="px-4 py-3"><TransactionBadge type={t.type} label={t.type} /></td>
            <td className={`px-4 py-3 font-mono text-right whitespace-nowrap ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
            </td>
            <td className="px-4 py-3 text-text-muted text-xs max-w-[120px] truncate" title={t.note || ''}>
              {t.note || '—'}
            </td>
            {isAdmin && (
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditTarget(t)}
                    className="p-1.5 text-text-secondary hover:text-accent hover:bg-elevated rounded transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(t)}
                    className="p-1.5 text-text-secondary hover:text-danger hover:bg-elevated rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Transactions</h2>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-accent hover:bg-accent-hover rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Transaction
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by description..."
              value={filters.search}
              onChange={e => setFilters({ search: e.target.value })}
              className="w-full bg-elevated border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary"
            />
          </div>
          <select
            value={filters.type}
            onChange={e => setFilters({ type: e.target.value })}
            className="bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
          >
            <option value="all">All Types</option>
            {TRANSACTION_TYPES.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={e => setFilters({ category: e.target.value })}
            className="bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
          >
            <option value="all">All Categories</option>
            {TRANSACTION_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => setFilters({ dateFrom: e.target.value })}
            className="bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
            placeholder="From"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={e => setFilters({ dateTo: e.target.value })}
            className="bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
            placeholder="To"
          />
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs text-text-secondary border border-border rounded-md hover:bg-elevated transition-colors whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.sortBy}
              onChange={e => setFilters({ sortBy: e.target.value })}
              className="bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
            >
              <option value="date">Sort by: Date</option>
              <option value="amount">Sort by: Amount</option>
              <option value="category">Sort by: Category</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={e => setFilters({ sortOrder: e.target.value })}
              className="bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
            >
              <option value="desc">Order: Desc</option>
              <option value="asc">Order: Asc</option>
            </select>
            <select
              value={filters.groupBy}
              onChange={e => setFilters({ groupBy: e.target.value })}
              className="bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary"
            >
              <option value="none">Group by: None</option>
              <option value="category">Group by: Category</option>
              <option value="month">Group by: Month</option>
              <option value="type">Group by: Type</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportToCSV(filteredTransactions)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-text-secondary border border-border rounded-md hover:bg-elevated transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              onClick={() => exportToJSON(filteredTransactions)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-text-secondary border border-border rounded-md hover:bg-elevated transition-colors"
            >
              <FileJson className="w-3.5 h-3.5" /> JSON
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-text-muted">
        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No transactions match your filters"
          description="Try adjusting your search or filter criteria."
          action={
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-accent border border-accent rounded-md hover:bg-accent-subtle transition-colors"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-surface overflow-x-auto">
          {groupedTransactions ? (
            Object.entries(groupedTransactions).map(([group, items]) => (
              <div key={group}>
                <div className="px-4 py-2.5 bg-elevated/50 border-b border-border">
                  <h3 className="text-sm font-medium text-text-secondary capitalize">{group}</h3>
                </div>
                {renderTable(items)}
              </div>
            ))
          ) : (
            renderTable(filteredTransactions)
          )}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSubmit={addTransaction}
        />
      )}
      {editTarget && (
        <TransactionModal
          transaction={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={(data) => updateTransaction(editTarget.id, data)}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          transaction={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTransaction(deleteTarget.id)}
        />
      )}
    </div>
  );
}
