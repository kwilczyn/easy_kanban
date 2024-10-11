import { describe, it, expect, beforeEach, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import KanbanBoard from '@/components/board/KanbanBoard.vue'
import KanbanTask from '@/components/board/KanbanTask.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import KanbanList from '@/components/board/KanbanList.vue'
import BaseDropdown from '@/components/base/BaseDropdown.vue'
import TaskForm from '@/components/forms/TaskForm.vue'
import ClickOutsideDirective from '@/directives/ClickOutsideDirective.js'

import { createStore } from 'vuex'

const mockStore = createStore({
  getters: {
    getListTitles: () => ['To Do', 'In Progress', 'Done']
  },
  actions: {
    moveTaskAbove: vi.fn(),
    moveTask: vi.fn()
  }
})

describe('KanbanBoard', () => {
  let wrapper
  let data = {}
  const dataTransfer = {
    setData: (key, value) => (data[key] = value),
    getData: (key) => data[key]
  }

  beforeEach(() => {
    data = {}
    wrapper = mount(KanbanBoard, {
      global: {
        components: { KanbanList, BaseButton, BaseDropdown, BaseModal, TaskForm },
        plugins: [mockStore],
        directives: {
          'click-outside': ClickOutsideDirective
        }
      },
      props: {
        lists: [
          {
            title: 'To Do',
            tasks: [
              {
                id: 1,
                title: 'Task 1',
                description: 'This is a task description.'
              },
              {
                id: 2,
                title: 'Task 2',
                description: 'This is a task 2 description.'
              }
            ]
          },
          {
            title: 'In Progress',
            tasks: [
              {
                id: 3,
                title: 'Task 3',
                description: 'This is a task 3 description.'
              }
            ]
          },
          {
            title: 'Done',
            tasks: [
              {
                id: 4,
                title: 'Task 4',
                description: 'This is a task 4 description.'
              }
            ]
          }
        ]
      }
    })
  })
  it('activates moveTaskAbove action from the store when the drop event is triggered on one of the tasks', async () => {
    vi.spyOn(mockStore, 'dispatch')
    await wrapper.find('.kanban-task[id="1"]').trigger('dragstart', { dataTransfer })
    await wrapper.find('.kanban-task[id="3"]').trigger('drop', { dataTransfer })
    expect(mockStore.dispatch).toHaveBeenCalledWith('moveTaskAbove', {
      taskId: 1,
      targetTaskId: 3
    })
  })

  it('activates moveTask action from the store when the drop event is triggered on a lists', async () => {
    vi.spyOn(mockStore, 'dispatch')
    await wrapper.find('.kanban-task[id="1"]').trigger('dragstart', { dataTransfer })
    await wrapper.find('.kanban-list:nth-of-type(3)').trigger('drop', { dataTransfer })
    expect(mockStore.dispatch).toHaveBeenCalledWith('moveTask', {
      from: 'To Do',
      to: 'Done',
      taskId: 1
    })
  })
})
