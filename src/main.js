import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.scss'
import VueKonva from 'vue-konva'
import { store } from './store'

const app = createApp(App)
app.use(store)
app.use(VueKonva)

app.mount('#app')
