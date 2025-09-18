import type { Tab, TabGroup, GroupCategory } from '../types';
import { groupingHeuristics } from './grouping-heuristics';

class TabClassifier {
  /**
   * Groups tabs by category using domain-based heuristics
   */
  groupTabs(tabs: Tab[]): TabGroup[] {
    if (tabs.length === 0) return [];

    // Group tabs by category
    const tabsByCategory: Record<GroupCategory, Tab[]> = {
      development: [],
      social: [],
      media: [],
      shopping: [],
      productivity: [],
      documentation: [],
      news: [],
      entertainment: [],
      education: [],
      other: [],
    };

    // Classify each tab and add to appropriate category
    tabs.forEach(tab => {
      const category = this.classifyTab(tab);
      tabsByCategory[category].push(tab);
    });

    // Create groups only for categories that have tabs
    const groups: TabGroup[] = [];

    (Object.entries(tabsByCategory) as [GroupCategory, Tab[]][]).forEach(([category, categoryTabs]) => {
      if (categoryTabs.length > 0) {
        groups.push({
          id: `group-${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: this.getCategoryName(category),
          category,
          tabs: categoryTabs,
          isExpanded: true,
        });
      }
    });

    return groups;
  }

  /**
   * Classifies a single tab based on its URL
   */
  classifyTab(tab: Tab): GroupCategory {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname.toLowerCase();

      // Check each category's patterns
      for (const [category, patterns] of Object.entries(groupingHeuristics.domainPatterns)) {
        if (patterns.some(pattern => domain.includes(pattern))) {
          return category as GroupCategory;
        }
      }

      return 'other';
    } catch {
      // Invalid URL, classify as other
      return 'other';
    }
  }

  /**
   * Gets the display name for a category
   */
  private getCategoryName(category: GroupCategory): string {
    const categoryNames: Record<GroupCategory, string> = {
      development: 'Development',
      social: 'Social',
      media: 'Media',
      shopping: 'Shopping',
      productivity: 'Productivity',
      documentation: 'Documentation',
      news: 'News',
      entertainment: 'Entertainment',
      education: 'Education',
      other: 'Other',
    };

    return categoryNames[category];
  }
}

export const tabClassifier = new TabClassifier();