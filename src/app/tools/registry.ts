import type { ToolMeta } from './types'
import { base64Tool } from './base64'
import { urlEncoderTool } from './url-encoder'

export const toolRegistry: ToolMeta[] = [base64Tool, urlEncoderTool]
