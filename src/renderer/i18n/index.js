import Vue from 'vue'
import VueI18n from 'vue-i18n'
import localeEn from 'element-ui/lib/locale/lang/en'
import localeZh from 'element-ui/lib/locale/lang/zh-CN'
import commonEn from './common'
import commonZh from './common-zh-CN'
import dashboardEn from './dashboard'
import dashboardZh from './dashboard-zh-CN'
import menuEn from './menu'
import menuZh from './menu-zh-CN'

Vue.use(VueI18n)

const messages = {
    en: {
        el: localeEn.el,
        common: commonEn.common,
        dashboard: dashboardEn.dashboard,
        menu: menuEn.menu
    },
    zh: {
        el: localeZh.el,
        common: commonZh.common,
        dashboard: dashboardZh.dashboard,
        menu: menuZh.menu
    }
}

let defaultLang = 'en'
const path = require('path')
const os = require('os')
const fs = require('fs')

const configDir = path.join(os.homedir(), '.eden')
if (!fs.existsSync(configDir))
    fs.mkdirSync(configDir)

const langConfigFile = path.join(configDir, 'language.json')
if (fs.existsSync(langConfigFile))
    defaultLang = JSON.parse(fs.readFileSync(langConfigFile, 'utf8')).language
else {
    if (typeof localStorage !== 'undefined' 
        && (localStorage.language ==='zh' || localStorage.language ==='en'))
        defaultLang = localStorage.language
    writeLangJsonConfigFile(defaultLang)
}

let localeMessages = {
    locale: defaultLang,
    messages
}
const i18n = new VueI18n(localeMessages)

export function writeLangJsonConfigFile(lang) {
    let langJson = { language: lang }
    fs.writeFileSync(langConfigFile, JSON.stringify(langJson), 'utf8')
}
export {localeMessages}
export default i18n;