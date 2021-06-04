<template>
  <a-modal
    :title="title"
    v-model="visible"
    width="500px"
    @close="close"
    custom-class="org-modal"
  >
    <a-form :model="orgForm" :rules="rules" ref="orgForm" label-width="145px">
      <el-form-item label="域名机构" prop="name">
        <el-input v-model="orgForm.name"></el-input>
      </el-form-item>
      <el-form-item label="机构层级">
        <span>{{level}}</span>
      </el-form-item>
      <el-form-item label="剩余机构数">
        <span>{{restSubOrgCount}}</span>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="orgForm.name"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="phone">
        <el-input v-model="orgForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="orgForm.password"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="orgForm.roleId" placeholder="请选择角色">
          <el-option v-for="item in roleList" :label="item.label" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="剩余账号数">
        <span></span>
      </el-form-item>
    </a-form>
  </a-modal>
</template>
<script>
export default {
  name: "OrgAccountModal",
  nameComment: "顶级机构详情页-子机构创建编辑-本级账号创建编辑",
  props: {
    roleList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false,
      type: "add",
      title: "创建",
      orgForm: {},
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    close () {
      this.visible = false
    }
  }
}
</script>
<style>
</style>