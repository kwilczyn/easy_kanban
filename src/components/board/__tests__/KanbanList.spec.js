import { describe, it, expect, beforeEach, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import KanbanTask from '@/components/board/KanbanTask.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import KanbanList from '@/components/board/KanbanList.vue'
import BaseDropdown from '@/components/base/BaseDropdown.vue'
import { createStore } from 'vuex'
import ClickOutsideDirective from '@/directives/ClickOutsideDirective.js'

const mockStore = createStore({
  getters: {
    getListTitles: () => ['To Do', 'In Progress', 'Done']
  },
  actions: {
    removeTask: vi.fn()
  }
})

describe('KanbanList', () => {
  let wrapper

  wrapper = mount(KanbanList, {
    global: {
      components: { KanbanTask, BaseButton, BaseDropdown, BaseModal },
      plugins: [mockStore],
      directives: {
        'click-outside': ClickOutsideDirective
      }
    },
    props: {
      title: 'My List',
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
    }
  })
  it('renders title properly', () => {
    expect(wrapper.text()).toContain('My List')
  })

  it('renders tasks properly', () => {
    expect(wrapper.text()).toContain('Task 1')
    expect(wrapper.text()).toContain('Task 2')
  })

  it('emits an event when the delete button is clicked', async () => {
    await wrapper.findComponent(BaseButton).trigger('click')
    expect(wrapper.emitted('removeList')).toBeTruthy()
  })

  it('activates removeTask action from the store when the removeTask event is emmited', async () => {
    vi.spyOn(mockStore, 'dispatch')
    await wrapper.findComponent(KanbanTask).vm.$emit('removeTask', { taskId: 1 })
    expect(mockStore.dispatch).toHaveBeenCalledWith('removeTask', {
      listTitle: 'My List',
      taskId: 1
    })
  })
})
