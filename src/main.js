import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client' 

import './assets/main.css'
import App from './App.vue'
import router from './router'
import { captureAttribution } from '@/utils/utm'
import reveal from '@/directives/reveal'

// Guarda los parámetros de campaña (UTM / fbclid) si el visitante llegó de un anuncio
captureAttribution()

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(head)
app.use(router)

app.directive('reveal', reveal)

app.mount('#app')