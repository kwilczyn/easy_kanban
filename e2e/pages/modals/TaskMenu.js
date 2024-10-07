export default class TaskMenu {
  constructor(page) {
    this.page = page
    this.editTaskButton = page.getByRole('button', { name: 'Edit Task' })
    this.removeTaskButton = page.getByRole('button', { name: 'Delete Task' })
  }
}
