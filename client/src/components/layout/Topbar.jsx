import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Check, ChevronDown } from 'lucide-react';
import { useRole } from '../../context/RoleContext.jsx';
import toast from 'react-hot-toast';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/insights': 'Insights',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export default function Topbar({ onMenuClick }) {
  const { role, setRole, profile } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (r) => {
    setRole(r);
    setMenuOpen(false);
    toast.success(`Switched to ${r === 'admin' ? 'Admin' : 'Viewer'}`);
  };

  return (
    <header className="h-14 border-b border-border bg-surface/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-text-secondary hover:text-text-primary"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold tracking-tight text-text-primary">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3" ref={menuRef}>
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
          role === 'admin'
            ? 'bg-accent-subtle text-accent border border-accent/30'
            : 'bg-elevated text-text-secondary border border-border'
        }`}>
          {role === 'admin' ? 'Admin' : 'Viewer'}
        </span>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-white">
              {profile.avatarInitials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-surface shadow-xl z-50 py-1 origin-top-right"
              >
                <div className="px-3 py-2 border-b border-border">
                  <div className="text-sm font-medium text-text-primary">{profile.name}</div>
                  <div className="text-xs text-text-secondary">{profile.email}</div>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-text-muted font-medium uppercase tracking-wider">
                    Switch Role
                  </div>
                  {['admin', 'viewer'].map(r => (
                    <button
                      key={r}
                      onClick={() => handleRoleSwitch(r)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-elevated transition-colors"
                    >
                      <span className="w-4">
                        {role === r && <Check className="w-4 h-4 text-accent" />}
                      </span>
                      <span className="capitalize">{r}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-border py-1">
                  <button
                    onClick={() => { navigate('/profile'); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-elevated hover:text-text-primary transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-elevated hover:text-text-primary transition-colors"
                  >
                    Settings
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
