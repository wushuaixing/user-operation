<template>
  <nav class="yc-bread-crumb">
    <div class="yc-bread-crumb-title">
      <div class="title" v-if="!editStatus">
        {{ text }}
        <i class="iconfont iconbianji2 editI" v-if="editable" @click="showEdit"></i>
      </div>
      <div v-else>
        <el-input style="width: 300px"
                  v-model="editValue"
                  maxlength="100"
                  @change="(val) => editValue = val.replace(/\s+/g, '')"></el-input>
        <el-button type="primary" style="margin-left: 32px" @click="save"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
      <div class="action-btn" v-if="btnText">
        <el-button type="primary" icon="el-icon-plus" class="button-first" @click="$emit('handleClick')">{{
          btnText
        }}</el-button>
      </div>
    </div>
    <div class="slot-area">
      <slot name="detail"></slot>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    text: {
      type: String,
      default: '',
    },
    editable: {
      type: Boolean,
      default: false,
    },
    btnText: {
      type: String,
      default: '',
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
      childMessage: '子组件',
    };
  },
  mounted() {},
  methods: {
    showEdit() {
      this.editStatus = true;
      // eslint-disable-next-line prefer-destructuring
      this.editValue = this.text.split('（ID：')[0];
    },
    save() {
      // 将输入框的值返回 做保存处理
      this.$emit('saveName', this.editValue);
    },
    cancel() {
      this.editStatus = false;
    },
  },
};
</script>

<style lang="scss">
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
    .editI {
      font-size: 20px;
      color: #296DD3;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
</style>
