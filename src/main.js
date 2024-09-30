import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BaseButton from './components/base/BaseButton.vue'
import BaseModal from './components/base/BaseModal.vue'
import BaseFormRow from './components/base/BaseFormRow.vue'
import store from './store/store'

const app = createApp(App)

app
  .component('base-button', BaseButton)
  .component('base-modal', BaseModal)
  .component('base-form-row', BaseFormRow)
app.use(router)
app.use(store)
app.mount('#app')
