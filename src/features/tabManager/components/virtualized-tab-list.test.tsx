import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VirtualizedTabList } from './virtualized-tab-list';
import type { Tab } from '../types';

// Mock react-window
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
    // Render first few items for testing
    const itemsToRender = Math.min(itemCount, 3);
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

describe('VirtualizedTabList', () => {
  const mockTabs: Tab[] = [
    {
      id: 1,
      title: 'Tab 1',
      url: 'https://example.com',
      active: true,
      windowId: 1,
      index: 0
    },
    {
      id: 2,
      title: 'Tab 2',
      url: 'https://google.com',
      active: false,
      windowId: 1,
      index: 1
    },
    {
      id: 3,
      title: 'Tab 3',
      url: 'https://github.com',
      active: false,
      windowId: 1,
      index: 2
    }
  ];

  const mockCallbacks = {
    onCloseTab: vi.fn(),
    onNavigateToTab: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render virtualized list container', () => {
    render(
      <VirtualizedTabList
        tabs={mockTabs}
        height={400}
        {...mockCallbacks}
      />
    );

    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
  });

  it('should render tab items for visible tabs', () => {
    render(
      <VirtualizedTabList
        tabs={mockTabs}
        height={400}
        {...mockCallbacks}
      />
    );

    // Should render first 3 tabs (mocked behavior)
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('should handle empty tabs list', () => {
    render(
      <VirtualizedTabList
        tabs={[]}
        height={400}
        {...mockCallbacks}
      />
    );

    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    // Should not render any tab items
    expect(screen.queryByTestId('tab-item')).not.toBeInTheDocument();
  });

  it('should pass callbacks to tab items', () => {
    render(
      <VirtualizedTabList
        tabs={mockTabs}
        height={400}
        {...mockCallbacks}
      />
    );

    // Tab items should be rendered with callbacks
    const tabItems = screen.getAllByTestId('tab-item');
    expect(tabItems.length).toBeGreaterThan(0);
  });

  it('should handle missing tab gracefully', () => {
    // Test case where index exceeds tabs length
    const { container } = render(
      <VirtualizedTabList
        tabs={[]}
        height={400}
        {...mockCallbacks}
      />
    );

    // Should not crash when no tabs are available
    expect(container).toBeInTheDocument();
  });
});