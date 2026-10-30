import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Default from './layout/wrapper/index.vue'
import VueLazyload from 'vue-lazyload'

import blank from './layout/wrapper/blank.vue'
import admin from './layout/wrapper/admin.vue'
import Toaster from "@meforma/vue-toaster";
import icon from './assets/img/icon.svg';

const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/png';
link.href = icon;
document.head.appendChild(link);
const app = createApp(App)

app.use(router)
app.use(Toaster, {
  position: "top-right",
});
app.use(VueLazyload)
app.component("default-layout", Default);
app.component("blank-layout", blank);
app.component("admin-layout", admin);
app.mount("#app")