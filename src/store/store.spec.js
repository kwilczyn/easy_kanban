import { describe, it, expect, beforeEach } from 'vitest'
import { mutations, getters } from './store'

const initialState = {
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
let state

describe('mutations', () => {
  beforeEach(() => {
    state = structuredClone(initialState)
  })

  it('addList', () => {
    const { addList } = mutations
    addList(state, { title: 'New List' })
    expect(state.activeBoard.lists.length).toBe(4)
  })

  it('removeList', () => {
    const { removeList } = mutations
    removeList(state, { title: 'In Progress' })
    expect(state.activeBoard.lists.length).toBe(2)
  })

  it('removeTask', () => {
    const { removeTask } = mutations
    removeTask(state, { listTitle: 'To Do', taskId: 1 })
    expect(state.activeBoard.lists[0].tasks.length).toBe(1)
    expect(state.activeBoard.lists[0].tasks[0].id).toBe(4)
  })
})

describe('getters', () => {
  beforeEach(() => {
    state = structuredClone(initialState)
  })

  it('getTaskTitles', () => {
    const { getTaskTitles } = getters
    const taskTitles = getTaskTitles(state)('To Do')
    expect(taskTitles).toEqual(['Task 1', 'Task 4'])
  })
})
