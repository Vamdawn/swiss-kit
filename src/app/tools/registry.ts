import type { ToolMeta } from './types'
import { jsonFormatterTool } from './json-formatter'
import { base64Tool } from './base64'
import { urlEncoderTool } from './url-encoder'
import { uuidGeneratorTool } from './uuid-generator'
import { jsonYamlConverterTool } from './json-yaml-converter'
import { timestampConverterTool } from './timestamp-converter'

export const toolRegistry: ToolMeta[] = [
  jsonFormatterTool,
  base64Tool,
  urlEncoderTool,
  uuidGeneratorTool,
  jsonYamlConverterTool,
  timestampConverterTool,
]
