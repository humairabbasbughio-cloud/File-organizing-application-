import React, { createContext, useContext, useState } from 'react';
import { INITIAL_USERS, ROLE_PERMISSIONS_MAP } from '../data/initialData';
import { Permission, User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User;
  users: User[];
  hasPermission: (permission: Permission) => boolean;
  switchUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'lastActive'>) => void;
  removeUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>(INITIAL_USERS[0].id);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const hasPermission = (permission: Permission): boolean => {
    const roleConfig = ROLE_PERMISSIONS_MAP.find(r => r.role === currentUser.role);
    if (!roleConfig) return false;
    return roleConfig.permissions.includes(permission);
  };

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUserId(userId);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, lastActive: new Date().toISOString() } : u))
      );
    }
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const addUser = (newUser: Omit<User, 'id' | 'createdAt' | 'lastActive'>) => {
    const created: User = {
      ...newUser,
      id: `u-custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    setUsers(prev => [...prev, created]);
  };

  const removeUser = (userId: string) => {
    if (userId === currentUser.id) return; // Cannot delete self
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        hasPermission,
        switchUser,
        updateUserRole,
        addUser,
        removeUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
