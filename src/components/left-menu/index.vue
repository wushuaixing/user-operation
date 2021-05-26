<template>
  <div class="yc-aside-container">
    <el-menu
      :default-active="$route.path"
      :default-openeds="['/index']"
      class="el-aside-menu"
      background-color="#19283F"
      text-color="#fff"
      router
      active-text-color="#fff"
      unique-opened="true"
    >
      <template
        v-for="item in role === '204' ?userMenu: adminMenu "
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
          :route="{ path: item.path }"
        >
          <i :class="item.icon"></i>
          <template #title>{{ item.text }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "index",
  nameComment: "左侧导航栏",
  data() {
    return {
      adminMenu: [
        {
          text: "账号管理",
          icon: "iconfont iconyonghuyunying-zhanghaoguanli",
          path: "/index",
          key: "Instructions",
          child: [
            {
              text: "运营账号",
              path: "/index",
              key: "Instructions",
            },
          ],
        },
        {
          text: "客户管理",
          icon: "iconfont iconyonghuyunying-kehuguanli",
          path: "/customerManagement",
          key: "CustomerManagement",
        },
        {
          text: "顶级机构分配",
          icon: "iconfont iconyonghuyunying-shenherenwufenpei",
          path: "/taskAssign",
          key: "TaskAssign",
        },
      ],
      userMenu: [
        {
          text: "数据审核",
          icon: "el-icon-picture-outline-round",
          path: "/index",
          key: "DataAudit",
        },
        {
          text: "文书搜索",
          icon: "el-icon-present",
          path: "/documentSearch",
          key: "DocumentSearch",
        },
      ],
      roleName: "",
    };
  },
  props: {
    role: {
      type: String,
      default: "",
    },
  },
  created() {
    console.log(this.role);
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
    &__title{
      height: 58px;
      line-height: 58px;
    }
    &::after{
      content: none !important;
    }
    .el-menu-item {
      padding-left: 44px !important;
      height: 46px;
      line-height: 46px;
    }
  }

  .el-menu-item {
    width: 220px;
    position: relative;
    height: 58px;
    line-height: 58px;
    opacity: 0.8;
  }
  .iconfont {
    margin-right: 8px;
    position: relative;
    top: -1px;
  }
  .is-active {
    opacity: 1;
    &::after{
      display:block;
      content:'';
      border-width: 6px 7px 6px 7px;
      border-style:solid;
      border-color: transparent #EEF1F7 transparent transparent;
      position:absolute;
      right:0;
      top:calc(50% - 6px);
    }
  }
}
</style>
