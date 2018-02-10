import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login-view',
            component: require('@/templates/LoginView').default
        },
        {
            path: '/register',
            name: 'register',
            component: require('@/templates/RegisterView').default
        },
        {
            path: '/encryption-key',
            name: 'encryption-key',
            component: require('@/templates/EncryptionKey').default
        },
        {
            path: '/password-reset',
            name: 'password-reset',
            component: require('@/templates/PasswordResetView').default
        },
        {
            path: '/index',
            name: 'index-view',
            component: require('@/templates/IndexView').default,
            children: [
                {
                    path: '/index',
                    component: require('@/templates/FavouritesView').default,
                    children: [
                        {
                            path: '/folders',
                            name: 'folders-view',
                            component: require('@/templates/Favourites/Folders').default
                        },
                        {
                            path: '/folder/:bucketId',
                            name: 'folder-view',
                            component: require('@/templates/Favourites/Folder').default
                        },
                        {
                            path: '/file-download',
                            name: 'file-download',
                            component: require('@/templates/Favourites/DownloadView').default
                        },
                        {
                            path: '/share-my-storage',
                            name: 'share-my-storage',
                            component: require('@/templates/Favourites/ShareMyStorage').default
                        },
                        {
                            path: '/wallet',
                            name: 'wallet',
                            component: require('@/templates/Favourites/Wallet').default
                        },
                        {
                            path: '/wallet-manager',
                            name: 'wallet-manager',
                            component: require('@/templates/Favourites/WalletManager').default
                        },
                        {
                            path: '/debit',
                            name: 'debit-view',
                            component: require('@/templates/Favourites/Debit').default
                        }
                    ]
                }
            ]
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
