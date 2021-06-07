import { createApp } from 'vue';
import lang from 'element-plus/lib/locale/lang/zh-cn';
import locale from 'element-plus/lib/locale';
import App from '@/App.vue';
import installElementPlus from './plugins/element';
import filters from './plugins/filter';
import 'dayjs/locale/zh-cn';
import router from './router';
import store from './store';
import './assets/font/iconfont';
import './version';
import '../element-variables.scss';
import './assets/public.scss';
import './assets/font/iconfont.css';

const app = createApp(App);

app.use(router);
app.use(store);
app.config.globalProperties.$filters = filters;
installElementPlus(app);
locale.use(lang);
app.mount('#app');
