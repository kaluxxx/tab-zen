import { describe, it, expect } from 'vitest';
import { getCategoryColor } from './category-colors';

describe('getCategoryColor', () => {
  it('should return correct color for development category', () => {
    const color = getCategoryColor('development');
    expect(color).toBe('bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200');
  });

  it('should return correct color for social category', () => {
    const color = getCategoryColor('social');
    expect(color).toBe('bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200');
  });

  it('should return correct color for media category', () => {
    const color = getCategoryColor('media');
    expect(color).toBe('bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200');
  });

  it('should return correct color for shopping category', () => {
    const color = getCategoryColor('shopping');
    expect(color).toBe('bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200');
  });

  it('should return correct color for productivity category', () => {
    const color = getCategoryColor('productivity');
    expect(color).toBe('bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200');
  });

  it('should return correct color for documentation category', () => {
    const color = getCategoryColor('documentation');
    expect(color).toBe('bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200');
  });

  it('should return correct color for news category', () => {
    const color = getCategoryColor('news');
    expect(color).toBe('bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200');
  });

  it('should return correct color for entertainment category', () => {
    const color = getCategoryColor('entertainment');
    expect(color).toBe('bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200');
  });

  it('should return correct color for education category', () => {
    const color = getCategoryColor('education');
    expect(color).toBe('bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200');
  });

  it('should return correct color for other category', () => {
    const color = getCategoryColor('other');
    expect(color).toBe('bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200');
  });

  it('should return default color for unknown category', () => {
    const color = getCategoryColor('unknown-category');
    expect(color).toBe('bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200');
  });

  it('should return default color for empty string', () => {
    const color = getCategoryColor('');
    expect(color).toBe('bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200');
  });

  it('should be case sensitive', () => {
    const color = getCategoryColor('DEVELOPMENT');
    expect(color).toBe('bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200');
  });
});