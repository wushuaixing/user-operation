<template>
  <el-dialog
    title="创建域名机构"
    v-model="addOrgVisible"
    @close="resetAddOrgForm"
    width="500px"
  >
    <el-form
      :model="addOrgForm"
      ref="addOrgForm"
      v-bind="addOrgFormOptions.options"
      :rules="addOrgFormOptions.rules"
    >
      <el-form-item label="二级域名：" prop="subDomain">
        <el-input
          v-model="addOrgForm.subDomain"
          autocomplete="off"
          maxlength="100"
          placeholder="请输入二级域名"
          @input="(val) => addOrgForm.subDomain = val.replace(/[^a-zA-Z]/g, '')"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="机构名称：" prop="name">
        <el-input
          v-model="addOrgForm.name"
          autocomplete="off"
          maxlength="100"
          placeholder="请输入机构名称"
          @change="(val) => addOrgForm.name = val.replace(/\s+/g, '')"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
            <span class="dialog-footer">
              <el-button @click="addOrgVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleAddOrg">确 定</el-button>
            </span>
    </template>
  </el-dialog>
</template>
<script>
import AdminApi from '@/server/api/admin';

export default {
  emits: ['afterAdd'],
  data() {
    return {
      addOrgVisible: false,
      addOrgForm: {
        subDomain: '',
        name: '',
      },
      addOrgFormOptions: {
        options: {
          labelPosition: 'right',
          labelWidth: '120px',
          destroyOnClose: true,
          class: 'add-org-modal',
        },
        rules: {
          subDomain: [
            { required: true, message: '二级域名不允许为空', trigger: 'change' },
          ],
          name: [
            { required: true, message: '机构名称不允许为空', trigger: 'change' },
          ],
        },
      },
    };
  },
  methods: {
    resetAddOrgForm() {
      this.$refs.addOrgForm.resetFields();
    },
    // 域名机构创建
    handleAddOrg() {
      this.$refs.addOrgForm.validate((valid) => {
        if (valid) {
          AdminApi.addDomain(this.addOrgForm).then((res) => {
            const { code, message } = res.data;
            if (code === 200) {
              this.$message.success('域名机构创建成功');
              // 关闭弹窗 刷新左侧树
              this.addOrgVisible = false;
              this.$emit('afterAdd');
            } else {
              this.$message.warning(message);
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
</style>
