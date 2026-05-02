import mongoose from 'mongoose'
import { env } from '../config/env.js'

export async function connectDb(uri = env.mongodbUri) {
  mongoose.set('strictQuery', true)
  return mongoose.connect(uri)
}

export async function connectDatabase() {
  return connectDb(env.mongodbUri)
}

export async function disconnectDatabase() {
  return mongoose.disconnect()
}
