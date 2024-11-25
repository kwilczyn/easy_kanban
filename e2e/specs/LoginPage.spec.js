import process from 'node:process'
import dotenv from 'dotenv'
dotenv.config()

import { test, expect } from '@playwright/test'

import LoginPage from './../pages/LoginPage.js'
import HomePage from './../pages/HomePage.js'

let homePage
let loginPage

test.beforeEach(async ({ page }, workerParams) => {
  loginPage = new LoginPage(page)
  homePage = new HomePage(page)
  await homePage.navigate()
})

test('log in a valid user', async ({}, workerParams) => {
  await loginPage.logIn(workerParams.project.use.testUser, process.env.TEST_USER_PASSWORD)
  await expect(homePage.page).not.toHaveURL(/auth/)
  expect(homePage.navigationBar).toContainText('Board')
})

test('log in a user with invalid credentials', async () => {
  await loginPage.logIn('invalid', 'invalid_password')
  await expect(loginPage.logInUserForm).toContainText(
    'No active account found with the given credentials'
  )
})

test('register a new user and log in', async ({}, workerParams) => {
  await loginPage.signInSwtichButton.click()
  const username = getRandomUsername()
  await loginPage.RegisterUser(
    username,
    'example@email.test.pl',
    process.env.TEST_USER_PASSWORD,
    process.env.TEST_USER_PASSWORD
  )
  await expect(loginPage.registerSuccesfulInfo).toContainText('Registration successful!')
  await loginPage.logIn(username, process.env.TEST_USER_PASSWORD)
  await expect(homePage.page).not.toHaveURL(/auth/)
  await expect(homePage.navigationBar).toContainText('Board')
})

function getRandomUsername() {
  return `test_random_${Math.floor(Math.random() * 1000000)}`
}
