import { createRouter, createWebHistory } from 'vue-router';
import { adminRoutes, normalRoutes } from '@/utils/rule';

const role = localStorage.getItem('role');

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/index',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const list = role === '204' ? normalRoutes : adminRoutes;
list.forEach((i) => router.addRoute(i));

export default router;
