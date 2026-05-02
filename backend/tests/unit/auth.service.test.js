import { describe, it, expect, beforeEach, afterEach } from '../test-utils/vitest-node.js'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { User } from '../../src/modules/auth/user.model.js'
import { signupStudent, loginUser, updateBasicInfo, updateActiveRole } from '../../src/modules/auth/auth.service.js'
import { ApiError } from '../../src/utils/apiError.js'

let mongoServer

describe('Auth Service', () => {
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })

  afterEach(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  describe('signupStudent', () => {
    it('should create a new student user', async () => {
      const input = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePassword123',
        defaultRole: 'competitor',
      }

      const result = await signupStudent(input)

      expect(result.user).toBeDefined()
      expect(result.user.username).toBe('testuser')
      expect(result.user.email).toBe('test@example.com')
      expect(result.token).toBeDefined()
      expect(result.refreshToken).toBeDefined()
    })

    it('should reject duplicate email', async () => {
      const input = {
        username: 'testuser1',
        email: 'duplicate@example.com',
        password: 'SecurePassword123',
        defaultRole: 'competitor',
      }

      await signupStudent(input)

      const duplicateInput = {
        username: 'testuser2',
        email: 'duplicate@example.com',
        password: 'SecurePassword123',
        defaultRole: 'competitor',
      }

      await expect(signupStudent(duplicateInput)).rejects.toThrow(ApiError)
    })

    it('should reject duplicate username', async () => {
      const input = {
        username: 'duplicate',
        email: 'test1@example.com',
        password: 'SecurePassword123',
        defaultRole: 'competitor',
      }

      await signupStudent(input)

      const duplicateInput = {
        username: 'duplicate',
        email: 'test2@example.com',
        password: 'SecurePassword123',
        defaultRole: 'competitor',
      }

      await expect(signupStudent(duplicateInput)).rejects.toThrow(ApiError)
    })
  })

  describe('loginUser', () => {
    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('SecurePassword123', 12),
        systemRole: 'student',
        defaultRole: 'competitor',
        activeRole: 'competitor',
        accountStatus: 'active',
      })
    })

    it('should authenticate with correct credentials', async () => {
      const result = await loginUser({
        email: 'test@example.com',
        password: 'SecurePassword123',
      })

      expect(result.user).toBeDefined()
      expect(result.token).toBeDefined()
      expect(result.refreshToken).toBeDefined()
    })

    it('should reject invalid email', async () => {
      await expect(
        loginUser({
          email: 'nonexistent@example.com',
          password: 'SecurePassword123',
        }),
      ).rejects.toThrow(ApiError)
    })

    it('should reject invalid password', async () => {
      await expect(
        loginUser({
          email: 'test@example.com',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow(ApiError)
    })

    it('should reject banned account', async () => {
      const user = await User.findOne({ email: 'test@example.com' })
      user.accountStatus = 'banned'
      await user.save()

      await expect(
        loginUser({
          email: 'test@example.com',
          password: 'SecurePassword123',
        }),
      ).rejects.toThrow(ApiError)
    })
  })

  describe('updateBasicInfo', () => {
    let user

    beforeEach(async () => {
      user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('SecurePassword123', 12),
        systemRole: 'student',
        defaultRole: 'competitor',
        activeRole: 'competitor',
        accountStatus: 'active',
      })
    })

    it('should update username and email', async () => {
      const result = await updateBasicInfo(user, {
        username: 'newusername',
        email: 'newemail@example.com',
      })

      expect(result.username).toBe('newusername')
      expect(result.email).toBe('newemail@example.com')
    })

    it('should reject duplicate email', async () => {
      await User.create({
        username: 'otheruser',
        email: 'other@example.com',
        passwordHash: await bcrypt.hash('Password', 12),
        systemRole: 'student',
        defaultRole: 'competitor',
        activeRole: 'competitor',
        accountStatus: 'active',
      })

      await expect(
        updateBasicInfo(user, {
          username: 'newusername',
          email: 'other@example.com',
        }),
      ).rejects.toThrow(ApiError)
    })
  })

  describe('updateActiveRole', () => {
    let user

    beforeEach(async () => {
      user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('SecurePassword123', 12),
        systemRole: 'student',
        defaultRole: 'competitor',
        activeRole: 'competitor',
        accountStatus: 'active',
      })
    })

    it('should switch active role for student', async () => {
      const result = await updateActiveRole(user, 'teamLeader')
      expect(result.activeRole).toBe('teamLeader')
    })

    it('should reject role change for admin', async () => {
      const adminUser = await User.create({
        username: 'adminuser',
        email: 'admin@example.com',
        passwordHash: await bcrypt.hash('Password', 12),
        systemRole: 'admin',
        activeRole: 'admin',
        accountStatus: 'active',
      })

      await expect(updateActiveRole(adminUser, 'competitor')).rejects.toThrow(ApiError)
    })
  })
})
