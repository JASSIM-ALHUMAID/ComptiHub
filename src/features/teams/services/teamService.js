import { teams as mockTeams } from '../../../data/mocks/teams'
import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'
import { getUserSkills } from '../../../data/mocks/skills'

let mockTeamCollection = mockTeams.map((team) => ({
  ...team,
  members: team.members.map((member) => ({
    ...member,
    skills: getUserSkills(member.id),
  })),
}))

let mockLeaveRequests = []

function getSession() {
  return authService.getSession()
}

function isApiSession() {
  return getSession()?.source === 'api'
}

function normalizeTeam(team) {
  const members = (team.members ?? []).map((member) => ({
    ...member,
    skills: member.skills ?? getUserSkills(member.id),
  }))

  return {
    ...team,
    id: team.id ?? team._id,
    _id: team._id ?? team.id,
    members,
    memberIds: team.memberIds ?? members.map((member) => member.id),
    openSlots: team.openSlots ?? Math.max(0, team.totalSlots - members.length),
  }
}

function normalizeLeaveRequest(leaveRequest) {
  return {
    ...leaveRequest,
    id: leaveRequest.id ?? leaveRequest._id,
    _id: leaveRequest._id ?? leaveRequest.id,
  }
}

export const teamService = {
  async createTeam(form) {
    if (!isApiSession()) {
      const user = getSession()
      const team = normalizeTeam({
        id: `team-${Date.now()}`,
        name: form.name.trim(),
        competitionId: form.competitionId,
        competitionTitle: '',
        leaderId: user.id,
        leaderName: user.username,
        description: form.description.trim(),
        requiredSkills: form.requiredSkills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        totalSlots: Number(form.totalSlots),
        members: [
          {
            id: user.id,
            username: user.username,
            role: 'Team Leader',
            skills: getUserSkills(user.id),
          },
        ],
        status: Number(form.totalSlots) === 1 ? 'full' : 'recruiting',
      })
      mockTeamCollection = [team, ...mockTeamCollection]
      return team
    }

    const data = await apiClient(endpoints.teams.create, {
      method: 'POST',
      body: {
        name: form.name.trim(),
        competitionId: form.competitionId,
        description: form.description.trim(),
        totalSlots: Number(form.totalSlots),
        requiredSkills: form.requiredSkills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
      },
      token: authService.getToken(),
    })

    return normalizeTeam(data.team)
  },

  async listMyTeams() {
    if (!isApiSession()) {
      const user = getSession()
      return mockTeamCollection.filter((team) => team.members.some((member) => member.id === user?.id))
    }

    const data = await apiClient(endpoints.teams.listMine, {
      token: authService.getToken(),
    })
    return data.teams.map(normalizeTeam)
  },

  async getTeamById(id) {
    if (!isApiSession()) {
      const team = mockTeamCollection.find((item) => item.id === id)
      return team ? normalizeTeam(team) : null
    }

    const data = await apiClient(endpoints.teams.byId(id), {
      token: authService.getToken(),
    })
    return normalizeTeam(data.team)
  },

  async listCompetitionTeams(competitionId) {
    if (!isApiSession()) {
      return mockTeamCollection
        .filter((team) => team.competitionId === competitionId && team.status === 'recruiting')
        .map(normalizeTeam)
    }

    const data = await apiClient(endpoints.competitions.teamsById(competitionId))
    return data.teams.map(normalizeTeam)
  },

  async createLeaveRequest(teamId) {
    if (!isApiSession()) {
      const user = getSession()
      const team = mockTeamCollection.find((item) => item.id === teamId)
      const leaveRequest = normalizeLeaveRequest({
        id: `leave-${Date.now()}`,
        teamId,
        competitionId: team?.competitionId ?? '',
        requesterId: user.id,
        requesterName: user.username,
        teamName: team?.name ?? 'Unknown Team',
        status: 'pending',
        createdAt: new Date().toISOString(),
      })
      mockLeaveRequests = [leaveRequest, ...mockLeaveRequests]
      return leaveRequest
    }

    const data = await apiClient(endpoints.teams.leaveRequests(teamId), {
      method: 'POST',
      token: authService.getToken(),
    })
    return normalizeLeaveRequest(data.leaveRequest)
  },

  async listIncomingLeaveRequests() {
    if (!isApiSession()) {
      const user = getSession()
      return mockLeaveRequests.filter((request) => {
        const team = mockTeamCollection.find((item) => item.id === request.teamId)
        return team?.leaderId === user?.id
      })
    }

    const data = await apiClient(endpoints.teams.incomingLeaveRequests, {
      token: authService.getToken(),
    })
    return data.leaveRequests.map(normalizeLeaveRequest)
  },

  async reviewLeaveRequest(id, status) {
    if (!isApiSession()) {
      const request = mockLeaveRequests.find((item) => item.id === id)
      if (request) {
        request.status = status
        request.reviewedAt = new Date().toISOString()
      }

      if (status === 'approved' && request) {
        mockTeamCollection = mockTeamCollection.map((team) => {
          if (team.id !== request.teamId) {
            return team
          }

          const members = team.members.filter((member) => member.id !== request.requesterId)
          return normalizeTeam({
            ...team,
            members,
            status: members.length >= team.totalSlots ? 'full' : 'recruiting',
          })
        })
      }

      return normalizeLeaveRequest(request)
    }

    const data = await apiClient(endpoints.leaveRequests.review(id), {
      method: 'PATCH',
      body: { status },
      token: authService.getToken(),
    })
    return normalizeLeaveRequest(data.leaveRequest)
  },
}
