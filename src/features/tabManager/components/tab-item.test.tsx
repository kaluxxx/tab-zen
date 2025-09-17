import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});