import { createApp } from './app.js'
import { connectDatabase } from './db/connect.js'
import { env } from './config/env.js'

async function start() {
  await connectDatabase()

  const app = createApp()
  app.listen(env.port, () => {
    console.log(`Backend API listening on port ${env.port}`)
  })
}

start().catch((error) => {
  console.error('Failed to start backend API', error)
  process.exit(1)
})
