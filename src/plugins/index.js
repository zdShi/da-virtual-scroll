import VirtualScroll from "@/plugins/VirtualScroll";

const plugin = {
  install(Vue) {
    Vue.component("VirtualScroll", VirtualScroll);
  },
};
export default plugin;
