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

test('move a task to list forward using dropdown menu', async ({ page }) => {
  await homePage.moveTask('To Do', 'Task 1', 'Done')
  await expect(homePage.listByTitle('Done').taskByTitle('Task 1')).toBeAttached()
})

test('move a task to list backward using dropdown menu', async ({ page }) => {
  await homePage.moveTask('In Progress', 'Task 2', 'To Do')
  await expect(homePage.listByTitle('To Do').taskByTitle('Task 2')).toBeAttached()
})

test('move a task to another list by drag and drop', async ({ page }) => {
  await homePage
    .listByTitle('To Do')
    .taskByTitle('Task 1')
    .dragTo(homePage.listByTitle('Done').header)
  await expect(homePage.listByTitle('Done').taskByTitle('Task 1')).toBeAttached()
})

test('move a task above another task in the same list', async ({ page }) => {
  await homePage
    .listByTitle('To Do')
    .taskByTitle('Task 4')
    .dragTo(homePage.listByTitle('To Do').taskByTitle('Task 1'))
  await expect(homePage.listByTitle('').first()).toContainText('Task 4')
})

test('move a task above another task in a different list', async ({ page }) => {
  await homePage
    .listByTitle('To Do')
    .taskByTitle('Task 4')
    .dragTo(homePage.listByTitle('In Progress').taskByTitle('Task 2'))
  await expect(homePage.listByTitle('In Progress').first()).toContainText('Task 4')
})

test('move a task into an empty list', async ({ page }) => {
  await homePage.addList('Test List')
  await homePage
    .listByTitle('To Do')
    .taskByTitle('Task 1')
    .dragTo(homePage.listByTitle('Test List'))
  expect(homePage.listByTitle('Test List').taskByTitle('Task 1')).toBeAttached()
})

test('move a list backward', async ({ page }) => {
  await homePage.listByTitle('In Progress').leftArrowButton.click()
  await expect(homePage.listByTitle('').first()).toContainText('In Progress')
})

test('move a list forward', async ({ page }) => {
  await homePage.listByTitle('In Progress').rightArrowButton.click()
  await expect(homePage.listByTitle('').last()).toContainText('In Progress')
})
