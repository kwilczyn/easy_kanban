import apiClient from '@/api/apiClient.js'
import listApi from '@/api/list.js'
import taskApi from '@/api/task.js'
import authApi from '@/api/auth.js'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mutations, getters, actions } from './store'
import store from './store.js'

// mock API client
vi.mock('@/api/task.js', () => {
  return {
    default: {
      fetchTasks: vi.fn(),
      createTask: vi.fn(),
      deleteTask: vi.fn(),
      editTask: vi.fn(),
      patchTask: vi.fn()
    }
  }
})

vi.mock('@/api/list.js', () => {
  return {
    default: {
      fetchLists: vi.fn(),
      createList: vi.fn(),
      deleteList: vi.fn(),
      moveListForward: vi.fn(),
      moveListBackward: vi.fn()
    }
  }
})

vi.mock('@/api/auth.js', () => {
  return {
    default: {
      registerUser: vi.fn(),
      loginUser: vi.fn()
    }
  }
})

const initialState = {
  registrationSuccessful: null,
  boardNames: ['My Simple Kanban Board'],
  boards: [
    { id: 1, title: 'My Simple Kanban Board', users: [1] },
    { id: 2, title: 'My Simple Kanban Board 2', users: [1] }
  ],
  activeBoard: {
    id: 1,
    title: 'My Simple Kanban Board',
    lists: [
      {
        id: 1,
        title: 'To Do',
        tasks: [
          { id: 1, title: 'Task 1', description: 'This is a task description.', position: 0 },
          {
            id: 4,
            title: 'Task 4',
            description: 'This is the fourth task description.',
            position: 4
          }
        ]
      },
      {
        id: 4,
        title: 'In Progress',
        tasks: [
          {
            id: 2,
            title: 'Task 2',
            description: 'This is the second task description.',
            position: 5
          }
        ]
      },
      {
        id: 18,
        title: 'Done',
        tasks: [
          {
            id: 3,
            title: 'Task 3',
            description: 'This is the third task description.',
            position: 6
          }
        ]
      }
    ]
  }
}
let state

describe('mutations', () => {
  beforeEach(() => {
    state = structuredClone(initialState)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  it('setRegistrationSuccessful', () => {
    const { setRegistrationSuccessful } = mutations
    setRegistrationSuccessful(state, true)
    expect(state.registrationSuccessful).toBe(true)
  })

  it('setCsrfToken', () => {
    const { setCsrftoken } = mutations
    setCsrftoken(state, { csrfToken: 'token' })
    expect(state.csrfToken).toBe('token')
  })

  it('setBoards', () => {
    const { setBoards } = mutations
    setBoards(state, ['Board 1', 'Board 2'])
    expect(state.boards).toEqual(['Board 1', 'Board 2'])
  })

  it('setActiveBoard', () => {
    const { setActiveBoard } = mutations
    setActiveBoard(state, { title: 'New Board' })
    expect(state.activeBoard.title).toBe('New Board')
  })

  it('mountListData', () => {
    const { mountListData } = mutations
    mountListData(state, { id: 10, title: 'Done' })
    expect(state.activeBoard.lists[2].id).toBe(10)
    expect(state.activeBoard.lists[2].title).toBe('Done')
  })

  it('mountListData does not mount list if title is missing', () => {
    const { mountListData } = mutations
    expect(() => mountListData(state, { id: 10 })).toThrow()
  })

  it('mountTaskData', () => {
    const { mountTaskData } = mutations
    state.activeBoard.lists[0].tasks[2] = { title: 'New created task' }
    mountTaskData(state, { id: 10 })
    expect(state.activeBoard.lists[0].tasks[2].id).toBe(10)
  })

  it('mountTaskData does not mount task if id is missing', () => {
    const { mountTaskData } = mutations
    expect(() => mountTaskData(state, {})).toThrow()
  })

  it('addList', () => {
    const { addList } = mutations
    addList(state, { title: 'New List' })
    expect(state.activeBoard.lists.length).toBe(4)
  })

  it('removeList', () => {
    const { removeList } = mutations
    listApi.deleteList.mockResolvedValueOnce({})
    removeList(state, { title: 'In Progress' })
    expect(state.activeBoard.lists.length).toBe(2)
  })

  it('removeTask', () => {
    const { removeTask } = mutations
    removeTask(state, { listTitle: 'To Do', taskId: 1 })
    expect(state.activeBoard.lists[0].tasks.length).toBe(1)
    expect(state.activeBoard.lists[0].tasks[0].id).toBe(4)
  })

  it('addTask', () => {
    const { addTask } = mutations
    addTask(state, { listTitle: 'To Do', title: 'New Task', description: 'This is a new task.' })
    expect(state.activeBoard.lists[0].tasks.length).toBe(3)
  })

  it('updateTask', () => {
    const { updateTask } = mutations
    updateTask(state, {
      listTitle: 'To Do',
      taskId: 1,
      title: 'Updated Task',
      description: 'This is an updated task.'
    })
    expect(state.activeBoard.lists[0].tasks[0].title).toBe('Updated Task')
    expect(state.activeBoard.lists[0].tasks[0].description).toBe('This is an updated task.')
  })

  it('moveTask', () => {
    const { moveTask } = mutations
    moveTask(state, { from: 1, to: 4, taskId: 1 })
    expect(state.activeBoard.lists[0].tasks.length).toBe(1)
    expect(state.activeBoard.lists[1].tasks.length).toBe(2)
  })

  it('moveTaskAbove', () => {
    const { moveTaskAbove } = mutations
    moveTaskAbove(state, { taskId: 2, targetTaskId: 1 })
    expect(state.activeBoard.lists[0].tasks[0].id).toBe(2)
    expect(state.activeBoard.lists[0].tasks[1].id).toBe(1)
    expect(state.activeBoard.lists[1].tasks.length).toBe(0)
  })

  it('moveListBackward', () => {
    const { moveListBackward } = mutations
    listApi.moveListBackward.mockResolvedValueOnce({})
    moveListBackward(state, { listTitle: 'In Progress' })
    expect(state.activeBoard.lists[0].title).toBe('In Progress')
  })

  it('moveListForward', () => {
    const { moveListForward } = mutations
    listApi.moveListForward.mockResolvedValueOnce({})
    moveListForward(state, { listTitle: 'In Progress' })
    expect(state.activeBoard.lists[2].title).toBe('In Progress')
  })

  it('setCommunicationError', () => {
    const { setCommunicationError } = mutations
    setCommunicationError(state, new Error('Communication error'))
    expect(state.communicationError.message).toBe('Communication error')
  })

  it('setLoadingBoar', () => {
    const { setLoadingBoard } = mutations
    setLoadingBoard(state, true)
    expect(state.loadingBoard).toBe(true)
  })

  it('setWaitingForRegistration', () => {
    const { setWaitingForRegistration } = mutations
    setWaitingForRegistration(state, true)
    expect(state.waitingForRegistration).toBe(true)
  })

  it('setWaitingForLogin', () => {
    const { setWaitingForLogin } = mutations
    setWaitingForLogin(state, true)
    expect(state.waitingForLogin).toBe(true)
  })
})

describe('getters', () => {
  beforeEach(() => {
    state = structuredClone(initialState)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  it('getBoardNames', () => {
    const { getBoardNames } = getters
    const boardNames = getBoardNames(state)
    expect(boardNames).toEqual(['My Simple Kanban Board', 'My Simple Kanban Board 2'])
  })

  it('getActiveBoard', () => {
    const { getActiveBoard } = getters
    const activeBoard = getActiveBoard(state)
    expect(activeBoard.title).toBe('My Simple Kanban Board')
  })

  it('getListTitles', () => {
    const { getListTitles } = getters
    const listTitles = getListTitles(state)
    expect(listTitles).toEqual(['To Do', 'In Progress', 'Done'])
  })

  it('getListByTitle', () => {
    const { getListByTitle } = getters
    const list = getListByTitle(state)('In Progress')
    expect(list.id).toBe(4)
  })

  it('getTaskTitles', () => {
    const { getTaskTitles } = getters
    const taskTitles = getTaskTitles(state)('To Do')
    expect(taskTitles).toEqual(['Task 1', 'Task 4'])
  })

  it('getTaskPosition', () => {
    const { getTaskPosition } = getters
    const taskPosition = getTaskPosition(state)(1)
    expect(taskPosition).toBe(0)
  })
})

describe('actions', () => {
  let context

  beforeEach(() => {
    state = structuredClone(initialState)
    let computedGetters = {}
    Object.keys(getters).forEach((key) => {
      Object.defineProperty(computedGetters, key, {
        get: () => getters[key](state)
      })
    })
    context = {
      state,
      commit: vi.fn(),
      dispatch: vi.fn(),
      getters: computedGetters
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  it('registerUser throws error when any required field is missing', async () => {
    const requiredFields = ['username', 'password', 'password_confirm', 'email']
    for (const field of requiredFields) {
      const payload = {
        username: 'testuser',
        password: 'password123',
        password_confirm: 'password123',
        email: 'test@example.com'
      }
      delete payload[field]

      await expect(actions.registerUser(context, payload)).rejects.toThrow(
        'username, password, password_confirm, email are required'
      )
    }
  })

  it('registerUser throws error when payload is undefined', async () => {
    await expect(actions.registerUser(context, undefined)).rejects.toThrow()
  })

  it('registerUser sets registrationSuccessful to true when registration succeds', async () => {
    const payload = {
      username: 'testuser',
      password: 'password123',
      password_confirm: 'password123',
      email: 'test@example.com'
    }
    authApi.registerUser.mockResolvedValueOnce({})
    await actions.registerUser(context, payload)
    expect(context.commit).toHaveBeenCalledWith('setWaitingForRegistration', true)
    expect(context.commit).toHaveBeenCalledWith('setRegistrationSuccessful', true)
    expect(context.commit).toHaveBeenCalledWith('setWaitingForRegistration', false)
  })

  it('registerUser does not set registrationSuccessful when registration fails', async () => {
    const payload = {
      username: 'testuser',
      password: 'password123',
      password_confirm: 'password123',
      email: 'test@example.com'
    }
    const error = new Error('Registration failed')
    authApi.registerUser.mockRejectedValueOnce(error)

    await actions.registerUser(context, payload)

    expect(context.commit).not.toHaveBeenCalledWith('setRegistrationSuccessful', true)
    expect(context.commit).toHaveBeenCalledWith('setWaitingForRegistration', false)
  })

  it('loginUser throws error when any required field is missing', async () => {
    const requiredFields = ['username', 'password']
    for (const field of requiredFields) {
      const payload = {
        username: 'testuser',
        password: 'password123'
      }
      delete payload[field]

      await expect(actions.loginUser(context, payload)).rejects.toThrow(
        'username, password are required'
      )
    }
  })

  it('loginUser throws error when payload is undefined', async () => {
    await expect(actions.loginUser(context, undefined)).rejects.toThrow()
  })

  it('loginUser sets waitingForLogin to true before sending api request', async () => {
    const payload = {
      username: 'testuser',
      password: 'password123'
    }
    authApi.loginUser.mockResolvedValueOnce({})
    await actions.loginUser(context, payload)
    expect(context.commit.mock.calls[0]).toEqual(['setWaitingForLogin', true])
    expect(context.commit.mock.calls.slice(-1)[0]).toEqual(['setWaitingForLogin', false])
  })

  it('loginUser sets waitingForLogin to false when login fails', async () => {
    const payload = {
      username: 'testuser',
      password: 'password123'
    }
    const error = new Error('Login failed')
    authApi.loginUser.mockRejectedValueOnce(error)
    await actions.loginUser(context, payload)
    expect(context.commit.mock.calls.slice(-1)[0]).toEqual(['setWaitingForLogin', false])
  })

  it('loginUser sets loginError when login fails with response code 401', async () => {
    const payload = {
      username: 'testuser',
      password: 'password123'
    }
    const error = new Error('Login failed')
    error.response = { status: 401, data: { detail: 'Unauthorized' } }
    authApi.loginUser.mockRejectedValueOnce(error)
    await actions.loginUser(context, payload)
    expect(context.commit).toHaveBeenCalledWith('setLoginError', 'Unauthorized')
  })

  describe('fetchBoard', () => {
    it('sets loadingBoard to true before sending api request', async () => {
      listApi.fetchLists.mockResolvedValueOnce({})
      await actions.fetchBoard(context, { boardId: 1 })
      expect(context.commit.mock.calls[0]).toEqual(['setLoadingBoard', true])
      expect(context.commit.mock.calls.slice(-1)[0]).toEqual(['setLoadingBoard', false])
    })

    it('sets loadingBoard to false when fetch fails', async () => {
      const error = new Error('Fetch failed')
      listApi.fetchLists.mockRejectedValueOnce(error)
      await actions.fetchBoard(context, { boardId: 1 })
      expect(context.commit.mock.calls.slice(-1)[0]).toEqual(['setLoadingBoard', false])
    })
  })

  it('addList', async () => {
    const { addList } = actions
    listApi.createList.mockResolvedValueOnce({ data: { id: 10, title: 'New List' } })
    await addList(context, { title: 'New List' })
    expect(listApi.createList).toHaveBeenCalledWith({ boardId: 1, listData: { title: 'New List' } })
    expect(context.commit).toHaveBeenCalledWith('addList', { title: 'New List' })
    expect(context.commit).toHaveBeenCalledWith('mountListData', { id: 10, title: 'New List' })
  })

  it('does not add list if title is missing', () => {
    const { addList } = actions
    expect(() => addList(context, {})).toThrow()
  })

  it('removeList', async () => {
    const { removeList } = actions
    listApi.deleteList.mockResolvedValueOnce({})
    await removeList(context, { id: 4, title: 'In Progress' })
    expect(context.commit).toHaveBeenCalledWith('removeList', { id: 4, title: 'In Progress' })
    expect(listApi.deleteList).toHaveBeenCalledWith({ boardId: 1, listId: 4 })
  })

  it('does not remove list if title is missing', () => {
    const { removeList } = actions
    expect(() => removeList(context, {})).toThrow()
  })

  it('removeTask', async () => {
    const { removeTask } = actions
    taskApi.deleteTask.mockResolvedValueOnce({})
    await removeTask(context, { listId: 1, listTitle: 'To Do', taskId: 1 })
    expect(context.commit).toHaveBeenCalledWith('removeTask', {
      listId: 1,
      listTitle: 'To Do',
      taskId: 1
    })
    expect(taskApi.deleteTask).toHaveBeenCalledWith({ boardId: 1, listId: 1, taskId: 1 })
  })

  it('does not remove task if listTitle is missing', () => {
    const { removeTask } = actions
    expect(() => removeTask(context, { taskId: 1 })).toThrow()
  })

  it('does not remove task if taskId is missing', () => {
    const { removeTask } = actions
    expect(() => removeTask(context, { listTitle: 'To Do' })).toThrow()
  })

  it('addTask', async () => {
    const { addTask } = actions
    taskApi.createTask.mockResolvedValueOnce({
      data: {
        id: 10,
        title: 'New Task',
        description: 'This is a new task.'
      }
    })
    await addTask(context, {
      listTitle: 'To Do',
      listId: 1,
      title: 'New Task',
      description: 'This is a new task.'
    })
    expect(context.commit).toHaveBeenCalledWith('addTask', {
      listTitle: 'To Do',
      listId: 1,
      title: 'New Task',
      description: 'This is a new task.'
    })
    expect(context.commit).toHaveBeenCalledWith('mountTaskData', { id: 10 })
  })

  it('updateTask', async () => {
    const { updateTask } = actions
    taskApi.patchTask.mockResolvedValueOnce({})
    await updateTask(context, {
      listId: 1,
      listTitle: 'To Do',
      taskId: 1,
      title: 'Updated Task',
      description: 'This is an updated task.'
    })
    expect(context.commit).toHaveBeenCalledWith('updateTask', {
      listId: 1,
      listTitle: 'To Do',
      taskId: 1,
      title: 'Updated Task',
      description: 'This is an updated task.'
    })
    expect(taskApi.patchTask).toHaveBeenCalledWith({
      boardId: 1,
      listId: 1,
      taskId: 1,
      taskData: {
        listId: 1,
        listTitle: 'To Do',
        title: 'Updated Task',
        description: 'This is an updated task.',
        taskId: 1
      }
    })
  })

  it('does not update task if listTitle is missing', () => {
    const { updateTask } = actions
    expect(() =>
      updateTask(context, {
        taskId: 1,
        title: 'Updated Task',
        description: 'This is an updated task.'
      })
    ).toThrow()
  })

  it('does not update task if taskId is missing', () => {
    const { updateTask } = actions
    expect(() =>
      updateTask(context, {
        listTitle: 'To Do',
        title: 'Updated Task',
        description: 'This is an updated task.'
      })
    ).toThrow()
  })

  it('moveTask', async () => {
    const { moveTask } = actions
    taskApi.patchTask.mockResolvedValueOnce({})
    await moveTask(context, { from: 1, to: 2, taskId: 1 })
    expect(context.commit).toHaveBeenCalledWith('moveTask', {
      from: 1,
      to: 2,
      taskId: 1
    })
    expect(taskApi.patchTask).toHaveBeenCalledWith({
      boardId: 1,
      listId: 1,
      taskId: 1,
      taskData: { list: 2 }
    })
  })

  it('moveTask does not move task if from is missing', () => {
    const { moveTask } = actions
    expect(() => moveTask(context, { to: 'In Progress', taskId: 1 })).toThrow()
  })

  it('moveTask does not move task if to is missing', () => {
    const { moveTask } = actions
    expect(() => moveTask(context, { from: 'To Do', taskId: 1 })).toThrow()
  })

  it('moveTask does not move task if taskId is missing', () => {
    const { moveTask } = actions
    expect(() => moveTask(context, { from: 'To Do', to: 'In Progress' })).toThrow()
  })

  it('moveTaskAbove', async () => {
    const { moveTaskAbove } = actions
    taskApi.patchTask.mockResolvedValueOnce({})
    await moveTaskAbove(context, { listId: 1, taskId: 2, targetTaskId: 1 })
    expect(context.commit).toHaveBeenCalledWith('moveTaskAbove', {
      taskId: 2,
      targetTaskId: 1
    })
    expect(taskApi.patchTask).toHaveBeenCalledWith({
      boardId: 1,
      listId: 1,
      taskId: 2,
      taskData: { position: 0, list: 1 }
    })
  })

  it('moveTaskAbove does not move task if taskId is missing', () => {
    const { moveTaskAbove } = actions
    expect(() => moveTaskAbove(context, { targetTaskId: 1 })).toThrow()
  })

  it('moveTaskAbove does not move task if targetTaskId is missing', () => {
    const { moveTaskAbove } = actions
    expect(() => moveTaskAbove(context, { taskId: 2 })).toThrow()
  })

  it('moveListBackward', async () => {
    const { moveListBackward } = actions
    listApi.moveListBackward.mockResolvedValueOnce({})
    await moveListBackward(context, { listTitle: 'In Progress', id: 2 })
    expect(context.commit).toHaveBeenCalledWith('moveListBackward', {
      id: 2,
      listTitle: 'In Progress'
    })
    expect(listApi.moveListBackward).toHaveBeenCalledWith({ boardId: 1, listId: 2 })
  })

  it('moveListBackward does not move list if listTitle is missing', () => {
    const { moveListBackward } = actions
    expect(() => moveListBackward(context, {})).toThrow()
  })

  it('moveListBackward does not move list for the leftmost list', () => {
    const { moveListBackward } = actions
    moveListBackward(context, { id: 1, listTitle: 'To Do' })
    expect(context.commit).not.toHaveBeenCalled()
  })

  it('moveListForward', async () => {
    const { moveListForward } = actions
    listApi.moveListForward.mockResolvedValueOnce({})
    await moveListForward(context, { id: 2, listTitle: 'In Progress' })
    expect(context.commit).toHaveBeenCalledWith('moveListForward', {
      id: 2,
      listTitle: 'In Progress'
    })
    expect(listApi.moveListForward).toHaveBeenCalledWith({ boardId: 1, listId: 2 })
  })

  it('moveListForward does not move list if listTitle is missing', () => {
    const { moveListForward } = actions
    expect(() => moveListForward(context, {})).toThrow()
  })

  it('moveListForward does not move list for the rightmost list', () => {
    const { moveListForward } = actions
    moveListForward(context, { id: 3, listTitle: 'Done' })
    expect(context.commit).not.toHaveBeenCalled()
  })
})

describe('apiClient response interceptor', () => {
  it('should have a response interceptor', () => {
    expect(apiClient.interceptors.response.handlers.length).toBe(1)
  })

  it('should retry the request with a refreshed token on 401 error', async () => {
    const originalRequest = { url: '/api/test/', method: 'get', headers: {} }
    const error = {
      config: originalRequest,
      response: { status: 401 }
    }
    localStorage.setItem('refreshToken', 'testRefreshToken')
    const refreshTokenPost = vi
      .spyOn(apiClient, 'post')
      .mockResolvedValue({ data: { access: 'refreshedAccessToken' } })
    const retriedRequest = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: 'testData' })

    await apiClient.interceptors.response.handlers[0].rejected(error)
    expect(refreshTokenPost).toHaveBeenCalledWith('/api/token/refresh/', {
      refresh: 'testRefreshToken'
    })
    expect(retriedRequest).toHaveBeenCalledWith({
      ...originalRequest,
      headers: { Authorization: 'Bearer refreshedAccessToken' }
    })
  })

  it('should log out the user on 401 error if the refresh token is not available', async () => {
    const originalRequest = { url: '/api/test/', method: 'get', headers: {} }
    const error = {
      config: originalRequest,
      response: { status: 401 }
    }
    localStorage.removeItem('refreshToken')
    const logoutUser = vi.spyOn(store, 'dispatch')
    await apiClient.interceptors.response.handlers[0].rejected(error)
    expect(logoutUser).toHaveBeenCalledWith('logoutUser')
  })

  it('should log out the user on 401 error if the refresh token is expired', async () => {
    const originalRequest = { url: '/api/test/', method: 'get', headers: {} }
    const error = {
      config: originalRequest,
      response: { status: 401 }
    }
    localStorage.setItem('refreshToken', 'testRefreshToken')
    const refreshTokenPost = vi
      .spyOn(apiClient, 'post')
      .mockRejectedValue({ response: { data: 'testError' } })
    const logoutUser = vi.spyOn(store, 'dispatch')
    await apiClient.interceptors.response.handlers[0].rejected(error)
    expect(refreshTokenPost).toHaveBeenCalledWith('/api/token/refresh/', {
      refresh: 'testRefreshToken'
    })
    expect(logoutUser).toHaveBeenCalledWith('logoutUser')
  })

  it('should not retry refresh token request on 401 error', async () => {
    const originalRequest = { url: '/api/token/refresh/', method: 'post', headers: {} }
    const error = {
      config: originalRequest,
      response: { status: 401 }
    }
    const refreshTokenPost = vi
      .spyOn(apiClient, 'post')
      .mockResolvedValue({ data: { access: 'refreshedAccessToken' } })
    const retriedRequest = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: 'testData' })

    await apiClient.interceptors.response.handlers[0].rejected(error)
    expect(refreshTokenPost).not.toHaveBeenCalled()
    expect(retriedRequest).not.toHaveBeenCalled()
  })
})
