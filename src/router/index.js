import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('../views/HomeView.vue')
const LoginView = () => import('../views/LoginView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth',
      name: 'auth',
      component: LoginView
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'auth' && !localStorage.getItem('token')) {
    next({ name: 'auth' })
  } else if (to.name === 'auth' && localStorage.getItem('token')) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
