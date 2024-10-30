export default function taskByTitle(list, title) {
  let task = null
  if (title) {
    task = list.locator(`li:has(:text-is("${title}"))`)
  } else {
    task = list.locator('li:has([draggable])')
  }
  task.burgerMenuButton = task.getByRole('button', { name: '...' })
  return task
}
