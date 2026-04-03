import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, TrendingUp, User, Settings, X } from 'lucide-react';
import { useEffect } from 'react';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights', label: 'Insights', icon: TrendingUp },
];

const accountItems = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const renderNavItem = ({ to, label, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
          isActive
            ? 'text-accent bg-accent-subtle border-l-2 border-accent'
            : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
        }`
      }
    >
      <Icon className="w-4 h-4" />
      {label}
    </NavLink>
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(open || typeof window !== 'undefined') && (
          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-50
              w-60 bg-surface border-r border-border
              flex flex-col h-screen
              transform transition-transform duration-200 ease-in-out
              ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Logo */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-accent text-lg">◈</span>
                <span className="font-mono font-bold text-white tracking-widest text-sm">AUREUS</span>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <motion.nav
              variants={container}
              initial="hidden"
              animate="show"
              className="flex-1 px-3 py-4 space-y-4"
            >
              <div>
                <div className="px-3 mb-2 text-xs text-text-muted uppercase tracking-widest font-sans">
                  Menu
                </div>
                <div className="space-y-1">
                  {menuItems.map(navItem => (
                    <motion.div key={navItem.to} variants={item}>
                      {renderNavItem(navItem)}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs text-text-muted uppercase tracking-widest font-sans">
                  Account
                </div>
                <div className="space-y-1">
                  {accountItems.map(navItem => (
                    <motion.div key={navItem.to} variants={item}>
                      {renderNavItem(navItem)}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.nav>

            {/* Version */}
            <div className="px-4 py-3 border-t border-border">
              <span className="text-xs text-text-muted">v1.0.0</span>
            </div>
          </aside>
        )}
      </AnimatePresence>
    </>
  );
}
