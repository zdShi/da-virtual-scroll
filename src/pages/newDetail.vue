<template>
  <div>
    <button @click="back">返回</button>
    <h1>这里是详情页</h1>
  </div>
</template>

<script>
export default {
  name: "newDetail",
  methods: {
    back() {
      this.$router.back();
    },
  },
};
</script>

<style scoped></style>
