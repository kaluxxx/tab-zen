import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTabs } from './use-tabs';
import { tabService } from '../services/tab-service';
import type { TabList } from '../types';
import type { ReactNode } from 'react';

// Mock tabService
vi.mock('../services/tab-service', () => ({
  tabService: {
    getAllTabs: vi.fn()
  }
}));

const mockTabService = vi.mocked(tabService);

// Query client wrapper for tests
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
      },
    },
  });
  
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  return Wrapper;
};

describe('useTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    // Arrange
    mockTabService.getAllTabs.mockReturnValue(new Promise(() => {})); // Never resolves

    // Act
    const { result } = renderHook(() => useTabs(), {
      wrapper: createWrapper()
    });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.tabs).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch tabs successfully', async () => {
    // Arrange
    const mockTabList: TabList = {
      tabs: [
        {
          id: 1,
          title: 'Google',
          url: 'https://google.com',
          favIconUrl: 'https://google.com/favicon.ico',
          active: true,
          windowId: 1,
          index: 0
        }
      ],
      totalCount: 1
    };
    
    mockTabService.getAllTabs.mockResolvedValue(mockTabList);

    // Act
    const { result } = renderHook(() => useTabs(), {
      wrapper: createWrapper()
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tabs).toEqual(mockTabList.tabs);
    expect(result.current.error).toBeNull();
  });
});