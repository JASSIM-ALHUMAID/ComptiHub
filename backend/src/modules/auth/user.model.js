import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { env } from '../../config/env.js'

const studentRoles = ['competitor', 'teamLeader']

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    systemRole: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
      required: true,
    },
    defaultRole: {
      type: String,
      enum: studentRoles,
      required() {
        return this.systemRole === 'student'
      },
    },
    activeRole: {
      type: String,
      enum: ['competitor', 'teamLeader', 'admin'],
      required: true,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
      required: true,
    },
    refreshTokens: {
      type: [{ token: String, expiresAt: Date }],
      default: [],
      select: false,
    },
  },
  { timestamps: true },
)

userSchema.methods.issueAccessToken = function issueAccessToken() {
  return jwt.sign({ sub: this._id.toString(), systemRole: this.systemRole }, env.jwtSecret, { expiresIn: '1h' })
}

userSchema.methods.issueRefreshToken = function issueRefreshToken() {
  const expiresIn = 7 * 24 * 60 * 60 // 7 days in seconds
  const token = jwt.sign({ sub: this._id.toString(), type: 'refresh' }, env.jwtSecret, { expiresIn })
  return { token, expiresIn }
}

userSchema.methods.addRefreshToken = function addRefreshToken(token, expiresInSeconds) {
  this.refreshTokens = (this.refreshTokens || []).filter((rt) => new Date(rt.expiresAt) > new Date())
  this.refreshTokens.push({
    token,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
  })
}

userSchema.methods.verifyRefreshToken = function verifyRefreshToken(token) {
  const stored = (this.refreshTokens || []).find((rt) => rt.token === token && new Date(rt.expiresAt) > new Date())
  return !!stored
}

userSchema.methods.revokeRefreshToken = function revokeRefreshToken(token) {
  this.refreshTokens = (this.refreshTokens || []).filter((rt) => rt.token !== token)
}

userSchema.methods.toSessionUser = function toSessionUser() {
  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
    systemRole: this.systemRole,
    defaultRole: this.defaultRole,
    activeRole: this.activeRole,
    accountStatus: this.accountStatus,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const User = mongoose.models.User || mongoose.model('User', userSchema)
