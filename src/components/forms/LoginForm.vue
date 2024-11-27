<template>
  <form id="login-user-form" @submit.prevent="submitForm">
    <h2>Log In</h2>
    <base-form-row
      label="Username"
      :fieldValidator="usernameInvalid"
      type="text"
      name="username"
      v-model.lazy.trim="username"
    />
    <base-form-row
      label="Password"
      :fieldValidator="passwordInvalid"
      type="password"
      name="password"
      v-model.lazy.trim="password"
    />
    <p class="error_text" v-if="loginError">{{ loginError }}</p>
    <base-button customType="add" type="submit" :class="{ loading: waitingForData }"
      >Log In</base-button
    >
  </form>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      usernameInvalid: '',
      password: '',
      passwordInvalid: ''
    }
  },
  computed: {
    ...mapState(['loginError']),
    waitingForData() {
      return this.$store.state.waitingForLogin
    }
  },
  methods: {
    ...mapActions(['loginUser']),
    submitForm() {
      if (this.validateForm()) {
        this.loginUser({
          username: this.username,
          password: this.password
        })
      }
    },
    validateUsername() {
      if (this.username.length === 0) {
        this.usernameInvalid = 'Username is required'
      } else if (this.username.length > 150) {
        this.usernameInvalid = 'Username must be at most 150 characters'
      } else {
        this.usernameInvalid = ''
        return true
      }
      return false
    },
    validatePassword() {
      if (this.password.length === 0) {
        this.passwordInvalid = 'Password is required'
      } else if (this.password.length < 8) {
        this.passwordInvalid = 'Password must be at least 8 characters'
      } else if (this.password.length > 128) {
        this.passwordInvalid = 'Password must be at most 128 characters'
      } else {
        this.passwordInvalid = ''
        return true
      }
      return false
    },
    validateForm() {
      const usernameValid = this.validateUsername()
      const passwordValid = this.validatePassword()
      return usernameValid && passwordValid
    }
  }
}
</script>

<style scoped>
h2 {
  text-align: center;
}

#login-user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
