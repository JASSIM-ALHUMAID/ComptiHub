import mongoose from 'mongoose'

const competitionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    organizer: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    mode: { type: String, required: true, trim: true, maxlength: 100 },
    teamSize: { type: String, required: true, trim: true, maxlength: 50 },
    deadline: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft', 'upcoming', 'active', 'ended'],
      required: true,
    },
    prize: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    requirements: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    links: { type: [String], default: [] },
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, required: true, trim: true },
    registrationDeadline: { type: String, required: true, trim: true },
    participationType: {
      type: String,
      enum: ['team', 'solo'],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
)

// Indexes for common queries
competitionSchema.index({ status: 1 })
competitionSchema.index({ category: 1 })
competitionSchema.index({ status: 1, category: 1 })
competitionSchema.index({ createdAt: -1 })
competitionSchema.index({ startDate: 1, status: 1 })

export const Competition = mongoose.models.Competition || mongoose.model('Competition', competitionSchema)
