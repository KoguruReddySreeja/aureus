import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { RoleProvider } from './context/RoleContext.jsx';
import { TransactionProvider } from './context/TransactionContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Insights from './pages/Insights.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

const toastOptions = {
  position: 'bottom-right',
  style: {
    background: '#111111',
    color: '#f0f0f0',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    fontFamily: 'Geist',
    fontSize: '14px',
  },
  iconTheme: { primary: '#22c55e', secondary: '#111111' },
  error: {
    iconTheme: { primary: '#ef4444', secondary: '#111111' },
  },
};

export default function App() {
  return (
    <Router>
      <RoleProvider>
        <SettingsProvider>
          <TransactionProvider>
            <AnimatedRoutes />
            <Toaster toastOptions={toastOptions} />
          </TransactionProvider>
        </SettingsProvider>
      </RoleProvider>
    </Router>
  );
}
