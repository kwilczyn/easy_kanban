import { test, expect } from '@playwright/test'
import HomePage from '../pages/HomePage.js'

test('add a new list', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.navigate()
  await homePage.addList('My List')
  await expect(homePage.getListByTitle('My List')).toBeAttached()
})

test('remove a list', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.navigate()
  await homePage.removeList('To Do')
  await expect(homePage.getListByTitle('To Do')).not.toBeAttached()
})
