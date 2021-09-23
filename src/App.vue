<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
#app {
  font-family: Microsoft YaHei, PingFangSC-Regular, PingFang SC, Helvetica,
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #20242e;
  height: 100vh;
}

.yc-newpage-contaner {
  background-color: #edeff3;
  min-height: 100%;
  overflow: hidden;
  min-width: 1400px;
  .main-wrapper {
    margin: 20px auto;
    background-color: #fff;
    width: 1280px;
    min-height: 94vh;
    .yc-bread-crumb{
      .title{
        color: #20242E;
      }
    }
  }
}
.el-radio-button__inner{
  padding: 9px 15px!important;
  font-weight: normal!important;
  border-color: #DDE0E7!important;
  box-shadow: unset!important;
}
.el-radio-button:first-child .el-radio-button__inner{
  border-radius: 2px 0px 0px 2px!important;
}
.el-radio-button:last-child .el-radio-button__inner{
  border-radius: 0 2px 2px 0!important;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner{
  color: #296DD3!important;
  background-color: #E7F1FF!important;
  border-color: #E7F1FF!important;
  &~.el-radio-button__inner{
    border-color: #DDE0E7!important;
  }
}
</style>
