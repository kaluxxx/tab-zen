import { useMemo } from 'react';
import type { Tab } from '../types';

interface UseTabSearchReturn {
  filteredTabs: Tab[];
  searchTerm: string;
  hasResults: boolean;
}

export function useTabSearch(tabs: Tab[], searchTerm: string): UseTabSearchReturn {
  const trimmedSearchTerm = searchTerm.trim();

  const filteredTabs = useMemo(() => {
    if (!trimmedSearchTerm) {
      return tabs;
    }

    const normalizedSearchTerm = trimmedSearchTerm.toLowerCase();

    return tabs.filter((tab) => {
      const title = (tab.title || '').toLowerCase();
      const url = (tab.url || '').toLowerCase();
      
      return title.includes(normalizedSearchTerm) || url.includes(normalizedSearchTerm);
    });
  }, [tabs, trimmedSearchTerm]);

  return {
    filteredTabs,
    searchTerm: trimmedSearchTerm,
    hasResults: filteredTabs.length > 0
  };
}