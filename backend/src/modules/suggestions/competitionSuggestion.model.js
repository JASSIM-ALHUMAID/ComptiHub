import mongoose from 'mongoose'

export const suggestionStatuses = ['pending', 'approved', 'rejected']

const competitionSuggestionSchema = new mongoose.Schema(
  {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    resourceLink: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    proposedSchedule: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    hardwareTier: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    budget: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    status: {
      type: String,
      enum: suggestionStatuses,
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

competitionSuggestionSchema.index({ status: 1, createdAt: -1 })

export const CompetitionSuggestion =
  mongoose.models.CompetitionSuggestion || mongoose.model('CompetitionSuggestion', competitionSuggestionSchema)

