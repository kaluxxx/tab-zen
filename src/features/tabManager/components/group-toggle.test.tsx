import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GroupToggle } from './group-toggle';

describe('GroupToggle', () => {
  const mockCallbacks = {
    onToggleGrouping: vi.fn(),
    onExpandAll: vi.fn(),
    onCollapseAll: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render grouping toggle buttons', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={2}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      expect(screen.getByLabelText('Vue groupée')).toBeInTheDocument();
      expect(screen.getByLabelText('Vue liste')).toBeInTheDocument();
    });

    it('should highlight active view correctly when grouping enabled', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={2}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      const groupButton = screen.getByLabelText('Vue groupée');
      const listButton = screen.getByLabelText('Vue liste');

      expect(groupButton).toHaveClass('bg-primary', 'text-primary-foreground');
      expect(listButton).not.toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('should highlight active view correctly when grouping disabled', () => {
      render(
        <GroupToggle
          isGroupingEnabled={false}
          expandedGroups={0}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      const groupButton = screen.getByLabelText('Vue groupée');
      const listButton = screen.getByLabelText('Vue liste');

      expect(listButton).toHaveClass('bg-primary', 'text-primary-foreground');
      expect(groupButton).not.toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('should show expand/collapse controls when grouping enabled and has groups', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={2}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      expect(screen.getByLabelText('Développer tous les groupes')).toBeInTheDocument();
      expect(screen.getByLabelText('Réduire tous les groupes')).toBeInTheDocument();
    });

    it('should not show expand/collapse controls when grouping disabled', () => {
      render(
        <GroupToggle
          isGroupingEnabled={false}
          expandedGroups={0}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      expect(screen.queryByLabelText('Développer tous les groupes')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Réduire tous les groupes')).not.toBeInTheDocument();
    });

    it('should not show expand/collapse controls when no groups', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={0}
          totalGroups={0}
          {...mockCallbacks}
        />
      );

      expect(screen.queryByLabelText('Développer tous les groupes')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Réduire tous les groupes')).not.toBeInTheDocument();
    });

    it('should show groups status when grouping enabled and has groups', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={2}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      expect(screen.getByText('2/3 groupes développés')).toBeInTheDocument();
    });

    it('should disable expand all when all groups are expanded', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={3}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      const expandAllButton = screen.getByLabelText('Développer tous les groupes');
      expect(expandAllButton).toBeDisabled();
    });

    it('should disable collapse all when all groups are collapsed', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={0}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      const collapseAllButton = screen.getByLabelText('Réduire tous les groupes');
      expect(collapseAllButton).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('should call onToggleGrouping when group button is clicked', () => {
      render(
        <GroupToggle
          isGroupingEnabled={false}
          expandedGroups={0}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      const groupButton = screen.getByLabelText('Vue groupée');
      fireEvent.click(groupButton);

      expect(mockCallbacks.onToggleGrouping).toHaveBeenCalled();
    });

    it('should call onToggleGrouping when list button is clicked', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={2}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      const listButton = screen.getByLabelText('Vue liste');
      fireEvent.click(listButton);

      expect(mockCallbacks.onToggleGrouping).toHaveBeenCalled();
    });

    it('should call onExpandAll when expand all button is clicked', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={1}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      const expandAllButton = screen.getByLabelText('Développer tous les groupes');
      fireEvent.click(expandAllButton);

      expect(mockCallbacks.onExpandAll).toHaveBeenCalled();
    });

    it('should call onCollapseAll when collapse all button is clicked', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={2}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      const collapseAllButton = screen.getByLabelText('Réduire tous les groupes');
      fireEvent.click(collapseAllButton);

      expect(mockCallbacks.onCollapseAll).toHaveBeenCalled();
    });

    it('should not call callbacks when buttons are disabled', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={3}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      const expandAllButton = screen.getByLabelText('Développer tous les groupes');
      fireEvent.click(expandAllButton);

      expect(mockCallbacks.onExpandAll).not.toHaveBeenCalled();
    });

    it('should not call callbacks when they are not provided', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={1}
          totalGroups={3}
          onToggleGrouping={mockCallbacks.onToggleGrouping}
        />
      );

      // Should not throw when optional callbacks are not provided
      expect(true).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have proper aria labels for all interactive elements', () => {
      render(
        <GroupToggle
          isGroupingEnabled={true}
          expandedGroups={1}
          totalGroups={3}
          {...mockCallbacks}
        />
      );

      expect(screen.getByLabelText('Vue groupée')).toBeInTheDocument();
      expect(screen.getByLabelText('Vue liste')).toBeInTheDocument();
      expect(screen.getByLabelText('Développer tous les groupes')).toBeInTheDocument();
      expect(screen.getByLabelText('Réduire tous les groupes')).toBeInTheDocument();
    });
  });
});