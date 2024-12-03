import apiClient from '@/api/apiClient.js'
import { validateParams } from '@/api/apiClient.js'

export default {
  fetchBoards() {
    return apiClient.get('api/board/', {
      params: {}
    })
  },

  fetchBoard({ boardId }) {
    validateParams({ boardId })
    return apiClient.get(`api/board/${boardId}/`)
  },
  createBoard({ boardData }) {
    validateParams({ boardData })
    return apiClient.post('api/board/', boardData)
  },
  deleteBoard({ boardId }) {
    validateParams({ boardId })
    return apiClient.delete(`api/board/${boardId}/`)
  }
}
