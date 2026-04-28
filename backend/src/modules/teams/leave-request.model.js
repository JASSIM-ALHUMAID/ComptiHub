import mongoose from 'mongoose'

const leaveRequestSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    teamId: { type: String, required: true, trim: true, index: true },
    competitionId: { type: String, required: true, trim: true, index: true },
    requesterId: { type: String, required: true, trim: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      required: true,
      default: 'pending',
    },
    reviewedBy: { type: String, trim: true, default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

export const LeaveRequest = mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', leaveRequestSchema)
