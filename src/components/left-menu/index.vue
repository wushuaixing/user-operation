<template>
  <div class="yc-aside-container">
    <el-menu
       :default-active="$route.path.replace(/^\/([^\/]*).*$/, '/$1')"
      :default-openeds="['/index']"
      class="el-aside-menu"
      background-color="#19283F"
      text-color="#fff"
      router
      active-text-color="#fff"
      unique-opened="true"
    >
      <template
        v-for="item in role === '204' ? userMenu : adminMenu"
        :key="item.text"
      >
        <el-submenu v-if="item.child" :index="item.path">
          <template #title>
            <i :class="item.icon"></i>
            <span>{{ item.text }}</span>
          </template>
          <el-menu-item
            v-for="childItem in item.child"
            :key="childItem.key"
            :index="childItem.path"
            :route="{ path: childItem.path }"
          >
            <i v-if="childItem.icon" :class="childItem.icon"></i>
            <template #title>{{ childItem.text }}</template>
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          v-else
          :key="item.key"
          :index="item.path"
          :route="{ path: item.path, query: {id: ''} }"
        >
          <i :class="item.icon"></i>
          <template #title
            >{{ item.text }}
            <svg
              class="icon"
              aria-hidden="true"
              v-if="
                item.key === 'TaskAssign' &&
                Number($store.state.toBeAllocatedNum)
              "
              style="font-size: 16px; position: relative; top: 1px"
            >
              <use xlink:href="#iconfenpei"></use>
            </svg>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { userMenu, adminMenu } from "../../utils/rule";
export default {
  name: "index",
  nameComment: "左侧导航栏",
  data() {
    return {
      userMenu,
      adminMenu,
      roleName: "",
    };
  },
  props: {
    role: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss">
.yc-aside-container {
  .el-aside-menu {
    .is-active {
      background-color: #296dd3 !important;
    }
  }
  .el-submenu {
    width: 220px;
    &__title {
      height: 58px;
      line-height: 58px;
      color: rgba(255, 255, 255, 0.8) !important;
      font-size: 16px;
      i {
        color: rgba(255, 255, 255, 0.8);
      }
    }
    &::after {
      content: none !important;
    }
    .el-menu-item {
      padding-left: 44px !important;
      height: 46px;
      line-height: 46px;
      font-size: 14px;
    }
  }

  .el-menu-item {
    width: 220px;
    position: relative;
    height: 58px;
    line-height: 58px;
    opacity: 0.8;
    font-size: 16px;
  }
  .iconfont {
    margin-right: 8px;
    position: relative;
    top: -1px;
  }
  .is-active {
    opacity: 1;
    &::after {
      display: block;
      content: "";
      border-width: 6px 7px 6px 7px;
      border-style: solid;
      border-color: transparent #eef1f7 transparent transparent;
      position: absolute;
      right: 0;
      top: calc(50% - 6px);
    }
    .el-submenu__title{
      color: #fff !important;
      i {
        color: #fff !important;
      }
    }
  }

}
</style>
