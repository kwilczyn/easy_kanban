export default class AddListModal {
  constructor(page) {
    this.page = page
    this.titleInput = page.getByLabel('Title')
    this.addListButton = page.getByRole('button', { name: 'Add List' })
    this.backdrop = page.locator('.backdrop')
  }
}
