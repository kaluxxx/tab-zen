import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useTabGrouping } from './use-tab-grouping';
import { groupingService } from '../services/grouping-service';
import type { Tab } from '../types';

// Mock grouping service
vi.mock('../services/grouping-service', () => ({
  groupingService: {
    getGroupedTabs: vi.fn(),
    toggleGroupExpansion: vi.fn(),
    expandAllGroups: vi.fn(),
    collapseAllGroups: vi.fn(),
    findGroupByTab: vi.fn(),
    getTabsInGroup: vi.fn(),
    getGroupsStats: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useTabGrouping', () => {
  const mockTabs: Tab[] = [
    {
      id: 1,
      title: 'GitHub',
      url: 'https://github.com/user/repo',
      active: false,
      windowId: 1,
      index: 0,
    },
    {
      id: 2,
      title: 'YouTube',
      url: 'https://youtube.com/watch?v=abc',
      active: false,
      windowId: 1,
      index: 1,
    },
  ];

  const mockGroups = [
    {
      id: 'group-development-1',
      name: 'Development',
      category: 'development' as const,
      tabs: [mockTabs[0]],
      isExpanded: true,
    },
    {
      id: 'group-media-1',
      name: 'Media',
      category: 'media' as const,
      tabs: [mockTabs[1]],
      isExpanded: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup mock return values
    vi.mocked(groupingService.getGroupsStats).mockReturnValue({
      totalGroups: mockGroups.length,
      totalTabs: mockTabs.length,
      expandedGroups: 2,
      categoryCounts: { development: 1, media: 1 },
    });
  });

  describe('basic functionality', () => {
    it('should fetch and return grouped tabs', async () => {
      // Arrange
      vi.mocked(groupingService.getGroupedTabs).mockResolvedValue({
        groups: mockGroups,
        error: null,
      });

      // Act
      const { result } = renderHook(() => useTabGrouping(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.groups).toEqual(mockGroups);
      expect(result.current.error).toBeNull();
      expect(result.current.totalTabs).toBe(2);
      expect(result.current.expandedGroups).toBe(2);
    });

    it('should handle service errors', async () => {
      // Arrange - The service rejects with an error
      vi.mocked(groupingService.getGroupedTabs).mockRejectedValue(new Error('Failed to fetch'));

      // Act
      const { result } = renderHook(() => useTabGrouping(), {
        wrapper: createWrapper(),
      });

      // Assert - Wait for the error state
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should have error from React Query
      expect(result.current.error).toBeTruthy();
      expect(result.current.groups).toEqual([]);
    });

    it('should start with grouping enabled', () => {
      // Arrange
      vi.mocked(groupingService.getGroupedTabs).mockResolvedValue({
        groups: [],
        error: null,
      });

      // Act
      const { result } = renderHook(() => useTabGrouping(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isGroupingEnabled).toBe(true);
    });
  });

  describe('grouping toggle', () => {
    it('should toggle grouping enabled state', async () => {
      // Arrange
      vi.mocked(groupingService.getGroupedTabs).mockResolvedValue({
        groups: mockGroups,
        error: null,
      });

      const { result } = renderHook(() => useTabGrouping(), {
        wrapper: createWrapper(),
      });

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Act
      act(() => {
        result.current.toggleGrouping();
      });

      // Assert
      expect(result.current.isGroupingEnabled).toBe(false);

      // Act again
      act(() => {
        result.current.toggleGrouping();
      });

      // Assert
      expect(result.current.isGroupingEnabled).toBe(true);
    });

    it('should not fetch when grouping is disabled', () => {
      // Arrange
      const mockGetGroupedTabs = vi.mocked(groupingService.getGroupedTabs);

      const { result } = renderHook(() => useTabGrouping({ enabled: false }), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockGetGroupedTabs).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('group expansion', () => {
    it('should toggle group expansion', async () => {
      // Arrange
      vi.mocked(groupingService.getGroupedTabs).mockResolvedValue({
        groups: mockGroups,
        error: null,
      });

      const updatedGroups = [
        { ...mockGroups[0], isExpanded: false },
        mockGroups[1],
      ];

      vi.mocked(groupingService.toggleGroupExpansion).mockReturnValue(
        updatedGroups
      );

      const { result } = renderHook(() => useTabGrouping(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Act
      act(() => {
        result.current.toggleGroupExpansion('group-development-1');
      });

      // Assert
      expect(groupingService.toggleGroupExpansion).toHaveBeenCalledWith(
        mockGroups,
        'group-development-1'
      );
    });

    it('should expand all groups', async () => {
      // Arrange
      vi.mocked(groupingService.getGroupedTabs).mockResolvedValue({
        groups: mockGroups,
        error: null,
      });

      vi.mocked(groupingService.expandAllGroups).mockReturnValue(mockGroups);

      const { result } = renderHook(() => useTabGrouping(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Act
      act(() => {
        result.current.expandAllGroups();
      });

      // Assert
      expect(groupingService.expandAllGroups).toHaveBeenCalledWith(mockGroups);
    });

    it('should collapse all groups', async () => {
      // Arrange
      vi.mocked(groupingService.getGroupedTabs).mockResolvedValue({
        groups: mockGroups,
        error: null,
      });

      const collapsedGroups = mockGroups.map(g => ({ ...g, isExpanded: false }));
      vi.mocked(groupingService.collapseAllGroups).mockReturnValue(
        collapsedGroups
      );

      const { result } = renderHook(() => useTabGrouping(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Act
      act(() => {
        result.current.collapseAllGroups();
      });

      // Assert
      expect(groupingService.collapseAllGroups).toHaveBeenCalledWith(mockGroups);
    });
  });

  describe('utility functions', () => {
    it('should find group by tab', async () => {
      // Arrange
      vi.mocked(groupingService.getGroupedTabs).mockResolvedValue({
        groups: mockGroups,
        error: null,
      });

      vi.mocked(groupingService.findGroupByTab).mockReturnValue(mockGroups[0]);

      const { result } = renderHook(() => useTabGrouping(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Act
      const group = result.current.findGroupByTab(1);

      // Assert
      expect(groupingService.findGroupByTab).toHaveBeenCalledWith(
        mockGroups,
        1
      );
      expect(group).toEqual(mockGroups[0]);
    });

    it('should get tabs in group', async () => {
      // Arrange
      vi.mocked(groupingService.getGroupedTabs).mockResolvedValue({
        groups: mockGroups,
        error: null,
      });

      vi.mocked(groupingService.getTabsInGroup).mockReturnValue([mockTabs[0]]);

      const { result } = renderHook(() => useTabGrouping(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Act
      const tabs = result.current.getTabsInGroup('group-development-1');

      // Assert
      expect(groupingService.getTabsInGroup).toHaveBeenCalledWith(
        mockGroups,
        'group-development-1'
      );
      expect(tabs).toEqual([mockTabs[0]]);
    });
  });
});