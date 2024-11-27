export default class HomePage {
  constructor(page) {
    this.page = page

    this.logInSwitchButton = page.locator('#log-in-selection-button')
    this.signInSwtichButton = page.locator('#sign-up-selection-button')

    this.logInUserForm = page.locator('#login-user-form')
    this.usernameInput = page.getByLabel('Username')
    this.passwordInput = page.getByLabel('Password', { exact: true })
    this.logInButton = page.locator('#login-user-form button[type="submit"]')

    this.registerUserForm = page.locator('#register-user-form')
    this.emailInput = page.getByLabel('Email')
    this.confirmPasswordInput = page.getByLabel('Confirm Password', { exact: true })
    this.registerButton = page.locator('#register-user-form button[type="submit"]')
    this.registerSuccesfulInfo = page.locator('#registration-successful-info')
  }

  async navigate() {
    await this.page.goto('/auth')
  }

  async logIn(username, password) {
    await this.logInSwitchButton.click()
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.logInButton.click()
  }

  async RegisterUser(username, email, password, confirmPassword) {
    await this.signInSwtichButton.click()
    await this.usernameInput.fill(username)
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.confirmPasswordInput.fill(confirmPassword)
    await this.registerButton.click()
  }
}
