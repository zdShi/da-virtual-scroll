import Vue from "vue";
import App from "./App.vue";
//导入路由
import router from "./router";
import axios from "axios";
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

//注册自定义插件
import VirtualScroll from "@/plugins";
Vue.use(VirtualScroll);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
