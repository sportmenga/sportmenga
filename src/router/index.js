import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tienda',
      name: 'tienda',
      component: () => import('../views/TiendaView.vue'),
    },
    {
      path: '/inscripcion',
      name: 'inscripcion',
      component: () => import('../views/InscripcionView.vue'),
    },
    {
      path: '/ingreso',
      name: 'ingreso',
      component: () => import('../views/IngresoView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/prueba',
      name: 'prueba',
      component: () => import('../views/prueba.vue'),
    },
    {
      path: '/administracion',
      name: 'administracion',
      component: () => import('../views/administracion.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
