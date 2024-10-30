import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiClient, { validateParams } from '@/api/apiClient.js'
import board from '@/api/board'

vi.mock('@/api/apiClient.js', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn()
    },
    validateParams: vi.fn()
  }
})

describe('board', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  describe('fetchBoards', () => {
    it('should call apiClient.get with appropriate parameters', () => {
      const users__id = '123'
      board.fetchBoards({ users__id })
      expect(apiClient.get).toHaveBeenCalledWith('api/board/', { params: { users__id: users__id } })
    })
  })

  describe('fetchBoard', () => {
    it('should validate parameters and call apiClient.get with correct URL', () => {
      const boardId = '456'
      board.fetchBoard({ boardId })
      expect(validateParams).toHaveBeenCalledWith({ boardId })
      expect(apiClient.get).toHaveBeenCalledWith(`api/board/${boardId}`)
    })
  })

  describe('createBoard', () => {
    it('should validate parameters and call apiClient.post with correct data', () => {
      const boardData = { name: 'New Board' }
      board.createBoard({ boardData })
      expect(validateParams).toHaveBeenCalledWith({ boardData })
      expect(apiClient.post).toHaveBeenCalledWith('api/board', boardData)
    })
  })

  describe('deleteBoard', () => {
    it('should validate parameters and call apiClient.delete with correct URL', () => {
      const boardId = '789'
      board.deleteBoard({ boardId })
      expect(validateParams).toHaveBeenCalledWith({ boardId })
      expect(apiClient.delete).toHaveBeenCalledWith(`api/board/${boardId}`)
    })
  })
})
