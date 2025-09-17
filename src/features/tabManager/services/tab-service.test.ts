import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tabService } from './tab-service';

// Mock Chrome API
const mockChrome = {
  tabs: {
    query: vi.fn()
  },
  runtime: {
    lastError: undefined as chrome.runtime.LastError | undefined
  }
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
global.chrome = mockChrome;

describe('tabService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllTabs', () => {
    it('should return all tabs when chrome.tabs.query succeeds', async () => {
      // Arrange
      const mockTabs: Partial<chrome.tabs.Tab>[] = [
        {
          id: 1,
          title: 'Google',
          url: 'https://google.com',
          favIconUrl: 'https://google.com/favicon.ico',
          active: true,
          windowId: 1,
          index: 0
        },
        {
          id: 2,
          title: 'GitHub',
          url: 'https://github.com',
          favIconUrl: 'https://github.com/favicon.ico',
          active: false,
          windowId: 1,
          index: 1
        }
      ];
      
      mockChrome.tabs.query.mockImplementation((_query, callback) => {
        callback(mockTabs);
      });

      // Act
      const result = await tabService.getAllTabs();

      // Assert
      expect(result.tabs).toHaveLength(2);
      expect(result.totalCount).toBe(2);
      expect(result.tabs[0]).toEqual({
        id: 1,
        title: 'Google',
        url: 'https://google.com',
        favIconUrl: 'https://google.com/favicon.ico',
        active: true,
        windowId: 1,
        index: 0
      });
    });

    it('should return empty list when no tabs exist', async () => {
      // Arrange
      mockChrome.tabs.query.mockImplementation((_query, callback) => {
        callback([]);
      });

      // Act
      const result = await tabService.getAllTabs();

      // Assert
      expect(result.tabs).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });

    it('should throw error when chrome.tabs.query fails', async () => {
      // Arrange
      mockChrome.runtime.lastError = { message: 'Chrome API error' } as chrome.runtime.LastError;
      mockChrome.tabs.query.mockImplementation((_query, callback) => {
        callback([]);
      });

      // Act & Assert
      await expect(tabService.getAllTabs()).rejects.toThrow('Failed to fetch tabs');
      
      // Cleanup
      mockChrome.runtime.lastError = undefined;
    });

    it('should handle tabs with missing favIconUrl', async () => {
      // Arrange
      const mockTabs: Partial<chrome.tabs.Tab>[] = [
        {
          id: 1,
          title: 'Local Page',
          url: 'file://local/page.html',
          active: false,
          windowId: 1,
          index: 0
        }
      ];
      
      mockChrome.tabs.query.mockImplementation((_query, callback) => {
        callback(mockTabs);
      });

      // Act
      const result = await tabService.getAllTabs();

      // Assert
      expect(result.tabs[0].favIconUrl).toBeUndefined();
    });
  });
});