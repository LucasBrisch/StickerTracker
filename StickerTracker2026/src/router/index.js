import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CollectionView from '../views/CollectionView.vue'

const routes = [
  {
    path: '/',
    component: LoginView,
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/collection/:id',
    component: CollectionView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    next('/')
  } else if (to.path === '/' && session) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router