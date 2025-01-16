export default class ConfirmRemoveModal {
  constructor(page) {
    this.page = page
    this.confirmButton = page.getByRole('button', { name: 'Yes' })
  }
}
