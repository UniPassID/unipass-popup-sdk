import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import "./assets/main.scss";

// element
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

createApp(App).use(createPinia()).mount("#app");
