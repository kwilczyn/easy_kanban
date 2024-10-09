import AddListModal from './modals/AddListModal.js'
import AddTaskModal from './modals/AddTaskModal.js'
import listByTitle from './components/list.js'
import TaskMenu from './modals/TaskMenu.js'

export default class HomePage {
  constructor(page) {
    this.page = page
    this.addListButton = page.getByRole('button', { name: '+' }).last()
    this.addListModal = new AddListModal(page)
    this.taskModal = new AddTaskModal(page)
    this.taskMenu = new TaskMenu(page)
    this.listByTitle = (title) => {
      return listByTitle(page, title)
    }
  }

  async navigate() {
    await this.page.goto('/')
  }

  async addList(title) {
    await this.addListButton.click()
    await this.addListModal.titleInput.fill(title)
    await this.addListModal.addListButton.click()
    await this.addListModal.backdrop.waitFor({ state: 'hidden' })
  }

  async removeList(title) {
    this.listByTitle(title).removeListButton.click()
  }

  async addTask(listTitle, taskTitle) {
    await this.listByTitle(listTitle).addTaskButton.click()
    await this.taskModal.titleInput.fill(taskTitle)
    await this.taskModal.descriptionInput.fill('My Task Description')
    await this.taskModal.addTaskButton.click()
    await this.taskModal.backdrop.waitFor({ state: 'hidden' })
  }

  async removeTask(listTitle, taskTitle) {
    this.listByTitle(listTitle).taskByTitle(taskTitle).burgerMenuButton.click()
    this.taskMenu.removeTaskButton.click()
  }

  async editTask(listTitle, taskTitle, newTaskTitle) {
    this.listByTitle(listTitle).taskByTitle(taskTitle).burgerMenuButton.click()
    this.taskMenu.editTaskButton.click()
    await this.taskModal.titleInput.fill(newTaskTitle)
    await this.taskModal.updateTaskButton.click()
    await this.taskModal.backdrop.waitFor({ state: 'hidden' })
  }

  async moveTask(listTitle, taskTitle, toListTitle) {
    this.listByTitle(listTitle).taskByTitle(taskTitle).burgerMenuButton.click()
    await this.taskMenu.moveTaskSelect.selectOption(toListTitle)
  }
}
