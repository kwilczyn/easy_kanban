<template>
  <div class="content">
    <h1>
      Welcome to Easy Kanban App!
      <img src="@/assets/logo.webp" class="logo-icon" />
    </h1>
    <p>
      Easy Kanban is a simple Kanban board application that allows you to manage your tasks in a
      visual way.
    </p>
    <p>Do you want to Log in or Sign up?</p>
    <div id="selectionContainer">
      <base-button
        id="log-in-selection-button"
        customType="navigation"
        :class="mode === 'log-in' ? 'selected' : null"
        @click="setLogInMode"
        >Log In</base-button
      >
      <base-button
        id="sign-up-selection-button"
        customType="navigation"
        :class="mode === 'sign-up' ? 'selected' : null"
        @click="setSignUpMode"
        >Sign Up</base-button
      >
    </div>
    <div class="registration" v-if="mode === 'sign-up'">
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
    setSignUpMode() {
      this.mode = 'sign-up'
    },
    setLogInMode() {
      this.mode = 'log-in'
    }
  }
}
</script>

<style scoped>
.content {
  text-align: center;
  h1 {
    vertical-align: center;
  }

  .logo-icon {
    position: static;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-background-nav);
  min-height: 35rem;
}

#selectionContainer {
  display: flex;
  gap: 1rem;
  height: 2.6rem;
  padding: 2px;
  overflow: hidden;
}
</style>
