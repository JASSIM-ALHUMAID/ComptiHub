import bcrypt from 'bcrypt'
import { ApiError } from '../../utils/apiError.js'
import { User } from './user.model.js'
import { createProfileForUser } from '../profile/profile.service.js'

const saltRounds = 12

function authPayload(user) {
  const { token: refreshToken, expiresIn } = user.issueRefreshToken()
  user.addRefreshToken(refreshToken, expiresIn)

  return {
    user: user.toSessionUser(),
    token: user.issueAccessToken(),
    refreshToken,
  }
}

export async function signupStudent(input) {
  const existing = await User.findOne({
    $or: [{ email: input.email }, { username: input.username }],
  }).lean()

  if (existing?.email === input.email) {
    throw new ApiError(409, 'An account with that email already exists.')
  }

  if (existing?.username === input.username) {
    throw new ApiError(409, 'An account with that username already exists.')
  }

  const passwordHash = await bcrypt.hash(input.password, saltRounds)
  const user = await User.create({
    username: input.username,
    email: input.email,
    passwordHash,
    systemRole: 'student',
    defaultRole: input.defaultRole,
    activeRole: input.defaultRole,
    accountStatus: 'active',
  })

  await createProfileForUser(user._id)

  const payload = authPayload(user)
  await user.save()
  return payload
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash +refreshTokens')

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.')
  }

  if (user.accountStatus !== 'active') {
    throw new ApiError(403, `Account is ${user.accountStatus}.`)
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password.')
  }

  if (user.systemRole === 'student') {
    user.activeRole = user.defaultRole
  }

  await user.save()
  const payload = authPayload(user)
  await user.save()
  return payload
}

export async function updateDefaultRole(user, defaultRole) {
  if (user.systemRole !== 'student') {
    throw new ApiError(403, 'Only student accounts can update default role.')
  }

  user.defaultRole = defaultRole
  await user.save()
  return user.toSessionUser()
}

export async function updateActiveRole(user, activeRole) {
  if (user.systemRole !== 'student') {
    throw new ApiError(403, 'Only student accounts can switch student roles.')
  }

  user.activeRole = activeRole
  await user.save()
  return user.toSessionUser()
}

export async function updateBasicInfo(user, { username, email }) {
  const existing = await User.findOne({
    _id: { $ne: user._id },
    $or: [{ email }, { username }],
  }).lean()

  if (existing?.email === email) {
    throw new ApiError(409, 'An account with that email already exists.')
  }

  if (existing?.username === username) {
    throw new ApiError(409, 'An account with that username already exists.')
  }

  user.username = username
  user.email = email
  await user.save()
  return user.toSessionUser()
}
