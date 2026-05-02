import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

function normalizeTeam(team) {
  const members = (team.members ?? []).map((member) => ({
    ...member,
    skills: member.skills ?? [],
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
    const data = await apiClient(endpoints.teams.listMine, {
      token: authService.getToken(),
    })
    return data.teams.map(normalizeTeam)
  },

  async getTeamById(id) {
    const data = await apiClient(endpoints.teams.byId(id), {
      token: authService.getToken(),
    })
    return normalizeTeam(data.team)
  },

  async listCompetitionTeams(competitionId) {
    const data = await apiClient(endpoints.competitions.teamsById(competitionId))
    return data.teams.map(normalizeTeam)
  },

  async createLeaveRequest(teamId) {
    const data = await apiClient(endpoints.teams.leaveRequests(teamId), {
      method: 'POST',
      token: authService.getToken(),
    })
    return normalizeLeaveRequest(data.leaveRequest)
  },

  async listIncomingLeaveRequests() {
    const data = await apiClient(endpoints.teams.incomingLeaveRequests, {
      token: authService.getToken(),
    })
    return data.leaveRequests.map(normalizeLeaveRequest)
  },

  async reviewLeaveRequest(id, status) {
    const data = await apiClient(endpoints.leaveRequests.review(id), {
      method: 'PATCH',
      body: { status },
      token: authService.getToken(),
    })
    return normalizeLeaveRequest(data.leaveRequest)
  },
}
