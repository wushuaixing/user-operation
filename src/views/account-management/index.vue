<template>
  <div class="yc-container account-management-container">
    <nav class="breadcrumb">
      <div class="title bold-text">运营账号</div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="visible = true"
        class="button-first"
      >
        添加账号
      </el-button>
    </nav>
    <el-table
      :data="accountList"
      style="width: 100%"
      @sort-change="sortChange"
      v-loading="loading"
    >
      <template #empty>
        <img src="../../assets/img/no_data.png" alt="" />
        <p>暂无数据</p>
      </template>
      <el-table-column
        v-for="item in column"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sort"
        :width="item.width"
        :key="item.class"
        :align="item.align"
        :class-name="item.class"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="text"
            @click="handleAction(scope.row, 'edit')"
            class="button-link"
          >
            重置密码
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            @click="handleAction(scope.row, 'del')"
            class="button-link"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="pageChange"
      @size-change="sizeChange"
      background
      :current-page="page"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="params.num"
      layout="total,sizes, prev, pager, next, jumper"
      :total="total"
    />
    <el-dialog
      title="添加账号"
      v-model="visible"
      @close="resetForm"
      width="500px"
    >
      <el-form
        :model="form"
        ref="addAccountForm"
        v-bind="formOptions.options"
        :rules="formOptions.rules"
      >
        <el-form-item label="姓名：" prop="name">
          <el-input
            v-model="form.name"
            autocomplete="off"
            maxlength="100"
            placeholder="请输入姓名"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="账号：" prop="phone">
          <el-input
            v-model="form.phone"
            autocomplete="off"
            maxlength="11"
            @change="(value) => (form.phone = value.replace(/\D/g, ''))"
            placeholder="请输入手机号"
            @blur="handlePwd"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="form.password"
            autocomplete="off"
            maxlength="20"
            @change="(value) => (form.password = value.replace(/[\W_]/g, ''))"
            placeholder="密码默认为账号后六位"
            show-password
            class="passward-item"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import AdminApi from "@/server/api/admin";
import { toRaw } from "vue";
import { encryptInfo } from "@/utils/encrypt";
import { SORTER_TYPE } from "@/utils/static";
import { accountManagementColumn } from "@/static/column";
import { $modalConfirm } from "@/utils/better-el";
export default {
  name: "index",
  nameComment: "账号管理-运营账号",
  data() {
    return {
      page: 1,
      params: {
        num: 10,
        sortColumn: "",
        sortOrder: "",
      },
      total: 0,
      loading: false,
      column: accountManagementColumn,
      accountList: [],
      visible: false,
      form: {
        name: "",
        phone: "",
        password: "",
      },
      formOptions: {
        options: {
          labelPosition: "right",
          labelWidth: "126px",
          destroyOnClose: true,
          class: "add-account-modal",
        },
        rules: {
          name: [{ required: true, message: "请输入姓名", trigger: "change" }],
          phone: [
            { required: true, message: "请输入手机号", trigger: "change" },
            { min: 11, message: "账号小于11位", trigger: "change" },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "change" },
            { min: 6, message: "密码小于6位", trigger: "change" },
          ],
        },
      },
    };
  },
  created() {
    this.getList();
    document.title = "运营账号";
  },
  methods: {
    //翻页
    pageChange(page) {
      this.page = parseInt(page);
      this.getList();
    },
    //pageSize 改变
    sizeChange(num) {
      this.params = {
        ...this.params,
        num,
      };
      setTimeout(() => {
        this.page = 1;
        this.getList();
      }, 10);
    },
    //排序
    sortChange({ prop, order }) {
      this.params = {
        ...this.params,
        sortColumn: SORTER_TYPE[prop],
        sortOrder: SORTER_TYPE[order],
      };
      this.page = 1;
      this.getList();
    },
    //重置密码 && 删除账号
    handleAction({ id, name }, action) {
      const isDel = action === "del";
      const text = isDel
        ? "点击确定，该账号将被删除并无法在用户运营平台登录"
        : "点击确定，密码将被重置为账号后6位";

      const title = isDel ? `确认删除${name}的账号?` : "确认重置密码?";
      const messageText = isDel ? "删除成功" : "重置密码成功";
      $modalConfirm({ text, title })
        .then(() => {
          AdminApi.delUserAndResetPwd({ id }, action)
            .then((res) => {
              const { code } = res.data || {};
              if (code === 200) {
                this.$message.success({
                  message: messageText,
                  duration: 1000,
                  onClose: () => {
                    this.getList();
                  },
                });
              } else {
                this.$message.error(res.data.message);
              }
            })
            .then(() => {
              isDel && this.$store.dispatch("getNumAction");
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //添加账号-密码默认为账号后六位
    handlePwd() {
      const phone = this.form.phone;
      if (/^\d{11}$/.test(phone)) {
        this.form.password =
          phone.length > 6 ? phone.substring(phone.length - 6) : phone;
      }
    },
    //列表数据
    getList() {
      this.loading = true;
      const params = {
        ...toRaw(this.params),
        page: this.page,
      };
      AdminApi.getAccountList(params)
        .then((res) => {
          const { code, data } = res.data || {};
          if (code === 200) {
            const { list, page, total } = data || {};
            this.accountList = list;
            this.total = total;
            this.page = page;
          } else {
            this.$message.error("请求出错");
          }
        })
        .finally(() => (this.loading = false));
    },
    //添加账号
    onSubmit() {
      this.$refs["addAccountForm"].validate((valid) => {
        if (valid) {
          AdminApi.addAccount(encryptInfo(toRaw(this.form))).then((res) => {
            const { code } = res.data || {};
            if (code === 5005) {
              this.$message.warning("账号已存在");
            } else if (code === 200) {
              this.$message.success({
                message: "添加成功",
                duration: 1000,
                onClose: () => {
                  this.visible = false;
                  this.getList();
                },
              });
            } else {
              this.$message.error("添加失败");
            }
          });
        }
      });
    },
    resetForm() {
      this.$refs["addAccountForm"].resetFields();
    },
  },
};
</script>
<style lang="scss">
.account-management-container {
  padding-top: 16px !important;
  nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    align-items: center;

    .title {
      line-height: 20px;
      border-left: 3px solid #296dd3;
      height: 20px;
      padding-left: 8px;
    }
    .el-button {
      width: 100px;
      padding: 0;
      i {
        font-size: 12px;
      }
    }
  }
  tbody {
    .org-num {
      padding-right: 25px;
    }
    .obligor-num {
      padding-right: 18px;
    }
  }
}
.add-account-modal {
  padding-right: 75px;
  .el-form {
    &-item {
      margin-bottom: 16px !important;
      &:last-child {
        margin-bottom: 36px !important;
      }
    }
  }
}
</style>
