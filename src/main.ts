import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'virtual:svg-icons-register';
import '@unocss/reset/tailwind-compat.css';
import 'virtual:uno.css';

import '@/styles/main.scss';
import App from './App.vue';
import router from './router';
import '@/router/router-guard';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
