import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Tab } from '../types';
import { groupingService } from './grouping-service';
import { tabService } from './tab-service';

// Mock tab-service
vi.mock('./tab-service', () => ({
  tabService: {
    getAllTabs: vi.fn(),
  },
}));

describe('groupingService', () => {
  const mockTabs: Tab[] = [
    {
      id: 1,
      title: 'GitHub Repository',
      url: 'https://github.com/user/repo',
      active: false,
      windowId: 1,
      index: 0,
    },
    {
      id: 2,
      title: 'YouTube Video',
      url: 'https://www.youtube.com/watch?v=abc',
      active: false,
      windowId: 1,
      index: 1,
    },
    {
      id: 3,
      title: 'Facebook',
      url: 'https://www.facebook.com/',
      active: false,
      windowId: 1,
      index: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getGroupedTabs', () => {
    it('should fetch tabs and return grouped tabs', async () => {
      // Arrange
      vi.mocked(tabService.getAllTabs).mockResolvedValue({ tabs: mockTabs, totalCount: mockTabs.length });

      // Act
      const result = await groupingService.getGroupedTabs();

      // Assert
      expect(tabService.getAllTabs).toHaveBeenCalledOnce();
      expect(result.error).toBeNull();
      expect(result.groups).toBeDefined();
      expect(result.groups!.length).toBeGreaterThan(0);

      // Check that tabs are properly grouped
      const allTabsInGroups = result.groups!.flatMap(group => group.tabs);
      expect(allTabsInGroups).toHaveLength(mockTabs.length);
    });

    it('should handle tab service errors', async () => {
      // Arrange
      vi.mocked(tabService.getAllTabs).mockRejectedValue(new Error('Failed to fetch tabs'));

      // Act
      const result = await groupingService.getGroupedTabs();

      // Assert
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Failed to fetch tabs');
      expect(result.groups).toBeNull();
    });

    it('should handle empty tab list', async () => {
      // Arrange
      vi.mocked(tabService.getAllTabs).mockResolvedValue({ tabs: [], totalCount: 0 });

      // Act
      const result = await groupingService.getGroupedTabs();

      // Assert
      expect(result.error).toBeNull();
      expect(result.groups).toEqual([]);
    });

    it('should preserve tab data in groups', async () => {
      // Arrange
      vi.mocked(tabService.getAllTabs).mockResolvedValue({ tabs: mockTabs, totalCount: mockTabs.length });

      // Act
      const result = await groupingService.getGroupedTabs();

      // Assert
      const developmentGroup = result.groups!.find(g => g.category === 'development');
      const githubTab = developmentGroup?.tabs.find(t => t.id === 1);

      expect(githubTab).toBeDefined();
      expect(githubTab!.title).toBe('GitHub Repository');
      expect(githubTab!.url).toBe('https://github.com/user/repo');
    });
  });

  describe('getGroupedTabsSync', () => {
    it('should group provided tabs synchronously', () => {
      // Act
      const groups = groupingService.getGroupedTabsSync(mockTabs);

      // Assert
      expect(groups.length).toBeGreaterThan(0);

      const developmentGroup = groups.find(g => g.category === 'development');
      const mediaGroup = groups.find(g => g.category === 'media');
      const socialGroup = groups.find(g => g.category === 'social');

      expect(developmentGroup).toBeDefined();
      expect(developmentGroup!.tabs).toHaveLength(1);
      expect(developmentGroup!.tabs[0].id).toBe(1);

      expect(mediaGroup).toBeDefined();
      expect(mediaGroup!.tabs).toHaveLength(1);
      expect(mediaGroup!.tabs[0].id).toBe(2);

      expect(socialGroup).toBeDefined();
      expect(socialGroup!.tabs).toHaveLength(1);
      expect(socialGroup!.tabs[0].id).toBe(3);
    });

    it('should return empty array for empty input', () => {
      // Act
      const groups = groupingService.getGroupedTabsSync([]);

      // Assert
      expect(groups).toEqual([]);
    });
  });

  describe('toggleGroupExpansion', () => {
    it('should toggle group expansion state', () => {
      // Arrange
      const groups = groupingService.getGroupedTabsSync(mockTabs);
      const groupToToggle = groups[0];
      const initialExpansion = groupToToggle.isExpanded;

      // Act
      const updatedGroups = groupingService.toggleGroupExpansion(groups, groupToToggle.id);
      const updatedGroup = updatedGroups.find(g => g.id === groupToToggle.id);

      // Assert
      expect(updatedGroup!.isExpanded).toBe(!initialExpansion);

      // Other groups should remain unchanged
      const otherGroups = updatedGroups.filter(g => g.id !== groupToToggle.id);
      const originalOtherGroups = groups.filter(g => g.id !== groupToToggle.id);

      otherGroups.forEach((group, index) => {
        expect(group.isExpanded).toBe(originalOtherGroups[index].isExpanded);
      });
    });

    it('should return original groups if group ID not found', () => {
      // Arrange
      const groups = groupingService.getGroupedTabsSync(mockTabs);

      // Act
      const updatedGroups = groupingService.toggleGroupExpansion(groups, 'non-existent-id');

      // Assert
      expect(updatedGroups).toEqual(groups);
    });
  });

  describe('getTabsInGroup', () => {
    it('should return tabs for a specific group', () => {
      // Arrange
      const groups = groupingService.getGroupedTabsSync(mockTabs);
      const developmentGroup = groups.find(g => g.category === 'development')!;

      // Act
      const tabsInGroup = groupingService.getTabsInGroup(groups, developmentGroup.id);

      // Assert
      expect(tabsInGroup).toHaveLength(1);
      expect(tabsInGroup[0].id).toBe(1);
      expect(tabsInGroup[0].title).toBe('GitHub Repository');
    });

    it('should return empty array if group not found', () => {
      // Arrange
      const groups = groupingService.getGroupedTabsSync(mockTabs);

      // Act
      const tabsInGroup = groupingService.getTabsInGroup(groups, 'non-existent-id');

      // Assert
      expect(tabsInGroup).toEqual([]);
    });
  });
});