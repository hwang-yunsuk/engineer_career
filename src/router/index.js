import { createRouter, createWebHistory } from 'vue-router'
import App from '@/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/index',
      name: 'home',
      component: App
    }
  ]
})

export default router
