export function formatJson(input: string, indent: number = 2): string {
  return JSON.stringify(JSON.parse(input), null, indent)
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input))
}

export function validateJson(input: string): string | null {
  try {
    JSON.parse(input)
    return null
  } catch (e) {
    return (e as Error).message
  }
}
