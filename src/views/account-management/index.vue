<template>
  <div class="yc-container account-management-container">
    <nav class="breadcrumb">
      <div class="title bold-text">审核账号</div>
      <el-button type="primary" icon="el-icon-plus" @click="visible = true">
        添加账号
      </el-button>
    </nav>
    <el-table
      :data="accountList"
      style="width: 100%"
      @sort-change="sortChange"
      v-loading="loading"
    >
      <el-table-column
        v-for="item in column"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sort"
        :width="item.width"
        :key="item.label"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="handleAction(scope.row, 'edit')">
            重置密码
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="handleAction(scope.row, 'del')"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="pageChange"
      background
      :current-page="page"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog title="添加账号" v-model="visible" @close="resetForm">
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
            maxlength="20"
            placeholder="请输入姓名"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="账号：" prop="phone">
          <el-input
            v-model="form.phone"
            autocomplete="off"
            maxlength="11"
            oninput="value = value.replace(/\D/g,'')"
            placeholder="请输入账号"
            @blur="handlePwd"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="form.password"
            autocomplete="off"
            maxlength="20"
            oninput="value = value.replace(/[\W_]/g,'')"
            placeholder="密码默认为账号后六位"
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
import WarningIcon from "@/assets/img/warn-icon.png";
export default {
  name: "index",
  data() {
    return {
      page: 1,
      params: {
        num: 10,
        orderField: "",
        sortOrder: "",
      },
      total: 0,
      loading: false,
      column: [
        {
          prop: "id",
          label: "ID",
          width: "180",
          sort: false,
        },
        {
          prop: "phone",
          label: "账号",
          width: "180",
          sort: false,
        },
        {
          prop: "userName",
          label: "姓名",
          width: "180",
          sort: false,
        },
        {
          prop: "normalErrorNum",
          label: "负责合作机构数",
          width: "180",
          sort: "custom",
        },
        {
          prop: "notIncludeErrorNum",
          label: "债务人数",
          width: "180",
          sort: "custom",
        },
      ],
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
          labelWidth: "120px",
          destroyOnClose: true,
        },
        rules: {
          name: [{ required: true, message: "请输入姓名", trigger: "change" }],
          phone: [
            { required: true, message: "请输入账号", trigger: "change" },
            { min: 11, message: "账号小于11位", trigger: "change" },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "change" },
          ],
        },
      },
      WarningIcon,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    pageChange(page) {
      this.page = parseInt(page);
      this.getList();
    },
    sortChange({ prop, order }) {
      this.params = {
        ...this.params,
        orderField: SORTER_TYPE[prop],
        sortOrder: SORTER_TYPE[order],
      };
      this.page = 1;
      this.getList();
    },
    handleAction({ id, userName }, action) {
      const isDel = action === "del";
      const text = isDel
        ? "删除后，该账号将无法在平台登录"
        : "重置密码后，该账号密码为账号后6位";
      const title = isDel ? `确认删除${userName}的账号?` : "确认重置密码?";
      const messageText = isDel ? "删除成功" : "重置密码成功";
      this.$confirm(text, title, {
        type: "warning",
      })
        .then(() => {
          AdminApi.delUserAndResetPwd({ id }, action).then((res) => {
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
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handlePwd() {
      const phone = this.form.phone;
      console.log(this.form.phone);
      if (/^\d{11}$/.test(phone)) {
        this.form.password =
          phone.length > 6 ? phone.substring(phone.length - 6) : phone;
      }
    },
    getList() {
      this.loading = true;
      const params = {
        ...toRaw(this.params),
        page: this.page,
      };
      AdminApi.getUsersList(params)
        .then((res) => {
          const { code, data } = res.data || {};
          if (code === 200) {
            const { list, page, total } = data || {};
            this.accountList = list;
            this.total = total;
            this.params = {
              ...this.params,
              page,
            };
          } else {
            this.$message.error("请求出错");
          }
        })
        .finally((this.loading = false));
    },
    onSubmit() {
      this.$refs["addAccountForm"].validate((valid) => {
        if (valid) {
          AdminApi.addUser(encryptInfo(toRaw(this.form))).then((res) => {
            const { code } = res.data || {};
            if (code === 5005) {
              this.$message.warning("用户已存在");
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
  }
}
</style>
