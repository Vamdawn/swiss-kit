# 颜色转换器 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现 Swiss Kit M1 第 4 个工具——颜色转换器，支持 HEX/RGB/HSL/CSS Named Colors 四种格式双向转换。

**Architecture:** 单面板布局 + 大色块预览。用户输入任意格式的颜色值，`parseColorInput` 智能解析为内部 `{r,g,b}` 格式，通过 `computed` 派生出所有输出格式。所有转换逻辑为 `utils.ts` 中的纯函数，Vue 组件只负责 UI 绑定。

**Tech Stack:** Vue 3 + Naive UI + Vitest + CSS Variables（5 套主题）

**Design doc:** `docs/plans/2026-02-20-color-converter-design.md`

---

### Task 1: CSS Named Colors 数据 + 基础类型

**Files:**

- Create: `src/app/tools/color-converter/utils.ts`

**Step 1: 创建 utils.ts，写类型定义和 named colors 数据**

```typescript
// src/app/tools/color-converter/utils.ts

export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

// CSS Level 4 全部 148 个命名色
// key: 小写名称, value: [r, g, b]
export const CSS_NAMED_COLORS: Record<string, [number, number, number]> = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50],
}
```

**Step 2: Commit**

```bash
git add src/app/tools/color-converter/utils.ts
git commit -m "feat(color): add RGB/HSL types and CSS named colors data"
```

---

### Task 2: RGB ↔ HSL 转换函数 (TDD)

**Files:**

- Create: `src/app/tools/color-converter/__tests__/color-converter.test.ts`
- Modify: `src/app/tools/color-converter/utils.ts`

**Step 1: 写 rgbToHsl 和 hslToRgb 的失败测试**

```typescript
// src/app/tools/color-converter/__tests__/color-converter.test.ts
import { describe, it, expect } from 'vitest'
import { rgbToHsl, hslToRgb } from '../utils'

describe('color converter utils', () => {
  describe('rgbToHsl', () => {
    it('should convert pure red', () => {
      expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
    })

    it('should convert pure green', () => {
      expect(rgbToHsl({ r: 0, g: 128, b: 0 })).toEqual({ h: 120, s: 100, l: 25 })
    })

    it('should convert pure blue', () => {
      expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, l: 50 })
    })

    it('should convert black', () => {
      expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 })
    })

    it('should convert white', () => {
      expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 })
    })

    it('should convert gray', () => {
      expect(rgbToHsl({ r: 128, g: 128, b: 128 })).toEqual({ h: 0, s: 0, l: 50 })
    })

    it('should convert tomato', () => {
      // tomato = rgb(255, 99, 71) = hsl(9, 100%, 64%)
      expect(rgbToHsl({ r: 255, g: 99, b: 71 })).toEqual({ h: 9, s: 100, l: 64 })
    })

    it('should convert steelblue', () => {
      // steelblue = rgb(70, 130, 180) = hsl(207, 44%, 49%)
      expect(rgbToHsl({ r: 70, g: 130, b: 180 })).toEqual({ h: 207, s: 44, l: 49 })
    })
  })

  describe('hslToRgb', () => {
    it('should convert pure red', () => {
      expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should convert pure blue', () => {
      expect(hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255 })
    })

    it('should convert black', () => {
      expect(hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 })
    })

    it('should convert white', () => {
      expect(hslToRgb({ h: 0, s: 0, l: 100 })).toEqual({ r: 255, g: 255, b: 255 })
    })

    it('should convert gray (saturation 0)', () => {
      expect(hslToRgb({ h: 0, s: 0, l: 50 })).toEqual({ r: 128, g: 128, b: 128 })
    })
  })
})
```

**Step 2: 运行测试，确认失败**

Run: `pnpm test run src/app/tools/color-converter/__tests__/color-converter.test.ts`
Expected: FAIL — `rgbToHsl` / `hslToRgb` 未定义

**Step 3: 在 utils.ts 中实现 rgbToHsl 和 hslToRgb**

在 `CSS_NAMED_COLORS` 下方添加：

```typescript
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min

  if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) }

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100
  const ln = l / 100

  if (sn === 0) {
    const v = Math.round(ln * 255)
    return { r: v, g: v, b: v }
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  const hn = h / 360

  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  }
}
```

**Step 4: 运行测试，确认通过**

Run: `pnpm test run src/app/tools/color-converter/__tests__/color-converter.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/tools/color-converter/utils.ts src/app/tools/color-converter/__tests__/color-converter.test.ts
git commit -m "feat(color): add rgbToHsl and hslToRgb conversion with tests"
```

---

### Task 3: 格式输出函数 (TDD)

**Files:**

- Modify: `src/app/tools/color-converter/__tests__/color-converter.test.ts`
- Modify: `src/app/tools/color-converter/utils.ts`

**Step 1: 写 toHex、toRgbString、toHslString、findNamedColor、getContrastColor 的失败测试**

在测试文件的 **import 行**中追加新函数（合并到已有的 import 语句），然后在 `describe('color converter utils', ...)` **内部**末尾追加以下 describe 块：

```typescript
// 在文件顶部 import 行中追加：toHex, toRgbString, toHslString, findNamedColor, getContrastColor
// 即: import { rgbToHsl, hslToRgb, toHex, toRgbString, toHslString, findNamedColor, getContrastColor } from '../utils'

// 以下 describe 块追加到 describe('color converter utils', () => { ... }) 内部：
describe('toHex', () => {
  it('should convert red', () => {
    expect(toHex({ r: 255, g: 0, b: 0 })).toBe('#FF0000')
  })

  it('should convert black', () => {
    expect(toHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
  })

  it('should convert white', () => {
    expect(toHex({ r: 255, g: 255, b: 255 })).toBe('#FFFFFF')
  })

  it('should pad single digits with zero', () => {
    expect(toHex({ r: 1, g: 2, b: 3 })).toBe('#010203')
  })
})

describe('toRgbString', () => {
  it('should format as rgb()', () => {
    expect(toRgbString({ r: 255, g: 107, b: 107 })).toBe('rgb(255, 107, 107)')
  })
})

describe('toHslString', () => {
  it('should format as hsl()', () => {
    expect(toHslString({ r: 255, g: 0, b: 0 })).toBe('hsl(0, 100%, 50%)')
  })

  it('should format tomato', () => {
    expect(toHslString({ r: 255, g: 99, b: 71 })).toBe('hsl(9, 100%, 64%)')
  })
})

describe('findNamedColor', () => {
  it('should find exact match: tomato', () => {
    expect(findNamedColor({ r: 255, g: 99, b: 71 })).toBe('tomato')
  })

  it('should find exact match: steelblue', () => {
    expect(findNamedColor({ r: 70, g: 130, b: 180 })).toBe('steelblue')
  })

  it('should find exact match: red', () => {
    expect(findNamedColor({ r: 255, g: 0, b: 0 })).toBe('red')
  })

  it('should return null for non-matching color', () => {
    expect(findNamedColor({ r: 255, g: 100, b: 71 })).toBeNull()
  })

  it('should return null for arbitrary color', () => {
    expect(findNamedColor({ r: 123, g: 45, b: 67 })).toBeNull()
  })

  it('should return first match for duplicate RGB (aqua/cyan)', () => {
    expect(findNamedColor({ r: 0, g: 255, b: 255 })).toBe('aqua')
  })

  it('should return first match for duplicate RGB (fuchsia/magenta)', () => {
    expect(findNamedColor({ r: 255, g: 0, b: 255 })).toBe('fuchsia')
  })
})

describe('getContrastColor', () => {
  it('should return white for dark background', () => {
    expect(getContrastColor({ r: 0, g: 0, b: 0 })).toBe('#FFFFFF')
    expect(getContrastColor({ r: 50, g: 50, b: 50 })).toBe('#FFFFFF')
  })

  it('should return black for light background', () => {
    expect(getContrastColor({ r: 255, g: 255, b: 255 })).toBe('#000000')
    expect(getContrastColor({ r: 200, g: 200, b: 200 })).toBe('#000000')
  })

  it('should return white for pure red', () => {
    expect(getContrastColor({ r: 255, g: 0, b: 0 })).toBe('#FFFFFF')
  })

  it('should return black for yellow', () => {
    expect(getContrastColor({ r: 255, g: 255, b: 0 })).toBe('#000000')
  })
})
```

**Step 2: 运行测试，确认失败**

Run: `pnpm test run src/app/tools/color-converter/__tests__/color-converter.test.ts`
Expected: FAIL — 函数未定义

**Step 3: 在 utils.ts 中实现这些函数**

在 `hslToRgb` 下方添加：

```typescript
export function toHex({ r, g, b }: RGB): string {
  const hex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase()
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

export function toRgbString({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`
}

export function toHslString(rgb: RGB): string {
  const { h, s, l } = rgbToHsl(rgb)
  return `hsl(${h}, ${s}%, ${l}%)`
}

export function findNamedColor({ r, g, b }: RGB): string | null {
  for (const [name, [nr, ng, nb]] of Object.entries(CSS_NAMED_COLORS)) {
    if (nr === r && ng === g && nb === b) return name
  }
  return null
}

export function getContrastColor({ r, g, b }: RGB): '#000000' | '#FFFFFF' {
  // W3C relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
```

**Step 4: 运行测试，确认通过**

Run: `pnpm test run src/app/tools/color-converter/__tests__/color-converter.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/tools/color-converter/utils.ts src/app/tools/color-converter/__tests__/color-converter.test.ts
git commit -m "feat(color): add format output functions with tests"
```

---

### Task 4: 智能输入解析器 parseColorInput (TDD)

**Files:**

- Modify: `src/app/tools/color-converter/__tests__/color-converter.test.ts`
- Modify: `src/app/tools/color-converter/utils.ts`

**Step 1: 写 parseColorInput 的失败测试**

在测试文件的 **import 行**中追加 `parseColorInput`，然后在 `describe('color converter utils', ...)` **内部**末尾追加以下 describe 块：

```typescript
// 在文件顶部 import 行中追加：parseColorInput
// 即: import { rgbToHsl, hslToRgb, toHex, toRgbString, toHslString, findNamedColor, getContrastColor, parseColorInput } from '../utils'

// 以下 describe 块追加到 describe('color converter utils', () => { ... }) 内部：
describe('parseColorInput', () => {
  describe('HEX input', () => {
    it('should parse 6-digit hex', () => {
      expect(parseColorInput('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should parse 6-digit hex lowercase', () => {
      expect(parseColorInput('#ff6b6b')).toEqual({ r: 255, g: 107, b: 107 })
    })

    it('should parse 3-digit hex', () => {
      expect(parseColorInput('#F00')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should parse 3-digit hex lowercase', () => {
      expect(parseColorInput('#abc')).toEqual({ r: 170, g: 187, b: 204 })
    })

    it('should parse 8-digit hex (ignore alpha)', () => {
      expect(parseColorInput('#FF000080')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should parse black', () => {
      expect(parseColorInput('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    })

    it('should parse white', () => {
      expect(parseColorInput('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 })
    })
  })

  describe('RGB input', () => {
    it('should parse rgb() format', () => {
      expect(parseColorInput('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should parse rgb() without spaces', () => {
      expect(parseColorInput('rgb(255,107,107)')).toEqual({ r: 255, g: 107, b: 107 })
    })

    it('should parse rgba() format', () => {
      expect(parseColorInput('rgba(255, 0, 0, 0.5)')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should parse comma-separated numbers', () => {
      expect(parseColorInput('255, 107, 107')).toEqual({ r: 255, g: 107, b: 107 })
    })

    it('should parse comma-separated numbers without spaces', () => {
      expect(parseColorInput('255,0,0')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should clamp values to 0-255', () => {
      expect(parseColorInput('rgb(300, -10, 0)')).toEqual({ r: 255, g: 0, b: 0 })
    })
  })

  describe('HSL input', () => {
    it('should parse hsl() format', () => {
      expect(parseColorInput('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should parse hsla() format', () => {
      expect(parseColorInput('hsla(240, 100%, 50%, 0.5)')).toEqual({ r: 0, g: 0, b: 255 })
    })

    it('should parse hsl without percent signs', () => {
      expect(parseColorInput('hsl(0, 100, 50)')).toEqual({ r: 255, g: 0, b: 0 })
    })
  })

  describe('CSS Named Color input', () => {
    it('should parse red', () => {
      expect(parseColorInput('red')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should parse tomato', () => {
      expect(parseColorInput('tomato')).toEqual({ r: 255, g: 99, b: 71 })
    })

    it('should parse case-insensitively', () => {
      expect(parseColorInput('SteelBlue')).toEqual({ r: 70, g: 130, b: 180 })
    })

    it('should parse with whitespace', () => {
      expect(parseColorInput('  tomato  ')).toEqual({ r: 255, g: 99, b: 71 })
    })
  })

  describe('invalid input', () => {
    it('should return null for empty string', () => {
      expect(parseColorInput('')).toBeNull()
    })

    it('should return null for whitespace only', () => {
      expect(parseColorInput('   ')).toBeNull()
    })

    it('should return null for random text', () => {
      expect(parseColorInput('hello')).toBeNull()
    })

    it('should return null for invalid hex', () => {
      expect(parseColorInput('#ZZZZZZ')).toBeNull()
    })

    it('should return null for incomplete rgb', () => {
      expect(parseColorInput('rgb(255, 0)')).toBeNull()
    })
  })
})
```

**Step 2: 运行测试，确认失败**

Run: `pnpm test run src/app/tools/color-converter/__tests__/color-converter.test.ts`
Expected: FAIL — `parseColorInput` 未定义

**Step 3: 在 utils.ts 中实现 parseColorInput**

在 `getContrastColor` 下方添加：

```typescript
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function parseHex(input: string): RGB | null {
  const match = input.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i)
  if (!match) return null
  const hex = match[1]

  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
    }
  }
  // hex.length is 6 or 8 (regex guarantees 3, 6, or 8)
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  }
}

function parseRgb(input: string): RGB | null {
  // Match rgb(r, g, b) or rgba(r, g, b, a)
  const funcMatch = input.match(/^rgba?\(\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)/)
  if (funcMatch) {
    return {
      r: clamp(parseInt(funcMatch[1]), 0, 255),
      g: clamp(parseInt(funcMatch[2]), 0, 255),
      b: clamp(parseInt(funcMatch[3]), 0, 255),
    }
  }

  // Match bare comma-separated: 255, 107, 107
  const bareMatch = input.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/)
  if (bareMatch) {
    return {
      r: clamp(parseInt(bareMatch[1]), 0, 255),
      g: clamp(parseInt(bareMatch[2]), 0, 255),
      b: clamp(parseInt(bareMatch[3]), 0, 255),
    }
  }

  return null
}

function parseHsl(input: string): RGB | null {
  // Note: only matches integer values; CSS allows decimals and negative hue — acceptable for M1
  const match = input.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/)
  if (!match) return null
  return hslToRgb({
    h: parseInt(match[1]),
    s: parseInt(match[2]),
    l: parseInt(match[3]),
  })
}

function parseNamedColor(input: string): RGB | null {
  const color = CSS_NAMED_COLORS[input.toLowerCase()]
  if (!color) return null
  return { r: color[0], g: color[1], b: color[2] }
}

export function parseColorInput(input: string): RGB | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // Priority 1: HEX
  if (trimmed.startsWith('#')) return parseHex(trimmed)

  // Priority 2: RGB function
  if (/^rgba?\(/i.test(trimmed)) return parseRgb(trimmed)

  // Priority 3: HSL function
  if (/^hsla?\(/i.test(trimmed)) return parseHsl(trimmed)

  // Priority 4: Bare comma-separated numbers
  if (/^\d{1,3}\s*,/.test(trimmed)) return parseRgb(trimmed)

  // Priority 5: CSS Named Color
  return parseNamedColor(trimmed)
}
```

**Step 4: 运行测试，确认通过**

Run: `pnpm test run src/app/tools/color-converter/__tests__/color-converter.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/tools/color-converter/utils.ts src/app/tools/color-converter/__tests__/color-converter.test.ts
git commit -m "feat(color): add smart parseColorInput with tests"
```

---

### Task 5: 主题渐变色

> **注意：** 此 Task 仅添加 CSS 渐变色变量，不创建 index.ts 和注册（那些在 Task 6 中完成，因为 index.ts 需要导入 Vue 组件）。

**Files:**

- Modify: `src/app/assets/styles/variables.css`（在 `--brand-gradient` 之前）
- Modify: `src/app/assets/styles/themes/ink-wash.css`（在 `--brand-gradient` 之前）
- Modify: `src/app/assets/styles/themes/twilight.css`（在 `--brand-gradient` 之前）
- Modify: `src/app/assets/styles/themes/nord.css`（在 `--brand-gradient` 之前）
- Modify: `src/app/assets/styles/themes/github-dark.css`（在 `--brand-gradient` 之前）

**Step 1: 添加 5 套主题的渐变色**

在 `variables.css` 的 `--brand-gradient` 之前添加：

```css
--tool-color-gradient: linear-gradient(135deg, #f093fb, #f5af19);
```

在 `ink-wash.css` 的 `--brand-gradient` 之前添加：

```css
--tool-color-gradient: linear-gradient(135deg, #7a9e8f, #8e7a9e);
```

在 `twilight.css` 的 `--brand-gradient` 之前添加：

```css
--tool-color-gradient: linear-gradient(135deg, #e040a0, #9b59b6);
```

在 `nord.css` 的 `--brand-gradient` 之前添加：

```css
--tool-color-gradient: linear-gradient(135deg, #88c0d0, #a3be8c);
```

在 `github-dark.css` 的 `--brand-gradient` 之前添加：

```css
--tool-color-gradient: linear-gradient(135deg, #f778ba, #a371f7);
```

**Step 2: Commit**

```bash
git add src/app/assets/styles/variables.css src/app/assets/styles/themes/
git commit -m "feat(color): add theme gradient CSS variables"
```

---

### Task 6: Vue 组件 + ToolMeta 注册

**Files:**

- Create: `src/app/tools/color-converter/ColorConverterTool.vue`
- Create: `src/app/tools/color-converter/index.ts`
- Modify: `src/app/tools/registry.ts`

**Step 1: 创建完整的 Vue 组件**

```vue
<!-- src/app/tools/color-converter/ColorConverterTool.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NAlert } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import ToolPageHeader from '@/components/ToolPageHeader.vue'
import { colorConverterTool } from './index'
import {
  parseColorInput,
  toHex,
  toRgbString,
  toHslString,
  findNamedColor,
  getContrastColor,
} from './utils'

const input = ref('')

const parsed = computed(() => parseColorInput(input.value))

const hexValue = computed(() => (parsed.value ? toHex(parsed.value) : ''))
const rgbValue = computed(() => (parsed.value ? toRgbString(parsed.value) : ''))
const hslValue = computed(() => (parsed.value ? toHslString(parsed.value) : ''))
const namedColor = computed(() => (parsed.value ? findNamedColor(parsed.value) : null))
const contrastColor = computed(() => (parsed.value ? getContrastColor(parsed.value) : '#000000'))

const previewBg = computed(() => (parsed.value ? hexValue.value : 'transparent'))

const hasError = computed(() => input.value.trim() !== '' && !parsed.value)

const QUICK_COLORS = [
  'red',
  'orange',
  'gold',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'pink',
  'brown',
  'black',
  'white',
]

function selectQuickColor(name: string) {
  input.value = name
}
</script>

<template>
  <div>
    <ToolPageHeader
      :title="colorConverterTool.title"
      :description="colorConverterTool.description"
      :icon="colorConverterTool.icon"
      :gradient-var="colorConverterTool.gradientVar"
    />

    <div class="input-area">
      <div class="input-wrapper">
        <span
          class="color-indicator"
          :style="{ background: parsed ? previewBg : 'var(--color-border)' }"
        />
        <NInput
          v-model:value="input"
          placeholder="输入颜色值：#FF6B6B、rgb(255,107,107)、hsl(0,100%,71%)、tomato"
          class="color-input"
          clearable
        />
      </div>
    </div>

    <NAlert v-if="hasError" type="warning" :bordered="false" style="margin-top: var(--space-sm)">
      无法识别的颜色格式
    </NAlert>

    <div v-if="parsed" class="preview-section">
      <div
        class="color-preview"
        :style="{ background: previewBg }"
        role="img"
        :aria-label="`颜色预览: ${hexValue}`"
      >
        <span class="preview-hex" :style="{ color: contrastColor }">{{ hexValue }}</span>
      </div>

      <div class="result-list">
        <div class="result-row">
          <span class="result-label">HEX</span>
          <code class="result-value">{{ hexValue }}</code>
          <CopyButton :text="hexValue" />
        </div>
        <div class="result-row">
          <span class="result-label">RGB</span>
          <code class="result-value">{{ rgbValue }}</code>
          <CopyButton :text="rgbValue" />
        </div>
        <div class="result-row">
          <span class="result-label">HSL</span>
          <code class="result-value">{{ hslValue }}</code>
          <CopyButton :text="hslValue" />
        </div>
        <div class="result-row">
          <span class="result-label">CSS</span>
          <code v-if="namedColor" class="result-value">{{ namedColor }}</code>
          <span v-else class="result-value result-value--empty">无匹配的命名色</span>
          <CopyButton v-if="namedColor" :text="namedColor" />
        </div>
      </div>
    </div>

    <div class="quick-colors">
      <button
        v-for="name in QUICK_COLORS"
        :key="name"
        class="quick-color-dot"
        :style="{ background: name }"
        :title="name"
        :aria-label="`选择颜色 ${name}`"
        @click="selectQuickColor(name)"
      />
    </div>
  </div>
</template>

<style scoped>
.input-area {
  margin-bottom: var(--space-md);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.color-indicator {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  transition: background var(--transition-fast);
}

.color-input {
  flex: 1;
}

.color-input :deep(input) {
  font-family: var(--font-mono) !important;
  font-size: 13px !important;
}

.preview-section {
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

.color-preview {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: background var(--transition-fast);
}

.preview-hex {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.result-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.result-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
}

.result-label {
  flex-shrink: 0;
  width: 36px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.result-value {
  flex: 1;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  word-break: break-all;
}

.result-value--empty {
  color: var(--color-text-secondary);
  font-style: italic;
  font-family: var(--font-body);
}

.quick-colors {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-xl);
  flex-wrap: wrap;
}

.quick-color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
  padding: 0;
}

.quick-color-dot:hover {
  transform: scale(1.2);
  box-shadow: var(--shadow-md);
}

.quick-color-dot:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
```

**Step 2: 创建 index.ts**

```typescript
// src/app/tools/color-converter/index.ts
import type { ToolMeta } from '../types'
import ColorConverterTool from './ColorConverterTool.vue'

export const colorConverterTool: ToolMeta = {
  name: 'color-converter',
  title: '颜色转换',
  description: 'HEX、RGB、HSL、CSS 命名色互相转换',
  path: '/tools/color-converter',
  component: ColorConverterTool,
  icon: 'M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
  gradientVar: '--tool-color-gradient',
}
```

图标使用 Material Design 的调色盘图标 `palette` SVG path。

**Step 3: 在 registry.ts 中注册**

在 `registry.ts` 中：

- 添加 import: `import { colorConverterTool } from './color-converter'`
- 添加到数组: `colorConverterTool,`

```typescript
// src/app/tools/registry.ts
import type { ToolMeta } from './types'
import { jsonFormatterTool } from './json-formatter'
import { base64Tool } from './base64'
import { urlEncoderTool } from './url-encoder'
import { uuidGeneratorTool } from './uuid-generator'
import { jsonYamlConverterTool } from './json-yaml-converter'
import { timestampConverterTool } from './timestamp-converter'
import { colorConverterTool } from './color-converter'

export const toolRegistry: ToolMeta[] = [
  jsonFormatterTool,
  base64Tool,
  urlEncoderTool,
  uuidGeneratorTool,
  jsonYamlConverterTool,
  timestampConverterTool,
  colorConverterTool,
]
```

**Step 4: Commit**

```bash
git add src/app/tools/color-converter/ColorConverterTool.vue src/app/tools/color-converter/index.ts src/app/tools/registry.ts
git commit -m "feat(color): add Vue component, ToolMeta and register"
```

---

### Task 7: 手动验证 + 全量测试

**Step 1: 运行全量测试**

Run: `pnpm test run`
Expected: 全部通过，无新增失败

**Step 2: 启动开发服务器手动验证**

Run: `pnpm dev`

手动检查清单：

- [ ] 首页出现「颜色转换」工具磁贴，图标有渐变色
- [ ] 侧边栏菜单出现「颜色转换」
- [ ] 点击进入工具页面，ToolPageHeader 正确显示
- [ ] 输入 `#FF6B6B`：预览区显示正确颜色，4 行结果正确
- [ ] 输入 `rgb(255, 99, 71)`：识别为 tomato
- [ ] 输入 `hsl(0, 100%, 50%)`：显示红色
- [ ] 输入 `tomato`：识别为 CSS 命名色
- [ ] 输入 `hello`：显示警告
- [ ] 复制按钮工作正常
- [ ] 底部快捷色圆点可点击
- [ ] 切换 5 个主题，渐变色正常

**Step 3: 修复发现的问题（如有）**

**Step 4: 最终 Commit**

```bash
git add src/app/tools/color-converter/
git commit -m "feat(color): color converter tool complete"
```

---

## 任务依赖关系

```
Task 1 (类型+数据) → Task 2 (RGB↔HSL) → Task 3 (输出函数) → Task 4 (解析器)
                                                                     ↓
Task 5 (主题CSS) ──────────────────────────────────────→ Task 6 (Vue+注册)
                                                                     ↓
                                                              Task 7 (验证)
```

Task 1-4 严格串行（TDD 链）。Task 5 仅添加 CSS 变量，可在 Task 1 后任意时间并行。Task 6 创建 Vue 组件 + index.ts + 注册到 registry，依赖 Task 4 和 5。Task 7 依赖 Task 6。
