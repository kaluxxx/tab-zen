import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTabSearch } from './use-tab-search';
import type { Tab } from '../types';

const mockTabs: Tab[] = [
  {
    id: 1,
    title: 'GitHub - React Documentation',
    url: 'https://github.com/facebook/react',
    favIconUrl: 'https://github.com/favicon.ico',
    active: false,
    index: 0,
    windowId: 1,
  },
  {
    id: 2,
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/',
    favIconUrl: 'https://typescriptlang.org/favicon.ico',
    active: true,
    index: 1,
    windowId: 1,
  },
  {
    id: 3,
    title: 'Stack Overflow - JavaScript Question',
    url: 'https://stackoverflow.com/questions/javascript-array',
    favIconUrl: 'https://stackoverflow.com/favicon.ico',
    active: false,
    index: 2,
    windowId: 1,
  }
];

describe('useTabSearch', () => {
  it('should return all tabs when search term is empty', () => {
    const { result } = renderHook(() => useTabSearch(mockTabs, ''));
    
    expect(result.current.filteredTabs).toEqual(mockTabs);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.hasResults).toBe(true);
  });

  it('should filter tabs by title (case insensitive)', () => {
    const { result } = renderHook(() => useTabSearch(mockTabs, 'react'));
    
    expect(result.current.filteredTabs).toHaveLength(1);
    expect(result.current.filteredTabs[0].title).toBe('GitHub - React Documentation');
    expect(result.current.hasResults).toBe(true);
  });

  it('should filter tabs by URL (case insensitive)', () => {
    const { result } = renderHook(() => useTabSearch(mockTabs, 'stackoverflow'));
    
    expect(result.current.filteredTabs).toHaveLength(1);
    expect(result.current.filteredTabs[0].url).toContain('stackoverflow.com');
    expect(result.current.hasResults).toBe(true);
  });

  it('should handle multiple matches', () => {
    const { result } = renderHook(() => useTabSearch(mockTabs, 'script'));
    
    expect(result.current.filteredTabs).toHaveLength(2);
    expect(result.current.filteredTabs.some(tab => tab.title.includes('TypeScript'))).toBe(true);
    expect(result.current.filteredTabs.some(tab => tab.url.includes('javascript'))).toBe(true);
  });

  it('should return empty array when no matches found', () => {
    const { result } = renderHook(() => useTabSearch(mockTabs, 'nonexistent'));
    
    expect(result.current.filteredTabs).toHaveLength(0);
    expect(result.current.hasResults).toBe(false);
  });

  it('should handle search in both title and URL', () => {
    const { result } = renderHook(() => useTabSearch(mockTabs, 'github'));
    
    expect(result.current.filteredTabs).toHaveLength(1);
    expect(result.current.filteredTabs[0].title).toBe('GitHub - React Documentation');
  });

  it('should trim whitespace from search term', () => {
    const { result } = renderHook(() => useTabSearch(mockTabs, '  react  '));
    
    expect(result.current.searchTerm).toBe('react');
    expect(result.current.filteredTabs).toHaveLength(1);
  });

  it('should handle empty tabs array', () => {
    const { result } = renderHook(() => useTabSearch([], 'react'));
    
    expect(result.current.filteredTabs).toHaveLength(0);
    expect(result.current.hasResults).toBe(false);
  });

  it('should handle tabs with undefined/null titles', () => {
    const tabsWithNullTitle: Tab[] = [
      {
        ...mockTabs[0],
        title: ''
      }
    ];
    
    const { result } = renderHook(() => useTabSearch(tabsWithNullTitle, 'github'));
    
    expect(result.current.filteredTabs).toHaveLength(1);
    expect(result.current.filteredTabs[0].url).toContain('github.com');
  });

  it('should be case insensitive for accented characters', () => {
    const tabsWithAccents: Tab[] = [
      {
        ...mockTabs[0],
        title: 'Développement React - Français'
      }
    ];
    
    const { result } = renderHook(() => useTabSearch(tabsWithAccents, 'développement'));
    
    expect(result.current.filteredTabs).toHaveLength(1);
  });
});