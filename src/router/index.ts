import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/statistics',
        name: 'statistics',
        component: () => import('@/views/StatisticsView.vue'),
    },
    {
        path: '/assets',
        name: 'assets',
        component: () => import('@/views/AssetsView.vue'),
    },
    {
        path: '/me',
        name: 'me',
        component: () => import('@/views/MeView.vue'),
    },
    {
        path: '/add',
        name: 'add-expense',
        component: () => import('@/views/AddExpenseView.vue'),
    },
    {
        path: '/history',
        name: 'history',
        component: () => import('@/views/HistoryView.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
