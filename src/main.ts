import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'
import { toast } from './utils/toast'

const app = createApp(App)
app.use(toast)
app.mount('#app')
