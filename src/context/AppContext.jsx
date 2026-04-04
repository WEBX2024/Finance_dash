import { useState, useEffect, useCallback } from 'react';
import { mockTransactions } from '../data/mockData';
import { nextId } from '../utils/helpers';
import { AppContext } from './appContextDef';

// ── Keys for localStorage ────────────────────────────────────────
const LS_TRANSACTIONS = 'fd_transactions';
const LS_ROLE         = 'fd_role';
const LS_THEME        = 'fd_theme';

// ── Helpers ──────────────────────────────────────────────────────
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadString(key, fallback) {
  return localStorage.getItem(key) || fallback;
}

export function AppProvider({ children }) {
  // State — hydrate from localStorage, fall back to defaults
  const [transactions, setTransactions] = useState(() =>
    loadJSON(LS_TRANSACTIONS, mockTransactions),
  );
  const [role, setRole]   = useState(() => loadString(LS_ROLE, 'admin'));
  const [theme, setTheme] = useState(() => loadString(LS_THEME, 'light'));
  const [currentPage, setCurrentPage] = useState('dashboard');

  // ── Persist on change ──────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(LS_TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(LS_ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(LS_THEME, theme);
    // Toggle dark class on document for Tailwind dark mode
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // ── Actions ────────────────────────────────────────────────────
  const addTransaction = useCallback(
    (txn) => {
      if (role !== 'admin') return;
      setTransactions((prev) => [
        { ...txn, id: nextId(prev) },
        ...prev,
      ]);
    },
    [role],
  );

  const toggleRole = useCallback(() => {
    setRole((prev) => (prev === 'admin' ? 'viewer' : 'admin'));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // ── Value ──────────────────────────────────────────────────────
  const value = {
    transactions,
    role,
    theme,
    currentPage,
    setCurrentPage,
    addTransaction,
    toggleRole,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
