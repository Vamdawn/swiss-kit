import { describe, it, expect } from 'vitest'
import {
  parseInput,
  isMilliseconds,
  formatISO8601,
  formatLocalTime,
  formatUTCTime,
  formatRFC2822,
  formatRelativeTime,
} from '../utils'

describe('timestamp converter utils', () => {
  describe('isMilliseconds', () => {
    it('should return false for 10-digit numbers (seconds)', () => {
      expect(isMilliseconds(1708416000)).toBe(false)
    })

    it('should return true for 13-digit numbers (milliseconds)', () => {
      expect(isMilliseconds(1708416000000)).toBe(true)
    })

    it('should return false for small numbers', () => {
      expect(isMilliseconds(0)).toBe(false)
      expect(isMilliseconds(1000)).toBe(false)
    })
  })

  describe('parseInput', () => {
    it('should return null for empty string', () => {
      expect(parseInput('')).toBeNull()
      expect(parseInput('   ')).toBeNull()
    })

    it('should parse seconds timestamp', () => {
      const result = parseInput('1708416000')
      expect(result).toEqual({ type: 'timestamp-s', ms: 1708416000000 })
    })

    it('should parse milliseconds timestamp', () => {
      const result = parseInput('1708416000000')
      expect(result).toEqual({ type: 'timestamp-ms', ms: 1708416000000 })
    })

    it('should parse ISO 8601 date string', () => {
      const result = parseInput('2024-02-20T08:00:00.000Z')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('date')
      expect(result!.ms).toBe(1708416000000)
    })

    it('should parse simple date string', () => {
      const result = parseInput('2024-02-20')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('date')
    })

    it('should return null for invalid input', () => {
      expect(parseInput('not-a-date')).toBeNull()
      expect(parseInput('abc123')).toBeNull()
    })

    it('should handle negative timestamps', () => {
      const result = parseInput('-1000')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('timestamp-s')
      expect(result!.ms).toBe(-1000000)
    })

    it('should handle zero timestamp', () => {
      const result = parseInput('0')
      expect(result).toEqual({ type: 'timestamp-s', ms: 0 })
    })

    it('should treat large negative numbers as seconds', () => {
      const result = parseInput('-10000000000')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('timestamp-s')
    })
  })

  describe('formatISO8601', () => {
    it('should format to ISO 8601 string', () => {
      expect(formatISO8601(1708416000000)).toBe('2024-02-20T08:00:00.000Z')
    })

    it('should handle epoch zero', () => {
      expect(formatISO8601(0)).toBe('1970-01-01T00:00:00.000Z')
    })
  })

  describe('formatLocalTime', () => {
    it('should format to local readable time', () => {
      const result = formatLocalTime(1708416000000)
      expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/)
    })
  })

  describe('formatUTCTime', () => {
    it('should format to UTC readable time', () => {
      expect(formatUTCTime(1708416000000)).toBe('2024/02/20 08:00:00')
    })

    it('should pad single digits', () => {
      const ms = Date.UTC(2024, 0, 5, 3, 4, 5)
      expect(formatUTCTime(ms)).toBe('2024/01/05 03:04:05')
    })
  })

  describe('formatRFC2822', () => {
    it('should format to RFC 2822 string', () => {
      const result = formatRFC2822(1708416000000)
      expect(result).toContain('Tue')
      expect(result).toContain('20 Feb 2024')
      expect(result).toContain('08:00:00')
      expect(result).toContain('GMT')
    })
  })

  describe('formatRelativeTime', () => {
    const base = 1708416000000

    it('should show 刚刚 for < 5s', () => {
      expect(formatRelativeTime(base, base + 3_000)).toBe('刚刚')
    })

    it('should show seconds for < 60s', () => {
      expect(formatRelativeTime(base, base + 30_000)).toBe('30 秒前')
    })

    it('should show minutes for < 60min', () => {
      expect(formatRelativeTime(base, base + 5 * 60_000)).toBe('5 分钟前')
    })

    it('should show hours for < 24h', () => {
      expect(formatRelativeTime(base, base + 3 * 3600_000)).toBe('3 小时前')
    })

    it('should show days for < 30d', () => {
      expect(formatRelativeTime(base, base + 7 * 86400_000)).toBe('7 天前')
    })

    it('should show months for < 12mo', () => {
      expect(formatRelativeTime(base, base + 60 * 86400_000)).toBe('2 个月前')
    })

    it('should show years for >= 365d', () => {
      expect(formatRelativeTime(base, base + 400 * 86400_000)).toBe('1 年前')
    })

    it('should show future times with 后', () => {
      expect(formatRelativeTime(base + 3600_000, base)).toBe('1 小时后')
    })
  })
})
