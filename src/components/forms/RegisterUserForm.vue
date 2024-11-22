<template>
  <form id="register-user-form" @submit.prevent="submitForm">
    <h2>Register a new user</h2>
    <base-form-row
      label="Username"
      :fieldValidator="usernameInvalid"
      type="text"
      name="username"
      v-model.lazy.trim="username"
    />
    <base-form-row
      label="Email"
      :fieldValidator="emailInvalid"
      type="email"
      name="email"
      v-model.lazy.trim="email"
    />
    <base-form-row
      label="Password"
      :fieldValidator="passwordInvalid"
      type="password"
      name="password"
      v-model.lazy.trim="password"
    />
    <base-form-row
      label="Confirm Password"
      :fieldValidator="confirmPasswordInvalid"
      type="password"
      name="confirmPassword"
      v-model.lazy.trim="password_confirm"
    />
    <base-button customType="add" type="submit" :class="{ loading: waitingForRegistration }"
      >Register</base-button
    >
  </form>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'RegisterUserForm',
  data() {
    return {
      username: '',
      usernameInvalid: '',
      email: '',
      emailInvalid: '',
      password: '',
      passwordInvalid: '',
      password_confirm: '',
      confirmPasswordInvalid: ''
    }
  },
  computed: {
    ...mapState(['waitingForRegistration'])
  },
  methods: {
    ...mapActions(['registerUser']),
    submitForm() {
      if (this.validateForm()) {
        this.registerUser({
          username: this.username,
          email: this.email,
          password: this.password,
          password_confirm: this.password_confirm
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
    validateEmail() {
      if (this.email.length === 0) {
        this.emailInvalid = 'Email is required'
      } else if (!this.email.includes('@')) {
        this.emailInvalid = 'Email must contain an @ symbol'
      } else if (this.email.length > 254) {
        this.emailInvalid = 'Email must be at most 254 characters'
      } else if (this.email.length < 3) {
        this.emailInvalid = 'Email must be at least 3 characters'
      } else {
        this.emailInvalid = ''
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
    validateConfirmPassword() {
      if (this.password_confirm.length === 0) {
        this.confirmPasswordInvalid = 'Confirm Password is required'
      } else if (this.password_confirm !== this.password) {
        this.confirmPasswordInvalid = 'Passwords do not match'
      } else {
        this.confirmPasswordInvalid = ''
        return true
      }
      return false
    },
    validateForm() {
      const usernameValid = this.validateUsername()
      const emailValid = this.validateEmail()
      const passwordValid = this.validatePassword()
      const confirmPasswordValid = this.validateConfirmPassword()
      return usernameValid && emailValid && passwordValid && confirmPasswordValid
    }
  }
}
</script>

<style scoped>
h2 {
  text-align: center;
}

#register-user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
