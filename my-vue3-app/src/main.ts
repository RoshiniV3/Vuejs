import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/colors.css'
import './style.css'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
