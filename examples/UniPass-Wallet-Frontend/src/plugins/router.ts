import { createRouter, createWebHistory } from 'vue-router'
import { trackRouter } from 'vue-gtag-next'

// auto routes
const modules = require.context('@/pages', true, /.vue/)
const routes = modules.keys().map((item) => {
  const pageName = item.slice(2)
  let path = item.slice(1).replace('.vue', '')
  // index
  if (path.endsWith('/index')) {
    path = path.slice(0, -6)
  }
  // 404
  else if (path.endsWith('/_')) {
    path = `${path.slice(0, -2)}/:pathMatch(.*)*`
  }
  const pageModule = () => import(`@/pages/${pageName}`)
  return {
    path,
    component: pageModule,
  }
})
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// google analytics
trackRouter(router)
export default router
