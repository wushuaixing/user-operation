<template>
  <div class="customer-tree" id="customerTree">
    <div class="customer-tree-title">
      <svg class="icon" aria-hidden="true" style="font-size: 20px;">
        <use xlink:href="#iconyonghuyunying-quanbushiyongjigou"></use>
      </svg>
      <span
        class="titleText"
        :class="{ active: selectAll }"
        @click="handleSelect('all')"
        >{{`全部机构(${totalOperatedOrgNum}/${totalOrgNum})`}}</span
      >
      <el-tooltip
        class="item"
        effect="dark"
        content="合作中机构数/总机构数"
        placement="top"
      >
        <img src="../../../assets/img/icon.png" style="vertical-align: bottom;margin-left:13px;"/>
      </el-tooltip>
    </div>
    <div class="customer-tree-content">
      <div
        v-for="(item, index) in activities"
        :key="item.id"
        class="customer-tree-content-item"
      >
        <span :class="{ active: isActive === index }" class="itemText" @click="handleSelect('item', index, item)">
          <div class="itemText-ellipsis">
            <el-tooltip
              effect="dark"
              :content="item.name"
              placement="top"
              v-if="item.name.length >= 17"
            >
              <span>{{item.name}}</span>
            </el-tooltip>
            <span v-else>{{item.name}}</span>
          </div>
          {{ setText(item) }}</span
        >
        <!-- 横线 -->
        <div
          class="itemS"
          :style="isActive === index ? 'background: #296DD3' : ''"
        ></div>
        <!-- 竖线 -->
        <div
          class="itemV"
          :style="index ? '' : 'height: 20px;top:-13px;'"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CustomerTree",
  props: {
    activities: {
      type: Array,
      default: () => []
    },
    totalOrgNum: { // 总机构数
      type: Number,
      default: 0
    },
    totalOperatedOrgNum: { // 总合作中机构数
      type: Number,
      default: 0
    },
    activeKey: {
      type: String,
      default: ''
    }
  },
  watch: {
    activeKey (newVal) {
      if (newVal) {
        this.activities.forEach((item, index) => {
          if (item.id === Number(newVal)) {
            this.isActive = index
          }
        })
        this.selectAll = false
        this.$nextTick(() => {
          // 若是选中的机构没有在视线之内，手动调整滚动条展示
          let dom = document.getElementById("customerTree");
          if (dom && dom.clientHeight > 41) {
            // 若是树的总高度不高于容器，则不做任何处理  clientHeight   scrollTop
            console.log(dom.clientHeight)
            let domHeight = dom.clientHeight
            let scrollHeight = dom.scrollTop
            let itemClientHeight = 20 + 34 * (this.isActive + 1)
            if ((itemClientHeight < scrollHeight) || (itemClientHeight > (domHeight + scrollHeight))) {
              dom.scrollTop = itemClientHeight - 50
            }
          }
        })
      }
    }
  },
  data() {
    return {
      selectAll: true,
      isActive: -1,
    };
  },
  methods: {
    // 设置文字+数字
    setText(item) {
      return `(${item.operatedOrgNum}/${item.orgNum})`;
    },

    // 点击选中某一项
    handleSelect(val, index, item) {
      if (val === "all") {
        this.selectAll = true;
        this.isActive = -1;
        this.$emit("handleClick", 'all', {});
      } else {
        this.selectAll = false;
        this.isActive = index;
        this.$emit("handleClick", '', item);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.customer-tree {
  width: 100%;
  max-height: 89vh;
  overflow-y: auto;
  &-title {
    font-size: 16px;
    line-height: 16px;
    cursor: pointer;
    font-weight: 600;
    .titleText {
      color: #20242e;
      margin-left: 6px;
    }
    .active {
      color: #296dd3;
    }
  }
  &-content {
    font-size: 14px;
    line-height: 14px;
    cursor: pointer;
    margin-top: 21px;
    color: #20242e;
    &-item {
      margin-top: 20px;
      position: relative;
      padding-left: 28px;
      .itemText {
        &-ellipsis {
          display: inline-block;
          max-width: 236px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          vertical-align: top;
        }
      }
      .active {
        color: #296dd3;
      }
      .itemS {
        position: absolute;
        background: #c5c7ce;
        width: 8px;
        height: 1px;
        top: 6px;
        left: 8px;
      }
      .activeS {
        background: #296dd3;
      }
      .itemV {
        position: absolute;
        background: #c5c7ce;
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
