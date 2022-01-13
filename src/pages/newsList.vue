<template>
  <div class="list_box" ref="box" @click="toDetail($event)">
    <VirtualScroll
      :itemHeight="itemHeight"
      :dataList="newsList"
      :loadingTips="loadingTips"
      :isRequestStatus="isRequestStatus"
      @moreData="getData"
    />
  </div>
</template>

<script>
import { nanoid } from "nanoid";
export default {
  name: "newsList",
  data() {
    return {
      //数据源
      newsList: [],
      //请求状态信息
      loadingTips: "小二正在努力，请耐心等待---",
      //单条数据的高度
      itemHeight: 130,
      isRequestStatus: true,
    };
  },
  async created() {
    this.getData(10);
  },
  methods: {
    //跳转到详情
    toDetail(e) {
      console.log(e.target);
      this.$router.push({ name: "newDetail" });
    },
    //获取数据
    getData(num) {
      let newData = [];
      this.isRequestStatus = true;
      this.$axios
        .get(`http://localhost:4000/data?num=${num}`)
        .then((res) => {
          this.isRequestStatus = false;
          newData = res.data.list;
          newData.map((item) => (item.id = nanoid()));
          console.log(newData);
          this.newsList = [...this.newsList, ...newData];
        })
        .catch((err) => {
          window.console.log(err);
          this.loadingTips = "网络似乎开小差了---";
        });
    },
  },
};
</script>

<style scoped>
.list_box {
  width: 100%;
  height: 100%;
}
</style>
