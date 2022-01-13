import Vue from "vue";
import Router from "vue-router";

//新闻列表，异步路由
// const newsList = import("../pages/newsList.vue");
// const newDetail = import("../pages/newDetail.vue");
import newsList from "../pages/newsList";
import newDetail from "../pages/newDetail";
Vue.use(Router);
export default new Router({
  routes: [
    {
      path: "/",
      name: "newsList",
      component: newsList,
    },
    {
      path: "/newDetail",
      name: "newDetail",
      component: newDetail,
    },
  ],
});
