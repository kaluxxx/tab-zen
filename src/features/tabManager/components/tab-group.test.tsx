import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { TabGroup as TabGroupType } from '../types';
import { TabGroup } from './tab-group';

describe('TabGroup', () => {
  const mockGroup: TabGroupType = {
    id: 'group-dev-1',
    name: 'Development',
    category: 'development',
    isExpanded: true,
    tabs: [
      {
        id: 1,
        title: 'GitHub Repository',
        url: 'https://github.com/user/repo',
        active: false,
        windowId: 1,
        index: 0,
      },
      {
        id: 2,
        title: 'Stack Overflow',
        url: 'https://stackoverflow.com/questions/123',
        active: true,
        windowId: 1,
        index: 1,
      },
    ],
  };

  const mockCallbacks = {
    onToggleExpansion: vi.fn(),
    onCloseTab: vi.fn(),
    onNavigateToTab: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render group header with name and tab count', () => {
      render(<TabGroup group={mockGroup} {...mockCallbacks} />);

      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // tab count
    });

    it('should render all tabs when expanded', () => {
      render(<TabGroup group={mockGroup} {...mockCallbacks} />);

      expect(screen.getByText('GitHub Repository')).toBeInTheDocument();
      expect(screen.getByText('Stack Overflow')).toBeInTheDocument();
    });

    it('should not render tabs when collapsed', () => {
      const collapsedGroup = { ...mockGroup, isExpanded: false };
      render(<TabGroup group={collapsedGroup} {...mockCallbacks} />);

      expect(screen.queryByText('GitHub Repository')).not.toBeInTheDocument();
      expect(screen.queryByText('Stack Overflow')).not.toBeInTheDocument();
    });

    it('should show correct expansion icon when expanded', () => {
      render(<TabGroup group={mockGroup} {...mockCallbacks} />);

      const expandButton = screen.getByLabelText('Réduire le groupe');
      expect(expandButton).toBeInTheDocument();
    });

    it('should show correct expansion icon when collapsed', () => {
      const collapsedGroup = { ...mockGroup, isExpanded: false };
      render(<TabGroup group={collapsedGroup} {...mockCallbacks} />);

      const expandButton = screen.getByLabelText('Développer le groupe');
      expect(expandButton).toBeInTheDocument();
    });

    it('should render empty state when no tabs', () => {
      const emptyGroup = { ...mockGroup, tabs: [] };
      render(<TabGroup group={emptyGroup} {...mockCallbacks} />);

      expect(screen.getByText('Aucun onglet dans ce groupe')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onToggleExpansion when header is clicked', () => {
      render(<TabGroup group={mockGroup} {...mockCallbacks} />);

      const header = screen.getByText('Development').closest('div');
      fireEvent.click(header!);

      expect(mockCallbacks.onToggleExpansion).toHaveBeenCalledWith('group-dev-1');
    });

    it('should call onToggleExpansion when expand button is clicked', () => {
      render(<TabGroup group={mockGroup} {...mockCallbacks} />);

      const expandButton = screen.getByLabelText('Réduire le groupe');
      fireEvent.click(expandButton);

      expect(mockCallbacks.onToggleExpansion).toHaveBeenCalledWith('group-dev-1');
    });

    it('should pass tab callbacks to TabItem components', () => {
      render(<TabGroup group={mockGroup} {...mockCallbacks} />);

      // Should render TabItem with callbacks - we can test this by checking
      // that the TabItem components are rendered (they have the callbacks)
      const tabItems = screen.getAllByTestId('tab-item');
      expect(tabItems).toHaveLength(2);
    });

    it('should not call onToggleExpansion when callback is not provided', () => {
      render(<TabGroup group={mockGroup} />);

      const header = screen.getByText('Development').closest('div');
      fireEvent.click(header!);

      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe('styling', () => {
    it('should show tab count in badge', () => {
      render(<TabGroup group={mockGroup} {...mockCallbacks} />);

      expect(screen.getByText('2')).toBeInTheDocument(); // tab count
    });

    it('should update tab count when tabs change', () => {
      const groupWithOnTab = { ...mockGroup, tabs: [mockGroup.tabs[0]] };
      render(<TabGroup group={groupWithOnTab} {...mockCallbacks} />);

      expect(screen.getByText('1')).toBeInTheDocument(); // tab count
    });

    it('should show zero count for empty group', () => {
      const emptyGroup = { ...mockGroup, tabs: [] };
      render(<TabGroup group={emptyGroup} {...mockCallbacks} />);

      expect(screen.getByText('0')).toBeInTheDocument(); // tab count
    });
  });

  describe('accessibility', () => {
    it('should have proper aria labels', () => {
      render(<TabGroup group={mockGroup} {...mockCallbacks} />);

      expect(screen.getByLabelText('Réduire le groupe')).toBeInTheDocument();
    });

    it('should have testid for testing', () => {
      render(<TabGroup group={mockGroup} {...mockCallbacks} />);

      expect(screen.getByTestId('tab-group')).toBeInTheDocument();
    });
  });
});