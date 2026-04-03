import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye } from 'lucide-react';
import { useRole } from '../../context/RoleContext.jsx';
import GlowCard from '../ui/GlowCard.jsx';

export default function RolesSection() {
  const navigate = useNavigate();
  const { setRole } = useRole();

  const handleTry = (role) => {
    setRole(role);
    navigate('/dashboard');
  };

  return (
    <section id="roles" className="py-24 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-3">
            Built for every stakeholder
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Aureus adapts its interface to match who's using it — giving each role exactly what they need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <GlowCard className="rounded-xl border border-border border-l-4 border-l-accent bg-surface p-6 h-full">
              <div className="p-2 bg-accent-subtle rounded-lg w-fit mb-4">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-1">Admin</h3>
              <p className="text-sm text-text-secondary mb-4">Full platform control</p>
              <ul className="space-y-2 mb-6">
                {['Add, edit, delete transactions', 'Manage application settings', 'Switch and assign roles', 'Reset and export all data'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleTry('admin')}
                className="text-sm text-accent hover:text-accent-hover transition-colors font-medium"
              >
                Try as Admin →
              </button>
            </GlowCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <GlowCard className="rounded-xl border border-border bg-surface p-6 h-full">
              <div className="p-2 bg-elevated rounded-lg w-fit mb-4">
                <Eye className="w-5 h-5 text-text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-1">Viewer</h3>
              <p className="text-sm text-text-secondary mb-4">Read-only intelligence</p>
              <ul className="space-y-2 mb-6">
                {['View all dashboards and charts', 'Filter and search transactions', 'Export CSV and JSON reports', 'Explore financial insights'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleTry('viewer')}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium"
              >
                Try as Viewer →
              </button>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
