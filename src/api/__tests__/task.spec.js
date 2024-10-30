import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiClient, { validateParams } from '@/api/apiClient.js'
import task from '@/api/task'

vi.mock('@/api/apiClient.js', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
      put: vi.fn(),
      patch: vi.fn()
    },
    validateParams: vi.fn()
  }
})

describe('task', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  describe('fetchTasks', () => {
    it('should validate parameters and call apiClient.get with correct URL', () => {
      const boardId = '123'
      const listId = '456'
      task.fetchTasks({ boardId, listId })
      expect(validateParams).toHaveBeenCalledWith({ boardId, listId })
      expect(apiClient.get).toHaveBeenCalledWith(`api/board/${boardId}/list/${listId}/task/`)
    })
  })

  describe('createTask', () => {
    it('should validate parameters and call apiClient.post with correct URL and data', () => {
      const boardId = '123'
      const listId = '456'
      const taskData = { name: 'New Task' }
      task.createTask({ boardId, listId, taskData })
      expect(validateParams).toHaveBeenCalledWith({ boardId, listId, taskData })
      expect(apiClient.post).toHaveBeenCalledWith(
        `api/board/${boardId}/list/${listId}/task/`,
        taskData
      )
    })
  })

  describe('deleteTask', () => {
    it('should validate parameters and call apiClient.delete with correct URL', () => {
      const boardId = '123'
      const listId = '456'
      const taskId = '789'
      task.deleteTask({ boardId, listId, taskId })
      expect(validateParams).toHaveBeenCalledWith({ boardId, listId, taskId })
      expect(apiClient.delete).toHaveBeenCalledWith(
        `api/board/${boardId}/list/${listId}/task/${taskId}/`
      )
    })
  })

  describe('editTask', () => {
    it('should validate parameters and call apiClient.put with correct URL and data', () => {
      const boardId = '123'
      const listId = '456'
      const taskId = '789'
      const taskData = { name: 'Updated Task' }
      task.editTask({ boardId, listId, taskId, taskData })
      expect(validateParams).toHaveBeenCalledWith({ boardId, listId, taskId, taskData })
      expect(apiClient.put).toHaveBeenCalledWith(
        `api/board/${boardId}/list/${listId}/task/${taskId}/`,
        taskData
      )
    })
  })

  describe('patchTask', () => {
    it('should validate parameters and call apiClient.patch with correct URL and data', () => {
      const boardId = '123'
      const listId = '456'
      const taskId = '789'
      const taskData = { status: 'Completed' }
      task.patchTask({ boardId, listId, taskId, taskData })
      expect(validateParams).toHaveBeenCalledWith({ boardId, listId, taskId, taskData })
      expect(apiClient.patch).toHaveBeenCalledWith(
        `api/board/${boardId}/list/${listId}/task/${taskId}/`,
        taskData
      )
    })
  })
})
