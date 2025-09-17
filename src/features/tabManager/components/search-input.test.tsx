import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  it('should render with placeholder text', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    
    expect(screen.getByPlaceholderText('Rechercher un onglet...')).toBeInTheDocument();
  });

  it('should display the provided value', () => {
    render(<SearchInput value="test search" onChange={() => {}} />);
    
    const input = screen.getByDisplayValue('test search');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when user types', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(<SearchInput value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Rechercher un onglet...');
    
    // Test single character input
    await user.type(input, 'r');
    expect(mockOnChange).toHaveBeenCalledWith('r');
    
    // Test that onChange is called for each keystroke
    mockOnChange.mockClear();
    await user.type(input, 'eact');
    expect(mockOnChange).toHaveBeenCalledTimes(4);
  });

  it('should clear input when clear button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(<SearchInput value="test" onChange={mockOnChange} />);
    
    const clearButton = screen.getByRole('button', { name: /effacer/i });
    await user.click(clearButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should not show clear button when input is empty', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    
    expect(screen.queryByRole('button', { name: /effacer/i })).not.toBeInTheDocument();
  });

  it('should show clear button when input has value', () => {
    render(<SearchInput value="test" onChange={() => {}} />);
    
    expect(screen.getByRole('button', { name: /effacer/i })).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('aria-label', 'Rechercher un onglet');
  });

  it('should focus input on mount when autoFocus is true', () => {
    render(<SearchInput value="" onChange={() => {}} autoFocus />);
    
    const input = screen.getByPlaceholderText('Rechercher un onglet...');
    expect(input).toHaveFocus();
  });

  it('should handle keyboard shortcuts', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(<SearchInput value="test" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Rechercher un onglet...');
    
    // Test Escape key to clear
    await user.type(input, '{Escape}');
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should have search icon', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    
    // Look for search icon (assuming we use an SVG or icon component)
    const searchIcon = screen.getByTestId('search-icon');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should handle paste events', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(<SearchInput value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Rechercher un onglet...');
    await user.click(input);
    await user.paste('pasted text');
    
    expect(mockOnChange).toHaveBeenCalledWith('pasted text');
  });
});