import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import { createHead } from "@unhead/vue/client";
import "./assets/main.css";
import App from "./App.vue";
import { dbReady } from "./db/index";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

if (!import.meta.env.DEV) {
  console.debug = () => {};
  console.info = () => {};
}

const app = createApp(App);
const head = createHead();

app.use(router);
app.use(head);

dbReady.then(() => {
  app.mount(document.body);
});
