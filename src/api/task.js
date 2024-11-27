import apiClient from './apiClient'
import { validateParams } from '@/api/apiClient.js'

export default {
  fetchTasks({ boardId, listId }) {
    validateParams({ boardId, listId })
    return apiClient.get(`api/board/${boardId}/list/${listId}/task/`)
  },
  createTask({ boardId, listId, taskData }) {
    validateParams({ boardId, listId, taskData })
    return apiClient.post(`api/board/${boardId}/list/${listId}/task/`, taskData)
  },
  deleteTask({ boardId, listId, taskId }) {
    validateParams({ boardId, listId, taskId })
    return apiClient.delete(`api/board/${boardId}/list/${listId}/task/${taskId}/`)
  },
  editTask({ boardId, listId, taskId, taskData }) {
    validateParams({ boardId, listId, taskId, taskData })
    return apiClient.put(`api/board/${boardId}/list/${listId}/task/${taskId}/`, taskData)
  },
  patchTask({ boardId, listId, taskId, taskData }) {
    validateParams({ boardId, listId, taskId, taskData })
    return apiClient.patch(`api/board/${boardId}/list/${listId}/task/${taskId}/`, taskData)
  }
}
