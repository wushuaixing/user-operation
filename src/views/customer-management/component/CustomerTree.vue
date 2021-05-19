<template>
  <div class="customer-tree">
    <div class="customer-tree-title" >
      <i class="iconfont icon-yonghuyunying-quanbushiyongjigou"></i>
      <span class="titleText" :class="{active: selectAll}" @click="handleSelect('all')">{{allCustomer.content + setText(allCustomer)}}</span>
      <el-tooltip class="item" effect="dark" content="合作中机构数/总机构数" placement="top">
        <img src="../../../assets/img/icon.png"/>
      </el-tooltip>
    </div>
    <div class="customer-tree-content">
      <div v-for="(item, index) in list" :key="item.content" class="customer-tree-content-item">
        <span :class="{active: isActive === index}" class="itemText">
          <span @click="handleSelect('item', index, item)">{{item.content}}</span>
          {{setText(item)}}</span>
        <!-- 横线 -->
        <div class="itemS" :style="isActive === index ? 'background: #296DD3' : ''"></div>
        <!-- 竖线 -->
        <div class="itemV" :style="index ? '' : 'height: 20px;top:-13px;'"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CustomerTree',
  data () {
    return {
      selectAll: true,
      isActive: false,
      allCustomer: {
        content: "全部机构",
        active: 4,
        all: 3,
        id: 0,
      },
      list: [
        {
          content: "恒丰银行域名机构",
          active: 1,
          all: 1,
          id: 1,
        },
        {
          content: "台州银行域名机构",
          active: 0,
          all: 1,
          id: 2,
        },
        {
          content: "光大银行域名机构",
          active: 2,
          all: 2,
          id: 4,
        },
      ]
    }
  },
  methods: {
    // 设置文字+数字
    setText (item) {
      return `（${item.active}/${item.all}）`
    },

    // 点击选中某一项
    handleSelect (val, index, item) {
      if (val === 'all') {
        this.selectAll = true
        this.isActive = -1
        this.$emit('handleClick', this.allCustomer)
      } else {
        this.selectAll = false
        this.isActive = index
        this.$emit('handleClick', item)
      }

    }
  }
}
</script>
<style lang="scss" scoped>
.customer-tree {
  width: 100%;
  &-title {
    font-size: 16px;
    line-height: 16px;
    cursor: pointer;
    font-weight: 600;
    .titleText {
      color: #20242E;
    }
    .active {
      color: #296DD3;
    }
  }
  &-content {
    font-size: 14px;
    line-height: 14px;
    cursor: pointer;
    margin-top: 21px;
    color: #20242E;
    &-item {
      margin-top: 20px;
      position: relative;
      padding-left: 24px;
      .itemText {
         margin-left: 30px;
      }
      .active {
        color: #296DD3;
      }
      .itemS {
        position: absolute;
        background: #C5C7CE;
        width: 8px;
        height: 1px;
        top: 6px;
        left: 8px;
      }
      .activeS {
        background: #296DD3;
      }
      .itemV {
        position: absolute;
        background: #C5C7CE;
        width: 1px;
        height: 34px;
        top: -27px;
        left: 7px;
      }
    }
    &-item:first-child {
      margin-top: 0;
    }
  }
}
</style>