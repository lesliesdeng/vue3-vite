import { createRouter, createWebHashHistory } from 'vue-router'
import { RouteRecordRaw } from 'vue-router'

import { firstRoute } from '@/utils/map-menu'

// import localCache from '@/utils/cache'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login/:key',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  // 管理端入口页
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/main.vue')
  },
  // 用户入口页
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/home.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/not-found/not-found.vue')
  },
  {
    path: '/full-screen',
    name: 'full-screen',
    component: () => import('@/views/full-screen/index.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

router.beforeEach((to) => {
  if (to.path !== '/login') {
    // 文创平台没有自己的登录页面，不做此校验
    // const token = localCache.getCache('token')
    // if (!token) {
    //   return '/login'
    // }
    if (to.path === '/main' || to.path === '/home') {
      return firstRoute?.path
    }
  }
})

export default router
