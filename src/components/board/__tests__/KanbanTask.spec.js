import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import KanbanTask from '@/components/board/KanbanTask.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDropdown from '@/components/base/BaseDropdown.vue'
import { createStore } from 'vuex'
import ClickOutsideDirective from '@/directives/ClickOutsideDirective.js'

const mockStore = createStore({
  getters: {
    getListTitles: () => ['To Do', 'In Progress', 'Done']
  }
})

describe('KanbanTask', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(KanbanTask, {
      global: {
        components: { BaseButton, BaseDropdown },
        plugins: [mockStore]
      },
      props: {
        task: {
          id: 1,
          title: 'Task 1',
          description: 'This is a task description.'
        }
      },
      directives: {
        'click-outside': ClickOutsideDirective
      }
    })
  })

  it('renders title properly', () => {
    expect(wrapper.text()).toContain('Task 1')
  })
  it('renders description properly', () => {
    expect(wrapper.text()).toContain('This is a task description.')
  })
  it('renders dropdown properly', async () => {
    await wrapper.findComponent(BaseButton).trigger('click')
    expect(wrapper.findComponent(BaseDropdown).exists()).toBe(true)
  })
  it('emits an event when the delete button is clicked', async () => {
    await wrapper.findComponent(BaseButton).trigger('click')
    await wrapper.find('[customtype="delete"]').trigger('click')
    expect(wrapper.emitted('removeTask')).toBeTruthy()
  })
  it('close dropdown when clicked outside', async () => {
    await wrapper.findComponent(BaseButton).trigger('click')
    await document.body.click()
    expect(wrapper.findComponent(BaseDropdown).exists()).toBe(false)
  })
  it('close dropdown when clicked on close button', async () => {
    const burger = await wrapper.findComponent(BaseButton)
    await burger.trigger('click')
    await burger.trigger('click')
    expect(wrapper.findComponent(BaseDropdown).exists()).toBe(false)
  })
})