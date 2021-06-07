<template>
  <div class="yc-newpage-contaner">
    <section class="main-content" v-loading="loading">
      <div class="yc-customer-header">
        <div class="customer-name">{{title}}</div>
        <div class="customer-message">
          <div class="customer-message-useDetail">
            <div class="useDetail-left">
              <div class="item">
                <span class="item-label">机构类型</span>：
                <span>{{customerData.type ? "正式" : "适用"}}</span>
              </div>
              <div class="item">
                <span class="item-label">剩余账号数</span>：
                <span v-if="!customerData.isAccountLimit">不限</span>
                <span v-else><span class="item-bold">
                  {{customerData.restAccountCount}}</span>/{{customerData.accountLimitCount}}
                </span>
              </div>
              <div class="item">
                <span class="item-label">剩余子机构数</span>：
                <span v-if="!customerData.isSubOrgLimit">不限</span>
                <span v-else><span class="item-bold">
                  {{customerData.restSubOrgCount}}</span>/{{customerData.subOrgLimitCount}}
                </span>
              </div>
            </div>
            <div class="useDetail-right">
              <div class="item">
                <span class="item-label1">剩余画像查询次数</span>：
                <span v-if="!customerData.isPortraitLimit">不限</span>
                <span v-else><span class="item-bold">
                  {{customerData.restPortraitCount}}</span>/{{customerData.portraitLimitCount}}
                </span>
              </div>
              <div class="item">
                <span class="item-label1">剩余分类搜索次数</span>：
                <span v-if="!customerData.isClassifiedLimit">不限</span>
                <span v-else><span class="item-bold">
                  {{customerData.restClassifiedCount}}</span>/{{customerData.classifiedLimitCount}}
                </span>
              </div>
              <div class="item">
                <span class="item-label1">剩余监控债务人数</span>：
                <span v-if="!customerData.isObligorLimit">不限</span>
                <span v-else><span class="item-bold">
                  {{customerData.restObligorCount}}</span>/{{customerData.obligorLimitCount}}
                </span>
              </div>
            </div>
            <div class="linkAddress">
              <div class="item">
                <span class="item-label">域名网址</span>：
                <a>{{customerData.url}}</a>
              </div>
            </div>
          </div>
          <div class="customer-message-timeline time1" v-if="contractRecord.length">
            <span>签约记录：</span>
            <el-timeline class="timeline">
              <el-timeline-item
                v-for="(activity, index) in contractList"
                color="#296DD3"
                :key="index">
                <div>
                  <span>
                    {{
                      `${acountList[index]}次续签起止日期：${activity.start || "-"} 至 ${activity.end || "-"}`
                    }}
                  </span>
                  <span class="open" @click="showContractMessage" v-if="contractRecord.length > 3 && index === contractList.length - 1">
                    <span v-if="showStatus === 'close'">展开<i class="el-icon-arrow-down" style="margin-left: 7px;"></i></span>
                    <span v-else>收起<i class="el-icon-arrow-up" style="margin-left: 7px;"></i></span>
                  </span>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div class="customer-message-timeline time2" v-if="delayRecord.length">
            <span>延期记录：</span>
            <el-timeline class="timeline">
              <el-timeline-item
                v-for="(activity, index) in delayList"
                color="#296DD3"
                :key="index">
                <div>
                  <span>{{`次延长时长：${activity.time}日`}}</span>
                  <span class="open" @click="showdelayMessage" v-if="delayRecord.length > 3 && index === delayList.length - 1">
                    <span v-if="delayShowStatus === 'close'">展开<i class="el-icon-arrow-down" style="margin-left: 7px;"></i></span>
                    <span v-else>收起<i class="el-icon-arrow-up" style="margin-left: 7px;"></i></span>
                  </span>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
      <el-affix :offset="1" @change="affixChange">
        <div class="yc-customer-content">
          <div class="yc-customer-content-customerTree">
            <div class="module-title">
              客户使用机构
            </div>
            <div class="customer-tree">
              <el-select
                style="width: 100%"
                id="org-select"
                v-model="searchValue"
                filterable
                remote
                placeholder="请输入机构名称"
                :remote-method="handleSearch"
                @change="setTree"
              >
                <el-option
                  v-for="item in searchList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <div class="tree-title">
                <span>ID</span>
                <span>机构名称</span>
              </div>
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
                    <span class="node-id">{{node.key}}</span>
                    <span class="node-name">{{ node.label }}</span>
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
          <div class="yc-customer-content-list" :class="{scroll: scrollShow}">
            <div class="module-title">
              {{activeCustonerName}}
            </div>
            <div class="list" v-if="isHasOrg">
              <div class="list-header">
                <span class="title">子机构列表</span>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  v-if="(customerData.isSubOrgLimit && customerData.restSubOrgCount > 0) || !customerData.isSubOrgLimit"
                  @click="handleAction({}, 'org', 'add')"
                >创建子机构</el-button>
              </div>
              <el-table
                :data="subOrgData"
                class="list-table"
                style="width: 100%">
                <template #empty>
                  <img src="../../../assets/img/no_data.png" alt="" />
                  <p>暂无数据</p>
                </template>
                <el-table-column
                  prop="id"
                  label="ID">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="机构名称"
                  >
                </el-table-column>
                <el-table-column
                  prop="accountNum"
                  label="总账号数">
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button
                      type="text"
                      @click="handleDelete(scope.row, 'org')"
                    >
                      删除
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                      type="text"
                      @click="handleAction(scope.row, 'org', 'edit')"
                      >编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="list">
              <div class="list-header">
                <span class="title">本级机构账号</span>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  v-if="(customerData.isAccountLimit && customerData.restAccountCount > 0) || !customerData.isAccountLimit"
                  @click="handleAction({}, 'account', 'add')"
                >创建本级账号</el-button>
              </div>
              <el-table
                :data="accountData"
                class="list-table"
                style="width: 100%">
                <template #empty>
                  <img src="../../../assets/img/no_data.png" alt="" />
                  <p>暂无数据</p>
                </template>
                <el-table-column
                  prop="phone"
                  width="140"
                  label="账号">
                </el-table-column>
                <el-table-column
                  prop="name"
                  width="110"
                  label="姓名"
                  >
                </el-table-column>
                <el-table-column
                  prop="roleName"
                  width="110"
                  label="角色">
                </el-table-column>
                <el-table-column
                  prop="num"
                  width="120"
                  label="导入债务人数"
                  >
                </el-table-column>
                <el-table-column
                  prop="time"
                  width="120"
                  label="上次登录时间">
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button
                      type="text"
                      @click="handleDelete(scope.row, 'account')"
                    >
                      删除
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                      type="text"
                      @click="handleAction(scope.row, 'account', 'edit')"
                      >编辑
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                      type="text"
                      @click="handleDelete(scope.row, 'reset')"
                    >
                      重置密码
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                      type="text"
                      @click="handleSubOrgEdit(scope.row)"
                      >操作记录
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @current-change="accountPageChange"
                background
                :current-page="accountPage"
                layout="total, prev, pager, next, jumper"
                :total="accountTotal"
              />
            </div>
            <OrgAccountModal
              ref="OrgAccountModal"
              :roleList="roleList"
              :modalObj="modalObj"
              @afterAction="afterAction"
            ></OrgAccountModal>
          </div>
        </div>
      </el-affix>
    </section>
  </div>
</template>

<script>
import AdminApi from '@/server/api/admin';
import OrgAccountModal from '@/views/customer-management/modal/OrgAccountModal.vue';
import $modalConfirm from '@/utils/better-el';

export default {
  name: 'CustomerDetail',
  nameComment: '机构详情',
  components: {
    OrgAccountModal,
  },
  data() {
    return {
      loading: false, // 整页loading
      activeOrgId: 0, // 当前选择的机构id 初始时是顶级机构id
      activeLevel: 0, // 当前机构层级
      customerData: {
        name: '',
        id: 0,
        // 账号数
        isAccountLimit: 0, // 是否限制 0：否  1：是
        accountLimitCount: 0, // 总
        restAccountCount: 0, // 剩余
        // 分类搜索
        isClassifiedLimit: 0,
        classifiedLimitCount: 0,
        restClassifiedCount: 0,
        // 监控债务
        isObligorLimit: 0,
        obligorLimitCount: 0,
        restObligorCount: 0,
        // 画像查询
        isPortraitLimit: 0,
        portraitLimitCount: 0,
        restPortraitCount: 0,
        // 子机构
        isSubOrgLimit: 0,
        subOrgLimitCount: 0,
        restSubOrgCount: 0,
        type: 0,
        url: 'cmbc.yczcjk.com',
      },
      contractShowIndex: 3,
      delayShowIndex: 3,
      showStatus: 'close',
      delayShowStatus: 'close',
      acountList: ['首', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      contractRecord: [
      ],
      delayRecord: [
      ],
      scrollShow: false,
      accountPage: 1,
      accountTotal: 0,
      searchValue: '', // 树搜索字段
      searchList: [], // 模糊查询出来的数组
      selectType: '1',
      subOrgData: [],
      accountData: [],
      treeData: [],
      defaultProps: {
        children: 'subOrg',
        label: 'name',
      },
      activeCustonerName: '',
      isHasOrg: true, // 是否有子机构
      roleList: [], // 角色列表 modal中创建编辑账号使用
    };
  },
  computed: {
    title() {
      return `顶级合作机构：${this.customerData.name} (ID：${this.customerData.id})`;
    },
    contractList() {
      return this.contractRecord.filter((item, index) => index < this.contractShowIndex);
    },
    delayList() {
      return this.delayRecord.filter((item, index) => index < this.delayShowIndex);
    },
    modalObj() {
      return {
        restAccountCount: this.customerData.restAccountCount,
        level: this.activeLevel,
        restSubOrgCount: this.customerData.restSubOrgCount,
        id: this.activeOrgId,
      };
    },
  },
  created() {
    document.title = '顶级机构详情页';
    // 从路由获取id 调用接口获取机构详情数据
    const { id } = this.$route.params;
    this.activeOrgId = id;
    this.getOrgDetailData(id, 'init');
    // 获取角色列表
    AdminApi.getSimpleListRole().then((res) => {
      const { code, message, data } = res.data || {};
      if (code === 200) {
        this.roleList = data;
      } else {
        console.log(message);
      }
    });
  },
  methods: {
    // 获取页面机构详情数据
    getOrgDetailData(id, type = '') {
      AdminApi.orgDetail(id).then((res) => {
        const { code, data, message } = res.data;
        if (code === 200) {
          // 进行赋值
          const {
            contractRecord, delayRecord, tree, ...customerData
          } = data;
          this.customerData = customerData;
          if (contractRecord.length) this.contractRecord = contractRecord;
          if (delayRecord.length) this.delayRecord = delayRecord;
          this.treeData = [tree];
          if (type === 'init') {
            this.activeCustonerName = tree.name;
            this.subOrgData = tree.subOrg;
            this.getAccountData(id);
            const { setCurrentKey } = this.$refs.orgTree;
            setCurrentKey(id);
          }
          if (type === 'org') {
            this.filterTreeNode(this.treeData, this.activeOrgId);
          }
        } else {
          this.$message.error(message);
        }
      });
    },

    // 获取本级账号数据
    getAccountData(id) {
      AdminApi.detailSubOrg(id).then((res) => {
        const { code, data, message } = res.data;
        if (code === 200) {
          this.accountData = data.users.map((item) => {
            const name = item.role === '196' ? '查询用户' : '管理员用户';
            return { ...item, roleName: name };
          });
        } else {
          this.$message.error(message);
        }
      });
    },
    // 展开收起
    showContractMessage() {
      this.contractShowIndex = this.showStatus === 'open' ? 3 : this.contractRecord.length;
      this.showStatus = this.contractShowIndex === 3 ? 'close' : 'open';
    },
    showdelayMessage() {
      this.delayShowIndex = this.delayShowStatus === 'open' ? 3 : this.delayRecord.length;
      this.delayShowStatus = this.delayShowIndex === 3 ? 'close' : 'open';
    },

    // 固钉状态改变
    affixChange(val) {
      this.scrollShow = val;
    },

    handleDelete(row, type) {
      const params = {
        id: row.id,
      };
      let title = '';
      let text = '';
      let api = null;
      if (type === 'org') {
        title = `确认删除机构${row.name}?`;
        text = '点击确定，该机构及其子机构都将被删除，被删除机构下的账号和业务也一并删除，无法恢复，请再次确认';
        api = AdminApi.detailDelSubOrg(params);
      } else if (type === 'account') {
        title = `确认删除${row.name}的账号`;
        text = '点击确定，选中的账号将被删除，请再次确认';
        api = AdminApi.detailDelOrgUser(params);
      } else {
        title = '确认重置密码';
        text = '点击确定，密码将被重置为账号后6位';
        api = AdminApi.detailResetPwd(params);
      }
      $modalConfirm({ text, title }).then(() => {
        api.then((res) => {
          const { code, message } = res.data || {};
          if (code === 200) {
            this.$message.success(message);
            if (type !== 'reset') {
              this.afterAction();
            }
          } else {
            this.$message.error(message);
          }
        });
      });
    },
    // 编辑 新增
    handleAction(row, modelType, type) {
      // modelType= org account     type= add edit
      this.$refs.OrgAccountModal.open(type, modelType, row);
    },
    accountPageChange() {},
    // 树节点搜索
    handleSearch(value) {
      // treeData 树节点中模糊搜索输入字段
      this.searchList = [];
      this.filterTree(this.treeData, value);
    },
    filterTree(list, value) {
      list.forEach((item) => {
        if (item.subOrg.length) {
          this.filterTree(item.subOrg, value);
        }
        if (item.name.indexOf(value) > -1) {
          this.searchList.push(item);
        }
      });
    },
    // 设置树节点高亮
    setTree(val) {
      const node = this.searchList.filter((item) => item.id === val);
      this.treeClick(node[0]);
      const { setCurrentKey } = this.$refs.orgTree;
      setCurrentKey(val);
    },
    // 树节点点击
    treeClick(obj) {
      const {
        name, id, subOrg, level,
      } = obj;
      this.activeOrgId = id;
      this.activeLevel = level;
      this.activeCustonerName = name;
      this.getAccountData(id);
      this.searchValue = '';
      this.isHasOrg = (level - 2) < 5;
      this.subOrgData = subOrg;
    },
    // 新增，编辑结束刷新页面
    afterAction() {
      // 重新获取机构详情数据
      const { id } = this.$route.params;
      this.getOrgDetailData(id, 'org');
      // 根据当前选中的子机构进行 树的选中
      const { setCurrentKey } = this.$refs.orgTree;
      setCurrentKey(this.activeOrgId);
      // 根据选中的树节点加载 子机构列表数据
      // 加载本级账号表格数据
      this.getAccountData(this.activeOrgId);
    },
    filterTreeNode(list, value) {
      list.forEach((item) => {
        if (item.subOrg.length) {
          this.filterTreeNode(item.subOrg, value);
        }
        if (item.id === value) {
          this.subOrgData = item.subOrg;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-content {
  width: 1400px;
  margin: 20px auto;
  min-height: 94vh;
  .yc-customer-header {
    min-height: 146px;
    background: #FFFFFF;
    padding: 20px;
    .customer-name {
      font-weight: 600;
      color: #20242E;
      font-size: 20px;
      line-height: 20px;
      margin-bottom: 24px;
    }
    .customer-message {
      display: flex;
      flex-direction: row;
      &-useDetail {
        width: 34%;
        color: #4E5566;
        font-size: 14px;
        .useDetail-left {
          display: inline-block;
          width: 200px;
        }
        .useDetail-right {
          display: inline-block;
          width: calc(100% - 200px);
        }
        .item {
            line-height: 14px;
            margin-top: 16px;
            &-label {
              width: 85px;
              display: inline-block;
              text-align-last: justify;
            }
            &-label1 {
              width: 115px;
              display: inline-block;
              text-align-last: justify;
            }
            &-bold {
              color: #20242E;
              font-weight: 600;
            }
          }
          .item:first-child {
            margin-top: 0px;
          }
        .linkAddress {
          margin-top: 12px;
        }
      }
      &-timeline {
        width: 33%;
        font-size: 14px;
        color: #20242E;
        line-height: 14px;
        position: relative;
        .timeline /deep/ {
          display: inline-grid;
          .open {
            font-size: 14px;
            color: #296DD3;
            cursor: pointer;
            margin-left: 16px;
          }
          .el-timeline-item {
            padding-bottom: 8px !important;
          }
          .el-timeline-item__tail {
            left: 4px;
            top: 7px;
            border-left: 1px solid #E2E4E9;
          }
          .el-timeline-item__node--normal {
            left: 2px;
            width: 6px;
            height: 6px;
            top: 4px;
          }
          .el-timeline-item__wrapper {
            padding-left: 16px;
            top: 0;
          }
        }
      }
    }
  }
  .yc-customer-content {
    margin-top: 20px;
    min-height: 69vh;
    display: flex;
    flex-direction: row;
    &-customerTree {
      width: 420px;
      background: #FFFFFF;
      .customer-tree /deep/ {
        padding: 20px;
        position: relative;
        .tree-title {
          padding: 12px 0 12px 20px;
          font-size: 14px;
          line-height: 14px;
          font-weight: 600;
          color: #4E5566;
          span:first-child {
            margin-right: 46px;
          }
        }
        .el-tree-node__content {
          .custom-tree-node {
            .node-id {
              position: absolute;
              left: 20px;
              font-size: 14px;
              color: #20242E;
            }
            .node-name {
              color: #20242E;
              font-size: 14px;
            }
          }
        }
        .el-tree-node__content:nth-of-type(2n) {
          background: #F6F7FA !important;
        }
        .el-tree-node__content > .el-tree-node__expand-icon {
          margin-left: 58px !important;
        }
      }
    }
    &-list {
      width: 960px;
      margin-left: 20px;
      background: #FFFFFF;
      .list {
        padding: 15px 20px;
        &-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          margin-bottom: 18px;
          height: 32px;
          .title {
            font-size: 16px;
            color: #20242E;
            line-height: 16px;
            font-weight: 600;
            margin-left: 11px;
          }
          .title::before {
            content: "";
            width: 3px;
            height: 20px;
            position: absolute;
            top: 6px;
            left: 0;
            background: #296DD3;
          }
        }
        :deep(.list-table){
          .el-table__empty-text {
            padding: 36px 0;
          }
        }
      }
    }
    .scroll {
      overflow-y: auto;
      max-height: 96vh;
    }
    .module-title {
      color: #20242E;
      line-height: 18px;
      font-size: 18px;
      font-weight: 600;
      height: 58px;
      padding-left: 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #E2E4E9;
    }
  }
}
</style>
