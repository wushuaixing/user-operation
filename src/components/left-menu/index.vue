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
    >
      <template
        v-for="item in role === 'Admin' ? adminMenu : userMenu"
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
            <i :class="item.icon"></i>
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
  nameComment:'左侧导航栏',
  data() {
    return {
      adminMenu: [
        {
          text: "账号管理",
          icon: "el-icon-menu",
          path: "/index",
          key: "Instructions",
          child: [
            {
              text: "审核账号",
              icon: "el-icon-menu",
              path: "/index",
              key: "Instructions",
            },
          ],
        },
        {
          text: "客户管理",
          icon: "el-icon-present",
          path: "/customerManagement",
          key: "CustomerManagement",
        },
        {
          text: "审核任务分配",
          icon: "el-icon-picture-outline-round",
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

  .el-submenu,
  .el-menu-item {
    width: 200px;
  }
}
</style>
