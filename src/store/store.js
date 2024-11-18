import { createStore } from 'vuex'
import apiClient from '@/api/apiClient.js'
import boardsApi from '@/api/board.js'
import listApi from '@/api/list.js'
import csrfApi from '@/api/csrf.js'
import taskApi from '@/api/task.js'
import authApi from '@/api/auth.js'
import router from '@/router'
import actionCanceler from '@/store/plugins/actionCanceler.js'
import mutationCanceler from '@/store/plugins/mutationCanceler.js'

export const mutations = {
  setRegistrationSuccessful(state, payload) {
    state.registrationSuccessful = payload
  },

  setToken(state, payload) {
    localStorage.setItem('token', payload.access)
    localStorage.setItem('refreshToken', payload.refresh)
    state.token = payload.access
    state.refreshToken = payload.refresh
    apiClient.defaults.headers['Authorization'] = `Bearer ${state.token}`
  },

  removeToken(state) {
    state.token = null
    state.refreshToken = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    delete apiClient.defaults.headers['Authorization']
  },

  setLoginError(state, payload) {
    state.loginError = payload
  },

  resetLoginError(state) {
    state.loginError = false
  },

  setCsrftoken(state, payload) {
    state.csrfToken = payload.csrfToken
  },
  setBoards(state, payload) {
    state.boards = payload
  },

  setActiveBoard(state, payload) {
    state.activeBoard = payload
  },

  addList(state, payload) {
    const list = {
      title: payload.title,
      tasks: []
    }
    state.activeBoard.lists.push(list)
  },
  mountListData(state, payload) {
    const list = state.activeBoard.lists.find((list) => list.title === payload.title)
    if (!list) throw new Error('List not found')
    list.id = payload.id
  },
  removeList(state, payload) {
    state.activeBoard.lists = state.activeBoard.lists.filter((list) => list.title !== payload.title)
  },
  addTask(state, payload) {
    const list = state.activeBoard.lists.find((list) => list.title === payload.listTitle)
    list.tasks.push({
      title: payload.title,
      description: payload.description
    })
  },
  mountTaskData(state, payload) {
    const task = state.activeBoard.lists.flatMap((list) => list.tasks).find((task) => !task.id)
    if (!task) throw new Error('Task not found')
    task.id = payload.id
  },
  updateTask(state, payload) {
    const oldTaskIndex = state.activeBoard.lists
      .find((list) => list.title === payload.listTitle)
      .tasks.findIndex((task) => task.id === payload.taskId)
    state.activeBoard.lists.find((list) => list.title === payload.listTitle).tasks[oldTaskIndex] = {
      id: payload.taskId,
      title: payload.title,
      description: payload.description
    }
  },
  removeTask(state, { listTitle, taskId }) {
    const list = state.activeBoard.lists.find((list) => list.title === listTitle)
    list.tasks = list.tasks.filter((task) => task.id !== taskId)
  },
  moveTask(state, { from, to, taskId }) {
    const fromList = state.activeBoard.lists.find((list) => list.id === from)
    const toList = state.activeBoard.lists.find((list) => list.id === to)
    const task = fromList.tasks.find((task) => task.id === taskId)
    fromList.tasks = fromList.tasks.filter((task) => task.id !== taskId)
    toList.tasks.push(task)
  },
  moveTaskAbove(state, { taskId, targetTaskId }) {
    taskId = Number(taskId)
    targetTaskId = Number(targetTaskId)
    const tasks = state.activeBoard.lists.flatMap((list) => list.tasks)
    const task = tasks.find((task) => task.id === taskId)
    const targetTask = tasks.find((task) => task.id === targetTaskId)
    const targetList = state.activeBoard.lists.find((list) => list.tasks.includes(targetTask))
    const list = state.activeBoard.lists.find((list) => list.tasks.includes(task))
    list.tasks = list.tasks.filter((task) => task.id !== taskId)
    const targetIndex = targetList.tasks.findIndex((task) => task.id === targetTaskId)
    targetList.tasks.splice(targetIndex, 0, task)
  },
  moveListBackward(state, { listTitle }) {
    const listIndex = state.activeBoard.lists.findIndex((list) => list.title === listTitle)
    const list = state.activeBoard.lists[listIndex]
    state.activeBoard.lists[listIndex] = state.activeBoard.lists[listIndex - 1]
    state.activeBoard.lists[listIndex - 1] = list
  },
  moveListForward(state, { listTitle }) {
    const listIndex = state.activeBoard.lists.findIndex((list) => list.title === listTitle)
    const list = state.activeBoard.lists[listIndex]
    state.activeBoard.lists[listIndex] = state.activeBoard.lists[listIndex + 1]
    state.activeBoard.lists[listIndex + 1] = list
  },
  setCommunicationError(state, payload) {
    state.communicationError = payload
  },
  setLoadingBoard(state, payload) {
    state.loadingBoard = payload
  },
  setWaitingForRegistration(state, payload) {
    state.waitingForRegistration = payload
  },
  setWaitingForLogin(state, payload) {
    state.waitingForLogin = payload
  }
}

export const getters = {
  getBoardNames(state) {
    return state.boards.map((board) => board.title)
  },
  getActiveBoard(state) {
    return state.activeBoard
  },
  getListTitles(state) {
    return state.activeBoard.lists.map((list) => list.title)
  },
  getListByTitle: (state) => (listTitle) => {
    return state.activeBoard.lists.find((list) => list.title === listTitle)
  },
  getTaskTitles: (state) => (listTitle) => {
    const list = state.activeBoard.lists.find((list) => list.title === listTitle)
    return list.tasks.map((task) => task.title)
  },
  getTaskPosition: (state) => (taskId) => {
    const task = state.activeBoard.lists
      .flatMap((list) => list.tasks)
      .find((task) => task.id === taskId)
    if (task === undefined) throw new Error('Task not found')
    return task.position
  }
}

export const actions = {
  async registerUser(context, payload) {
    if (!payload.username || !payload.password || !payload.password_confirm || !payload.email) {
      throw new Error('username, password, password_confirm, email are required')
    }
    try {
      context.commit('setWaitingForRegistration', true)
      await authApi.registerUser(payload)
      context.commit('setRegistrationSuccessful', true)
      context.commit('setWaitingForRegistration', false)
    } catch (error) {
      context.commit('setWaitingForRegistration', false)
      console.error('Error registering user', error)
    }
  },

  async tryToLogin(context) {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    if (token) {
      context.commit('setToken', { access: token, refresh: refreshToken })
      await context.dispatch('fetchBoards')
      if (context.state.boards.length > 0) {
        await context.dispatch('fetchBoard', { boardId: context.state.boards[0].id })
      }
    }
  },

  logoutUser(context) {
    context.commit('removeToken')
    context.commit('setBoards', [])
    context.commit('setActiveBoard', {})
    router.push({ name: 'auth' })
  },

  async loginUser(context, payload) {
    if (!payload.username || !payload.password) {
      throw new Error('username, password are required')
    }
    try {
      context.commit('setWaitingForLogin', true)
      const response = await authApi.loginUser(payload)
      context.commit('setToken', response.data)
      context.dispatch('fetchBoards')
      router.push({ name: 'home' })
      context.commit('setLoginError', false)
      context.commit('setWaitingForLogin', false)
    } catch (error) {
      context.commit('setWaitingForLogin', false)
      if (error.response && error.response.status === 401) {
        context.commit('setLoginError', error.response.data.detail)
      } else {
        console.error('Error logging in user', error)
      }
    }
  },

  async fetchCsrfToken(context) {
    try {
      const token = await csrfApi.getCsrfToken()
      context.commit('setCsrftoken', token.data)
      apiClient.defaults.headers['X-CSRFToken'] = context.state.csrfToken
    } catch (error) {
      console.error('Error fetching CSRF token', error)
    }
  },

  async fetchBoards(context) {
    try {
      const boards = await boardsApi.fetchBoards()
      context.commit('setBoards', boards.data)
    } catch (error) {
      console.error('Error fetching boards', error)
    }
  },

  async fetchBoard(context, { boardId }) {
    context.commit('setLoadingBoard', true)
    try {
      const board = await boardsApi.fetchBoard({ boardId })
      context.commit('setActiveBoard', board.data)
      context.commit('setLoadingBoard', false)
    } catch (error) {
      console.error('Error fetching board', error)
      context.commit('setLoadingBoard', false)
    }
  },

  addList(context, payload) {
    if (!payload.title) {
      throw new Error('title is required')
    }
    context.commit('addList', payload)

    return listApi
      .createList({
        boardId: context.getters.getActiveBoard.id,
        listData: { title: payload.title }
      })
      .then((response) => {
        context.commit('mountListData', { title: payload.title, id: response.data.id })
      })
      .catch((error) => {
        console.error('Error adding list', error)
      })
  },

  removeList(context, payload) {
    if (!payload.title || !payload.id) {
      throw new Error('title, id are required')
    }
    context.commit('removeList', payload)
    return listApi
      .deleteList({ boardId: context.getters.getActiveBoard.id, listId: payload.id })
      .catch((error) => {
        console.error('Error removing list', error.message)
      })
  },

  removeTask(context, payload) {
    if (!payload.listTitle || !payload.taskId) {
      throw new Error('listTitle, taskId, are required')
    }
    context.commit('removeTask', payload)

    return taskApi
      .deleteTask({
        boardId: context.getters.getActiveBoard.id,
        listId: payload.listId,
        taskId: payload.taskId
      })
      .catch((error) => {
        console.error('Error removing task', error)
      })
  },

  addTask(context, payload) {
    if (!payload.listTitle || !payload.title || !payload.listId) {
      throw new Error('listTitle, title, listId are required')
    }

    context.commit('addTask', payload)

    return taskApi
      .createTask({
        boardId: context.getters.getActiveBoard.id,
        listId: payload.listId,
        taskData: {
          title: payload.title,
          description: payload.description
        }
      })
      .then((response) => {
        context.commit('mountTaskData', { id: response.data.id })
      })
      .catch((error) => {
        console.error('Error adding task', error)
      })
  },

  updateTask(context, payload) {
    if (!payload.listTitle || !payload.taskId || !payload.listId) {
      throw new Error('listTitle, taskId, listId are required')
    }
    context.commit('updateTask', payload)

    return taskApi
      .patchTask({
        boardId: context.getters.getActiveBoard.id,
        listId: payload.listId,
        taskId: payload.taskId,
        taskData: payload
      })
      .catch((error) => {
        console.error('Error updating task', error)
      })
  },

  moveTask(context, payload) {
    if (!payload.from || !payload.to || !payload.taskId) {
      throw new Error('from, to, taskId are required')
    }
    context.commit('moveTask', payload)

    return taskApi
      .patchTask({
        boardId: context.getters.getActiveBoard.id,
        listId: payload.from,
        taskId: payload.taskId,
        taskData: {
          list: payload.to
        }
      })
      .catch((error) => {
        console.error('Error moving task', error)
      })
  },

  moveTaskAbove(context, { listId, taskId, targetTaskId }) {
    if (!taskId || !targetTaskId) {
      throw new Error('taskId, targetTaskId are required')
    }
    const targetPosition = context.getters.getTaskPosition(targetTaskId)
    const targetList = context.getters.getActiveBoard.lists.find((list) =>
      list.tasks.find((task) => task.id === targetTaskId)
    )
    const taskData = {
      list: targetList.id,
      position: targetPosition
    }

    context.commit('moveTaskAbove', { taskId, targetTaskId })

    return taskApi
      .patchTask({ boardId: context.getters.getActiveBoard.id, listId, taskId, taskData })
      .catch((error) => {
        console.error('Error moving task above', error)
      })
  },

  moveListBackward(context, payload) {
    if (!payload.listTitle || !payload.id) {
      throw new Error('listTitle, id are required')
    }
    // do not move the first list
    if (context.getters.getListTitles[0] === payload.listTitle) return
    context.commit('moveListBackward', payload)

    return listApi
      .moveListBackward({ boardId: context.getters.getActiveBoard.id, listId: payload.id })
      .catch((error) => {
        console.error('Error moving list backward', error)
      })
  },
  moveListForward(context, payload) {
    if (!payload.listTitle || !payload.id) {
      throw new Error('listTitle, id are required')
    }
    // do not move the last list
    if (
      context.getters.getListTitles[context.getters.getListTitles.length - 1] === payload.listTitle
    )
      return
    context.commit('moveListForward', payload)

    return listApi
      .moveListForward({ boardId: context.getters.getActiveBoard.id, listId: payload.id })
      .catch((error) => {
        console.error('Error moving list forward', error)
      })
  },

  resetCommunicationError(context) {
    context.commit('setCommunicationError', null)
  }
}

const store = createStore({
  state() {
    return {
      csrfToken: null,
      token: null,
      refreshToken: null,
      registrationSuccessful: null,
      loginError: false,
      boards: [],
      activeBoard: {},
      loadingBoard: false,
      waitingForRegistration: false,
      waitingForLogin: false
    }
  },
  getters,
  mutations,
  actions,
  plugins: [actionCanceler, mutationCanceler]
})

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (originalRequest.url == '/api/token/') {
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Try refreshing token
        if (
          !localStorage.getItem('refreshToken') ||
          originalRequest.url.includes('/api/token/refresh/')
        ) {
          logoutAndSetError()
          return
        }
        const response = await apiClient.post('/api/token/refresh/', {
          refresh: localStorage.getItem('refreshToken')
        })
        store.commit('setToken', {
          access: response.data.access,
          refresh: localStorage.getItem('refreshToken')
        })

        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access

        return apiClient.request(originalRequest)
      } catch (err) {
        if (err.response) {
          logoutAndSetError()
          return
        }
        return Promise.reject(error)
      }
    } else {
      store.commit('setCommunicationError', error)
      return Promise.reject(error)
    }
  }
)

function logoutAndSetError() {
  console.warn('User session has expired. Logging out...')
  store.commit('setLoginError', 'Sorry but user session has expired. Please log in again.')
  store.dispatch('logoutUser')
}

export default store
