import { useState, useMemo } from 'react';

/**
 * Custom hook that takes a transactions array and returns
 * filtered + sorted results along with control setters.
 *
 * @param {Array} transactions — full list of transaction objects
 * @returns {object}
 */
export function useTransactions(transactions) {
  const [searchQuery, setSearchQuery]     = useState('');
  const [typeFilter, setTypeFilter]       = useState('all'); // 'all' | 'income' | 'expense'
  const [sortField, setSortField]         = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Toggle sort — if same field, flip direction; otherwise switch field, default desc
  const toggleSort = (field) => {
    if (field === sortField) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...transactions];

    // ── Search (description + category) ────────────────────────
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }

    // ── Type filter ────────────────────────────────────────────
    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    // ── Sort ───────────────────────────────────────────────────
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle string comparison for date (ISO format sorts lexicographically)
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, searchQuery, typeFilter, sortField, sortDirection]);

  return {
    filtered,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    sortField,
    sortDirection,
    toggleSort,
  };
}
