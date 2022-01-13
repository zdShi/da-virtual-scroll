<template>
  <div class="list_box" ref="box">
    <!--滑动的主体-->
    <div
      class="scroll_container"
      ref="scrollContainer"
      @scroll.passive="handleScroll"
    >
      <div :style="fillBlank">
        <div v-for="item in showDataList" :key="item.id" class="item_style">
          <h3>{{ item.title }}</h3>
          <p>{{ item.from }}</p>
          <span>{{ item.date }}</span>
        </div>
        <!--提示信息-->
        <div v-if="isRequestStatus" class="loadingTips">
          <h3>{{ loadingTips }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "news",
  data() {
    return {
      //数据源
      dataList: [],
      //数据请求状态
      isRequestStatus: true,
      //请求状态信息
      loadingTips: "小二正在努力，请耐心等待---",
      //单条数据的高度
      itemHeight: 130,
      containerMaxCount: 0,
      //记录当前第一个item的偏移
      startIndex: 0,
      //滚动的状态，用来判断是否云处理滚动事件
      isScrollStatus: true,
    };
  },
  async created() {
    let newList = await this.getData(20);
    if (!newList) return;
    this.dataList = newList;
  },
  mounted() {
    this.setContainerMaxCount();
    window.onresize = this.setContainerMaxCount;
    window.ondeviceorientation = this.setContainerMaxCount;
  },
  computed: {
    //容器的最后一个item的索引
    endIndex() {
      let endIndex = this.startIndex + this.containerMaxCount;
      //如果数据源中不存在该index，则取数据源最后一个
      if (!this.dataList[endIndex]) {
        endIndex = this.dataList.length - 1;
      }
      return endIndex;
    },
    //定义一个 待显示显示的数组
    showDataList() {
      return this.dataList.slice(this.startIndex, this.endIndex);
    },
    //设置空白占位
    fillBlank() {
      //顶部空白
      let fillTop = this.startIndex * this.itemHeight + "px";
      //底部空白，如果enIndex超过了数据长度，则不填充
      let fillBottom =
        this.dataList.length - 1 > this.endIndex
          ? (this.dataList.length - this.endIndex) * this.itemHeight + "px"
          : 0;
      return { paddingTop: fillTop, paddingBottom: fillBottom };
    },
  },
  methods: {
    //获取数据
    getData(num) {
      this.isRequestStatus = true;
      return this.$axios
        .get(`http://localhost:4000/data?num=${num}`)
        .then((res) => {
          this.isRequestStatus = false;
          return res.data.list;
        })
        .catch((err) => {
          window.console.log(err);
          this.loadingTips = "网络似乎开小差了---";
          return false;
        });
    },
    //设置最大的容积
    setContainerMaxCount() {
      this.containerMaxCount =
        ~~(this.$refs.scrollContainer.offsetHeight / this.itemHeight) + 2;
      // console.log(this.containerMaxCount);
    },
    async handleScroll() {
      //判断是否允许处理滚动事件
      if (this.isScrollStatus) {
        this.isScrollStatus = false;
        // 中后可以再次处理滚动事件，至于事件的设置一般是按照屏幕的刷新率来设置
        let timer = setTimeout(() => {
          this.isScrollStatus = true;
          clearTimeout(timer);
        }, 30);
        //获取当前顶部item的index
        let currentIndex = ~~(
          this.$refs.scrollContainer.scrollTop / this.itemHeight
        );
        //如果滚动发生在同一个item内，不进行其他处理
        if (currentIndex === this.startIndex) return;
        this.startIndex = currentIndex;
        //上拉加载新数据
        await this.getNewData();
      }
      //添加定时器节流
    },
    //上拉加载新数据
    async getNewData() {
      //数据到底，且 ==没有处于请求状态==，防止重复请求
      if (
        this.startIndex + this.containerMaxCount > this.dataList.length - 1 &&
        !this.isRequestStatus
      ) {
        // console.log("到底部了，可以开始加载了");
        let newList = await this.getData(20);
        if (!newList) return;
        //合并新的数据
        this.dataList = [...this.dataList, ...newList];
      }
    },
  },
};
</script>

<style scoped>
.list_box {
  width: 100%;
  height: 100%;
}
.scroll_container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.scroll_container::before,
.scroll_container::after {
  content: "";
  display: table;
  clear: both;
}
.item_style {
  box-sizing: border-box;
  height: 130px;
  padding: 20px;
  border: solid 1px silver;
}
.loadingTips {
  text-align: center;
  padding: 20px 0;
}
</style>
