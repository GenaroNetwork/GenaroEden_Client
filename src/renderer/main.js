import Vue from 'vue'
import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import directive from 'element-ui/packages/popover/src/directive'
Vue.directive('popover', directive)

import 'material-design-icons/iconfont/material-icons.css'

// font awesome
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(solid)

import App from './App'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'

import i18n from './i18n'
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
require('electron').ipcRenderer.on('locale-language', (event, lang) => {
    i18n.locale = lang
});
Vue.use(VueAnalytics, {
    id: 'UA-119026505-1',
    router,
});
Vue.prototype.$http = axios

/* import vue filters */
import filters from "./filter"


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    i18n,
    template: '<App/>'
}).$mount('#app')
