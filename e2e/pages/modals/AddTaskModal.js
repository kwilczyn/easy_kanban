export default class AddTaskModal {
  constructor(page) {
    this.parent = page
    this.titleInput = page.getByLabel('Title')
    this.descriptionInput = page.getByLabel('Description')
    this.addTaskButton = page.getByRole('button', { name: 'Add Task' })
    this.backdrop = page.locator('.backdrop')
  }
}
