import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// Mock Chrome APIs for testing
Object.defineProperty(window, 'chrome', {
  writable: true,
  value: {
    runtime: {
      sendMessage: vi.fn(),
      onMessage: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
      },
    },
    tabs: {
      query: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      onCreated: {
        addListener: vi.fn(),
      },
      onRemoved: {
        addListener: vi.fn(),
      },
      onUpdated: {
        addListener: vi.fn(),
      },
    },
    storage: {
      sync: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
      },
      local: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
      },
    },
  },
})

// Mock webext-bridge for testing
vi.mock('webext-bridge', () => ({
  sendMessage: vi.fn(),
  onMessage: vi.fn(),
}))

// Global test setup
beforeEach(() => {
  vi.clearAllMocks()
})