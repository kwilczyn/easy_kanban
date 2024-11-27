import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BaseButton from './components/base/BaseButton.vue'
import BaseModal from './components/base/BaseModal.vue'
import BaseFormRow from './components/base/BaseFormRow.vue'
import BaseDropdown from './components/base/BaseDropdown.vue'
import store from './store/store'
import ClickOutside from './directives/ClickOutsideDirective.js'

store.dispatch('fetchCsrfToken').then(() => {
  store.dispatch('tryToLogin').then(() => {
    const app = createApp(App)
    app
      .component('base-button', BaseButton)
      .component('base-modal', BaseModal)
      .component('base-form-row', BaseFormRow)
      .component('base-dropdown', BaseDropdown)
    app.use(router)
    app.use(store)
    app.directive('click-outside', ClickOutside)
    app.mount('#app')
  })
})
