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
          path: '',
          component: require('@/templates/FavouritesView').default,
          children: [
            {
              path: '/file-index',
              component: require('@/templates/Favourites/FileIndexView').default
            },
            {
              path: '/file-upload',
              component: require('@/templates/Favourites/UploadView').default
            },
            {
              path: '/file-download',
              component: require('@/templates/Favourites/DownloadView').default
            },
            {
              path: '/share-my-storage',
              component: require('@/templates/Favourites/ShareMyStorage').default
            }
          ]
        }
      ]
    },
    {
      path: '/register',
      name: 'register-view',
      component: require('@/templates/RegisterView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
