import { describe, it, expect } from 'vitest'
import { jsonToYaml, yamlToJson, validateJson, validateYaml } from '../utils'

describe('JSON ↔ YAML converter utils', () => {
  describe('jsonToYaml', () => {
    it('should convert simple JSON to YAML', () => {
      const json = '{"name":"test","count":42}'
      const result = jsonToYaml(json)
      expect(result).toBe('name: test\ncount: 42\n')
    })

    it('should convert nested JSON to YAML', () => {
      const json = '{"server":{"host":"localhost","port":8080}}'
      const result = jsonToYaml(json)
      expect(result).toContain('server:')
      expect(result).toContain('  host: localhost')
      expect(result).toContain('  port: 8080')
    })

    it('should convert JSON array to YAML', () => {
      const json = '["a","b","c"]'
      const result = jsonToYaml(json)
      expect(result).toContain('- a')
      expect(result).toContain('- b')
      expect(result).toContain('- c')
    })

    it('should respect custom indent', () => {
      const json = '{"a":{"b":1}}'
      const result = jsonToYaml(json, 4)
      expect(result).toContain('    b: 1')
    })

    it('should throw on invalid JSON input', () => {
      expect(() => jsonToYaml('{invalid}')).toThrow()
    })

    it('should handle scalar JSON values', () => {
      expect(jsonToYaml('42')).toBe('42\n')
      expect(jsonToYaml('"hello"')).toBe('hello\n')
    })
  })

  describe('yamlToJson', () => {
    it('should convert simple YAML to JSON', () => {
      const yaml = 'name: test\ncount: 42\n'
      const result = yamlToJson(yaml)
      expect(JSON.parse(result)).toEqual({ name: 'test', count: 42 })
    })

    it('should convert nested YAML to JSON', () => {
      const yaml = 'server:\n  host: localhost\n  port: 8080\n'
      const result = yamlToJson(yaml)
      expect(JSON.parse(result)).toEqual({ server: { host: 'localhost', port: 8080 } })
    })

    it('should convert YAML array to JSON', () => {
      const yaml = '- a\n- b\n- c\n'
      const result = yamlToJson(yaml)
      expect(JSON.parse(result)).toEqual(['a', 'b', 'c'])
    })

    it('should respect custom indent', () => {
      const yaml = 'a:\n  b: 1\n'
      const result = yamlToJson(yaml, 4)
      expect(result).toContain('        "b": 1')
    })

    it('should throw on invalid YAML input', () => {
      expect(() => yamlToJson(': : invalid: [\n')).toThrow()
    })

    it('should handle YAML with only comments', () => {
      const result = yamlToJson('# just a comment\n')
      expect(result).toBe('null')
    })

    it('should handle bare YAML document separator', () => {
      const result = yamlToJson('---\n')
      expect(result).toBe('null')
    })

    it('should handle scalar YAML values', () => {
      expect(JSON.parse(yamlToJson('42'))).toBe(42)
      expect(JSON.parse(yamlToJson('true'))).toBe(true)
    })
  })

  describe('validateJson', () => {
    it('should return null for valid JSON', () => {
      expect(validateJson('{"a":1}')).toBeNull()
    })

    it('should return error message for invalid JSON', () => {
      const error = validateJson('{invalid}')
      expect(error).toBeTruthy()
      expect(typeof error).toBe('string')
    })
  })

  describe('validateYaml', () => {
    it('should return null for valid YAML', () => {
      expect(validateYaml('name: test\n')).toBeNull()
    })

    it('should return error message for invalid YAML', () => {
      const error = validateYaml(': : invalid: [\n')
      expect(error).toBeTruthy()
      expect(typeof error).toBe('string')
    })

    it('should return null for empty string', () => {
      expect(validateYaml('')).toBeNull()
    })
  })
})
