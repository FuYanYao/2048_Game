import { createApp } from 'vue'
import App from './App.vue'

import './assets/css/global.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import Vue3TouchEvents from "vue3-touch-events"

const app = createApp(App)
app.use(Vue3TouchEvents)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.mount('#app')