import { describe, it, expect, beforeEach, vi } from 'vitest'
import LoginForm from '@/components/forms/LoginForm.vue'
import RegisterUserForm from '@/components/forms/RegisterUserForm.vue'
import BaseFormRow from '@/components/base/BaseFormRow.vue'
import BaseFormLabel from '@/components/base/BaseFormLabel.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { createStore } from 'vuex'
import { mutations } from '@/store/store'
import { mount } from '@vue/test-utils'

const mockStore = createStore({
  state: {
    loginError: '',
    waitingForLogin: false
  },
  mutations: mutations
})

describe('LoginForm.vue', () => {
  let wrapper

  beforeEach(() => {
    mockStore.state.loginError = ''
    mockStore.state.waitingForLogin = false
    wrapper = mount(LoginForm, {
      global: {
        components: { BaseFormRow, BaseFormLabel, BaseButton },
        plugins: [mockStore]
      }
    })
  })

  it('renders the login form', () => {
    expect(wrapper.find('h2').text()).toBe('Log In')
    expect(wrapper.find('form#login-user-form').exists()).toBe(true)
  })

  it('has username and password fields', () => {
    const usernameField = wrapper.find('input[name="username"]')
    const passwordField = wrapper.find('input[name="password"]')

    expect(usernameField.exists()).toBe(true)
    expect(passwordField.exists()).toBe(true)
  })

  it('validates username is required', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Username is required')
  })

  it('validates username is too long', async () => {
    await wrapper.find('input[name="username"]').setValue('a'.repeat(151))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Username must be at most 150 characters')
  })

  it('allows username with max length', async () => {
    await wrapper.find('input[name="username"]').setValue('a'.repeat(150))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).not.toContain('Username must be')
  })

  it('validates password is required', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Password is required')
  })

  it('validates password is too short', async () => {
    await wrapper.find('input[name="password"]').setValue('a'.repeat(7))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Password must be at least 8 characters')
  })

  it('allows password with min length', async () => {
    await wrapper.find('input[name="password"]').setValue('a'.repeat(8))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).not.toContain('Password must be')
  })

  it('validates password is too long', async () => {
    await wrapper.find('input[name="password"]').setValue('a'.repeat(129))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Password must be at most 128 characters')
  })

  it('allows password with max length', async () => {
    await wrapper.find('input[name="password"]').setValue('a'.repeat(128))
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).not.toContain('Password must be')
  })

  it('submits the form', async () => {
    const dispatch = vi.spyOn(mockStore, 'dispatch')
    await wrapper.find('input[name="username"]').setValue('username')
    await wrapper.find('input[name="password"]').setValue('password')
    await wrapper.find('form').trigger('submit.prevent')
    expect(dispatch).toHaveBeenCalledWith('loginUser', {
      username: 'username',
      password: 'password'
    })
  })

  it('add loading class to the submit button when loading', async () => {
    mockStore.commit('setWaitingForLogin', true)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').classes()).toContain('loading')
  })

  it('removes loading class from the submit button when not loading', async () => {
    mockStore.commit('setWaitingForLogin', true)
    await wrapper.vm.$nextTick()
    mockStore.commit('setWaitingForLogin', false)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').classes()).not.toContain('loading')
  })

  it('displays an error message if the login failed', async () => {
    mockStore.commit('setLoginError', 'Login failed')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Login failed')
  })
})
