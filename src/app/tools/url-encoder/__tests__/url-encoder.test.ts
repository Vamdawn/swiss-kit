import { describe, it, expect } from 'vitest'
import { urlEncode, urlDecode } from '../utils'

describe('URL encode/decode', () => {
  it('should encode special characters', () => {
    expect(urlEncode('hello world')).toBe('hello%20world')
    expect(urlEncode('a=1&b=2')).toBe('a%3D1%26b%3D2')
  })

  it('should decode special characters', () => {
    expect(urlDecode('hello%20world')).toBe('hello world')
    expect(urlDecode('a%3D1%26b%3D2')).toBe('a=1&b=2')
  })

  it('should handle Unicode', () => {
    const input = '你好世界'
    expect(urlDecode(urlEncode(input))).toBe(input)
  })

  it('should handle empty string', () => {
    expect(urlEncode('')).toBe('')
    expect(urlDecode('')).toBe('')
  })
})
