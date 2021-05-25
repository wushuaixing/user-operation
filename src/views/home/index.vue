<template>
  <el-container v-if="!loading">
    <el-header>
      <TopMenu :name="name" />
    </el-header>
    <el-container>
      <el-aside width="220px">
        <LeftMenu :role="roleName" />
      </el-aside>
      <el-main>
        <div class="yc-main-wrapper">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TopMenu from "@/components/top-menu";
import LeftMenu from "@/components/left-menu";
import LoginApi from "@/server/api/login";

export default {
  name: "Home",
  data() {
    return {
      name: "",
      loading: false,
      roleName: "",
    };
  },
  components: {
    TopMenu,
    LeftMenu,
  },
  created() {
    const {
      params: { info, name, groupId },
    } = this.$route;
    if (info === "success") {
      this.$message.success("登录成功");
      this.name = name;
      this.roleName = groupId;
    } else {
      this.loading = true;
      LoginApi.getUserInfo().then((res) => {
        const {
          data: { code, data },
        } = res;
        const { name, groupId } = data || {};
        if (code === 200) {
          this.name = name;
          this.loading = false;
          this.roleName = groupId;
        } else {
          this.$router.push("/login");
        }
      });
    }
  },
};
</script>

<style lang="scss">
.el-container {
  height: 100%;
  overflow: auto;
}

.el-main {
  overflow: auto;
  background-color: #f0f2f5;

  .yc-main-wrapper {
    .yc-container {
      padding: 20px;
      background: #fff;
      min-height: 83vh;
    }
  }
}

.el-header {
  color: #fff;
  height: 60px !important;
}

.el-aside {
  background-color: #19283f;
  height: 100%;
}
</style>
