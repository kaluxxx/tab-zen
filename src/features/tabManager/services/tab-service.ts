import type { TabList } from '../types';

export const tabService = {
  async getAllTabs(): Promise<TabList> {
    try {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({}, (tabs) => {
          if (chrome.runtime.lastError) {
            reject(new Error('Failed to fetch tabs'));
            return;
          }
          
          const tabList: TabList = {
            tabs: tabs.map(tab => ({
              id: tab.id!,
              title: tab.title || '',
              url: tab.url || '',
              favIconUrl: tab.favIconUrl,
              active: tab.active || false,
              windowId: tab.windowId!,
              index: tab.index
            })),
            totalCount: tabs.length
          };
          
          resolve(tabList);
        });
      });
    } catch (error) {
      throw new Error('Failed to fetch tabs');
    }
  },

  async closeTab(tabId: number): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        chrome.tabs.remove(tabId, () => {
          if (chrome.runtime.lastError) {
            reject(new Error('Failed to close tab'));
            return;
          }
          resolve();
        });
      });
    } catch (error) {
      throw new Error('Failed to close tab');
    }
  },

  async switchToTab(tabId: number, windowId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // First, activate the tab
      chrome.tabs.update(tabId, { active: true }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error('Failed to switch to tab'));
          return;
        }

        // Then, focus the window containing the tab
        chrome.windows.update(windowId, { focused: true }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error('Failed to switch to tab'));
            return;
          }
          resolve();
        });
      });
    });
  }
};