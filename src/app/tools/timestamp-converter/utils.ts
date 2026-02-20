export interface ParsedInput {
  type: 'timestamp-s' | 'timestamp-ms' | 'date'
  ms: number
}

export function isMilliseconds(num: number): boolean {
  // Timestamps in seconds are 10 digits (up to 2286-11-20)
  // Timestamps in milliseconds are 13 digits
  // Negative values are always treated as seconds (pre-epoch dates)
  return num > 9_999_999_999
}

export function parseInput(input: string): ParsedInput | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // Try as numeric timestamp
  if (/^-?\d+$/.test(trimmed)) {
    const num = Number(trimmed)
    if (!Number.isFinite(num)) return null
    if (isMilliseconds(num)) {
      return { type: 'timestamp-ms', ms: num }
    }
    return { type: 'timestamp-s', ms: num * 1000 }
  }

  // Try as date string
  const date = new Date(trimmed)
  if (!Number.isNaN(date.getTime())) {
    return { type: 'date', ms: date.getTime() }
  }

  return null
}

export function formatISO8601(ms: number): string {
  return new Date(ms).toISOString()
}

export function formatLocalTime(ms: number): string {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function formatUTCTime(ms: number): string {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
}

export function formatRFC2822(ms: number): string {
  return new Date(ms).toUTCString()
}

export function formatRelativeTime(ms: number, now?: number): string {
  const current = now ?? Date.now()
  const diffMs = current - ms
  const absDiff = Math.abs(diffMs)
  const isPast = diffMs > 0

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  let label: string
  if (seconds < 5) return '刚刚'
  if (seconds < 60) label = `${seconds} 秒`
  else if (minutes < 60) label = `${minutes} 分钟`
  else if (hours < 24) label = `${hours} 小时`
  else if (days < 30) label = `${days} 天`
  else if (months < 12) label = `${months} 个月`
  else label = `${years} 年`

  return isPast ? `${label}前` : `${label}后`
}
