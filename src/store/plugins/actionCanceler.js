const notRestrictedActions = [
  'fetchCsrfToken',
  'registerUser',
  'tryToLogin',
  'loginUser',
  'logoutUser'
]

const actionCanceler = (store) => {
  store.subscribeAction(async (action, state) => {
    if (!state.token && !notRestrictedActions.includes(action.type)) {
      return
    }
  })
}

export default actionCanceler
