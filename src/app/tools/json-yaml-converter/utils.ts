import yaml from 'js-yaml'

export function jsonToYaml(jsonString: string, indent: number = 2): string {
  const obj = JSON.parse(jsonString)
  return yaml.dump(obj, { indent, schema: yaml.DEFAULT_SCHEMA })
}

export function yamlToJson(yamlString: string, indent: number = 2): string {
  const obj = yaml.load(yamlString, { schema: yaml.DEFAULT_SCHEMA })
  // yaml.load returns null for comment-only/empty-document YAML; guard undefined for edge cases
  if (obj === undefined) return JSON.stringify(null, null, indent)
  return JSON.stringify(obj, null, indent)
}

export function validateJson(input: string): string | null {
  try {
    JSON.parse(input)
    return null
  } catch (e) {
    return (e as Error).message
  }
}

export function validateYaml(input: string): string | null {
  // Empty input is not a validation error
  if (!input) return null
  try {
    yaml.load(input, { schema: yaml.DEFAULT_SCHEMA })
    return null
  } catch (e) {
    return (e as Error).message
  }
}
