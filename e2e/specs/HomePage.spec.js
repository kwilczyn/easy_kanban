import { test, expect } from '@playwright/test'
import HomePage from '../pages/HomePage.js'

let homePage

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page)
  await homePage.navigate()
})

test('add a new list', async ({ page }) => {
  await homePage.addList('My List')
  await expect(homePage.listByTitle('My List')).toBeAttached()
})

test('remove a list', async ({ page }) => {
  await homePage.removeList('To Do')
  await expect(homePage.listByTitle('To Do')).not.toBeAttached()
})

test('add a new task', async ({ page }) => {
  await homePage.addTask('To Do', 'My Task')
  await expect(homePage.listByTitle('To Do').taskByTitle('My Task')).toBeAttached()
})

test('remove a task', async ({ page }) => {
  await homePage.removeTask('To Do', 'Task 1')
  await expect(homePage.listByTitle('To Do').taskByTitle('Task 1')).not.toBeAttached()
})

test('edit a task', async ({ page }) => {
  await homePage.editTask('To Do', 'Task 1', 'My Task')
  await expect(homePage.listByTitle('To Do').taskByTitle('My Task')).toBeAttached()
})

test('move a task forward', async ({ page }) => {
  await homePage.moveTask('To Do', 'Task 1', 'Done')
  await expect(homePage.listByTitle('Done').taskByTitle('Task 1')).toBeAttached()
})

test('move a task backward', async ({ page }) => {
  await homePage.moveTask('In Progress', 'Task 2', 'To Do')
  await expect(homePage.listByTitle('To Do').taskByTitle('Task 2')).toBeAttached()
})
