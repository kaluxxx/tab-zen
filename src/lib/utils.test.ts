import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge classes correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })

    it('should handle conditional classes', () => {
      expect(cn('px-2', false && 'py-1', 'text-red-500')).toBe('px-2 text-red-500')
    })

    it('should handle empty inputs', () => {
      expect(cn()).toBe('')
    })
  })
})