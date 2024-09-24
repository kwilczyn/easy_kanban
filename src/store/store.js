import { createStore } from 'vuex'

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
  getters: {
    getBoarNames(state) {
      return state.boardNames
    },
    getActiveBoard(state) {
      return state.activeBoard
    }
  },
  mutations: {
    addList(state, payload) {
      const list = {
        title: payload.title,
        tasks: []
      }
      state.activeBoard.lists.push(list)
    },
    removeList(state, payload) {
      state.activeBoard.lists = state.activeBoard.lists.filter(
        (list) => list.title !== payload.title
      )
    }
  },
  actions: {
    addList(context, payload) {
      context.commit('addList', payload)
    },
    removeList(context, payload) {
      context.commit('removeList', payload)
    }
  }
})

export default store
