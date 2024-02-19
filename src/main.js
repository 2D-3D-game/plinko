import { createApp } from "vue";
import { createPinia } from 'pinia'
import { install } from '~/core/i18n'
import {initWujie} from '~/core/initWujie'
import SideBar from "./components/SideBar.vue";
import App from "./App.vue";

import "./assets/css/style.css";

initWujie()

const pinia = createPinia()

const app = createApp(App)
const sidebar = createApp(SideBar)

install(app)
install(sidebar)

app.use(pinia).mount("#myapp");
sidebar.use(pinia).mount("#app");
