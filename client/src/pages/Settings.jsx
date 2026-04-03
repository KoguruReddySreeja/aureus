import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Users, Database, Check, Download, FileJson, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRole } from '../context/RoleContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useTransactions } from '../context/TransactionContext.jsx';
import { exportToCSV, exportToJSON } from '../utils/exportUtils.js';
import PageTransition from '../components/layout/PageTransition.jsx';

const TABS = [
  { key: 'general', label: 'General', icon: Settings2 },
  { key: 'roles', label: 'Roles', icon: Users },
  { key: 'data', label: 'Data', icon: Database },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];
const DATE_FORMATS = ['MMM dd, yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd'];

function GeneralTab() {
  const { settings, updateSettings } = useSettings();
  const [local, setLocal] = useState({ ...settings });

  const handleSave = () => {
    updateSettings(local);
    toast.success('Settings saved');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">Display Settings</h3>
        <div className="h-px bg-border mb-5" />

        <div className="space-y-5">
          {/* Currency */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-text-secondary">Currency</label>
            <select
              value={local.currency}
              onChange={(e) => setLocal({ ...local, currency: e.target.value })}
              className="bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary w-40"
            >
              {CURRENCIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Date Format */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-text-secondary">Date Format</label>
            <select
              value={local.dateFormat}
              onChange={(e) => setLocal({ ...local, dateFormat: e.target.value })}
              className="bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary w-40"
            >
              {DATE_FORMATS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Compact Numbers */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-text-secondary">Compact Numbers</label>
            <button
              onClick={() => setLocal({ ...local, compactNumbers: !local.compactNumbers })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                local.compactNumbers ? 'bg-accent' : 'bg-elevated border border-border'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                local.compactNumbers ? 'translate-x-5' : ''
              }`} />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-text-secondary">Notifications</label>
            <button
              onClick={() => setLocal({ ...local, showNotifications: !local.showNotifications })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                local.showNotifications ? 'bg-accent' : 'bg-elevated border border-border'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                local.showNotifications ? 'translate-x-5' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-accent hover:bg-accent-hover text-white font-medium rounded-lg px-4 py-2 transition-all duration-150 hover:shadow-glow-sm active:scale-95 text-sm"
      >
        Save Settings
      </button>
    </div>
  );
}

function RolesTab() {
  const { role, setRole } = useRole();
  const [selected, setSelected] = useState(role);

  const handleApply = () => {
    setRole(selected);
    toast.success(`Role updated to ${selected === 'admin' ? 'Admin' : 'Viewer'}`);
  };

  const permissions = [
    { feature: 'Add Transactions', admin: true, viewer: false },
    { feature: 'Edit Transactions', admin: true, viewer: false },
    { feature: 'Delete Transactions', admin: true, viewer: false },
    { feature: 'View Dashboard', admin: true, viewer: true },
    { feature: 'View Transactions', admin: true, viewer: true },
    { feature: 'View Insights', admin: true, viewer: true },
    { feature: 'Export Data', admin: true, viewer: true },
    { feature: 'Profile & Settings', admin: true, viewer: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">Role Management</h3>
        <div className="h-px bg-border mb-5" />

        <div className="mb-3 text-sm text-text-secondary">
          Current Role: <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ml-1 ${
            role === 'admin'
              ? 'bg-accent-subtle text-accent border border-accent/30'
              : 'bg-elevated text-text-secondary border border-border'
          }`}>{role === 'admin' ? 'Admin' : 'Viewer'}</span>
        </div>

        <div className="space-y-3 mb-5">
          {[
            { value: 'admin', label: 'Admin', desc: 'Full control — add, edit, delete, manage settings' },
            { value: 'viewer', label: 'Viewer', desc: 'Read-only — view dashboards, export data' },
          ].map(r => (
            <button
              key={r.value}
              onClick={() => setSelected(r.value)}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-colors duration-150 ${
                selected === r.value
                  ? 'border-accent bg-accent-subtle'
                  : 'border-border hover:border-elevated-2 hover:bg-surface-2'
              }`}
            >
              <div className="mt-0.5 relative">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selected === r.value ? 'border-accent' : 'border-text-muted'
                }`}>
                  {selected === r.value && (
                    <motion.div
                      layoutId="activeRole"
                      className="absolute inset-1 bg-accent rounded-full"
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{r.label}</div>
                <div className="text-xs text-text-muted">{r.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleApply}
          className="bg-accent hover:bg-accent-hover text-white font-medium rounded-lg px-4 py-2 transition-all duration-150 hover:shadow-glow-sm active:scale-95 text-sm"
        >
          Apply Role
        </button>
      </div>

      {/* Permissions Table */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">Permissions</h3>
        <div className="h-px bg-border mb-4" />

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-elevated/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Feature</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Admin</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Viewer</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, i) => (
                <tr key={p.feature} className="border-t border-border">
                  <td className="px-4 py-2.5 text-text-primary">{p.feature}</td>
                  <td className="px-4 py-2.5 text-center">
                    {p.admin ? <Check className="w-4 h-4 text-success mx-auto" /> : <span className="text-text-muted">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {p.viewer ? <Check className="w-4 h-4 text-success mx-auto" /> : <span className="text-text-muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DataTab() {
  const { role } = useRole();
  const { transactions, resetData } = useTransactions();
  const isAdmin = role === 'admin';
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetData();
      setShowResetConfirm(false);
    } catch {
      // error handled in context
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">Overview</h3>
        <div className="h-px bg-border mb-4" />
        <div className="text-sm text-text-secondary">
          Transactions: <span className="font-mono text-text-primary">{transactions.length}</span> total
        </div>
      </div>

      {/* Export All */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">Export All Data</h3>
        <div className="h-px bg-border mb-4" />
        <p className="text-sm text-text-secondary mb-4">
          Export complete transaction history regardless of active filters.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { exportToCSV(transactions); toast.success('CSV exported'); }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-border hover:border-accent/50 hover:bg-accent-subtle text-text-secondary hover:text-text-primary rounded-lg transition-all duration-150"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => { exportToJSON(transactions); toast.success('JSON exported'); }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-border hover:border-accent/50 hover:bg-accent-subtle text-text-secondary hover:text-text-primary rounded-lg transition-all duration-150"
          >
            <FileJson className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      {isAdmin && (
        <div>
          <h3 className="text-base font-semibold text-danger mb-1">Danger Zone</h3>
          <div className="h-px bg-danger/30 mb-4" />
          <div className="rounded-lg border border-danger/30 bg-danger-subtle p-4">
            <h4 className="text-sm font-medium text-text-primary mb-1">Reset to Seed Data</h4>
            <p className="text-xs text-text-secondary mb-3">
              Deletes all current transactions and restores the original 40 demo entries.
            </p>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 text-sm text-white bg-danger hover:bg-red-600 rounded-lg transition-colors active:scale-95"
            >
              Reset to Seed Data
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowResetConfirm(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border rounded-lg w-full max-w-md mx-4 shadow-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <h2 className="text-lg font-semibold text-text-primary">Reset to Seed Data</h2>
            </div>
            <p className="text-sm text-text-secondary mb-5">
              This will permanently delete all current transactions and restore the original 40 demo entries. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm text-text-secondary border border-border rounded-md hover:bg-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="px-4 py-2 text-sm text-white bg-danger hover:bg-red-600 rounded-md transition-colors disabled:opacity-50"
              >
                {resetting ? 'Resetting...' : 'Reset Data'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-text-primary">Settings</h2>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-elevated border border-border w-fit">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                activeTab === tab.key
                  ? 'text-text-primary bg-surface shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-xl border border-border bg-surface p-6">
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'roles' && <RolesTab />}
          {activeTab === 'data' && <DataTab />}
        </div>
      </div>
    </PageTransition>
  );
}
