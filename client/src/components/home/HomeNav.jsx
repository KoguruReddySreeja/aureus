import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Roles', href: '#roles' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Contact', href: '#contact' },
  { label: 'Blog', href: '#blog' },
];

export default function HomeNav() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [0.4, 0.8]);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      style={{ backgroundColor: useTransform(bgOpacity, v => `rgba(0,0,0,${v})`) }}
      className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-accent text-lg">◈</span>
          <span className="font-mono font-bold text-white tracking-widest text-sm">AUREUS</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-sm text-white/60 hover:text-white transition-colors duration-150"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-white/60 hover:text-white transition-colors duration-150"
          >
            Sign In
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className="text-sm text-white bg-white/10 border border-white/20 hover:bg-white/15 px-4 py-1.5 rounded-full transition-all duration-150"
          >
            Request Demo →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/5 px-6 py-4 space-y-3"
        >
          {links.map(l => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="block w-full text-left text-sm text-white/60 hover:text-white py-2"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => navigate('/dashboard')}
            className="block w-full text-left text-sm text-accent py-2"
          >
            Sign In
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
}
