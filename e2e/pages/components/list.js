import taskByTitle from './task.js'

export default function listByTitle(page, title) {
  const list = page.locator('section', {
    has: page.getByRole('heading', { name: title })
  })
  list.taskByTitle = (taskTitle) => {
    return taskByTitle(list, taskTitle)
  }
  list.removeListButton = list.locator('header').getByRole('button', { name: 'X' })
  list.addTaskButton = list.getByRole('button', { name: '+' })
  list.header = list.getByRole('heading').first()
  list.leftArrowButton = list.locator('button[aria-roledescription="Move list backward"]')
  list.rightArrowButton = list.locator('button[aria-roledescription="Move list forward"]')
  return list
}
