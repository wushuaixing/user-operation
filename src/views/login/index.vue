<template>
  <div class="yc-login-wrapper">
    <section class="content">
      <div class="content-left">
        <h1>
          <img src="../../assets/img/sign_logo.png" alt="" />
        </h1>
        <div class="content-left-img-box">
          <img src="../../assets/img/login-main.png" alt="" />
        </div>
      </div>
      <div class="content-form">
        <p class="title">用户登录</p>
        <el-form
          :model="params"
          :rules="rules"
          ref="loginForm"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="params.username"
              placeholder="请输入11位账号"
              maxlength="11"
              @change="(value) => (params.username = value.replace(/\D/g, ''))"
            >
              <template #prefix>
                <img
                  src="../../assets/img/account.png"
                  alt=""
                  style="width: 20px"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="params.password"
              placeholder="请输入密码"
              maxlength="20"
              @change="(value) => (params.password = value.replace(/[\W_]/g, ''))"
              class="passward-item"
              show-password
            >
              <template #prefix>
                <img
                  src="../../assets/img/pwd.png"
                  alt=""
                  style="width: 20px"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            prop="picCode"
            class="pic-code-input"
            v-if="errorCount > 3"
          >
            <el-input
              v-model="params.picCode"
              placeholder="请输入图片验证码"
              maxlength="20"
            >
              <template #prefix>
                <img
                  src="../../assets/img/pic-code.png"
                  alt=""
                  style="width: 20px"
                />
              </template>
              <template #suffix>
                <img :src="picCodeImg" alt="" @click="toRefreshImg" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="login-btn">
            <el-button
              type="primary"
              @click="onSubmit"
              :loading="loading"
              class="button-first"
            >
              登 录
            </el-button>
          </el-form-item>
          <template v-if="isLocal">
            <el-button
              type="primary"
              @click="onFill(true)"
              class="button-second"
              >管理员</el-button
            >
            <el-button
              type="primary"
              @click="onFill(false)"
              class="button-third"
              >审核人员
            </el-button>
          </template>
        </el-form>
      </div>
      <div class="content-right" />
    </section>
    <footer>
      <p>
        <span><img src="../../assets/img/logo_btm.png" alt="" /></span>
        杭州源诚科技有限公司 技术支持
      </p>
      <p>Copyright © 2018 杭州源诚科技有限公司 备案号：浙ICP备17030014号</p>
    </footer>
  </div>
</template>

<script>
import { toRaw } from 'vue';
import LoginApi from '@/server/api/login';
import { encryptInfo } from '@/utils/encrypt';
import { clearEmpty } from '@/utils';
import { ruleProcess } from '@/utils/rule';

export default {
  name: 'login',
  nameComment: '登录',
  data() {
    return {
      picCodeImg: '',
      errorCount: 0,
      loading: false,
      isLocal: false,
      params: {
        username: '',
        password: '',
        picCode: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'change' },
          { min: 11, message: '账号小于11位', trigger: 'change' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
        ],
        picCode: [
          { required: true, message: '请输入验证码', trigger: 'change' },
        ],
      },
    };
  },
  created() {
    document.title = '用户运营平台';
    this.isLocal = /localhost/.test(window.location.host);
  },
  methods: {
    onSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = clearEmpty(encryptInfo(toRaw(this.params)));
          LoginApi.preLogin(params).then((res) => {
            const {
              data: { code, data },
            } = res;
            if (code === 200) {
              const { needCode } = data || {};
              if (needCode) {
                const { picCode } = params;
                const f = () => {
                  this.loading = false;
                  this.errorCount = 4;
                  this.toRefreshImg();
                };
                if (picCode) {
                  this.login(params);
                } else {
                  f();
                }
              } else {
                this.login(params);
              }
            }
          });
        }
      });
    },
    login(params) {
      const err = (text) => this.$message.error(text);
      const defaultErr = ({ errorCount }) => {
        err('账号或密码错误');
        this.errorCount = errorCount;
        if (this.errorCount > 3) this.toRefreshImg();
      };
      const suc = ({ groupId, token, name }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', groupId);
        ruleProcess(this);
        this.$router.push({
          name: 'Index',
          params: { info: 'success', name, groupId },
        });
      };
      LoginApi.login(params)
        .then((res) => {
          const {
            data: { code, data },
          } = res;
          switch (code) {
            case 5004:
              err('验证码错误');
              this.toRefreshImg();
              break;
            case 5006:
              err('账号不存在');
              break;
            case 200:
              suc(data || {});
              break;
            default:
              defaultErr(data || {});
          }
        })
        .finally(() => (this.loading = false));
    },
    toRefreshImg() {
      const { username } = this.params;
      LoginApi.getCaptcha(username).then((res) => {
        const {
          data: { code, data },
        } = res;
        const { captcha } = data || {};
        if (code === 200) {
          this.picCodeImg = captcha;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onFill(flag) {
      this.params = {
        ...this.params,
        username: flag ? '12345678910' : '66666666666',
        password: flag ? '678910' : '666666',
      };
    },
  },
};
</script>

<style lang="scss">
.yc-login-wrapper {
  height: 100%;
  width: 100%;
  background: url("../../assets/img/login-bg.jpg") center no-repeat;
  background-size:cover;
  overflow: auto;
  min-width: 1400px;
  .content {
    padding-top: 130px;
    width: 1160px;
    height: 620px;
    margin: 0 auto;
    display: flex;
    align-items: center;

    &-left {
      background: #296dd3;
      width: 640px;
      height: 560px;
      border-radius: 4px 0 0 4px;
      box-shadow: 0px 2px 6px 0px rgba(2, 39, 95, 0.44);
      h1 {
        text-align: center;
        height: 40px;
        padding: 50px 0 44px 0;
      }

      div {
        text-align: center;
      }
    }

    &-form {
      background: #fff;
      height: 100%;
      border-radius: 4px;
      padding: 80px 70px 0;
      box-shadow: 0px 2px 6px 0px rgba(41, 109, 211, 0.21);
      box-sizing: border-box;
      .title {
        color: #293038;
        line-height: 28px;
        font-size: 28px;
        text-align: center;
        margin-bottom: 80px;
      }

      .login-form {
        .el-form-item {
          margin-bottom: 30px;
        }
        .login-btn {
          margin-top: 80px;

          .el-button {
            width: 100%;
            background: #296dd3;
            border-radius: 2px;
            height: 44px;
            span {
              font-size: 18px;
              line-height: 18px;
            }
          }
        }

        .el-input {
          width: 350px;

          .el-input__inner {
            height: 44px;
            padding: 0 48px;
          }

          .el-input__prefix {
            width: 48px;
            left: 0;
            display: flex;
            align-items: center;
            padding-left: 16px;
          }
        }

        .el-form-item__error {
          left: 50px;
          font-size: 14px;
        }

        .pic-code-input {
          .el-input__inner {
            padding-right: 135px;
          }

          .el-input__suffix {
            top: 1px;
            right: 2px;
            width: 130px;
            height: 42px;
            border-left: 1px solid #dcdfe6;
            background-color: #fafafa;
            cursor: pointer;
            img {
              height: 42px;
              width: 115px;
            }
          }
        }
      }
    }

    &-right {
      height: 560px;
      width: 30px;
      background-color: #296dd3;
      border-radius: 0 4px 4px 0;
      box-shadow: 0px 2px 6px 0px rgba(2, 39, 95, 0.44);
    }
  }

  footer {
    margin-top: 104px;

    p {
      text-align: center;
      color: #7d8699;
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 20px;

      img {
        width: 14px;
        vertical-align: middle;
        position: relative;
        top: -1px;
      }
    }
  }
}
</style>
