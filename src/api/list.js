import apiClient from './apiClient'
import { validateParams } from '@/api/apiClient.js'

export default {
  fetchLists({ boardId }) {
    validateParams({ boardId })
    return apiClient.get(`api/board/${boardId}/list/`)
  },
  createList({ boardId, listData }) {
    validateParams({ boardId, listData })
    return apiClient.post(`api/board/${boardId}/list/`, listData)
  },
  deleteList({ boardId, listId }) {
    validateParams({ boardId, listId })
    return apiClient.delete(`api/board/${boardId}/list/${listId}/`)
  },
  moveListForward({ boardId, listId }) {
    validateParams({ boardId, listId })
    return apiClient.patch(`api/board/${boardId}/list/${listId}/forward/`)
  },
  moveListBackward({ boardId, listId }) {
    validateParams({ boardId, listId })
    return apiClient.patch(`api/board/${boardId}/list/${listId}/backward/`)
  }
}
