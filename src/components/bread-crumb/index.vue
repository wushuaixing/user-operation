<template>
  <nav class="yc-bread-crumb">
    <div class="yc-bread-crumb-title">
      <div class="title" v-if="!editStatus">
        {{ text }}
        <span v-if="editable" class="iconfont icon-bianji2" @click="showEdit"></span>
      </div>
      <div v-else>
        <el-input style="width: 300px;" v-model="editValue"></el-input>
        <el-button type="primary" style="margin-left: 32px;" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
      <div class="action-btn" v-if="btnText">
        <el-button type="primary" @click="$emit('handleClick')">{{btnText}}</el-button>
      </div>
    </div>
    <div class="slot-area">
      <slot name="detail"></slot>
    </div>
  </nav>
</template>

<script>
export default {
  name: "BreadCrumb",
  props: {
    text: {
      type: String,
      default: "",
    },
    editable: {
      type: Boolean,
      default: false
    },
    btnText:{
      type:String,
      default: "",
    },
    handleClick: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      editValue: '',
      editStatus: false,
      childMessage: "子组件",
    };
  },
  mounted () {
    
  },
  methods: {
    showEdit () {
      this.editStatus = true
      this.editValue = this.text
    },
    save () {
      this.editStatus = false
    },
    cancel () {
      this.editStatus = false
    }
  }
};
</script>

<style lang="scss" scoped>
.yc-bread-crumb {
  min-height: 58px;
  padding: 0 20px;
  border-bottom: 1px solid #e2e4e9;
  background-color: #fff;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #293038;
    font-weight: 700;
    font-size: 18px;
    height: 58px;
  }
}
</style>
