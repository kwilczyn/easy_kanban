import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'

import TaskForm from '@/components/forms/TaskForm.vue'
import BaseFormRow from '@/components/base/BaseFormRow.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseFormLabel from '@/components/base/BaseFormLabel.vue'

describe('AddTaskForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TaskForm, {
      global: {
        components: { BaseFormRow, BaseButton, BaseFormLabel }
      },
      props: { existingTaskTitles: ['Task 1', 'Task 2'] }
    })
  })

  it('renders properly', () => {
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Description')
    expect(wrapper.text()).toContain('Add Task')
  })

  it('emits an event with the task name when the form is submitted', async () => {
    await wrapper.find('input[name="title"]').setValue('My Task')
    await wrapper.find('textarea[name="description"]').setValue('This is a task description.')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('submitAddTask')[0][0]).toEqual({
      taskId: '',
      title: 'My Task',
      description: 'This is a task description.'
    })
  })

  it('displays an error message if the task name is empty', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Title is required')
  })

  it('displays an error message if the task name is too long', async () => {
    await wrapper.find('input[name="title"]').setValue('a'.repeat(51))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Title must be at most 50 characters')
  })

  it('displays an error message if the task name is too short', async () => {
    await wrapper.find('input[name="title"]').setValue('a')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Title must be at least 3 characters')
  })

  it('displays an error message if the task name is already taken', async () => {
    await wrapper.find('input[name="title"]').setValue('Task 1')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Title is already in use')
  })

  it('displays an error message if the task description is too long', async () => {
    await wrapper.find('input[name="title"]').setValue('My Task')
    await wrapper.find('textarea[name="description"]').setValue('a'.repeat(501))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Description must be at most 500 characters')
  })

  it("doesn't submit a task if the form is invalid", async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('submitAddTask')).toBeUndefined()
  })

  it('renders data from the existing task when editing', () => {
    wrapper = mount(TaskForm, {
      global: {
        components: { BaseFormRow, BaseButton, BaseFormLabel }
      },
      props: {
        existingTaskTitles: ['Task 1', 'Task 2'],
        task: { id: 99, title: 'Task 1', description: 'This is a task description.' }
      }
    })
    expect(wrapper.find('input[name="title"]').element.value).toBe('Task 1')
    expect(wrapper.find('textarea[name="description"]').element.value).toBe(
      'This is a task description.'
    )
  })
})
