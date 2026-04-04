import { createContext } from 'react';

/**
 * The shared AppContext instance.
 * Separated into its own file so that AppContext.jsx only exports components,
 * which is required for React Fast Refresh to work.
 */
export const AppContext = createContext(null);
