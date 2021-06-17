<template>
  <div class="yc-newpage-contaner">
    <div class="main-content" v-loading="loading">
      <div class="yc-customer-header">
        <Header ref="Header"></Header>
      </div>
      <el-affix :offset="1" @change="affixChange">
        <div class="yc-customer-content">
          <div class="yc-customer-content-customerTree">
            <div class="module-title">
              客户使用机构
            </div>
            <div class="customer-tree">
              <SearchTree
                ref="SearchTree"
                :treeData="treeData"
                @treeClick="treeClick"
                @afterAcountSearch="afterAcountSearch"
              ></SearchTree>
            </div>
          </div>
          <div class="yc-customer-content-list scroll" :class="{scroll: scrollShow}">
            <div class="module-title">
              <template v-if="!editable">
                <span>{{activeCustonerName}}</span>
                <span class="mark" v-if="activeLevel === 2">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icondingjihezuojigou"></use>
                  </svg>
                  顶级合作机构</span>
                <i class="iconfont iconbianji2 editI" @click="() => editable = true"></i>
              </template>
              <template v-else>
                <el-input
                  style="width: 300px;"
                  v-model="activeCustonerName"
                  maxlength="100"
                  @change="(val) => activeCustonerName = val.replace(/\s+/g, '')"
                ></el-input>
                <el-button type="primary" style="margin-left: 32px" @click="save">保存</el-button>
                <el-button @click="() => editable = false">取消</el-button>
              </template>
            </div>
            <div class="list" v-if="activeLevel < 8">
              <div class="list-header">
                <span class="title">子机构列表</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="剩余子机构数为0，不能再创建"
                  placement="top"
                  v-if="(customerData.isSubOrgLimit && customerData.restSubOrgCount <= 0)"
                >
                  <span>
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      :disabled="true"
                    >创建子机构</el-button>
                  </span>
                </el-tooltip>
                <el-button
                  v-else
                  type="primary"
                  class="button-first"
                  icon="el-icon-plus"
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
                  align="center"
                  label="账号数">
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
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="剩余账号数为0，不能再创建"
                  placement="top"
                  v-if="(customerData.isAccountLimit && customerData.restAccountCount <= 0)"
                >
                  <span>
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      :disabled="true"
                    >创建本级账号</el-button>
                  </span>
                </el-tooltip>
                <el-button
                  v-else
                  type="primary"
                  class="button-first"
                  icon="el-icon-plus"
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
                  width="170"
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
                  align="center"
                  >
                </el-table-column>
                <el-table-column
                  prop="time"
                  width="120"
                  label="上次登录时间">
                </el-table-column>
                <el-table-column label="操作" class-name="action-column">
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
                      @click="handleToRecord(scope.row)"
                      >操作记录
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <OrgAccountModal
              ref="OrgAccountModal"
              :roleList="roleList"
              :modalObj="modalObj"
              :acountList="acountList"
              @afterAction="afterAction"
            ></OrgAccountModal>
          </div>
        </div>
      </el-affix>
    </div>
  </div>
</template>

<script>
import AdminApi from '@/server/api/admin';
import OrgAccountModal from '@/views/customer-management/modal/orgaccount-modal.vue';
import $modalConfirm from '@/utils/better-el';
import Header from '@/views/customer-management/detail/header.vue';
import SearchTree from '@/views/customer-management/detail/search-tree.vue';

export default {
  name: 'CustomerDetail',
  nameComment: '机构详情',
  components: {
    OrgAccountModal,
    Header,
    SearchTree,
  },
  data() {
    return {
      loading: false, // 整页loading
      activeOrgId: 0, // 当前选择的机构id 初始时是顶级机构id
      activeLevel: 0, // 当前机构层级
      customerData: {},
      treeData: [],
      scrollShow: false,
      subOrgData: [],
      accountData: [],
      acountList: ['首', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      activeCustonerName: '',
      isHasOrg: true, // 是否有子机构
      roleList: [], // 角色列表 modal中创建编辑账号使用
      saveName: '',
      editable: false,
    };
  },
  computed: {
    modalObj() {
      return {
        isAccountLimit: this.customerData.isAccountLimit,
        restAccountCount: this.customerData.restAccountCount,
        level: this.activeLevel,
        isSubOrgLimit: this.customerData.isSubOrgLimit,
        restSubOrgCount: this.customerData.restSubOrgCount,
        id: this.activeOrgId,
      };
    },
  },
  created() {
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
  updated() {
    this.setTreeColor();
  },
  methods: {
    // 获取页面机构详情数据
    getOrgDetailData(id, type = '') {
      AdminApi.orgDetail(id).then((res) => {
        const { code, data, message } = res.data;
        if (code === 200) {
          // 进行赋值
          const {
            tree, ...customerData
          } = data;
          this.customerData = customerData;
          this.$refs.Header.setData(customerData);
          this.treeData = [tree];
          document.title = tree.name;
          // 设置斑马
          const { hightlight, setSearchList, setTreeColor } = this.$refs.SearchTree;
          setTreeColor();
          if (type === 'init') {
            // 若是初始化
            const {
              name, level, id: ID, subOrg,
            } = tree;
            this.activeCustonerName = name;
            this.activeLevel = level;
            this.activeOrgId = ID;
            this.subOrgData = [...subOrg].reverse();
            this.getAccountData(id);
            // 搜索下拉框列表赋值
            setSearchList('');
            // 高亮节点
            hightlight(id);
          }
          if (type === 'org') {
            this.filterTreeNode(this.treeData, this.activeOrgId);
            setSearchList('');
            // 根据当前选中的子机构进行 树的选中
            hightlight(this.activeOrgId);
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
            const roleName = item.role === '196' ? '查询用户' : '管理员用户';
            const time = item.time || '-';
            return { ...item, roleName, time };
          });
        } else {
          this.$message.error(message);
        }
      });
    },
    // 固钉状态改变
    affixChange(val) {
      this.scrollShow = val;
    },
    handleDelete(row, type) {
      const params = {
        id: row.id,
      };
      let obj = {};
      if (type === 'org') {
        obj = {
          title: `确认删除客户使用${this.acountList[row.level - 2]}级机构${row.name}？`,
          text: '点击确定，该机构及其子机构都将被删除，被删除机构下的账号和业务也一并删除，无法恢复，请再次确认',
          color: '#F93535',
          api: () => AdminApi.detailDelSubOrg(params),
        };
      } else if (type === 'account') {
        obj = {
          title: `确认删除${row.name}的账号？`,
          text: '点击确定，选中的账号将被删除，请再次确认',
          color: '#F93535',
          api: () => AdminApi.detailDelOrgUser(params),
        };
      } else {
        obj = {
          title: '确认重置密码？',
          text: '点击确定，密码将被重置为账号后6位',
          color: '#4E5566',
          api: () => AdminApi.detailResetPwd(params),
        };
      }
      const { api, ...info } = obj;
      $modalConfirm(info)
        .then(() => {
          api().then((res) => {
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
        })
        .catch(() => {
          console.log('取消了');
        });
    },
    // 编辑 新增
    handleAction(row, modelType, type) {
      // modelType= org account     type= add edit
      this.$refs.OrgAccountModal.open(type, modelType, row);
    },
    afterAcountSearch(id, list) {
      // 子机构赋值
      this.filterTreeNode(this.treeData, id);
      this.accountData = list;
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
      this.subOrgData = [...subOrg].reverse();
    },
    // 新增，编辑结束刷新页面
    afterAction() {
      // 重新获取机构详情数据
      const { id } = this.$route.params;
      this.getOrgDetailData(id, 'org');
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
          this.subOrgData = [...item.subOrg].reverse();
        }
      });
    },
    // 机构名称编辑
    save() {
      const params = {
        id: this.activeOrgId,
        value: this.activeCustonerName,
      };
      AdminApi.detailEditName(params).then((res) => {
        const { code, message } = res.data || {};
        if (code === 200) {
          this.$message.success('机构名称修改成功');
          this.editable = false;
          // 刷新数据
          this.afterAction();
        } else {
          this.$message.error(message);
        }
      });
    },
    // 操作日志
    handleToRecord(params = {}) {
      const { name, id } = params;
      const routerData = this.$router.resolve({
        path: '/operationRecord',
        query: { name, id },
      });
      window.open(routerData.href, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
.main-content {
  width: 1400px;
  margin: 20px auto;
  min-height: 94vh;
  overflow-x: hidden;
  .yc-customer-header {
    min-height: 146px;
    background: #FFFFFF;
    padding: 20px;
  }
  .yc-customer-content {
    margin-top: 20px;
    min-height: 69vh;
    display: flex;
    flex-direction: row;
    &-customerTree {
      width: 420px;
      background: #FFFFFF;
      .customer-tree {
        padding: 20px;
        position: relative;
      }
    }
    &-list {
      width: 960px;
      margin-left: 20px;
      padding-bottom: 22px;
      background: #FFFFFF;
      .list {
        padding: 18px 20px;
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
        .el-table::before {
          height: 0 !important;
        }
        :deep(.list-table){
          .action-column{
            .el-divider--vertical{
              margin: 0 6px !important;
            }
          }
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
      .mark {
        color: #FF871C;
        line-height: 12px;
        font-size: 12px;
        background: #FFEDE6;
        border-radius: 2px;
        padding: 5px 8px;
        margin-left: 8px;
        font-weight: 500;
      }
      .editI {
        font-size: 20px;
        color: #296DD3;
        cursor: pointer;
        margin-left: 13px;
      }
    }
  }
}
</style>
