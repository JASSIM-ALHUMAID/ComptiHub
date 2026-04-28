import express from 'express'
import { authenticate } from '../../middlewares/auth.js'
import { sendSuccess } from '../../utils/responses.js'
import {
  getProfileByUserId,
  getProfileSkillsByUserId,
  replaceProfileSkillsByUserId,
  updateProfileByUserId,
} from './profile.service.js'
import { profileSkillsSchema, profileUpdateSchema } from './profile.validation.js'

export const profileRouter = express.Router()

profileRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    const profile = await getProfileByUserId(req.user._id)
    sendSuccess(res, { profile })
  } catch (error) {
    next(error)
  }
})

profileRouter.patch('/me', authenticate, async (req, res, next) => {
  try {
    const updates = profileUpdateSchema.parse(req.body)
    const profile = await updateProfileByUserId(req.user._id, updates)
    sendSuccess(res, { profile })
  } catch (error) {
    next(error)
  }
})

profileRouter.get('/me/skills', authenticate, async (req, res, next) => {
  try {
    const skills = await getProfileSkillsByUserId(req.user._id)
    sendSuccess(res, { skills })
  } catch (error) {
    next(error)
  }
})

profileRouter.put('/me/skills', authenticate, async (req, res, next) => {
  try {
    const { skills } = profileSkillsSchema.parse(req.body)
    const nextSkills = await replaceProfileSkillsByUserId(req.user._id, skills)
    sendSuccess(res, { skills: nextSkills })
  } catch (error) {
    next(error)
  }
})
