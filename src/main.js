import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BaseButton from './components/base/BaseButton.vue'
import store from './store/store'

const app = createApp(App)

app.component('base-button', BaseButton)
app.use(router)
app.use(store)
app.mount('#app')
