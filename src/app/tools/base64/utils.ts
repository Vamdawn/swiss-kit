export function encodeBase64(input: string): string {
  return btoa(
    encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  )
}

export function decodeBase64(input: string): string {
  return decodeURIComponent(
    Array.from(atob(input), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''),
  )
}
