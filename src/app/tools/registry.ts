import type { ToolMeta } from './types'
import { base64Tool } from './base64'
import { urlEncoderTool } from './url-encoder'
import { uuidGeneratorTool } from './uuid-generator'

export const toolRegistry: ToolMeta[] = [base64Tool, urlEncoderTool, uuidGeneratorTool]
