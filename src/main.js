import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "es6-promise/auto";
import axios from "axios";

import { Dialog } from "feui";
window.Dialog = Dialog;

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

import './style.less'

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
