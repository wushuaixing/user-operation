<template>
  <div>
    <div class="customer-tree-select">
      <div class="divider"></div>
      <el-select @change="searchTypeChange"
                 v-model="searchType"
                 style="width: 90px"
                 class="customer-tree-select-type">
        <el-option v-for="item in typeList"
                   :value="item.value"
                   :key="item.value"
                   :label="item.label">
        </el-option>
      </el-select>
      <el-select
        style="width: calc(100% - 90px)"
        id="org-select"
        v-model="searchValue"
        filterable
        @input="handleSearch"
        :placeholder="searchType === 'org' ? '请输入机构名称' : '请输入11位账号'"
        @change="setTree"
      >
        <el-option
          v-for="item in searchList"
          :key="item.id"
          :label="searchType === 'org' ? item.name : item.phone"
          :value="item.id">
          <span v-if="searchType !== 'org'">{{`${item.phone}（${item.name}）`}}</span>
        </el-option>
      </el-select>
    </div>
    <div class="tree-title">
      <span>ID</span>
      <span>机构名称</span>
    </div>
    <div class="orgTree-scroll">
      <el-tree
        ref="orgTree"
        :data="treeData"
        node-key="id"
        highlight-current
        @node-click="treeClick"
        default-expand-all
        :props="defaultProps"
        :expand-on-click-node="false">
        <template #default="{ node }">
          <span class="custom-tree-node">
            <span class="node-id" :id="node.key">{{node.key}}</span>
            <span class="node-name" :title="node.label">{{ node.label }}
              <span v-if="node.level === 1">（顶级合作机构）</span>
            </span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script>
import AdminApi from '@/server/api/admin';

export default {
  emits: ['treeClick', 'afterAcountSearch', 'setLoading'],
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchType: 'org',
      typeList: [{
        value: 'org',
        label: '机构',
      }, {
        value: 'account',
        label: '账号',
      }],
      searchValue: '', // 树搜索字段
      searchList: [], // 模糊查询出来的数组
      selectType: '1',
      defaultProps: {
        children: 'subOrg',
        label: 'name',
      },
    };
  },
  methods: {
    searchTypeChange() {
      this.searchValue = '';
      this.searchList = [];
      const data = {
        target: {
          value: '',
        },
      };
      this.handleSearch(data);
    },
    setSearchList(val) {
      if (this.searchType === 'org') {
        this.searchList = [];
        this.$nextTick(() => {
          this.filterTree(this.treeData[0], val);
        });
      }
    },
    // 树节点搜索
    handleSearch(value) {
      const searchKey = value.target.value.replace(/\s+/g, '');
      if (this.searchType === 'org') {
        // treeData 树节点中模糊搜索输入字段
        this.searchList = [];
        this.filterTree(this.treeData[0], searchKey);
      } else {
        this.getUserList(searchKey);
      }
    },
    getUserList(searchKey) {
      this.searchList = [];
      const { id } = this.$route.params;
      const params = {
        mobile: searchKey,
        orgId: id,
      };
      AdminApi.simpleUser(params).then((res) => {
        const { code, data, message } = res.data || {};
        if (code === 200) {
          // 赋值下拉框
          this.searchList = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    resetUerlist() {
      // 若是账号搜索
      if (this.searchType === 'account') {
        this.searchValue = '';
        this.getUserList();
      }
    },
    // 遍历树 深度
    filterTree(node, value) {
      if (node.name.indexOf(value) > -1) this.searchList.push(node);
      if (node.subOrg.length) {
        node.subOrg.forEach((item) => this.filterTree(item, value));
      }
    },
    // 设置树节点高亮
    setTree(val) {
    // 机构搜索
      if (this.searchType === 'org') {
        const node = this.searchList.filter((item) => item.id === val);
        this.treeClick(node[0]);
        this.hightlight(val);
      } else {
      // 账号搜索
        this.$emit('setLoading', true);
        AdminApi.searchUser(val).then((res) => {
          this.$emit('setLoading', false);
          const { code, data, message } = res.data || {};
          if (code === 200) {
            const { orgId, user } = data;
            const obj = {
              roleName: user.role === '196' ? '查询用户' : '管理员用户',
              time: user.time || '-',
            };
            // 账号列表赋值
            const accountData = [Object.assign(user, obj)];
            this.$emit('afterAcountSearch', orgId, accountData);
            // 根据当前选中的子机构进行 树的选中
            this.hightlight(orgId);
            const dom = document.getElementById(orgId);
            if (dom) dom.scrollIntoView({ block: 'center' });
          } else {
            this.$message.error(message);
          }
        });
      }
    },
    treeClick(obj) {
    // 需要对搜索框做回填
      const { id } = obj;
      if (this.searchType !== 'org') {
        this.searchType = 'org';
        this.searchList = [];
        this.filterTree(this.treeData[0], '');
      }
      this.searchValue = id;
      this.$emit('treeClick', obj);
      const dom = document.getElementById(id);
      if (dom) dom.scrollIntoView({ block: 'center' });
    },
    // 设置树结构斑马纹
    setTreeColor() {
      this.$nextTick(() => {
        const content = document.getElementsByClassName('el-tree-node__content');
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < content.length; i++) {
          if (i % 2 === 0) {
            content[i].style.backgroundColor = '#F6F7FA';
          } else {
            content[i].style.backgroundColor = '';
          }
        }
      });
    },
    // 高亮树节点
    hightlight(id) {
    // 根据当前选中的子机构进行 树的选中
      this.$nextTick(() => {
        const { setCurrentKey } = this.$refs.orgTree;
        setCurrentKey(id);
      });
    },
  },
};
</script>
<style lang="scss">
  @import "../style.scss";
  .customer-tree-select {
    border: 1px solid #C5C7CE;
    border-radius: 2px;
    position: relative;
    .el-input__inner {
      border: none;
    }
    .divider {
      position: absolute;
      top: 8px;
      left: 90px;
      height: 16px;
      width: 1px;
      background-color: #C5C7CE;
      z-index: 2;
    }
    &-type {
      i.el-select__caret {
        /*很关键：将默认的select选择框样式清除*/
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        /*自定义图片*/
        background: url("../../../assets/img/arrowSelect.png") no-repeat scroll center center transparent;
        /*自定义图片的大小*/
        background-size: 10px 5px;
      }
      .el-select__caret {
        transform: rotateZ(0deg) !important;
      }
      .el-select__caret.is-reverse {
        transform: rotateZ(180deg) !important;
      }
      /*将小箭头的样式去去掉*/
      .el-icon-arrow-up:before {
        content: '';
      }
    }
  }
  #tree-select {
    .el-input-group__prepend {
      height: 32px;
    }
  }
  .tree-title {
    padding: 12px 0 12px 20px;
    font-size: 14px;
    line-height: 14px;
    font-weight: 600;
    color: #4E5566;
    background: #EDEFF3;
    margin-top: 16px;
    span:first-child {
      margin-right: 46px;
    }
  }
  .orgTree-scroll {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 78vh;
    @include scroll-style;
    .el-tree-node__content {
      height: 38px;
      .custom-tree-node {
        .node-id {
          position: absolute;
          left: 20px;
          font-size: 14px;
          color: #20242E;
          margin-top: 2px;
        }
        .node-name {
          color: #20242E;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
    .el-tree-node__content:nth-of-type(2n) {
      background: #F6F7FA !important;
    }
    .el-tree-node__content > .el-tree-node__expand-icon {
      margin-left: 58px !important;
    }
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background-color: unset;
      .custom-tree-node {
        .node-name {
          color: #296DD3 !important;
          font-weight: 600;
        }
      }
    }
  }
</style>
