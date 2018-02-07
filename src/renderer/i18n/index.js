import Vue from 'vue'
import ElementUI from 'element-ui'
import localeEn from 'element-ui/lib/locale/lang/en'
import localeCn from 'element-ui/lib/locale/lang/zh-CN'
import commonEn from './common'
import commonCn from './common-zh-CN'
import dashboardEn from './dashboard'
import dashboardCn from './dashboard-zh-CN'

const locale = {
    language: localStorage.language || 'en',
    message: {
        en: {
            elementSys: localeEn.el,
            common: commonEn.common,
            dashboard: dashboardEn.dashboard
        },
        cn: {
            elementSys: localeCn.el,
            common: commonCn.common,
            dashboard: dashboardCn.dashboard
        }
    }
}

export default {
    message: locale.message[locale.language]
}