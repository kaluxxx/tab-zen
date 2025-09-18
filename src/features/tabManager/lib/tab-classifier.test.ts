import {describe, expect, it} from 'vitest';
import type {Tab} from '../types';
import {tabClassifier} from './tab-classifier';

describe('tabClassifier', () => {
  const mockTabs: Tab[] = [
    {
      id: 1,
      title: 'GitHub - Repository',
      url: 'https://github.com/user/repo',
      active: false,
      windowId: 1,
      index: 0,
    },
    {
      id: 2,
      title: 'Stack Overflow - Question',
      url: 'https://stackoverflow.com/questions/123',
      active: false,
      windowId: 1,
      index: 1,
    },
    {
      id: 3,
      title: 'YouTube - Video',
      url: 'https://www.youtube.com/watch?v=abc',
      active: false,
      windowId: 1,
      index: 2,
    },
    {
      id: 4,
      title: 'Facebook',
      url: 'https://www.facebook.com/',
      active: false,
      windowId: 1,
      index: 3,
    },
    {
      id: 5,
      title: 'Google Docs',
      url: 'https://docs.google.com/document/d/123',
      active: false,
      windowId: 1,
      index: 4,
    },
    {
      id: 6,
      title: 'Unknown Site',
      url: 'https://unknown-domain.com/',
      active: false,
      windowId: 1,
      index: 5,
    },
  ];

  describe('groupTabs', () => {
    it('should group tabs by domain patterns', () => {
      const groups = tabClassifier.groupTabs(mockTabs);

      expect(groups).toHaveLength(5); // development, media, social, productivity, other

      const developmentGroup = groups.find(g => g.category === 'development');
      expect(developmentGroup).toBeDefined();
      expect(developmentGroup!.tabs).toHaveLength(2); // GitHub + StackOverflow
      expect(developmentGroup!.tabs.map(t => t.id)).toEqual([1, 2]);

      const mediaGroup = groups.find(g => g.category === 'media');
      expect(mediaGroup).toBeDefined();
      expect(mediaGroup!.tabs).toHaveLength(1); // YouTube
      expect(mediaGroup!.tabs[0].id).toBe(3);

      const socialGroup = groups.find(g => g.category === 'social');
      expect(socialGroup).toBeDefined();
      expect(socialGroup!.tabs).toHaveLength(1); // Facebook
      expect(socialGroup!.tabs[0].id).toBe(4);

      const productivityGroup = groups.find(g => g.category === 'productivity');
      expect(productivityGroup).toBeDefined();
      expect(productivityGroup!.tabs).toHaveLength(1); // Google Docs
      expect(productivityGroup!.tabs[0].id).toBe(5);

      const otherGroup = groups.find(g => g.category === 'other');
      expect(otherGroup).toBeDefined();
      expect(otherGroup!.tabs).toHaveLength(1); // Unknown site
      expect(otherGroup!.tabs[0].id).toBe(6);
    });

    it('should create unique group IDs', () => {
      const groups = tabClassifier.groupTabs(mockTabs);
      const groupIds = groups.map(g => g.id);
      const uniqueIds = new Set(groupIds);

      expect(groupIds.length).toBe(uniqueIds.size);
    });

    it('should set groups as expanded by default', () => {
      const groups = tabClassifier.groupTabs(mockTabs);

      groups.forEach(group => {
        expect(group.isExpanded).toBe(true);
      });
    });

    it('should assign proper group names based on category', () => {
      const groups = tabClassifier.groupTabs(mockTabs);

      const developmentGroup = groups.find(g => g.category === 'development');
      expect(developmentGroup!.name).toBe('Development');

      const mediaGroup = groups.find(g => g.category === 'media');
      expect(mediaGroup!.name).toBe('Media');

      const socialGroup = groups.find(g => g.category === 'social');
      expect(socialGroup!.name).toBe('Social');

      const productivityGroup = groups.find(g => g.category === 'productivity');
      expect(productivityGroup!.name).toBe('Productivity');

      const otherGroup = groups.find(g => g.category === 'other');
      expect(otherGroup!.name).toBe('Other');
    });

    it('should handle empty tab list', () => {
      const groups = tabClassifier.groupTabs([]);

      expect(groups).toEqual([]);
    });

    it('should preserve tab order within groups', () => {
      const tabs: Tab[] = [
        { id: 1, title: 'GitHub 1', url: 'https://github.com/repo1', active: false, windowId: 1, index: 0 },
        { id: 2, title: 'YouTube 1', url: 'https://youtube.com/video1', active: false, windowId: 1, index: 1 },
        { id: 3, title: 'GitHub 2', url: 'https://github.com/repo2', active: false, windowId: 1, index: 2 },
      ];

      const groups = tabClassifier.groupTabs(tabs);
      const developmentGroup = groups.find(g => g.category === 'development');

      expect(developmentGroup!.tabs.map(t => t.id)).toEqual([1, 3]); // Preserve original order
    });
  });

  describe('classifyTab', () => {
    it('should classify development sites correctly', () => {
      const githubTab: Tab = {
        id: 1,
        title: 'GitHub',
        url: 'https://github.com/user/repo',
        active: false,
        windowId: 1,
        index: 0,
      };

      const category = tabClassifier.classifyTab(githubTab);
      expect(category).toBe('development');
    });

    it('should classify media sites correctly', () => {
      const youtubeTab: Tab = {
        id: 1,
        title: 'YouTube',
        url: 'https://www.youtube.com/watch?v=abc',
        active: false,
        windowId: 1,
        index: 0,
      };

      const category = tabClassifier.classifyTab(youtubeTab);
      expect(category).toBe('media');
    });

    it('should classify unknown sites as other', () => {
      const unknownTab: Tab = {
        id: 1,
        title: 'Unknown',
        url: 'https://unknown-site.com/',
        active: false,
        windowId: 1,
        index: 0,
      };

      const category = tabClassifier.classifyTab(unknownTab);
      expect(category).toBe('other');
    });

    it('should handle malformed URLs', () => {
      const invalidTab: Tab = {
        id: 1,
        title: 'Invalid',
        url: 'not-a-url',
        active: false,
        windowId: 1,
        index: 0,
      };

      const category = tabClassifier.classifyTab(invalidTab);
      expect(category).toBe('other');
    });
  });
});