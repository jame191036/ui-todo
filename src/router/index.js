import { createRouter, createWebHistory } from 'vue-router';

// Import your pages/components
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';
import Register from '@/pages/user/Register.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/register', name: 'Register', component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
