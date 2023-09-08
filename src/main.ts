import { createApp } from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'

import './assets/css/index.less'
import 'normalize.css'
import router from './router'
import store, { setupStore } from './store'

import registerApp from './global'

const app = createApp(App)
registerApp(app)
setupStore()
app.use(router).use(store).use(VueLazyload).mount('#app')
