import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingMessage } from './loading-message';

describe('LoadingMessage', () => {
  it('should render loading message', () => {
    render(<LoadingMessage message="Loading data..." />);
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });
});