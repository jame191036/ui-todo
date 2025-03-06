import { createRouter, createWebHistory } from 'vue-router';

// Import your pages/components
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';
import Login from '@/pages/Login.vue';
import Register from '@/pages/user/Register.vue';
import ListUser from '@/pages/user/ListUser.vue';
import DetailUser from '@/pages/user/DetailUser.vue';
import ListTask from '@/pages/task/ListTask.vue';
import DetailTask from '@/pages/task/DetailTask.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/list-user', name: 'ListUser', component: ListUser },
  { path: '/detail-user/:user_id', name: 'DetailUser', component: DetailUser },
  { path: '/list-task', name: 'ListTask', component: ListTask },
  { path: '/detail-task/:task_id', name: 'DetailTask', component: DetailTask },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
