import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue';
import DashBoardView from '@/views/DashboardView.vue';
import EggView from '@/views/EggView.vue';
import GoodiesView from '../views/GoodiesView.vue';
import RegisterView from '../views/RegisterView.vue';

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
    
    component: () => import('../views/EggView.vue')
    },
    {
      path: '/goodies',
      name: 'goodies',
      
    component: () => import('../views/GoodiesView.vue')
    },{
      path: '/register',
      name: 'register',
      
      component: () => import('../views/RegisterView.vue')
      },
  ]
})

export default router
