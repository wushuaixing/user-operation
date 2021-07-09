<template>
  <el-dialog
    v-model="visible"
    width="500px"
    @close="close"
    :lock-scroll="false"
    custom-class="org-account-modal"
  >
    <template #title>
      <span class="dialog-title">
        <span class="title">{{title}}</span>
        <span class="level mark" v-if="type === 'edit' && modalType === 'org'" style="font-weight: normal">{{`${acountList[editObj.level - 2]}级`}}</span>
        <span class="role mark" v-if="type === 'edit' && modalType === 'account'" :style="roleTitle">
          <svg class="icon" aria-hidden="true" style="font-size: 14px;" v-if="editObj.roleName === '管理员用户'">
            <use xlink:href="#iconguanliyuanyonghu"></use>
          </svg>
          <svg class="icon" aria-hidden="true" style="font-size: 14px;" v-else>
            <use xlink:href="#iconchaxunyonghu"></use>
          </svg>
          {{editObj.roleName}}</span>
      </span>
    </template>
    <el-form :model="orgForm" :rules="rules" ref="orgForm" label-width="145px" class="org-account-modal-form">
      <template v-if="this.modalType === 'org'">
        <el-form-item
          label="机构名称："
          prop="name"
          :style="'margin-bottom:' + (type === 'add' ? '15px' : '24px')"
        >
          <el-input
            ref="nameInput"
            v-model="orgForm.name"
            style="width: 300px;"
            autocomplete="off"
            maxlength="100"
            placeholder="请输入机构名称"
            @change="(val) => orgForm.name = val.replace(/\s+/g, '')"
          ></el-input>
          <el-input style="display: none"></el-input>
        </el-form-item>
        <el-form-item label="机构层级：" v-if="type === 'add'" class="no-bottom">
          <span>{{modalObj.level - 1}}级</span>
        </el-form-item>
        <el-form-item label="剩余机构数：" v-if="type === 'add'" class="no-bottom">
          <span>{{modalObj.isSubOrgLimit ? modalObj.restSubOrgCount : '不限'}}</span>
        </el-form-item>
        <el-form-item
          label="上级机构ID："
          prop="parentId"
          v-if="type === 'edit'"
          class="need-bottom"
        >
          <el-select
            v-model="orgForm.parentId"
            style="width: 300px"
            placeholder="请选择上级机构ID"
            filterable
          >
            <el-option
              v-for="item in parentOrg"
              :label="item.id"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="上级机构名称："
          prop="parentName"
          v-if="type === 'edit'"
          class="need-bottom"
        >
          <el-input
            :modelValue="dynamicParentName"
            autocomplete="off"
            :disabled="true"
            style="width: 300px"
            placeholder="请输入上级机构名称"
          />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="账号：" v-if="type === 'edit'" style="margin-bottom: 12px;">
          <span>{{orgForm.phone}}</span>
        </el-form-item>
        <el-form-item label="姓名：" prop="name" class="need-bottom">
          <el-input
            v-model="orgForm.name"
            style="width: 300px;"
            autocomplete="off"
            maxlength="100"
            placeholder="请输入姓名"
            @change="(val) => orgForm.name = val.replace(/\s+/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号：" prop="phone" v-if="type === 'add'" class="need-bottom">
          <el-input
            v-model="orgForm.phone"
            style="width: 300px;"
            autocomplete="off"
            maxlength="11"
            @change="(value) => (orgForm.phone = value.replace(/\D/g, ''))"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password" v-if="type === 'add'" class="need-bottom">
          <el-input
            ref="accountPwd"
            v-model="orgForm.password"
            style="width: 300px;"
            placeholder="密码默认为当天日期"
            autocomplete="off"
            maxlength="20"
            @change="(value) => (orgForm.password = value.replace(/[\W_]/g, ''))"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="roleId" style="margin-bottom: 15px">
          <el-select v-model="orgForm.roleId" placeholder="请选择角色" style="width: 300px;">
            <el-option v-for="item in roleList" :label="item.value" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="剩余账号数：" v-if="type === 'add'" class="no-bottom">
          <span>{{modalObj.isAccountLimit ? modalObj.restAccountCount : '不限'}}</span>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="onsubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import AdminApi from '@/server/api/admin';
import { toRaw } from 'vue';
import { encryptInfo } from '@/utils/encrypt';
import { dateUtils } from '@/utils';

export default {
  name: 'OrgAccountModal',
  nameComment: '顶级机构详情页-子机构创建编辑-本级账号创建编辑',
  emits: ['afterAction'],
  props: {
    roleList: {
      type: Array,
      default: () => [],
    },
    modalObj: {
      type: Object,
      default: () => {},
    },
    acountList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false,
      type: 'add', // 操作类型 add edit
      modalType: '', // 弹窗是操作子机构还是账号 org account
      editObj: {}, // 编辑的对象
      title: '创建',
      parentOrg: [],
      orgForm: {
        name: '',
        phone: '',
        password: '',
        parentId: '',
        roleId: '',
      },
      rules: {
        parentId: [
          { required: true, message: '上级机构ID不允许为空', trigger: 'change' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          {
            min: 11, max: 11, message: '账号小于11位', trigger: 'change',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6, max: 20, message: '密码小于6位', trigger: 'change',
          },
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' },
        ],
      },
    };
  },
  computed: {
    // 上级机构名称(随上级机构Id联动)
    dynamicParentName() {
      const { parentId } = this.orgForm;
      return ((this.parentOrg || []).filter((i) => i.id === parentId)[0] || {})
        .value;
    },
    roleTitle() {
      return this.editObj.role === '181'
        ? {
          background: '#E7F1FF',
          color: '#296DD3',
          fontWeight: 'normal',
        }
        : {
          background: '#DAF5EB',
          color: '#1BBA7C',
          fontWeight: 'normal',
        };
    },
  },
  methods: {
    open(type, modalType, obj) {
      this.type = type;
      this.modalType = modalType;
      const ruleName = [
        { required: true, message: this.modalType === 'org' ? '请输入机构名称' : '请输入姓名', trigger: 'change' },
      ];
      this.rules = Object.assign(this.rules, { name: ruleName });
      if (type === 'edit') {
        this.editObj = { ...obj };
        this.title = `编辑：${obj.name}`;
        if (modalType === 'org') {
          this.orgForm.name = obj.name;
          this.orgForm.parentId = obj.parentId;
          AdminApi.selectParentOrgList(obj.id).then((res) => {
            const { code, data = [] } = res.data || {};
            if (code === 200) {
              this.parentOrg = data;
            } else {
              this.$message.error('请求错误');
            }
          });
        } else {
          const { name, phone } = obj;
          const roleId = Number(obj.role);
          this.orgForm = { ...{ name, phone, roleId } };
        }
      } else {
        this.orgForm = Object.assign(this.orgForm, {
          name: '',
          phone: '',
          password: dateUtils.formatStandardDate(new Date()).replace(/-/g, ''),
          parentId: '',
          roleId: 181,
        });
        // 密码赋值日期后六位
        this.title = modalType === 'org' ? '创建子机构' : '创建本级账号';
      }
      this.visible = true;
    },
    // 添加账号-密码默认为账号后六位
    // handlePwd() {
    //   const { phone } = this.orgForm;
    //   if (phone.length === 11) {
    //     this.orgForm.password = phone.substring(phone.length - 6);
    //     this.$refs.orgForm.clearValidate('password');
    //   }
    // },
    close() {
      this.$refs.orgForm.resetFields();
      this.visible = false;
    },
    onsubmit() {
      this.$refs.orgForm.validate((valid) => {
        if (valid) {
          let params = toRaw(this.orgForm);
          let api;
          let messageTip = '';
          if (this.type === 'add') {
            if (this.modalType === 'org') {
              // 机构新增
              params.parentId = this.modalObj.id;
              api = () => AdminApi.detailAddSubOrg(params);
              messageTip = '机构创建成功';
            } else {
              // 账号新增
              params.orgId = this.modalObj.id;
              params = encryptInfo(params);
              api = () => AdminApi.detailAddOrgUser(params);
              messageTip = '账号创建成功';
            }
          } else {
            // 编辑
            params.id = this.editObj.id;
            if (this.modalType === 'org') {
              api = () => AdminApi.detailChangeSubOrg(params);
              messageTip = '机构编辑成功';
            } else {
              api = () => AdminApi.detailEditOrgUser(params);
              messageTip = '账号编辑成功';
            }
          }
          api().then((res) => {
            const { code, message } = res.data;
            if (code === 200) {
              this.$message.success(messageTip);
              this.$emit('afterAction');
              // 关闭弹窗 刷新页面
              this.visible = false;
            } else if (code === 5005) {
              this.$message.warning('账号已存在');
            } else {
              this.$message.error(message);
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
  .org-account-modal {
    .dialog-title {
      display: flex;
      .title {
        font-weight: 600;
        color: #20242E;
        font-size: 16px;
        line-height: 16px;
        display: flex;
        align-items: center;
      }
      .level {
        color: #FF871C;
        border-radius: 2px;
        border: 1px solid #FF871C;
      }
      .role {
        color: #296DD3;
        background: #E7F1FF;
        border-radius: 2px;
      }
      .mark {
        display: block;
        font-size: 12px;
        line-height: 12px;
        padding: 5px 8px;
        margin-left: 8px;
      }
    }
    .el-dialog__body {
      padding: 32px 0 24px !important;
    }
    &-form {
      .el-form-item__label {
        line-height: 32px !important;
      }
      .el-form-item__content {
        line-height: 32px !important;
      }
      .need-bottom {
        margin-bottom: 24px;
      }
      .no-bottom {
        margin-bottom: 6px;
      }
    }
  }
</style>
