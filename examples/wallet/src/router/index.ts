import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignMessageView from '../views/SignMessageView.vue'
import SendTransactionView from '../views/SendTransactionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/connect',
      name: 'connect',
      component: () => import('../views/ConnectView.vue')
    },
    {
      path: '/signMessage',
      name: 'signMessage',
      component: () => SignMessageView
    },
    {
      path: '/sendTransaction',
      name: 'sendTransaction',
      component: () => SendTransactionView 
    }
  ]
})

export default router
