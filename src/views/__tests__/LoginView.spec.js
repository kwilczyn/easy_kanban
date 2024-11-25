import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseFormRow from '@/components/base/BaseFormRow.vue'
import LoginView from '@/views/LoginView.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import RegisterUserForm from '@/components/forms/RegisterUserForm.vue'
import LoginForm from '@/components/forms/LoginForm.vue'
import { createStore } from 'vuex'
import { getters, mutations } from '@/store/store'

const mockStore = createStore({
  getters: {
    ...getters,
    registrationSuccessful: () => false
  },
  state: {
    registrationSuccessful: false
  },
  mutations: mutations
})

describe('LoginView', () => {
  let wrapper

  beforeEach(() => {
    mockStore.state.registrationSuccessful = false

    wrapper = mount(LoginView, {
      global: {
        components: { BaseButton, RegisterUserForm, BaseFormRow },
        plugins: [mockStore]
      }
    })
  })

  it('renders correctly with default mode "log-in"', () => {
    expect(wrapper.find('h1').text()).toBe('Welcome to Easy Kanban App!')
    expect(wrapper.findComponent(LoginForm).exists()).toBe(true)
    expect(wrapper.find('p').text()).toContain('Easy Kanban is a simple Kanban board application')
  })

  it('switches to "log-in" mode when Log In button is clicked', async () => {
    await wrapper.find('#log-in-selection-button').trigger('click')
    expect(wrapper.vm.mode).toBe('log-in')
    expect(wrapper.findComponent(RegisterUserForm).exists()).toBe(false)
  })

  it('switches back to "sign-up" mode when Sign In button is clicked', async () => {
    // First switch to "log-in" mode
    await wrapper.find('#log-in-selection-button').trigger('click')
    // Then switch back to "sign-in" mode
    await wrapper.find('#sign-up-selection-button').trigger('click')
    expect(wrapper.vm.mode).toBe('sign-up')
    expect(wrapper.findComponent(RegisterUserForm).exists()).toBe(true)
  })

  it('displays registration success message when registrationSuccessful is true', async () => {
    mockStore.state.registrationSuccessful = true
    await wrapper.vm.$nextTick()
    await wrapper.find('#sign-up-selection-button').trigger('click')
    expect(wrapper.find('#registration-successful-info').text()).toContain(
      'Registration successful! Please log in.'
    )
    expect(wrapper.findComponent(RegisterUserForm).exists()).toBe(false)
  })

  it('does not display RegisterUserForm when registrationSuccessful is true', async () => {
    mockStore.state.registrationSuccessful = true
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(RegisterUserForm).exists()).toBe(false)
  })

  it('updates the component when the Vuex state changes', async () => {
    expect(wrapper.vm.registrationSuccessful).toBeFalsy()
    mockStore.commit('setRegistrationSuccessful', true)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.registrationSuccessful).toBe(true)
  })

  it('applies the "selected" class to the active mode button', async () => {
    // Default mode is "log-in"
    expect(wrapper.find('#log-in-selection-button').classes()).toContain('selected')
    // Switch to "log-in" mode
    await wrapper.find('#sign-up-selection-button').trigger('click')
    expect(wrapper.find('#sign-up-selection-button').classes()).toContain('selected')
    expect(wrapper.find('#log-in-selection-button').classes()).not.toContain('selected')
  })
})
