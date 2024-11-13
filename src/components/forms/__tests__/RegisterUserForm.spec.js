import { describe, it, expect, beforeEach, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import RegisterUserForm from '@/components/forms/RegisterUserForm.vue'
import BaseFormRow from '@/components/base/BaseFormRow.vue'
import BaseFormLabel from '@/components/base/BaseFormLabel.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { createStore } from 'vuex'

const mockStore = createStore({
  getters: {
    getListTitles: () => ['To Do', 'In Progress', 'Done']
  },
  actions: {
    registerUser: vi.fn()
  }
})

describe('RegisterUserForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(RegisterUserForm, {
      global: {
        components: { BaseFormRow, BaseFormLabel, BaseButton },
        plugins: [mockStore]
      }
    })
  })

  it('renders properly', () => {
    expect(wrapper.text()).toContain('Register a new user')
    expect(wrapper.text()).toContain('Username')
    expect(wrapper.text()).toContain('Password')
    expect(wrapper.text()).toContain('Confirm Password')
    expect(wrapper.text()).toContain('Register')
  })

  it('displays an error message if the username is empty', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Username is required')
  })

  it('displays an error message if the username is too long', async () => {
    await wrapper.find('input[name="username"]').setValue('a'.repeat(151))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Username must be at most 150 characters')
  })

  it('displays an error message if email is empty', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Email is required')
  })

  it('displays an error message if email is too long', async () => {
    await wrapper.find('input[name="email"]').setValue('a'.repeat(254) + '@')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Email must be at most 254 characters')
  })

  it('displays an error message if email has no @ symbol', async () => {
    await wrapper.find('input[name="email"]').setValue('email.com')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Email must contain an @ symbol')
  })

  it('displays an error message if email is too short', async () => {
    await wrapper.find('input[name="email"]').setValue('@'.repeat(2))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Email must be at least 3 characters')
  })

  it('displays an error message if the password is empty', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Password is required')
  })

  it('displays an error message if the password is too short', async () => {
    await wrapper.find('input[name="password"]').setValue('a'.repeat(7))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Password must be at least 8 characters')
  })

  it('displays an error message if the password is too long', async () => {
    await wrapper.find('input[name="password"]').setValue('a'.repeat(129))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Password must be at most 128 characters')
  })

  it('displays an error message if the confirm password is empty', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Confirm Password is required')
  })

  it('displays an error message if password and confirm password do not match', async () => {
    await wrapper.find('input[name="password"]').setValue('password')
    await wrapper.find('input[name="confirmPassword"]').setValue('password2')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Passwords do not match')
  })

  it('submits the form', async () => {
    const dispatch = vi.spyOn(mockStore, 'dispatch')
    await wrapper.find('input[name="username"]').setValue('username')
    await wrapper.find('input[name="email"]').setValue('email@test.email.pl')
    await wrapper.find('input[name="password"]').setValue('password')
    await wrapper.find('input[name="confirmPassword"]').setValue('password')
    await wrapper.find('form').trigger('submit.prevent')
    expect(dispatch).toHaveBeenCalledWith('registerUser', {
      username: 'username',
      email: 'email@test.email.pl',
      password: 'password',
      password_confirm: 'password'
    })
  })
})
