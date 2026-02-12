import { describe, it, expect } from 'vitest'
import { encodeBase64, decodeBase64 } from '../utils'

describe('Base64 encode/decode', () => {
  it('should encode ASCII text', () => {
    expect(encodeBase64('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==')
  })

  it('should decode ASCII text', () => {
    expect(decodeBase64('SGVsbG8sIFdvcmxkIQ==')).toBe('Hello, World!')
  })

  it('should handle Unicode text', () => {
    const input = '你好世界'
    const encoded = encodeBase64(input)
    expect(decodeBase64(encoded)).toBe(input)
  })

  it('should handle empty string', () => {
    expect(encodeBase64('')).toBe('')
    expect(decodeBase64('')).toBe('')
  })

  it('should throw on invalid base64 input', () => {
    expect(() => decodeBase64('not-valid-base64!!!')).toThrow()
  })
})
