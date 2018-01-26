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

import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, { locale })
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
    template: '<App/>'
}).$mount('#app')
