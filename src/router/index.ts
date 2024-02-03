import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '../pages/index.vue'
import Blog from '../components/Blog.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: IndexPage
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../pages/about.vue')
        },
        {
            path: '/blog/:id',
            component: Blog
        }
    ]
})

export default router