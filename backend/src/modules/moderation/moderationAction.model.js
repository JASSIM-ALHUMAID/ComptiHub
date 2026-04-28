import mongoose from 'mongoose'

export const moderationPenalties = ['warning', 'suspend', 'ban']

const moderationActionSchema = new mongoose.Schema(
  {
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    adminUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    penalty: {
      type: String,
      enum: moderationPenalties,
      required: true,
    },
    duration: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
)

moderationActionSchema.index({ targetUserId: 1, createdAt: -1 })

export const ModerationAction =
  mongoose.models.ModerationAction || mongoose.model('ModerationAction', moderationActionSchema)

