import type { Tab, TabGroup, TabServiceError } from '../types';
import { tabClassifier } from '../lib/tab-classifier';
import { tabService } from './tab-service';

export interface GroupingResult {
  groups: TabGroup[] | null;
  error: TabServiceError | null;
}

class GroupingService {
  /**
   * Fetches all tabs and returns them grouped by category
   */
  async getGroupedTabs(): Promise<GroupingResult> {
    try {
      const tabList = await tabService.getAllTabs();
      const groups = tabClassifier.groupTabs(tabList.tabs);

      return {
        groups,
        error: null,
      };
    } catch (error) {
      return {
        groups: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'GROUPING_ERROR',
        },
      };
    }
  }

  /**
   * Groups provided tabs synchronously
   */
  getGroupedTabsSync(tabs: Tab[]): TabGroup[] {
    return tabClassifier.groupTabs(tabs);
  }

  /**
   * Toggles the expansion state of a specific group
   */
  toggleGroupExpansion(groups: TabGroup[], groupId: string): TabGroup[] {
    return groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          isExpanded: !group.isExpanded,
        };
      }
      return group;
    });
  }

  /**
   * Gets all tabs within a specific group
   */
  getTabsInGroup(groups: TabGroup[], groupId: string): Tab[] {
    const group = groups.find(g => g.id === groupId);
    return group ? group.tabs : [];
  }

  /**
   * Counts total tabs across all groups
   */
  getTotalTabCount(groups: TabGroup[]): number {
    return groups.reduce((total, group) => total + group.tabs.length, 0);
  }

  /**
   * Gets groups statistics
   */
  getGroupsStats(groups: TabGroup[]) {
    const stats = {
      totalGroups: groups.length,
      totalTabs: this.getTotalTabCount(groups),
      expandedGroups: groups.filter(g => g.isExpanded).length,
      categoryCounts: {} as Record<string, number>,
    };

    // Count tabs per category
    groups.forEach(group => {
      stats.categoryCounts[group.category] = group.tabs.length;
    });

    return stats;
  }

  /**
   * Finds a group containing a specific tab
   */
  findGroupByTab(groups: TabGroup[], tabId: number): TabGroup | null {
    return groups.find(group =>
      group.tabs.some(tab => tab.id === tabId)
    ) || null;
  }

  /**
   * Collapses all groups
   */
  collapseAllGroups(groups: TabGroup[]): TabGroup[] {
    return groups.map(group => ({
      ...group,
      isExpanded: false,
    }));
  }

  /**
   * Expands all groups
   */
  expandAllGroups(groups: TabGroup[]): TabGroup[] {
    return groups.map(group => ({
      ...group,
      isExpanded: true,
    }));
  }
}

export const groupingService = new GroupingService();