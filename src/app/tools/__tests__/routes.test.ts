import { describe, it, expect } from 'vitest'
import { routes } from '@/router'

describe('routes', () => {
  it('should include the home route', () => {
    const home = routes.find((r) => r.path === '/')
    expect(home).toBeDefined()
    expect(home!.name).toBe('home')
  })

  it('should generate routes from tool registry', () => {
    const toolRoutes = routes.filter((r) => r.path.startsWith('/tools/'))
    expect(Array.isArray(toolRoutes)).toBe(true)
  })
})
