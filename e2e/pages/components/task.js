export default function taskByTitle(list, title) {
  const task = list.locator('li', { hasText: title })
  task.burgerMenuButton = task.getByRole('button', { name: '...' })
  return task
}
