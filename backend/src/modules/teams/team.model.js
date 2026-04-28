import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 150 },
    competitionId: { type: String, required: true, trim: true, index: true },
    leaderId: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    requiredSkills: { type: [String], default: [] },
    totalSlots: { type: Number, required: true, min: 1, max: 50 },
    memberIds: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['recruiting', 'full', 'closed', 'archived', 'dissolved'],
      required: true,
      default: 'recruiting',
    },
  },
  { timestamps: true },
)

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema)
