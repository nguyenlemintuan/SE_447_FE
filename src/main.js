import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/storefront.css'
import './assets/css/taste-overrides.css'

import Default from './layout/wrapper/index.vue'
import VueLazyload from 'vue-lazyload'

import blank from './layout/wrapper/blank.vue'
import admin from './layout/wrapper/admin.vue'
import Toaster from "@meforma/vue-toaster";

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
