import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import { sendSuccess } from './utils/responses.js'
import { authRouter } from './modules/auth/auth.routes.js'
import { adminCompetitionRouter, competitionRouter } from './modules/competitions/competition.routes.js'
import { profileRouter } from './modules/profile/profile.routes.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: env.clientUrl, credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())
  if (env.nodeEnv !== 'test') {
    app.use(morgan('dev'))
  }

  app.get('/health', (_req, res) => sendSuccess(res, { status: 'ok' }))

  const api = express.Router()
  api.get('/health', (_req, res) => sendSuccess(res, { status: 'ok' }))
  api.use('/auth', authRouter)
  api.use('/profile', profileRouter)
  api.use('/competitions', competitionRouter)
  api.use('/admin/competitions', adminCompetitionRouter)

  app.use('/api/v1', api)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
