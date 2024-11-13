const notRestrictedMutations = [
  'setRegistrationSuccessful',
  'setToken',
  'setLoginError',
  'setCommunicationError',
  'removeToken',
  'resetLoginError',
  'setCsrftoken'
]

const mutationCanceler = (store) => {
  store.subscribe((mutation, state) => {
    if (!state.token && !notRestrictedMutations.includes(mutation.type)) {
      return
    }
  })
}

export default mutationCanceler
