import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabList } from './tab-list';
import type { Tab, TabGroup } from '../types';

describe('TabList', () => {
  const mockTabs: Tab[] = [
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
      title: 'GitHub - Where the world builds software',
      url: 'https://github.com',
      favIconUrl: 'https://github.com/favicon.ico',
      active: false,
      windowId: 1,
      index: 1
    }
  ];

  it('should render empty state when no tabs provided', () => {
    // Act
    render(<TabList tabs={[]} />);

    // Assert
    expect(screen.getByText('Aucun onglet trouvé')).toBeInTheDocument();
  });

  it('should render list of tabs with title, favicon and URL', () => {
    // Act
    render(<TabList tabs={mockTabs} />);

    // Assert
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('GitHub - Where the world builds software')).toBeInTheDocument();
    expect(screen.getByText('google.com')).toBeInTheDocument();
    expect(screen.getByText('github.com')).toBeInTheDocument();

    // Check favicons
    const googleFavicon = screen.getByAltText('Google favicon');
    const githubFavicon = screen.getByAltText('GitHub - Where the world builds software favicon');
    expect(googleFavicon).toHaveAttribute('src', 'https://google.com/favicon.ico');
    expect(githubFavicon).toHaveAttribute('src', 'https://github.com/favicon.ico');
  });

  it('should show active tab with different styling', () => {
    // Act
    render(<TabList tabs={mockTabs} />);

    // Assert
    const googleTab = screen.getByText('Google').closest('[data-testid="tab-item"]');
    const githubTab = screen.getByText('GitHub - Where the world builds software').closest('[data-testid="tab-item"]');
    
    expect(googleTab).toHaveClass('bg-accent'); // Active tab styling
    expect(githubTab).not.toHaveClass('bg-accent'); // Inactive tab styling
  });

  it('should handle tabs without favicon gracefully', () => {
    // Arrange
    const tabsWithoutFavicon: Tab[] = [
      {
        id: 1,
        title: 'Local Page',
        url: 'file://local/page.html',
        active: false,
        windowId: 1,
        index: 0
      }
    ];

    // Act
    render(<TabList tabs={tabsWithoutFavicon} />);

    // Assert
    expect(screen.getByText('Local Page')).toBeInTheDocument();
    expect(screen.getByText('file://local/page.html')).toBeInTheDocument();
    
    // Should have a default icon
    expect(screen.getByTestId('default-tab-icon')).toBeInTheDocument();
  });

  it('should truncate long URLs properly', () => {
    // Arrange
    const tabWithLongUrl: Tab[] = [
      {
        id: 1,
        title: 'Long URL Page',
        url: 'https://very-long-domain-name.example.com/with/very/long/path/that/should/be/truncated',
        active: false,
        windowId: 1,
        index: 0
      }
    ];

    // Act
    render(<TabList tabs={tabWithLongUrl} />);

    // Assert
    expect(screen.getByText('very-long-domain-name.example.com')).toBeInTheDocument();
  });

  describe('grouped view', () => {
    const mockGroups: TabGroup[] = [
      {
        id: 'group-dev-1',
        name: 'Development',
        category: 'development',
        isExpanded: true,
        tabs: [mockTabs[1]], // GitHub tab
      },
      {
        id: 'group-other-1',
        name: 'Other',
        category: 'other',
        isExpanded: true,
        tabs: [mockTabs[0]], // Google tab
      },
    ];

    const mockCallbacks = {
      onCloseTab: vi.fn(),
      onNavigateToTab: vi.fn(),
      onToggleGroupExpansion: vi.fn(),
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should render groups when isGrouped is true', () => {
      // Act
      render(
        <TabList
          tabs={[]}
          groups={mockGroups}
          isGrouped={true}
          {...mockCallbacks}
        />
      );

      // Assert
      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
      expect(screen.getByText('GitHub - Where the world builds software')).toBeInTheDocument();
      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    it('should render tabs normally when isGrouped is false', () => {
      // Act
      render(
        <TabList
          tabs={mockTabs}
          groups={mockGroups}
          isGrouped={false}
          {...mockCallbacks}
        />
      );

      // Assert
      // Should render as normal tab list
      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('GitHub - Where the world builds software')).toBeInTheDocument();
      // Should not render group headers
      expect(screen.queryByText('Development')).not.toBeInTheDocument();
      expect(screen.queryByText('Other')).not.toBeInTheDocument();
    });

    it('should show empty state when no groups in grouped view', () => {
      // Act
      render(
        <TabList
          tabs={[]}
          groups={[]}
          isGrouped={true}
          {...mockCallbacks}
        />
      );

      // Assert
      expect(screen.getByText('Aucun onglet trouvé')).toBeInTheDocument();
    });

    it('should call onToggleGroupExpansion when group is clicked', () => {
      // Act
      render(
        <TabList
          tabs={[]}
          groups={mockGroups}
          isGrouped={true}
          {...mockCallbacks}
        />
      );

      const developmentHeader = screen.getByText('Development');
      fireEvent.click(developmentHeader);

      // Assert
      expect(mockCallbacks.onToggleGroupExpansion).toHaveBeenCalledWith('group-dev-1');
    });

    it('should pass tab callbacks to group components', () => {
      // Act
      render(
        <TabList
          tabs={[]}
          groups={mockGroups}
          isGrouped={true}
          {...mockCallbacks}
        />
      );

      // Assert - Groups should render with tab items that have callbacks
      const tabItems = screen.getAllByTestId('tab-item');
      expect(tabItems).toHaveLength(2); // One from each group
    });

    it('should render groups with proper spacing', () => {
      // Act
      render(
        <TabList
          tabs={[]}
          groups={mockGroups}
          isGrouped={true}
          {...mockCallbacks}
        />
      );

      // Assert
      const groups = screen.getAllByTestId('tab-group');
      expect(groups).toHaveLength(2);
    });
  });
});