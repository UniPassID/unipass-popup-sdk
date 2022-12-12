import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import JsonViewer from "vue-json-viewer";

import "./assets/main.scss";

// element
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

createApp(App).use(createPinia()).use(JsonViewer).mount("#app");
