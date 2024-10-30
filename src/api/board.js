import apiClient from '@/api/apiClient.js'
import { validateParams } from '@/api/apiClient.js'

export default {
  fetchBoards({ users__id }) {
    validateParams({ users__id })
    return apiClient.get('api/board/', {
      params: {
        users__id: users__id
      }
    })
  },

  fetchBoard({ boardId }) {
    validateParams({ boardId })
    return apiClient.get(`api/board/${boardId}`)
  },
  createBoard({ boardData }) {
    validateParams({ boardData })
    return apiClient.post('api/board', boardData)
  },
  deleteBoard({ boardId }) {
    validateParams({ boardId })
    return apiClient.delete(`api/board/${boardId}`)
  }
}
