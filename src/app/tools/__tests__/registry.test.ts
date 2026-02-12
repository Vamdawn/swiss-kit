import { describe, it, expect } from 'vitest'
import { toolRegistry } from '../registry'

describe('toolRegistry', () => {
  it('should export an array of tool meta objects', () => {
    expect(Array.isArray(toolRegistry)).toBe(true)
    // registry is empty initially, tools will be added later
    expect(toolRegistry.length).toBeGreaterThanOrEqual(0)
  })
})
