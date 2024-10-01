import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import AddListForm from '@/components/forms/AddListForm.vue'
import BaseFormRow from '@/components/base/BaseFormRow.vue'
import BaseFormLabel from '@/components/base/BaseFormLabel.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { createStore } from 'vuex'

const mockStore = createStore({
  getters: {
    getListTitles: () => ['To Do', 'In Progress', 'Done']
  }
})

describe('AddListForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(AddListForm, {
      global: {
        components: { BaseFormRow, BaseFormLabel, BaseButton },
        plugins: [mockStore]
      }
    })
  })

  it('renders properly', () => {
    expect(wrapper.text()).toContain('Add List')
  })

  it('emits an event with the list name when the form is submitted', async () => {
    await wrapper.find('input[name="title"]').setValue('My List')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('submitAddList')[0][0]).toEqual({ title: 'My List' })
  })

  it('displays an error message if the list name is empty', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Title is required')
  })

  it('displays an error message if the list name is already taken', async () => {
    await wrapper.find('input[name="title"]').setValue('To Do')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Title is already in use')
  })

  it('displays an error message if the list name is too long', async () => {
    await wrapper.find('input[name="title"]').setValue('a'.repeat(21))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Title must be at most 20 characters')
  })

  it('displays an error message if the list name is too short', async () => {
    await wrapper.find('input[name="title"]').setValue('a')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Title must be at least 3 characters')
  })

  it("doesn't submit a list if the form is invalid", async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('submitAddList')).toBeUndefined()
  })
})
