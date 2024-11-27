import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiClient, { validateParams } from '@/api/apiClient.js'
import list from '@/api/list'

vi.mock('@/api/apiClient.js', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn()
    },
    validateParams: vi.fn()
  }
})

describe('list', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  describe('fetchLists', () => {
    it('should validate parameters and call apiClient.get with correct URL', () => {
      const boardId = '456'
      list.fetchLists({ boardId })
      expect(validateParams).toHaveBeenCalledWith({ boardId })
      expect(apiClient.get).toHaveBeenCalledWith(`api/board/${boardId}/list/`)
    })
  })

  describe('createList', () => {
    it('should validate parameters and call apiClient.post with correct data', () => {
      const boardId = '123'
      const listData = { name: 'New List' }
      list.createList({ boardId, listData })
      expect(validateParams).toHaveBeenCalledWith({ boardId, listData })
      expect(apiClient.post).toHaveBeenCalledWith(`api/board/${boardId}/list/`, listData)
    })
  })

  describe('deleteList', () => {
    it('should validate parameters and call apiClient.delete with correct URL', () => {
      const boardId = '123'
      const listId = '789'
      list.deleteList({ boardId, listId })
      expect(validateParams).toHaveBeenCalledWith({ boardId, listId })
      expect(apiClient.delete).toHaveBeenCalledWith(`api/board/${boardId}/list/${listId}/`)
    })
  })

  describe('moveListForward', () => {
    it('should validate parameters and call apiClient.patch with correct URL', () => {
      const boardId = '123'
      const listId = '456'
      list.moveListForward({ boardId, listId })
      expect(validateParams).toHaveBeenCalledWith({ boardId, listId })
      expect(apiClient.patch).toHaveBeenCalledWith(`api/board/${boardId}/list/${listId}/forward/`)
    })
  })

  describe('moveListBackward', () => {
    it('should validate parameters and call apiClient.patch with correct URL', () => {
      const boardId = '123'
      const listId = '456'
      list.moveListBackward({ boardId, listId })
      expect(validateParams).toHaveBeenCalledWith({ boardId, listId })
      expect(apiClient.patch).toHaveBeenCalledWith(`api/board/${boardId}/list/${listId}/backward/`)
    })
  })
})
