import { useQuery } from '@tanstack/react-query';
import { tabService } from '../services/tab-service';
import type { Tab } from '../types';

interface UseTabsReturn {
  tabs: Tab[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useTabs(): UseTabsReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tabs'],
    queryFn: async () => {
      const tabList = await tabService.getAllTabs();
      return tabList.tabs;
    }
  });

  return {
    tabs: data || [],
    isLoading,
    error,
    refetch
  };
}