// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest'

// We need to reset the module singleton between tests,
// so we use dynamic imports with vi.resetModules().

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
    vi.resetModules()
  })

  it('should return default theme when no saved theme exists', async () => {
    const { useTheme } = await import('../useTheme')
    const { currentTheme, currentThemeMeta } = useTheme()

    expect(currentTheme.value).toBe('default')
    expect(currentThemeMeta.value.key).toBe('default')
    expect(currentThemeMeta.value.label).toBe('默认')
    expect(currentThemeMeta.value.isDark).toBe(false)
  })

  it('should provide all 5 themes', async () => {
    const { useTheme } = await import('../useTheme')
    const { themes } = useTheme()

    expect(themes).toHaveLength(5)
    expect(themes.map((t) => t.key)).toEqual([
      'default',
      'ink-wash',
      'twilight',
      'nord',
      'github-dark',
    ])
  })

  it('should read saved theme from localStorage on init', async () => {
    localStorage.setItem('swiss-kit-theme', 'nord')
    const { useTheme } = await import('../useTheme')
    const { currentTheme } = useTheme()

    expect(currentTheme.value).toBe('nord')
    expect(document.documentElement.dataset.theme).toBe('nord')
  })

  it('should ignore invalid saved theme and fall back to default', async () => {
    localStorage.setItem('swiss-kit-theme', 'nonexistent')
    const { useTheme } = await import('../useTheme')
    const { currentTheme } = useTheme()

    expect(currentTheme.value).toBe('default')
  })

  it('should set data-theme attribute and localStorage when calling setTheme', async () => {
    const { useTheme } = await import('../useTheme')
    const { setTheme, currentTheme } = useTheme()

    setTheme('twilight')

    expect(currentTheme.value).toBe('twilight')
    expect(document.documentElement.dataset.theme).toBe('twilight')
    expect(localStorage.getItem('swiss-kit-theme')).toBe('twilight')
  })

  it('should remove data-theme attribute when setting to default theme', async () => {
    const { useTheme } = await import('../useTheme')
    const { setTheme } = useTheme()

    setTheme('nord')
    expect(document.documentElement.dataset.theme).toBe('nord')

    setTheme('default')
    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(localStorage.getItem('swiss-kit-theme')).toBe('default')
  })

  it('should not change theme when calling setTheme with invalid key', async () => {
    const { useTheme } = await import('../useTheme')
    const { setTheme, currentTheme } = useTheme()

    expect(currentTheme.value).toBe('default')
    setTheme('invalid-theme')
    expect(currentTheme.value).toBe('default')
  })

  it('should share state across multiple useTheme calls (singleton)', async () => {
    const mod = await import('../useTheme')
    const first = mod.useTheme()
    const second = mod.useTheme()

    first.setTheme('github-dark')

    expect(second.currentTheme.value).toBe('github-dark')
    expect(second.currentThemeMeta.value.key).toBe('github-dark')
  })

  it('should have correct isDark values for each theme', async () => {
    const { useTheme } = await import('../useTheme')
    const { themes } = useTheme()

    const darkMap = Object.fromEntries(themes.map((t) => [t.key, t.isDark]))
    expect(darkMap).toEqual({
      default: false,
      'ink-wash': false,
      twilight: true,
      nord: true,
      'github-dark': true,
    })
  })

  it('should have correct accent colors for each theme', async () => {
    const { useTheme } = await import('../useTheme')
    const { themes } = useTheme()

    const accentMap = Object.fromEntries(themes.map((t) => [t.key, t.accent]))
    expect(accentMap).toEqual({
      default: '#1a7a6d',
      'ink-wash': '#4a7c6f',
      twilight: '#c792ea',
      nord: '#88c0d0',
      'github-dark': '#58a6ff',
    })
  })

  it('should update currentThemeMeta reactively when theme changes', async () => {
    const { useTheme } = await import('../useTheme')
    const { setTheme, currentThemeMeta } = useTheme()

    expect(currentThemeMeta.value.key).toBe('default')
    expect(currentThemeMeta.value.isDark).toBe(false)

    setTheme('twilight')

    expect(currentThemeMeta.value.key).toBe('twilight')
    expect(currentThemeMeta.value.label).toBe('薄暮')
    expect(currentThemeMeta.value.accent).toBe('#c792ea')
    expect(currentThemeMeta.value.isDark).toBe(true)
  })
})
