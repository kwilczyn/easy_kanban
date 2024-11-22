import process from 'node:process'
import dotenv from 'dotenv'
dotenv.config()

import { test, expect } from '@playwright/test'

import auth from '@/api/auth.js'
import csrf from '@/api/csrf.js'
import apiClient from '@/api/apiClient.js'
import HomePage from './../pages/HomePage.js'

const projectTokens = {}
let homePage

test.beforeAll(async ({}, workerParams) => {
  // Create test data using API
  const testUserId = workerParams.project.use.testUserId
  const testData = {
    boards: [
      {
        users: [testUserId],
        lists: [
          {
            title: 'Removing Tasks',
            tasks: [
              {
                title: 'Task To Remove',
                description: 'This task is going to be removed during a test execution.',
                position: 0
              }
            ],
            position: 0
          },
          { title: 'Adding Tasks', tasks: [], position: 1 },
          {
            title: 'List To Remove',
            tasks: [
              {
                title: 'LTR Example Task',
                description: 'Example Task on the list that is going to be removed',
                position: 0
              }
            ],
            position: 2
          },
          {
            title: 'Editing Tasks',
            tasks: [
              {
                title: 'Task To Edit',
                description: 'This Task is going to be edited during the test execution.',
                position: 0
              }
            ],
            position: 3
          }
        ],
        title: 'My Example Board'
      },
      {
        users: [testUserId],
        lists: [
          { title: 'First List', tasks: [], position: 0 },
          { title: 'List To Move Left', tasks: [], position: 1 },
          { title: 'Middle List', tasks: [], position: 2 },
          { title: 'List To Move Right', tasks: [], position: 3 },
          { title: 'Last List', tasks: [], position: 4 }
        ],
        title: 'Test Moving Lists'
      },
      {
        users: [testUserId],
        lists: [
          {
            title: 'First List',
            tasks: [],
            position: 0
          },
          {
            title: 'Moving Tasks',
            tasks: [
              { title: 'D&D Inside List Target', description: '', position: 0 },
              {
                title: 'D&D to Task and List',
                description:
                  'This task is going to be moved above another task on a different list using D&D',
                position: 1
              },
              {
                title: 'D&D to Task',
                description: 'Task to move above another task on the same list.',
                position: 2
              },
              {
                title: 'D&D Between Lists',
                description: 'Task to move to another list by D&D.',
                position: 3
              },
              {
                title: 'Moving F By Dropdown',
                description: 'Task to move forward using Dropdown Menu',
                position: 4
              },
              {
                title: 'Moving B By Dropdown',
                description: 'Task to move backward using Dropdown Menu',
                position: 5
              },
              { title: 'D&D to Empty List', description: '', position: 6 }
            ],
            position: 1
          },
          {
            title: 'Done',
            tasks: [{ title: 'D&D Outside List Target', description: '', position: 0 }],
            position: 2
          },
          { title: 'D&D Empty L Target', tasks: [], position: 3 }
        ],
        title: 'Test Moving Tasks'
      }
    ]
  }
  // todo: temporary hardcoded url
  apiClient.defaults.baseURL = 'http://localhost:8000/'
  const csrfToken = await csrf.getCsrfToken()
  const authResponse = await auth.loginUser({
    username: workerParams.project.use.testUser,
    password: process.env.TEST_USER_PASSWORD
  })
  const jwtToken = authResponse.data.access
  const refreshToken = authResponse.data.refresh
  projectTokens[workerParams.project.name] = { jwtToken, refreshToken }

  apiClient.defaults.headers['X-CSRFToken'] = csrfToken
  apiClient.defaults.headers['Authorization'] = `Bearer ${jwtToken}`

  await apiClient.post('api/create_test_data/', testData)
})

test.beforeEach(async ({ page }, workerParams) => {
  const { jwtToken, refreshToken } = projectTokens[workerParams.project.name]
  homePage = new HomePage(page)
  await homePage.navigate()
  await page.evaluate(
    (payload) => {
      localStorage.setItem('token', payload.jwtToken)
      localStorage.setItem('refreshToken', payload.refreshToken)
    },
    { jwtToken, refreshToken }
  )
  await page.reload()
})

test('add a new list', async ({ page }) => {
  await homePage.addList('New Added List')
  await expect(homePage.listByTitle('New Added List')).toBeAttached()
})

test('remove a list', async ({ page }) => {
  await homePage.removeList('List To Remove')
  await expect(homePage.listByTitle('List To Remove')).not.toBeAttached()
})

test('add a new task', async ({ page }) => {
  await homePage.addTask('Adding Tasks', 'New Added Task')
  await expect(homePage.listByTitle('Adding Tasks').taskByTitle('New Added Task')).toBeAttached()
})

test('remove a task', async ({ page }) => {
  await homePage.removeTask('Removing Tasks', 'Task To Remove')
  await expect(
    homePage.listByTitle('Removing Tasks').taskByTitle('Task To Remove')
  ).not.toBeAttached()
})

test('edit a task', async ({ page }) => {
  await homePage.editTask('Editing Tasks', 'Task To Edit', 'Edited Task')
  await expect(homePage.listByTitle('Editing Tasks').taskByTitle('Edited Task')).toBeAttached()
})

test('move a task to list forward using dropdown menu', async ({ page }) => {
  await homePage.selectBoard('Test Moving Tasks')
  await homePage.moveTask('Moving Tasks', 'Moving F By Dropdown', 'Done')
  await expect(homePage.listByTitle('Done').taskByTitle('Moving F By Dropdown')).toBeAttached()
})

test('move a task to list backward using dropdown menu', async ({ page }) => {
  await homePage.selectBoard('Test Moving Tasks')
  await homePage.moveTask('Moving Tasks', 'Moving B By Dropdown', 'First List')
  await expect(
    homePage.listByTitle('First List').taskByTitle('Moving B By Dropdown')
  ).toBeAttached()
})

test('move a task to another list by drag and drop', async ({ page }) => {
  await homePage.selectBoard('Test Moving Tasks')
  await homePage
    .listByTitle('Moving Tasks')
    .taskByTitle('D&D Between Lists')
    .dragTo(homePage.listByTitle('Done').header)
  await expect(homePage.listByTitle('Done').taskByTitle('').last()).toContainText(
    'D&D Between Lists'
  )
})

test('move a task above another task in the same list', async ({ page }) => {
  await homePage.selectBoard('Test Moving Tasks')
  await homePage
    .listByTitle('Moving Tasks')
    .taskByTitle('D&D to Task')
    .dragTo(homePage.listByTitle('Moving Tasks').taskByTitle('D&D Inside List Target'))
  await expect(homePage.listByTitle('Moving Tasks').taskByTitle('').first()).toContainText(
    'D&D to Task'
  )
})

test('move a task above another task in a different list', async ({ page }) => {
  await homePage.selectBoard('Test Moving Tasks')
  await homePage
    .listByTitle('Moving Tasks')
    .taskByTitle('D&D to Task and List')
    .dragTo(homePage.listByTitle('Done').taskByTitle('D&D Outside List Target'))
  await expect(homePage.listByTitle('Done').taskByTitle('').first()).toContainText(
    'D&D to Task and List'
  )
})

test('move a task into an empty list', async ({ page }) => {
  await homePage.selectBoard('Test Moving Tasks')
  await homePage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await homePage
    .listByTitle('Moving Tasks')
    .taskByTitle('D&D to Empty List')
    .dragTo(homePage.listByTitle('D&D Empty L Target').header)
  expect(homePage.listByTitle('D&D Empty L Target').taskByTitle('D&D to Empty List')).toBeAttached()
})

test('move a list backward', async ({ page }) => {
  await homePage.selectBoard('Test Moving Lists')
  await homePage.listByTitle('List To Move Left').leftArrowButton.click()
  await expect(homePage.listByTitle('').first()).toContainText('List To Move Left')
})

test('move a list forward', async ({ page }) => {
  await homePage.selectBoard('Test Moving Lists')
  await homePage.listByTitle('List To Move Right').rightArrowButton.click()
  await expect(homePage.listByTitle('').last()).toContainText('List To Move Right')
})
