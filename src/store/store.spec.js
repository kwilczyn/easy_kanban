import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mutations, getters, actions } from './store'

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
    moveTask(state, { from: 'To Do', to: 'In Progress', taskId: 1 })
    expect(state.activeBoard.lists[0].tasks.length).toBe(1)
    expect(state.activeBoard.lists[1].tasks.length).toBe(2)
  })

  it('moveTaskAbove', () => {
    const { moveTaskAbove } = mutations
    moveTaskAbove(state, { taskId: 2, targetTaskId: 1 })
    expect(state.activeBoard.lists[0].tasks[0].id).toBe(2)
    expect(state.activeBoard.lists[0].tasks[1].id).toBe(1)
    console.log(state.activeBoard.lists)
    expect(state.activeBoard.lists[1].tasks.length).toBe(0)
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

describe('actions', () => {
  let context

  beforeEach(() => {
    state = structuredClone(initialState)
    context = {
      state,
      commit: vi.fn(),
      dispatch: vi.fn()
    }
  })

  it('addList', () => {
    const { addList } = actions
    addList(context, { title: 'New List' })
    expect(context.commit).toHaveBeenCalledWith('addList', { title: 'New List' })
  })

  it('does not add list if title is missing', () => {
    const { addList } = actions
    expect(() => addList(context, {})).toThrow()
  })

  it('removeList', () => {
    const { removeList } = actions
    removeList(context, { title: 'In Progress' })
    expect(context.commit).toHaveBeenCalledWith('removeList', { title: 'In Progress' })
  })

  it('does not remove list if title is missing', () => {
    const { removeList } = actions
    expect(() => removeList(context, {})).toThrow()
  })

  it('removeTask', () => {
    const { removeTask } = actions
    removeTask(context, { listTitle: 'To Do', taskId: 1 })
    expect(context.commit).toHaveBeenCalledWith('removeTask', { listTitle: 'To Do', taskId: 1 })
  })

  it('does not remove task if listTitle is missing', () => {
    const { removeTask } = actions
    expect(() => removeTask(context, { taskId: 1 })).toThrow()
  })

  it('does not remove task if taskId is missing', () => {
    const { removeTask } = actions
    expect(() => removeTask(context, { listTitle: 'To Do' })).toThrow()
  })

  it('addTask', () => {
    const { addTask } = actions
    addTask(context, { listTitle: 'To Do', title: 'New Task', description: 'This is a new task.' })
    expect(context.commit).toHaveBeenCalledWith('addTask', {
      listTitle: 'To Do',
      title: 'New Task',
      description: 'This is a new task.'
    })
  })

  it('updateTask', () => {
    const { updateTask } = actions
    updateTask(context, {
      listTitle: 'To Do',
      taskId: 1,
      title: 'Updated Task',
      description: 'This is an updated task.'
    })
    expect(context.commit).toHaveBeenCalledWith('updateTask', {
      listTitle: 'To Do',
      taskId: 1,
      title: 'Updated Task',
      description: 'This is an updated task.'
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

  it('moveTask', () => {
    const { moveTask } = actions
    moveTask(context, { from: 'To Do', to: 'In Progress', taskId: 1 })
    expect(context.commit).toHaveBeenCalledWith('moveTask', {
      from: 'To Do',
      to: 'In Progress',
      taskId: 1
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

  it('moveTaskAbove', () => {
    const { moveTaskAbove } = actions
    moveTaskAbove(context, { taskId: 2, targetTaskId: 1 })
    expect(context.commit).toHaveBeenCalledWith('moveTaskAbove', { taskId: 2, targetTaskId: 1 })
  })

  it('moveTaskAbove does not move task if taskId is missing', () => {
    const { moveTaskAbove } = actions
    expect(() => moveTaskAbove(context, { targetTaskId: 1 })).toThrow()
  })

  it('moveTaskAbove does not move task if targetTaskId is missing', () => {
    const { moveTaskAbove } = actions
    expect(() => moveTaskAbove(context, { taskId: 2 })).toThrow()
  })
})
