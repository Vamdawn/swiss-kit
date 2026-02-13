// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed, defineComponent, h } from 'vue'

const mockSetTheme = vi.fn()

const mockThemes = [
  { key: 'default', label: '默认', accent: '#1a7a6d', isDark: false },
  { key: 'ink-wash', label: '水墨', accent: '#4a7c6f', isDark: false },
  { key: 'twilight', label: '薄暮', accent: '#c792ea', isDark: true },
  { key: 'nord', label: 'Nord', accent: '#88c0d0', isDark: true },
  { key: 'github-dark', label: 'GitHub Dark', accent: '#58a6ff', isDark: true },
]

const currentTheme = ref('default')

vi.mock('@/composables/useTheme', () => ({
  useTheme: () => ({
    themes: mockThemes,
    currentTheme,
    setTheme: mockSetTheme,
    currentThemeMeta: computed(
      () => mockThemes.find((t) => t.key === currentTheme.value) ?? mockThemes[0],
    ),
  }),
}))

vi.mock('naive-ui', () => ({
  NPopover: defineComponent({
    name: 'NPopover',
    setup(_, { slots }) {
      return () => h('div', [slots.trigger?.(), slots.default?.()])
    },
  }),
}))

// Must import after mocks are set up
const { default: ThemeSwitcher } = await import('../ThemeSwitcher.vue')

function mountComponent() {
  return mount(ThemeSwitcher)
}

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    currentTheme.value = 'default'
    mockSetTheme.mockClear()
  })

  it('should render a trigger button', () => {
    const wrapper = mountComponent()
    const triggerBtn = wrapper.find('.trigger-btn')
    expect(triggerBtn.exists()).toBe(true)
    expect(triggerBtn.attributes('type')).toBe('button')
    expect(triggerBtn.attributes('aria-label')).toBe('Switch theme')
  })

  it('should render all 5 theme options', () => {
    const wrapper = mountComponent()
    const options = wrapper.findAll('.theme-option')
    expect(options).toHaveLength(5)
  })

  it('should have the .active class on the current theme option', () => {
    currentTheme.value = 'nord'
    const wrapper = mountComponent()
    const options = wrapper.findAll('.theme-option')
    const activeOptions = options.filter((o) => o.classes('active'))
    expect(activeOptions).toHaveLength(1)
    expect(activeOptions[0].text()).toContain('Nord')
  })

  it('should call setTheme with the correct key when a theme option is clicked', async () => {
    const wrapper = mountComponent()
    const options = wrapper.findAll('.theme-option')
    // Click the "twilight" option (index 2)
    await options[2].trigger('click')
    expect(mockSetTheme).toHaveBeenCalledWith('twilight')
  })
})
