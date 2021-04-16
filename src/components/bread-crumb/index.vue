<template>
  <nav class="yc-bread-crumb">
    <div class="title">
      {{ text }}
    </div>
  </nav>
</template>

<script>
export default {
  name: "BreadCrumb",
  props: {
    text: {
      type: String,
      default: "面包屑",
    },
  },
  data() {
    return {
      childMessage: "子组件",
    };
  },
};
</script>

<style lang="scss">
.yc-bread-crumb {
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid #e2e4e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #293038;
  font-weight: 700;
  line-height: 56px;
  font-size: 16px;
  background-color: #fff;
}
</style>
