import AddListModal from './modals/AddListModal.js'

export default class HomePage {
  constructor(page) {
    this.page = page
    this.addListButton = page.getByRole('button', { name: '+' })
    this.addListModal = new AddListModal(page)
  }

  async navigate() {
    await this.page.goto('/')
  }

  getListByTitle(title) {
    return this.page
      .locator('section')
      .filter({ has: this.page.getByRole('heading', { name: title }) })
  }

  async addList(title) {
    await this.addListButton.click()
    await this.addListModal.titleInput.fill(title)
    await this.addListModal.addListButton.click()
    await this.addListModal.backdrop.waitFor({ state: 'hidden' })
  }

  async removeList(title) {
    const list = this.getListByTitle(title)
    await list.locator('header').getByRole('button', { name: 'X' }).click()
  }
}
