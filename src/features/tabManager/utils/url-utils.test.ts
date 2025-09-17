import { describe, it, expect } from 'vitest';
import { extractDomain } from './url-utils';

describe('extractDomain', () => {
  it('should extract domain from https URL', () => {
    expect(extractDomain('https://google.com/search?q=test')).toBe('google.com');
    expect(extractDomain('https://github.com/user/repo')).toBe('github.com');
  });

  it('should extract domain from http URL', () => {
    expect(extractDomain('http://example.com/path')).toBe('example.com');
  });

  it('should return full URL for file:// protocol', () => {
    expect(extractDomain('file://local/page.html')).toBe('file://local/page.html');
    expect(extractDomain('file:///C:/path/to/file.html')).toBe('file:///C:/path/to/file.html');
  });

  it('should handle invalid URLs gracefully', () => {
    expect(extractDomain('not-a-url')).toBe('not-a-url');
    expect(extractDomain('')).toBe('');
  });

  it('should handle URLs with subdomains', () => {
    expect(extractDomain('https://mail.google.com')).toBe('mail.google.com');
    expect(extractDomain('https://api.github.com/users')).toBe('api.github.com');
  });
});