import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabItem } from './tab-item';
import type { Tab } from '../types';

describe('TabItem', () => {
  const mockTab: Tab = {
    id: 1,
    title: 'Google',
    url: 'https://google.com',
    favIconUrl: 'https://google.com/favicon.ico',
    active: true,
    windowId: 1,
    index: 0
  };

  it('should render tab with title and domain', () => {
    render(<TabItem tab={mockTab} />);
    
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('google.com')).toBeInTheDocument();
  });

  it('should render favicon when available', () => {
    render(<TabItem tab={mockTab} />);
    
    const favicon = screen.getByAltText('Google favicon');
    expect(favicon).toHaveAttribute('src', 'https://google.com/favicon.ico');
  });

  it('should show default icon when no favicon', () => {
    const tabWithoutFavicon = { ...mockTab, favIconUrl: undefined };
    render(<TabItem tab={tabWithoutFavicon} />);
    
    expect(screen.getByTestId('default-tab-icon')).toBeInTheDocument();
  });

  it('should apply active styling for active tab', () => {
    render(<TabItem tab={mockTab} />);
    
    const tabElement = screen.getByTestId('tab-item');
    expect(tabElement).toHaveClass('bg-accent');
  });

  it('should not apply active styling for inactive tab', () => {
    const inactiveTab = { ...mockTab, active: false };
    render(<TabItem tab={inactiveTab} />);
    
    const tabElement = screen.getByTestId('tab-item');
    expect(tabElement).not.toHaveClass('bg-accent');
  });

  it('should handle missing title', () => {
    const tabWithoutTitle = { ...mockTab, title: '' };
    render(<TabItem tab={tabWithoutTitle} />);

    expect(screen.getByText('Sans titre')).toBeInTheDocument();
  });

  it('should not render close button when onClose is not provided', () => {
    render(<TabItem tab={mockTab} />);

    expect(screen.queryByTestId('close-tab-button')).not.toBeInTheDocument();
  });

  it('should render close button when onClose is provided', () => {
    const mockOnClose = vi.fn();
    render(<TabItem tab={mockTab} onClose={mockOnClose} />);

    expect(screen.getByTestId('close-tab-button')).toBeInTheDocument();
  });

  it('should call onClose with tab id when close button is clicked', () => {
    const mockOnClose = vi.fn();
    render(<TabItem tab={mockTab} onClose={mockOnClose} />);

    const closeButton = screen.getByTestId('close-tab-button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith(mockTab.id);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should stop propagation when close button is clicked', () => {
    const mockOnClose = vi.fn();
    const mockParentClick = vi.fn();

    render(
      <div onClick={mockParentClick}>
        <TabItem tab={mockTab} onClose={mockOnClose} />
      </div>
    );

    const closeButton = screen.getByTestId('close-tab-button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith(mockTab.id);
    expect(mockParentClick).not.toHaveBeenCalled();
  });

  it('should have proper accessibility label for close button', () => {
    const mockOnClose = vi.fn();
    render(<TabItem tab={mockTab} onClose={mockOnClose} />);

    const closeButton = screen.getByTestId('close-tab-button');
    expect(closeButton).toHaveAttribute('aria-label', `Fermer l'onglet ${mockTab.title}`);
  });
});