<template>
  <div class="yc-newpage-contaner">
    <div class="main-content" v-loading="loading">
      <div class="yc-customer-header">
        <div class="customer-name">{{title}}</div>
        <div class="customer-message">
          <div class="customer-message-useDetail">
            <div class="useDetail-left">
              <div class="item">
                <span class="item-label">机构类型</span>：
                <span>{{customerData.type ? "正式" : "试用"}}</span>
              </div>
              <div class="item">
                <span class="item-label">剩余账号数</span>：
                <span v-if="!customerData.isAccountLimit">不限</span>
                <span v-else>
                  <span class="item-bold">
                  {{checkNum(customerData.restAccountCount, customerData.accountLimitCount)}}
                  </span>/
                  {{customerData.accountLimitCount}}
                </span>
              </div>
              <div class="item">
                <span class="item-label">剩余子机构数</span>：
                <span v-if="!customerData.isSubOrgLimit">不限</span>
                <span v-else>
                  <span class="item-bold">
                  {{checkNum(customerData.restSubOrgCount, customerData.subOrgLimitCount)}}
                  </span>/
                  {{customerData.subOrgLimitCount}}
                </span>
              </div>
            </div>
            <div class="useDetail-right">
              <div class="item">
                <span class="item-label1">剩余画像查询次数</span>：
                <span v-if="!customerData.isPortraitLimit">不限</span>
                <span v-else>
                  <span class="item-bold">
                  {{checkNum(customerData.restPortraitCount, customerData.portraitLimitCount)}}
                  </span>/
                  {{customerData.portraitLimitCount}}
                </span>
              </div>
              <div class="item">
                <span class="item-label1">剩余分类搜索次数</span>：
                <span v-if="!customerData.isClassifiedLimit">不限</span>
                <span v-else>
                  <span class="item-bold">
                  {{checkNum(customerData.restClassifiedCount, customerData.classifiedLimitCount)}}
                  </span>/
                  {{customerData.classifiedLimitCount}}
                </span>
              </div>
              <div class="item">
                <span class="item-label1">剩余监控债务人数</span>：
                <span v-if="!customerData.isObligorLimit">不限</span>
                <span v-else>
                  <span class="item-bold">
                  {{checkNum(customerData.restObligorCount, customerData.obligorLimitCount)}}
                  </span>/
                  {{customerData.obligorLimitCount}}
                </span>
              </div>
            </div>
            <div class="linkAddress">
              <div class="item">
                <span class="item-label">域名网址</span>：
                <a :href="`https://www.${customerData.url}.yczcjk.com`" target='_blank'>{{customerData.url + '.yczcjk.com'}}</a>
              </div>
            </div>
          </div>
          <div class="customer-message-timeline time1" v-if="customerData.type && contractRecord.length">
            <span>签约记录：</span>
            <el-timeline class="timeline">
              <el-timeline-item
                v-for="(activity, index) in contractList"
                color="#296DD3"
                :key="index">
                <div>
                  <span>
                    {{activity.text}}
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
                  <span>{{activity.text}}</span>
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
              <div class="customer-tree-select">
                <div class="divider"></div>
                <el-select @change="searchTypeChange" v-model="searchType" style="width: 90px">
                  <el-option v-for="item in typeList"
                             :value="item.value"
                             :key="item.value"
                             :label="item.label"></el-option>
                </el-select>
                <el-select
                  style="width: calc(100% - 90px)"
                  id="org-select"
                  v-model="searchValue"
                  filterable
                  remote
                  :placeholder="searchType === 'org' ? '请输入机构名称' : '请输入11位账号'"
                  :remote-method="handleSearch"
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
                    <span class="node-name">{{ node.label }}
                      <span v-if="node.level === 1">（顶级合作机构）</span>
                    </span>
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
          <div class="yc-customer-content-list" :class="{scroll: scrollShow}">
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
      searchType: 'org',
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
      saveName: '',
      editable: false,
      typeList: [{
        value: 'org',
        label: '机构',
      }, {
        value: 'account',
        label: '账号',
      }],
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
            contractRecord, delayRecord, tree, ...customerData
          } = data;
          this.customerData = customerData;
          if (contractRecord.length) this.contractRecord = this.setRecord(contractRecord, 'qy');
          if (delayRecord.length) this.delayRecord = this.setRecord(delayRecord, 'yq');
          this.treeData = [tree];
          document.title = tree.name;
          if (type === 'init') {
            // 若是初始化
            this.activeCustonerName = tree.name;
            this.activeLevel = tree.level;
            this.activeOrgId = tree.id;
            this.subOrgData = tree.subOrg.reverse();
            this.getAccountData(id);
            this.filterTree(this.treeData[0], '');
            this.hightlight(id);
          }
          if (type === 'org') {
            this.filterTreeNode(this.treeData, this.activeOrgId);
            // 根据当前选中的子机构进行 树的选中
            this.hightlight(this.activeOrgId);
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    // 设置树结构斑马纹
    setTreeColor() {
      const content = document.getElementsByClassName('el-tree-node__content');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < content.length; i++) {
        if (i % 2 === 0) {
          content[i].style.background = '#F6F7FA';
        } else {
          content[i].style.background = '';
        }
      }
    },
    // 判断 限制 数字小于0取0 大于限制数等于限制数
    checkNum(rest, limit) {
      if (rest < 0) return 0;
      if (rest > limit) return limit;
      return rest;
    },
    // 设置签约记录 延期记录
    setRecord(list, type) {
      return type === 'qy'
        ? list.map((item, index) => {
          const text = `${this.acountList[index]}次${index ? '续签' : '签约'}起止日期：${item.start || '-'} 至 ${item.end || '-'}`;
          return Object.assign(item, { text });
        }).reverse()
        : list.map((item, index) => {
          const text = `${this.acountList[index + 1]}次延期时长：${item}日`;
          return Object.assign(item, { text });
        }).reverse();
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
    // 树节点搜索
    handleSearch(value) {
      if (this.searchType === 'org') {
        // treeData 树节点中模糊搜索输入字段
        this.searchList = [];
        this.filterTree(this.treeData[0], value);
      } else {
        const { id } = this.$route.params;
        const params = {
          mobile: value.replace(/\s+/g, ''),
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
        AdminApi.searchUser(val).then((res) => {
          const { code, data, message } = res.data || {};
          if (code === 200) {
            const { orgId, user } = data;
            const obj = {
              roleName: user.role === '196' ? '查询用户' : '管理员用户',
              time: user.time || '-',
            };
            // 子机构赋值
            this.filterTreeNode(this.treeData, orgId);
            // 账号列表赋值
            this.accountData = [Object.assign(user, obj)];
            // 根据当前选中的子机构进行 树的选中
            this.hightlight(orgId);
          } else {
            this.$message.error(message);
          }
        });
      }
    },
    // 高亮树节点
    hightlight(id) {
      // 根据当前选中的子机构进行 树的选中
      this.$nextTick(() => {
        const { setCurrentKey } = this.$refs.orgTree;
        setCurrentKey(id);
      });
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
      this.subOrgData = subOrg.reverse();
      // 需要对搜索框做回填
      if (this.searchType !== 'org') {
        this.searchType = 'org';
        this.filterTree(this.treeData[0], '');
      }
      this.searchValue = id;
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
          this.subOrgData = item.subOrg.reverse();
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
    searchTypeChange() {
      this.searchValue = '';
      this.searchList = [];
      if (this.searchType === 'org') this.filterTree(this.treeData[0], '');
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
      .time1 {
        width: 38%;
      }
      .time2 {
        width: 28%;
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
      :deep(.customer-tree) {
        padding: 20px;
        position: relative;
        &-select {
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
        }
        :deep(#tree-select) {
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
    }
    &-list {
      width: 960px;
      margin-left: 20px;
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
