#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import sirv from 'sirv'
import { createServer } from 'http'
import open from 'open'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appDir = resolve(__dirname, '../app')

const serve = sirv(appDir, { single: true })
const server = createServer(serve)

const port = Number(process.env.PORT) || 7749

server.listen(port, () => {
  const url = `http://localhost:${port}`
  console.log(`Swiss Kit is running at ${url}`)
  open(url)
})
