import { describe, it, expect, beforeEach, vi } from 'vitest'

import { mount, shallowMount } from '@vue/test-utils'
import KanbanTask from '@/components/board/KanbanTask.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import KanbanList from '@/components/board/KanbanList.vue'
import BaseDropdown from '@/components/base/BaseDropdown.vue'
import TaskForm from '@/components/forms/TaskForm.vue'
import BaseFormRow from '@/components/base/BaseFormRow.vue'
import { createStore } from 'vuex'
import ClickOutsideDirective from '@/directives/ClickOutsideDirective.js'

const mockStore = createStore({
  getters: {
    getListTitles: () => ['To Do', 'In Progress', 'Done'],
    getTaskTitles: () => (listTitle) => ['Task 1', 'Task 2']
  },
  actions: {
    removeTask: vi.fn(),
    addTask: vi.fn(),
    moveTask: vi.fn(),
    updateTask: vi.fn()
  }
})

describe('KanbanList', () => {
  let wrapper

  wrapper = mount(KanbanList, {
    global: {
      components: { KanbanTask, BaseButton, BaseDropdown, BaseModal, TaskForm, BaseFormRow },
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

  it('opens the modal when the add task button is clicked', async () => {
    await wrapper.find('button[customType="add"]').trigger('click')
    expect(wrapper.findComponent(BaseModal).exists()).toBe(true)
  })

  it('activates addTask action from the store when the addTask event is emmited', async () => {
    vi.spyOn(mockStore, 'dispatch')
    await wrapper.find('button[customType="add"]').trigger('click')
    await wrapper.findComponent(TaskForm).vm.$emit('submitAddTask', {
      taskId: '',
      title: 'New Task',
      description: 'This is a new task.'
    })
    expect(mockStore.dispatch).toHaveBeenCalledWith('addTask', {
      listTitle: 'My List',
      taskId: '',
      title: 'New Task',
      description: 'This is a new task.'
    })
  })

  it('activates updateTask action from the store when the editTask event is emmited', async () => {
    vi.spyOn(mockStore, 'dispatch')
    await wrapper.findComponent(KanbanTask).vm.$emit('openEditModal', {
      id: 1,
      title: 'Task 1',
      description: 'This is a task description.'
    })
    await wrapper.findComponent(TaskForm).vm.$emit('submitAddTask', {
      taskId: 1,
      title: 'Edited Task',
      description: 'This is the edited task.'
    })
    expect(mockStore.dispatch).toHaveBeenCalledWith('updateTask', {
      listTitle: 'My List',
      taskId: 1,
      title: 'Edited Task',
      description: 'This is the edited task.'
    })
  })

  it('activates moveTask action from the store when the moveTask event is emmited', async () => {
    vi.spyOn(mockStore, 'dispatch')
    await wrapper.findComponent(KanbanTask).vm.$emit('moveTask', {
      taskId: 1,
      to: 'Done'
    })
    expect(mockStore.dispatch).toHaveBeenCalledWith('moveTask', {
      from: 'My List',
      to: 'Done',
      taskId: 1
    })
  })

  it('does not activate moveTask action from the store if to is equal to from', async () => {
    vi.spyOn(mockStore, 'dispatch')
    await wrapper.findComponent(KanbanTask).vm.$emit('moveTask', {
      taskId: 1,
      to: 'My List'
    })
    expect(mockStore.dispatch).not.toHaveBeenCalled()
  })

  it('does not show left arrow if the list is the first list', async () => {
    wrapper = shallowMount(KanbanList, {
      global: {
        plugins: [mockStore],
        components: { BaseButton },
        stubs: { BaseModal: true, TaskForm: true }
      },
      props: {
        title: 'My List',
        tasks: [],
        first: true
      }
    })
    expect(wrapper.find('[aria-roledescription="Move list backward"]').exists()).toBe(false)
  })

  it('does not show right arrow if the list is the last list', async () => {
    wrapper = shallowMount(KanbanList, {
      global: {
        plugins: [mockStore],
        components: { BaseButton },
        stubs: { BaseModal: true, TaskForm: true }
      },
      plugins: [mockStore],

      props: {
        title: 'My List',
        tasks: [],
        last: true
      }
    })
    expect(wrapper.find('[aria-roledescription="Move list forward"]').exists()).toBe(false)
  })
})
