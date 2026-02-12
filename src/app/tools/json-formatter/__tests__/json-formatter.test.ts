import { describe, it, expect } from 'vitest'
import { formatJson, minifyJson, validateJson } from '../utils'

describe('JSON formatter utils', () => {
  const validJson = '{"name":"test","count":42,"nested":{"a":1}}'

  describe('formatJson', () => {
    it('should format JSON with 2-space indent', () => {
      const result = formatJson(validJson)
      expect(result).toBe(JSON.stringify(JSON.parse(validJson), null, 2))
    })

    it('should format with custom indent', () => {
      const result = formatJson(validJson, 4)
      expect(result).toBe(JSON.stringify(JSON.parse(validJson), null, 4))
    })
  })

  describe('minifyJson', () => {
    it('should remove all whitespace from JSON', () => {
      const formatted = '{\n  "name": "test"\n}'
      expect(minifyJson(formatted)).toBe('{"name":"test"}')
    })
  })

  describe('validateJson', () => {
    it('should return null for valid JSON', () => {
      expect(validateJson(validJson)).toBeNull()
    })

    it('should return error message for invalid JSON', () => {
      const error = validateJson('{invalid}')
      expect(error).toBeTruthy()
      expect(typeof error).toBe('string')
    })

    it('should return error for empty string', () => {
      const error = validateJson('')
      expect(error).toBeTruthy()
    })
  })
})
