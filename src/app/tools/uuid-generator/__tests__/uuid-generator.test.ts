import { describe, it, expect } from 'vitest'
import { generateUUIDv4, generateUUIDv7, generateULID } from '../utils'

describe('UUID/ULID generators', () => {
  describe('UUID v4', () => {
    it('should return a valid UUID v4 format', () => {
      const uuid = generateUUIDv4()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('should generate unique values', () => {
      const a = generateUUIDv4()
      const b = generateUUIDv4()
      expect(a).not.toBe(b)
    })
  })

  describe('UUID v7', () => {
    it('should return a valid UUID v7 format', () => {
      const uuid = generateUUIDv7()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('should generate unique values', () => {
      const a = generateUUIDv7()
      const b = generateUUIDv7()
      expect(a).not.toBe(b)
    })
  })

  describe('ULID', () => {
    it('should return a 26-character uppercase string', () => {
      const ulid = generateULID()
      expect(ulid).toMatch(/^[0-9A-Z]{26}$/)
    })

    it('should generate unique values', () => {
      const a = generateULID()
      const b = generateULID()
      expect(a).not.toBe(b)
    })
  })
})
