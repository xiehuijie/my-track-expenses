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
        path: '/me/books',
        name: 'me-books',
        component: () => import('@/views/me/BooksManagementView.vue'),
    },
    {
        path: '/me/categories',
        name: 'me-categories',
        component: () => import('@/views/me/CategoriesSettingsView.vue'),
    },
    {
        path: '/me/expense-config',
        name: 'me-expense-config',
        component: () => import('@/views/me/ExpenseConfigView.vue'),
    },
    {
        path: '/me/tags',
        name: 'me-tags',
        component: () => import('@/views/me/TagsView.vue'),
    },
    {
        path: '/me/recycle-bin',
        name: 'me-recycle-bin',
        component: () => import('@/views/me/RecycleBinView.vue'),
    },
    {
        path: '/me/cloud-sync',
        name: 'me-cloud-sync',
        component: () => import('@/views/me/CloudSyncView.vue'),
    },
    {
        path: '/me/settings',
        name: 'me-settings',
        component: () => import('@/views/me/SettingsView.vue'),
    },
    {
        path: '/me/messages',
        name: 'me-messages',
        component: () => import('@/views/me/MessageCenterView.vue'),
    },
    {
        path: '/me/dev-tools',
        name: 'me-dev-tools',
        component: () => import('@/views/me/DevToolsView.vue'),
    },
    {
        path: '/me/about',
        name: 'me-about',
        component: () => import('@/views/me/AboutView.vue'),
    },
    {
        path: '/me/license',
        name: 'me-license',
        component: () => import('@/views/me/LicenseView.vue'),
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
