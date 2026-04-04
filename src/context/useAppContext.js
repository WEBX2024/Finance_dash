import { useContext } from 'react';
import { AppContext } from './appContextDef';

/**
 * Convenience hook — throws if used outside <AppProvider>.
 */
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within <AppProvider>');
  }
  return ctx;
}
