<template>
  <div class="content">
    <h1>Welcome to Easy Kanban App!</h1>
    <p>
      Easy Kanban is a simple Kanban board application that allows you to manage your tasks in a
      visual way.
    </p>
    <p>Do you want to Log in or Sign in?</p>
    <div id="selectionContainer">
      <base-button
        id="log-in-selection-button"
        customType="navigation"
        :class="mode === 'log-in' ? 'selected' : null"
        @click="setLogInMode"
        >Log In</base-button
      >
      <base-button
        id="sign-in-selection-button"
        customType="navigation"
        :class="mode === 'sign-in' ? 'selected' : null"
        @click="setSignInMode"
        >Sign In</base-button
      >
    </div>
    <div class="registration" v-if="mode === 'sign-in'">
      <register-user-form v-if="!registrationSuccessful"></register-user-form>
      <p v-else id="registration-successful-info">Registration successful! Please log in.</p>
    </div>
    <div class="login">
      <login-form v-if="mode === 'log-in'"></login-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RegisterUserForm from '@/components/forms/RegisterUserForm.vue'
import LoginForm from '@/components/forms/LoginForm.vue'

export default {
  name: 'LoginView',
  components: {
    RegisterUserForm,
    LoginForm
  },
  data() {
    return {
      mode: 'log-in'
    }
  },
  computed: {
    ...mapState(['registrationSuccessful'])
  },
  methods: {
    setSignInMode() {
      this.mode = 'sign-in'
    },
    setLogInMode() {
      this.mode = 'log-in'
    }
  }
}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-background-nav);
}

#selectionContainer {
  display: flex;
  gap: 1rem;
  height: 2.6rem;
  padding: 2px;
  overflow: hidden;
}
</style>
