import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue';
import DashBoardView from '@/views/DashboardView.vue';
import EggView from '@/views/EggView.vue';
import GoodiesView from '../views/GoodiesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
     path: '/dashboard',
     name: 'dashBoard',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
     component: () => import('../views/DashboardView.vue')
     },
    {
    path: '/egg',
    name: 'egg',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/EggView.vue')
    },
    {
      path: '/goodies',
      name: 'goodies',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GoodiesView.vue')
      },
  ]
})

export default router
