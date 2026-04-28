import mongoose from 'mongoose'

const competitorProfileSchema = new mongoose.Schema(
  {
    focus: { type: String, trim: true, default: '' },
    preferredRole: { type: String, trim: true, default: '' },
    strengths: { type: String, trim: true, default: '' },
    availability: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '' },
  },
  { _id: false },
)

const teamLeaderProfileSchema = new mongoose.Schema(
  {
    focus: { type: String, trim: true, default: '' },
    preferredTeamSetup: { type: String, trim: true, default: '' },
    strengths: { type: String, trim: true, default: '' },
    availability: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '' },
  },
  { _id: false },
)

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    university: { type: String, trim: true, default: '' },
    major: { type: String, trim: true, default: '' },
    year: { type: String, trim: true, default: '' },
    competitor: {
      type: competitorProfileSchema,
      default: () => ({}),
    },
    teamLeader: {
      type: teamLeaderProfileSchema,
      default: () => ({}),
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
)

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema)
