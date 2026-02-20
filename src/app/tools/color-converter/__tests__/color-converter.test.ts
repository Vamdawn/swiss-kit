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
})
