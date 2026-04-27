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
  },
  { timestamps: true },
)

userSchema.methods.issueAccessToken = function issueAccessToken() {
  return jwt.sign({ sub: this._id.toString(), systemRole: this.systemRole }, env.jwtSecret, { expiresIn: '1h' })
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
