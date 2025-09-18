import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TabGroup, Tab } from '../types';
import { groupingService } from '../services/grouping-service';

export interface UseTabGroupingOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export interface UseTabGroupingReturn {
  groups: TabGroup[];
  isLoading: boolean;
  error: Error | null;
  isGroupingEnabled: boolean;
  totalTabs: number;
  expandedGroups: number;
  toggleGrouping: () => void;
  toggleGroupExpansion: (groupId: string) => void;
  expandAllGroups: () => void;
  collapseAllGroups: () => void;
  refetch: () => void;
  findGroupByTab: (tabId: number) => TabGroup | null;
  getTabsInGroup: (groupId: string) => Tab[];
}

export function useTabGrouping(options: UseTabGroupingOptions = {}): UseTabGroupingReturn {
  const { enabled = true, refetchInterval } = options;

  const [isGroupingEnabled, setIsGroupingEnabled] = useState(true);
  const [localGroups, setLocalGroups] = useState<TabGroup[]>([]);

  // Fetch grouped tabs using React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tab-groups'],
    queryFn: async () => {
      const result = await groupingService.getGroupedTabs();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.groups || [];
    },
    enabled: enabled && isGroupingEnabled,
    refetchInterval,
  });

  // Update local groups when data changes, preserving expansion state
  useEffect(() => {
    if (data) {
      setLocalGroups(prevGroups => {
        // If no previous groups, use new data as-is
        if (prevGroups.length === 0) {
          return data;
        }

        // Preserve expansion state from previous groups
        return data.map(newGroup => {
          const existingGroup = prevGroups.find(g => g.id === newGroup.id);
          return {
            ...newGroup,
            isExpanded: existingGroup?.isExpanded ?? newGroup.isExpanded
          };
        });
      });
    }
  }, [data]);

  // Always use local groups for consistency
  const groups = useMemo(() => {
    return localGroups;
  }, [localGroups]);

  // Toggle grouping on/off
  const toggleGrouping = useCallback(() => {
    setIsGroupingEnabled(prev => !prev);
  }, []);

  // Toggle specific group expansion
  const toggleGroupExpansion = useCallback((groupId: string) => {
    setLocalGroups(prevGroups =>
      groupingService.toggleGroupExpansion(prevGroups, groupId)
    );
  }, []);

  // Expand all groups
  const expandAllGroups = useCallback(() => {
    setLocalGroups(prevGroups =>
      groupingService.expandAllGroups(prevGroups)
    );
  }, []);

  // Collapse all groups
  const collapseAllGroups = useCallback(() => {
    setLocalGroups(prevGroups =>
      groupingService.collapseAllGroups(prevGroups)
    );
  }, []);

  // Find group containing a specific tab
  const findGroupByTab = useCallback((tabId: number): TabGroup | null => {
    return groupingService.findGroupByTab(groups, tabId);
  }, [groups]);

  // Get tabs in a specific group
  const getTabsInGroup = useCallback((groupId: string): Tab[] => {
    return groupingService.getTabsInGroup(groups, groupId);
  }, [groups]);

  // Computed values
  const stats = useMemo(() => {
    return groupingService.getGroupsStats(groups);
  }, [groups]);

  return {
    groups,
    isLoading,
    error,
    isGroupingEnabled,
    totalTabs: stats.totalTabs,
    expandedGroups: stats.expandedGroups,
    toggleGrouping,
    toggleGroupExpansion,
    expandAllGroups,
    collapseAllGroups,
    refetch,
    findGroupByTab,
    getTabsInGroup,
  };
}