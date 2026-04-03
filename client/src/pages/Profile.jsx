import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRole } from '../context/RoleContext.jsx';
import { useTransactions } from '../context/TransactionContext.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import GlowCard from '../components/ui/GlowCard.jsx';
import PageTransition from '../components/layout/PageTransition.jsx';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function Profile() {
  const { role, profile, updateProfile } = useRole();
  const { transactions, totals, loading } = useTransactions();

  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    company: profile.company,
  });
  const [errors, setErrors] = useState({});

  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.email.trim()) newErrors.email = true;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors');
      return;
    }

    setErrors({});
    const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    updateProfile({ ...form, avatarInitials: initials });
    toast.success('Profile updated');
  };

  const scrollToForm = () => {
    document.getElementById('profile-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Two Column Layout */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left — Profile Card */}
          <motion.div variants={item}>
            <GlowCard className="rounded-xl border border-border bg-surface p-6 h-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-bold mb-4">
                  {profile.avatarInitials}
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-1">{profile.name}</h2>
                <p className="text-sm text-text-secondary mb-1">{profile.email}</p>
                <p className="text-sm text-text-secondary mb-3">{profile.company}</p>
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium mb-3 ${
                  role === 'admin'
                    ? 'bg-accent-subtle text-accent border border-accent/30'
                    : 'bg-elevated text-text-secondary border border-border'
                }`}>
                  {role === 'admin' ? 'Admin' : 'Viewer'}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since {formatDate(profile.joinedDate)}</span>
                </div>
                <button
                  onClick={scrollToForm}
                  className="mt-4 px-4 py-2 text-sm border border-border hover:border-accent/50 hover:bg-accent-subtle text-text-secondary hover:text-text-primary rounded-lg transition-all duration-150"
                >
                  Edit Profile
                </button>
              </div>
            </GlowCard>
          </motion.div>

          {/* Right — Edit Form */}
          <motion.div variants={item}>
            <div id="profile-form" className="rounded-xl border border-border bg-surface p-6 h-full">
              <h3 className="text-base font-semibold text-text-primary mb-5">Edit Profile</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-text-secondary mb-1.5">
                    <User className="w-3.5 h-3.5" /> Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full bg-elevated border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-150 ${
                      errors.name ? 'border-danger' : 'border-border'
                    }`}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-text-secondary mb-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full bg-elevated border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-150 ${
                      errors.email ? 'border-danger' : 'border-border'
                    }`}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-text-secondary mb-1.5">
                    <Building className="w-3.5 h-3.5" /> Company
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-150"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent-hover text-white font-medium rounded-lg px-4 py-2 transition-all duration-150 hover:shadow-glow-sm active:scale-95 text-sm"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Transactions', value: transactions.length },
            { label: 'Total Income', value: formatCurrency(totals.income), color: 'text-success' },
            { label: 'Total Expenses', value: formatCurrency(totals.expenses), color: 'text-danger' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              variants={item}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="text-xs text-text-muted uppercase tracking-widest mb-2">{stat.label}</div>
              <div className={`font-mono text-2xl font-semibold ${stat.color || 'text-text-primary'}`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
