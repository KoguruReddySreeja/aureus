import { createContext, useContext, useState } from 'react';

const RoleContext = createContext(null);

const DEFAULT_PROFILE = {
  name: 'Alex Donovan',
  email: 'alex@aureus.io',
  company: 'Aureus Inc.',
  avatarInitials: 'AD',
  joinedDate: '2024-01-15',
};

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(
    () => localStorage.getItem('aureus_role') || 'admin'
  );
  const [profile, setProfile] = useState(
    () => JSON.parse(localStorage.getItem('aureus_profile') || 'null') || DEFAULT_PROFILE
  );

  const setRole = (r) => {
    setRoleState(r);
    localStorage.setItem('aureus_role', r);
  };

  const updateProfile = (updates) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem('aureus_profile', JSON.stringify(updated));
  };

  return (
    <RoleContext.Provider value={{ role, setRole, profile, updateProfile }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
