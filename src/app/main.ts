import './assets/styles/global.css'
import './assets/styles/themes/ink-wash.css'
import './assets/styles/themes/twilight.css'
import './assets/styles/themes/nord.css'
import './assets/styles/themes/github-dark.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './router'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
