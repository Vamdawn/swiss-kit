import { describe, it, expect } from 'vitest'
import {
  rgbToHsl,
  hslToRgb,
  toHex,
  toRgbString,
  toHslString,
  findNamedColor,
  getContrastColor,
  parseColorInput,
} from '../utils'

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
      expect(rgbToHsl({ r: 255, g: 99, b: 71 })).toEqual({ h: 9, s: 100, l: 64 })
    })
    it('should convert steelblue', () => {
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
})
