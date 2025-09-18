import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TabList } from './tab-list';
import type { Tab } from '../types';

// Mock react-window for performance tests
vi.mock('react-window', () => ({
  FixedSizeList: ({ children: Child, itemCount, itemData }: {
    children: React.ComponentType<{
      index: number;
      style: React.CSSProperties;
      data: unknown;
    }>;
    itemCount: number;
    itemData: unknown;
  }) => {
    // Only render first 10 items to simulate virtualization
    const itemsToRender = Math.min(itemCount, 10);
    return (
      <div data-testid="virtualized-list">
        {Array.from({ length: itemsToRender }, (_, index) => (
          <Child
            key={index}
            index={index}
            style={{ height: 70 }}
            data={itemData}
          />
        ))}
      </div>
    );
  }
}));

describe('Performance Tests', () => {
  // Generate large dataset for performance testing
  const generateTabs = (count: number): Tab[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      title: `Tab ${index + 1}`,
      url: `https://example${index % 10}.com/page${index}`,
      active: index === 0,
      windowId: Math.floor(index / 50) + 1,
      index,
      favIconUrl: `https://example${index % 10}.com/favicon.ico`
    }));
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should handle 200+ tabs efficiently with virtualization', () => {
    const largeTabs = generateTabs(200);

    const renderStart = performance.now();

    render(
      <TestWrapper>
        <TabList tabs={largeTabs} />
      </TestWrapper>
    );

    const renderEnd = performance.now();
    const renderTime = renderEnd - renderStart;

    // Should use virtualization for large lists
    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();

    // Should only render visible items (10 in our mock)
    const tabItems = screen.getAllByTestId('tab-item');
    expect(tabItems).toHaveLength(10);

    // Render time should be reasonable (less than 100ms for virtualized list)
    expect(renderTime).toBeLessThan(100);
  });

  it('should handle 500+ tabs without performance degradation', () => {
    const massiveTabs = generateTabs(500);

    const renderStart = performance.now();

    render(
      <TestWrapper>
        <TabList tabs={massiveTabs} />
      </TestWrapper>
    );

    const renderEnd = performance.now();
    const renderTime = renderEnd - renderStart;

    // Should still use virtualization
    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();

    // Should still only render visible items
    const tabItems = screen.getAllByTestId('tab-item');
    expect(tabItems).toHaveLength(10);

    // Render time should still be reasonable
    expect(renderTime).toBeLessThan(150);
  });

  it('should not use virtualization for small lists', () => {
    const smallTabs = generateTabs(10);

    render(
      <TestWrapper>
        <TabList tabs={smallTabs} />
      </TestWrapper>
    );

    // Should not use virtualization for small lists
    expect(screen.queryByTestId('virtualized-list')).not.toBeInTheDocument();

    // Should render all items normally
    const tabItems = screen.getAllByTestId('tab-item');
    expect(tabItems).toHaveLength(10);
  });

  it('should switch to virtualization at the threshold', () => {
    const thresholdTabs = generateTabs(51); // Just above threshold of 50

    render(
      <TestWrapper>
        <TabList tabs={thresholdTabs} />
      </TestWrapper>
    );

    // Should use virtualization at 51 tabs
    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
  });

  it('should handle memory efficiently with large datasets', () => {
    const largeTabs = generateTabs(1000);

    // Measure memory before render
    const initialMemory = (performance as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;

    render(
      <TestWrapper>
        <TabList tabs={largeTabs} />
      </TestWrapper>
    );

    // Force garbage collection if available (Chrome only)
    if (global.gc) {
      global.gc();
    }

    const finalMemory = (performance as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be minimal due to virtualization
    // This test only runs in Chrome with --expose-gc flag
    if (initialMemory > 0) {
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // Less than 5MB increase
    }

    // Should still only render visible items
    const tabItems = screen.getAllByTestId('tab-item');
    expect(tabItems).toHaveLength(10);
  });
});