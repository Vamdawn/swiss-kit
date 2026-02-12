export function generateUUIDv4(): string {
  return crypto.randomUUID()
}

export function generateUUIDv7(): string {
  const now = Date.now()
  const timeHex = now.toString(16).padStart(12, '0')

  const randomBytes = new Uint8Array(10)
  crypto.getRandomValues(randomBytes)

  const hex = Array.from(randomBytes, (b) => b.toString(16).padStart(2, '0')).join('')

  return [
    timeHex.slice(0, 8),
    timeHex.slice(8, 12),
    '7' + hex.slice(0, 3),
    ((parseInt(hex.slice(3, 5), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + hex.slice(5, 7),
    hex.slice(7, 19),
  ].join('-')
}

const ULID_ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

export function generateULID(): string {
  const now = Date.now()
  let timeChars = ''
  let t = now
  for (let i = 0; i < 10; i++) {
    timeChars = ULID_ENCODING[t % 32] + timeChars
    t = Math.floor(t / 32)
  }

  let randomChars = ''
  const randomBytes = new Uint8Array(10)
  crypto.getRandomValues(randomBytes)
  for (let i = 0; i < 16; i++) {
    const byteIndex = Math.floor((i * 5) / 8)
    const bitOffset = (i * 5) % 8
    let value = (randomBytes[byteIndex]! >> bitOffset) & 0x1f
    if (bitOffset > 3 && byteIndex + 1 < randomBytes.length) {
      value |= (randomBytes[byteIndex + 1]! << (8 - bitOffset)) & 0x1f
    }
    randomChars += ULID_ENCODING[value & 0x1f]
  }

  return timeChars + randomChars
}
