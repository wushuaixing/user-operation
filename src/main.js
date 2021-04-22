import { createApp } from "vue";
import App from "@/App";
import installElementPlus from "./plugins/element";
import filters from "./plugins/filter";
import "dayjs/locale/zh-cn";
import router from "./router";
import lang from "element-plus/lib/locale/lang/zh-cn";
import locale from "element-plus/lib/locale";
import store from "./store";
import '../element-variables.scss';
import "./assets/public.scss";

const app = createApp(App);

app.use(router);
app.use(store);
app.config.globalProperties.$filters = filters;
installElementPlus(app);
locale.use(lang);
app.mount("#app");
