import mongoose from 'mongoose'
import { env } from '../config/env.js'

export async function connectDatabase() {
  mongoose.set('strictQuery', true)
  return mongoose.connect(env.mongodbUri)
}

export async function disconnectDatabase() {
  return mongoose.disconnect()
}
