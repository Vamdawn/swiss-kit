import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface ThemeMeta {
  key: string
  label: string
  accent: string
  isDark: boolean
}

export const themes: ThemeMeta[] = [
  { key: 'default', label: '默认', accent: '#1a7a6d', isDark: false },
  { key: 'ink-wash', label: '水墨', accent: '#4a7c6f', isDark: false },
  { key: 'twilight', label: '薄暮', accent: '#c792ea', isDark: true },
  { key: 'nord', label: 'Nord', accent: '#88c0d0', isDark: true },
  { key: 'github-dark', label: 'GitHub Dark', accent: '#58a6ff', isDark: true },
]

const STORAGE_KEY = 'swiss-kit-theme'

function applyTheme(key: string): void {
  if (key === 'default') {
    delete document.documentElement.dataset.theme
  } else {
    document.documentElement.dataset.theme = key
  }
}

function readSavedTheme(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && themes.some((t) => t.key === saved)) {
      return saved
    }
  } catch {
    // localStorage may be unavailable (e.g., SSR or privacy mode)
  }
  return 'default'
}

// Singleton shared state — created once, shared across all consumers
const currentTheme: Ref<string> = ref(readSavedTheme())

// Apply the saved theme on module load so the page renders correctly
// before any component mounts
applyTheme(currentTheme.value)

export function useTheme(): {
  themes: ThemeMeta[]
  currentTheme: Ref<string>
  setTheme: (key: string) => void
  currentThemeMeta: ComputedRef<ThemeMeta>
} {
  function setTheme(key: string): void {
    const valid = themes.some((t) => t.key === key)
    if (!valid) return

    currentTheme.value = key
    applyTheme(key)

    try {
      localStorage.setItem(STORAGE_KEY, key)
    } catch {
      // localStorage may be unavailable
    }
  }

  const currentThemeMeta = computed<ThemeMeta>(() => {
    return themes.find((t) => t.key === currentTheme.value) ?? themes[0]
  })

  return {
    themes,
    currentTheme,
    setTheme,
    currentThemeMeta,
  }
}
