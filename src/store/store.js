import { createStore } from 'vuex'

export const mutations = {
  addList(state, payload) {
    const list = {
      title: payload.title,
      tasks: []
    }
    state.activeBoard.lists.push(list)
  },
  removeList(state, payload) {
    state.activeBoard.lists = state.activeBoard.lists.filter((list) => list.title !== payload.title)
  },
  addTask(state, payload) {
    const list = state.activeBoard.lists.find((list) => list.title === payload.listTitle)
    list.tasks.push({
      id: Math.floor(Math.random() * 1000),
      title: payload.title,
      description: payload.description
    })
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
  removeTask(state, payload) {
    const list = state.activeBoard.lists.find((list) => list.title === payload.listTitle)
    list.tasks = list.tasks.filter((task) => task.id !== payload.taskId)
  },
  moveTask(state, payload) {
    const fromList = state.activeBoard.lists.find((list) => list.title === payload.from)
    const toList = state.activeBoard.lists.find((list) => list.title === payload.to)
    const task = fromList.tasks.find((task) => task.id === payload.taskId)
    fromList.tasks = fromList.tasks.filter((task) => task.id !== payload.taskId)
    toList.tasks.push(task)
  },
  moveTaskAbove(state, { taskId, targetTaskId }) {
    taskId = Number(taskId)
    targetTaskId = Number(targetTaskId)
    const task = state.activeBoard.lists
      .flatMap((list) => list.tasks)
      .find((task) => task.id === taskId)
    const targetTask = state.activeBoard.lists
      .flatMap((list) => list.tasks)
      .find((task) => task.id === targetTaskId)
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
  }
}

export const getters = {
  getBoarNames(state) {
    return state.boardNames
  },
  getActiveBoard(state) {
    return state.activeBoard
  },
  getListTitles(state) {
    return state.activeBoard.lists.map((list) => list.title)
  },
  getTaskTitles: (state) => (listTitle) => {
    const list = state.activeBoard.lists.find((list) => list.title === listTitle)
    return list.tasks.map((task) => task.title)
  }
}

export const actions = {
  addList(context, payload) {
    if (!payload.title) {
      throw new Error('title is required')
    }
    context.commit('addList', payload)
  },
  removeList(context, payload) {
    if (!payload.title) {
      throw new Error('title is required')
    }
    context.commit('removeList', payload)
  },
  removeTask(context, payload) {
    if (!payload.listTitle || !payload.taskId) {
      throw new Error('listTitle, taskId, are required')
    }
    context.commit('removeTask', payload)
  },
  addTask(context, payload) {
    context.commit('addTask', payload)
  },
  updateTask(context, payload) {
    if (!payload.listTitle || !payload.taskId) {
      throw new Error('listTitle, taskId, are required')
    }
    context.commit('updateTask', payload)
  },
  moveTask(context, payload) {
    if (!payload.from || !payload.to || !payload.taskId) {
      throw new Error('from, to, taskId are required')
    }
    context.commit('moveTask', payload)
  },
  moveTaskAbove(context, { taskId, targetTaskId }) {
    if (!taskId || !targetTaskId) {
      throw new Error('taskId, targetTaskId are required')
    }
    context.commit('moveTaskAbove', { taskId, targetTaskId })
  },
  moveListBackward(context, payload) {
    if (!payload.listTitle) {
      throw new Error('listTitle is required')
    }
    // do not move the first list
    if (context.getters.getListTitles[0] === payload.listTitle) return
    context.commit('moveListBackward', payload)
  },
  moveListForward(context, payload) {
    if (!payload.listTitle) {
      throw new Error('listTitle is required')
    }
    // do not move the last list
    if (
      context.getters.getListTitles[context.getters.getListTitles.length - 1] === payload.listTitle
    )
      return
    context.commit('moveListForward', payload)
  }
}

const store = createStore({
  state() {
    return {
      boardNames: ['My Simple Kanban Board'],
      activeBoard: {
        id: 1,
        title: 'My Simple Kanban Board',
        lists: [
          {
            title: 'To Do',
            tasks: [
              { id: 1, title: 'Task 1', description: 'This is a task description.' },
              { id: 4, title: 'Task 4', description: 'This is the fourth task description.' }
            ]
          },
          {
            title: 'In Progress',
            tasks: [{ id: 2, title: 'Task 2', description: 'This is the second task description.' }]
          },
          {
            title: 'Done',
            tasks: [{ id: 3, title: 'Task 3', description: 'This is the third task description.' }]
          }
        ]
      }
    }
  },
  getters,
  mutations,
  actions
})

export default store
