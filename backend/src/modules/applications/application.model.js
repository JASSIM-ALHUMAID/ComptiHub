import mongoose from 'mongoose'

export const applicationStatuses = ['pending', 'accepted', 'rejected']
export const activeApplicationStatuses = ['pending']

const applicationSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    teamId: {
      type: String,
      ref: 'Team',
      required: true,
      index: true,
    },
    competitionId: {
      type: String,
      ref: 'Competition',
      required: true,
      index: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    status: {
      type: String,
      enum: applicationStatuses,
      default: 'pending',
      required: true,
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
  },
  { timestamps: true },
)

applicationSchema.index({ applicantId: 1, teamId: 1, status: 1 })
applicationSchema.index({ applicantId: 1, competitionId: 1, status: 1 })
applicationSchema.index({ teamId: 1, status: 1, createdAt: -1 })

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema)

