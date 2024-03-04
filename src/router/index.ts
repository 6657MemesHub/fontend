import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/Home/HomeView.vue';
import MemesView from '@/views/Memes/MemesView.vue';
import SearchResultsView from '@/views/SearchResults/SearchResultsView.vue';
import ContributeView from '@/views/Contribute/ContributeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeView
        },
        {
            path: '/memes',
            component: MemesView
        },
        {
            path: '/search',
            component: SearchResultsView
        },
        {
            path: '/contribute',
            component: ContributeView
        },
        {
            path: '/:catchAll(.*)',
            component: HomeView
        }
    ]
});

export default router;
