<template>
  <div class="yc-header-container">
    <div class="title">
      <img :src="logo" alt="" />
      <span>源诚用户运营平台</span>
    </div>
    <div class="user-message">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          hi,{{ name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-check" @click="visible = true">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-check" @click="loginOut">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      v-model="visible"
      @close="resetForm"
      width="500px"
      custom-class="change-pwd-modal"
    >
      <el-form
        :model="form"
        ref="editPwdForm"
        v-bind="formOptions.options"
        :rules="formOptions.rules"
      >
        <el-form-item label="原密码：" prop="oldPassword">
          <el-input
            v-model="form.oldPassword"
            autocomplete="off"
            maxlength="20"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            autocomplete="off"
            maxlength="20"
            oninput="value = value.replace(/[\W_]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            autocomplete="off"
            maxlength="20"
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
import logoImg from "@/assets/img/top_logo.png";
import { encryptEditPwd } from "@/utils/encrypt";
import { toRaw } from "vue";
import LoginApi from "@/server/api/login";

export default {
  name: "index",
  nameComment:'顶部导航栏',
  data() {
    const validateOld = (rule, value, callback) => {
      if (this.form.newPassword !== "") {
        this.$refs.editPwdForm.validateField("newPassword");
      }
      callback();
    };
    const validateNew = (rule, value, callback) => {
      if (value === this.form.oldPassword) {
        callback(new Error("新密码不能与原密码一致!"));
      }
      if (this.form.confirmPassword !== "") {
        this.$refs.editPwdForm.validateField("confirmPassword");
      }
      callback();
    };
    const validateConfirm = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      logo: logoImg,
      visible: false,
      form: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      formOptions: {
        options: {
          labelPosition: "right",
          labelWidth: "120px",
          destroyOnClose: true,
        },
        rules: {
          oldPassword: [
            { required: true, message: "请输入原密码", trigger: "blur" },
            { validator: validateOld, trigger: "blur" },
          ],
          newPassword: [
            { required: true, message: "请输入新密码", trigger: "blur" },
            { min: 6, message: "密码不能小于6位", trigger: "change" },
            { validator: validateNew, trigger: "blur" },
          ],
          confirmPassword: [
            { required: true, message: "请再次输入新密码", trigger: "blur" },
            { validator: validateConfirm, trigger: "blur" },
          ],
        },
      },
    };
  },
  props: {
    name: {
      type: String,
      default: "",
    },
  },
  methods: {
    onSubmit() {
      this.$refs["editPwdForm"].validate((valid) => {
        if (valid) {
          const { oldPassword, newPassword } = encryptEditPwd(toRaw(this.form));
          LoginApi.editPassword({ oldPassword, newPassword }).then((res) => {
            if (res.data.code === 200) {
              this.$message.success({
                message: "密码修改成功",
                onClose: () => {
                  localStorage.clear();
                  this.$router.push("/login");
                  this.visible = false;
                },
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    },
    resetForm() {
      this.$refs["editPwdForm"].resetFields();
    },
    loginOut() {
      this.$confirm("确认退出登录吗", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
        closeOnClickModal: false,
      })
        .then(() => {
          LoginApi.loginOut().then(() => {
            localStorage.clear();
            this.$router.push("/login");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
.el-header {
  padding: 0;
}

.yc-header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    display: flex;
    align-items: center;
    height: 100%;
    background-color: #132032;
    padding: 0 25px 0 20px;

    span {
      font-size: 16px;
      margin-left: 6px;
      font-weight: 700;
    }
  }

  .user-message {
    //&:hover {
    //  background-color: #0286d5;
    //}
    .el-dropdown {
      &:hover {
        color: #296dd3;
      }

      .el-dropdown-selfdefine {
        display: flex;
        min-width: 80px;
        padding: 0 20px;
        height: 50px;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.el-dropdown__popper {
  top: 50px !important;
  left: unset !important;
  right: 0 !important;
  width: 120px;
  border-radius: 0;

  .el-dropdown-menu {
    padding: 0;
  }

  .el-popper__arrow::before {
    content: none;
  }
}

.change-pwd-modal {
  .el-dialog__body {
    .el-form {
      padding: 0 30px;
    }
  }
}
</style>
