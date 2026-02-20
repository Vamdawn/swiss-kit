import { describe, it, expect } from 'vitest'
import {
  rgbToHsl,
  hslToRgb,
  toHex,
  toRgbString,
  toHslString,
  findNamedColor,
  getContrastColor,
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
})
