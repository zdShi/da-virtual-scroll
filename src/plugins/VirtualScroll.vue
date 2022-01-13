<template>
  <!--滑动的主体-->
  <div
    class="scroll_container"
    ref="scrollContainer"
    @scroll.passive="handleScroll"
  >
    <div :style="fillBlank">
      <div v-for="item in sliceDataList" :key="item.id" class="item_style">
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
</template>

<script>
export default {
  name: "VirtualScroll",
  props: {
    itemHeight: {
      type: Number,
    },
    loadingTips: {
      default: "加载中。。。。",
      type: String,
    },
    dataList: {
      type: Array,
      // default: [],
    },
    isRequestStatus: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      //数据请求状态
      containerMaxCount: 0,
      //记录当前第一个item的偏移
      startIndex: 0,
      //滚动的状态，用来判断是否云处理滚动事件
      isScrollStatus: true,
      //记录当前的滚动位置
      currentScrollTop: 0,
    };
  },
  async created() {
    // console.log(this.getData);
    // let newList = await this.$emit("getDate", this.requestDataCount);
    // if (!newList) return;
    // this.dataList = newList;
  },
  mounted() {
    this.setContainerMaxCount();
    window.onresize = this.setContainerMaxCount;
    window.ondeviceorientation = this.setContainerMaxCount;
  },
  //路由使用 keep-alive的时候，可以调用 activated
  activated() {
    //将当前的滚动位置赋值给需要的位置
    this.$refs.scrollContainer.scrollTop = this.currentScrollTop;
  },
  computed: {
    //容器的最后一个item的索引
    sliceEnd() {
      let sliceEnd = this.startIndex + this.containerMaxCount;
      //如果数据源中不存在该index，则取数据源最后一个
      if (!this.dataList[sliceEnd]) {
        sliceEnd = this.dataList.length - 1;
      }
      return sliceEnd;
    },
    //定义一个 待显示显示的数组
    sliceDataList() {
      /*备注
       * startIndex代表的数据的截取起始位置
       * this.startIndex代表屏幕显示内最顶部的item在数据中的index
       * containerMaxCount代表的是视口内多可展示的item的数量*/
      // let startIndex = 0;
      // //如果当前显示的顶部index小于可以显示数量，那么从0开始截取，可以保留顶部一屏的数据
      // if (this.startIndex <= this.containerMaxCount) {
      //   startIndex = 0;
      // } else {
      //   startIndex = this.startIndex - this.containerMaxCount;
      // }
      let sliceStart =
        this.startIndex - this.containerMaxCount > 0
          ? this.startIndex - this.containerMaxCount
          : 0;
      return this.dataList.slice(sliceStart, this.sliceEnd);
    },
    //设置空白占位
    fillBlank() {
      let sliceStart =
        this.startIndex - this.containerMaxCount > 0
          ? this.startIndex - this.containerMaxCount
          : 0;
      let fillTop = sliceStart * this.itemHeight + "px";
      //底部空白，如果enIndex超过了数据长度，则不填充
      let fillBottom =
        this.dataList.length - 1 > this.sliceEnd
          ? (this.dataList.length - this.sliceEnd) * this.itemHeight + "px"
          : 0;
      return { paddingTop: fillTop, paddingBottom: fillBottom };
    },
  },
  methods: {
    //设置最大的容积
    setContainerMaxCount() {
      this.containerMaxCount =
        ~~(this.$refs.scrollContainer.offsetHeight / this.itemHeight) + 2;
      // console.log(this.containerMaxCount);
    },
    handleScroll() {
      let requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.mozRequestAnimationFrame;
      let fps = 60;
      let interval = 1000 / fps;
      let then = Date.now(); //记录时间戳
      requestAnimationFrame(() => {
        let now = Date.now(); //在下一帧获取新的时间戳
        this.setDataStatus(); //获取底部的数据
        //如果滑动速度过快，超过了屏幕刷新间隔的事件，则不处理
        if (now - then >= interval) {
          then = now;
          requestAnimationFrame(arguments.callee);
        }
      });
    },

    //上拉加载新数据
    setDataStatus() {
      //记录当前的滚动状态
      this.currentScrollTop = this.$refs.scrollContainer.scrollTop;
      //获取当前顶部item的index
      let currentIndex = ~~(this.currentScrollTop / this.itemHeight);
      //如果滚动发生在同一个item内，不进行其他处理
      if (currentIndex === this.startIndex) return;
      this.startIndex = currentIndex;
      // console.log(this.startIndex);
      //数据到底，且 ==没有处于请求状态==，防止重复请求
      if (
        this.startIndex + this.containerMaxCount > this.dataList.length - 1 &&
        !this.isRequestStatus
      ) {
        this.$emit("moreData", 10);
      }
    },
  },
};
</script>

<style scoped>
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
