import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './header';

describe('Header', () => {
  it('should render title and tab count', () => {
    render(<Header title="TabZen" tabCount={3} />);
    
    expect(screen.getByText('TabZen')).toBeInTheDocument();
    expect(screen.getByText('3 onglets ouverts')).toBeInTheDocument();
  });

  it('should handle singular tab count', () => {
    render(<Header title="TabZen" tabCount={1} />);
    
    expect(screen.getByText('1 onglet ouvert')).toBeInTheDocument();
  });

  it('should handle zero tabs', () => {
    render(<Header title="TabZen" tabCount={0} />);
    
    expect(screen.getByText('0 onglet ouvert')).toBeInTheDocument();
  });
});