<template>
  <div class="customer-management-container">
    <div class="query-content">
      <el-form :inline="true" :model="queryParams" class="query-form">
        <div>
          <el-form-item label="机构名称：" style="width: 300px">
          <el-select
            id="org-select"
            v-model="queryParams.orgId"
            filterable
            remote
            placeholder="请输入机构名称"
            :remote-method="remoteMethod"
            @change="setCustomerName"
            >
            <el-option
              v-for="item in customerOptions"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同结束日期：">
          <el-date-picker
            class="query-time"
            v-model="queryParams.start"
            type="date"
            @change="endTimeChange"
            :disabledDate="disabledStartDate"
            placeholder="开始日期">
          </el-date-picker>
          <span style="margin:0 6px;">至</span>
          <el-date-picker
            class="query-time"
            v-model="queryParams.end"
            type="date"
            @change="endTimeChange"
            :disabledDate="disabledEndDate"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="顶级合作机构状态：">
          <el-select v-model="queryParams.status" style="width: 162px" @change="statusChange">
            <el-option
              v-for="item in Object.keys(topOrgStatus)"
              :key="item"
              :label="topOrgStatus[item]"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构类型：">
          <el-select v-model="queryParams.type" style="width: 94px">
            <el-option
              v-for="item in Object.keys(orgType)"
              :key="orgType[item]"
              :label="item"
              :value="orgType[item]"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button type="primary" @click="handleClear"
            >清空搜索条件</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content">
      <div class="main-content-left">
        <CustomerTree
          ref="CustomerTree"
          :totalOrgNum="totalOrgNum"
          :totalOperatedOrgNum="totalOperatedOrgNum"
          :activities="activities"
          :activeKey="activeKey"
          @handleClick="customerTreeClick"
        ></CustomerTree>
      </div>
      <div class="main-content-right">
        <BreadCrumb
          :text="title"
          :editable="editable"
          :btnText="!editable ? '创建域名机构' : '创建顶级合作机构'"
          @handleClick="showModal('add')"
          @saveName="saveName"
        >
          <template v-slot:detail v-if="editable">
            <div class="customer-detail">
              <div class="customer-detail-left">
                <div class="link">
                  <span>二级域名:</span>
                  <a :href="`http://www.${customerObj.subDomain}`" target='_blank'>{{customerObj.subDomain}}</a>
                </div>
                <div class="link">
                  <span>创建时间:</span>
                  <span>{{customerObj.createTime}}</span>
                </div>
              </div>
              <div class="customer-detail-right">
                <div class="customer num1">
                  <div class="customer-type">
                    顶级合作机构（家）</div>
                  <div class="customer-num">{{customerObj.topCooperateOrgNum}}</div>
                </div>
                <div class="divider"></div>
                <div class="customer num2">
                  <div class="customer-type">正式机构（家）</div>
                  <div class="customer-num">{{customerObj.formalOrgNum}}</div>
                </div>
                <div class="divider" style="margin-right: 31px;"></div>
                <div class="customer num3">
                  <div class="customer-type">试用机构（家）</div>
                  <div class="customer-num">{{customerObj.trialOrgNum}}</div>
                </div>
              </div>
            </div>
          </template>
        </BreadCrumb>
        <div class="table-content">
          <div class="table-content-btn">
            <el-button
              type="primary"
              v-if="!isChecked"
              @click="handleBatchCheck(true)"
              class="button-third"
              icon="iconfont iconyonghuyunying-piliangguanli"
              style="padding: 0 11px"
            >
              批量管理
            </el-button>
            <el-button
              type="primary"
              v-if="!isChecked"
              @click="handleExport('all')"
              class="button-third"
              icon="iconfont iconyonghuyunying-daochu"
              style="padding: 0 11px"
            >
              一键导出
            </el-button>
            <el-button
              type="primary"
              v-if="isChecked"
              @click="handleBatchCheck(false)"
              class="button-second"
              style="padding: 0 12px;"
              >取消批量管理</el-button
            >
            <el-button
              @click="handleExport()"
              class="button-fourth"
              v-show="isChecked"
            >导出
            </el-button>
            <span v-if="(multipleSelection || []).length" class="total-tips">
              <svg class="icon" aria-hidden="true" style="margin-right: 3px;font-size: 16px;position: relative;top: 1px">
                <use xlink:href="#iconxuanzhongshuju"></use>
              </svg>
              已选中 <b>{{ (multipleSelection || []).length }}</b> 条数据
            </span>
          </div>
          <div class="table-contend-body">
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="(val) => (this.multipleSelection = val)"
              @sort-change="handleSortChange"
              @row-click="rowClick"
              v-loading="loading"
              :row-key="(val) => val.id"
            >
              <template #empty>
                <img src="../../assets/img/no_data.png" alt="" />
                <p>暂无数据</p>
              </template>
              <el-table-column
                type="selection"
                v-if="isChecked"
                width="55"
                :reserve-selection="true"
              />
              <el-table-column
                v-for="item in column"
                :prop="item.prop"
                :label="item.label"
                :sortable="item.sort"
                :width="item.width"
                :align="item.align"
                :key="item.label"
              >
                <template #default="scope" v-if="item.prop === 'name'">
                  <span>{{ scope.row.name }}</span>
                  <span style="color: #F93535;font-size: 12px;line-height: 12px;border: 1px solid #F93535;margin-left: 10px;border-radius: 3px;padding: 2px 3px;display: inline-block;"
                        v-if="scope.row.isExpire">已过期</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="text"
                    @click.stop="showModal('edit',scope.row)"
                  >
                    权限管理
                  </el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button
                    type="text"
                    @click.stop="handleAction(scope.row)"
                    >操作日志
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="pageChange"
              @size-change="sizeChange"
              background
              :current-page="page"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            />
          </div>
        </div>
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
              >
              </el-input>
            </el-form-item>
            <el-form-item label="机构名称：" prop="name">
              <el-input
                v-model="addOrgForm.name"
                autocomplete="off"
                maxlength="100"
                placeholder="请输入机构名称"
                @blur="setName"
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
        <RulesModal
          ref="RulesModal"
          :formData="rulesForm"
          @getData="getData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { topOrgStatus, orgType, CUSTOMER_LIST } from '@/utils/static';
import BreadCrumb from '@/components/bread-crumb/index.vue';
import { customerColumn } from '@/static/column';
import { toRaw } from 'vue';
import AdminApi from '@/server/api/admin';
import RulesModal from '@/views/customer-management/modal/rules-modal.vue';
import $modalConfirm from '@/utils/better-el';
import { dateUtils, fileDownload } from '@/utils';
import CustomerTree from './component/CustomerTree.vue';

export default {
  name: 'customerManagement',
  nameComment: '客户管理',
  components: {
    RulesModal,
    BreadCrumb,
    CustomerTree,
  },
  data() {
    return {
      queryParams: {
        orgId: '',
        status: '0',
        type: -1,
        start: undefined,
        end: undefined,
      },
      currentQueryParams: {
        orgId: '',
        status: '0',
        type: -1,
        start: undefined,
        end: undefined,
      },
      customerOptions: [], // 搜索框中的机构列表
      selectTimer: null,
      title: '全部',
      topOrgStatus,
      orgType,
      tableData: [],
      multipleSelection: [],
      loading: false,
      isChecked: false,
      column: customerColumn,
      page: 1,
      pageSize: 10,
      total: 0,
      isActive: 0,
      activities: [], // 域名机构列表
      totalOrgNum: 0, // 总机构数
      totalOperatedOrgNum: 0, // 总合作中机构数
      activeKey: -1,
      editable: false, // 是否可编辑
      customerObj: { // 选中的域名机构详情
        subDomain: '',
        createTime: '',
        topCooperateOrgNum: 0,
        formalOrgNum: 0,
        trialOrgNum: 0,
        domainId: '',
        domainName: '',
      },
      addOrgVisible: false,
      addOrgForm: {
        subDomain: '',
        name: '',
      },
      rulesForm: {},
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
  created() {
    this.getCuntomerTreeData();
    // 查询机构 使得2查询框默认展示搜索数据
    this.getOrgList('');
  },
  mounted() {
    // 点击浏览器刷新时，响应 对带参做处理
    this.$nextTick(() => {
      const { id } = this.$route.params;
      if (id && id !== 'all') {
        this.queryParams.orgId = Number(id);
        this.currentQueryParams.orgId = Number(id);
      }
      this.getList();
    });
    // 给机构搜索select框添加最大输入长度
    const dom = document.getElementById('org-select');
    dom.setAttribute('maxLength', 100);
  },
  watch: {
    $route(to) {
      // 对路由变化作出响应...
      const { id } = to.params;
      if (id) {
        if (id !== 'all') {
          this.queryParams.orgId = Number(id);
        }
      } else {
        this.queryParams.orgId = '';
        this.$refs.CustomerTree.setStatusAll();
      }
      this.getOrgList('');
      this.getList();
    },
    isChecked(newVal) {
      // isChecked字段变为false时，清空选中的数组
      if (!newVal) {
        this.multipleSelection = [];
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
  methods: {
    getData() {
      this.getCuntomerTreeData();
      this.getList();
    },
    // 获取列表数据
    getList(type) {
      console.log(toRaw(this.queryParams));
      // 处理搜索条件参数
      const params = {
        ...toRaw(type ? this.currentQueryParams : this.queryParams),
        page: this.page,
        num: this.pageSize,
      };
      if (params.start) params.start = dateUtils.formatStandardDate(params.start);
      if (params.end) params.end = dateUtils.formatStandardDate(params.end);
      if (params.type === -1) {
        delete params.type;
      }
      this.loading = true;
      AdminApi.searchOrg(params)
        .then((res) => {
          const { code, data } = res.data || {};
          if (code === 200) {
            const { list, page, total } = data.result || {};
            // 需要对返回的数据进行空处理，变为"-"
            this.tableData = list.map((item) => {
              const typeName = item.type ? '正式' : '试用';
              const startTime = item.startTime || '-';
              return Object.assign(item, { typeName, startTime });
            });
            this.total = total;
            this.page = page;
            // 若不是全部机构 则赋值机构详情 customerObj
            const { detail } = data;
            if (detail && Object.keys(detail).length > 0) {
              this.editable = true;
              this.customerObj = Object.assign(this.customerObj, detail);
              this.title = `${detail.domainName}（ID：${detail.domainId}）`;
              this.activeKey = detail.domainId;
            } else {
              this.title = `全部机构（${this.totalOperatedOrgNum}/${this.totalOrgNum}）`;
              this.editable = false;
            }
          } else {
            this.$message.error('请求出错');
          }
        })
        .finally(() => this.loading = false);
    },
    // 获取左侧树 数据
    getCuntomerTreeData() {
      AdminApi.orgListDomain().then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const { list, totalOrgNum, totalOperatedOrgNum } = data;
          this.activities = list;
          this.totalOrgNum = totalOrgNum;
          this.totalOperatedOrgNum = totalOperatedOrgNum;
        }
      });
    },
    // 排序
    handleSortChange({ prop, order }) {
      this.isChecked = false;
      // this.multipleSelection = []
      this.page = 1;
      const sort = {
        sortColumn: CUSTOMER_LIST[prop],
        sortOrder: CUSTOMER_LIST[order],
      };
      this.currentQueryParams = Object.assign(this.currentQueryParams, sort);
      this.getList('sort');
    },
    // 翻页
    pageChange(page) {
      this.page = parseInt(page, 10);
      this.getList('page');
    },
    // 页数改变
    sizeChange(size) {
      console.log(size);
      this.pageSize = size;
      this.getList('page');
    },
    // （取消）批量管理
    handleBatchCheck(isChecked) {
      this.isChecked = isChecked;
      // if (!isChecked) this.$refs.multipleTable.clearSelection();
    },
    // 操作日志
    handleAction(params = {}) {
      const { name, id, type } = params;
      const text = type ? '正式' : '试用';
      const routerData = this.$router.resolve({
        path: '/OperationLog',
        query: { name: `${name}（${text}）`, id },
      });
      window.open(routerData.href, '_blank');
    },

    // 点击一行跳转详情页
    rowClick(row) {
      const { id } = row;
      window.open(`/customerDetail/${id}`, '_blank');
    },

    // 机构状态改变 结束日期改变
    statusChange(val) {
      const nowDate = new Date();
      switch (val) {
        case '1': {
          // 开始日期赋值当天 结束日期置空
          this.queryParams.end = undefined;
          this.queryParams.start = nowDate;
          break;
        }
        case '2': {
          // 开始日期置空 结束日期赋值昨天
          this.queryParams.start = undefined;
          this.queryParams.end = new Date(nowDate.getTime() - 24 * 3600 * 1000);
          break;
        }
        case '3': {
          // 开始日期今天 结束日期：今天+两个月
          this.queryParams.start = new Date();
          nowDate.setMonth(nowDate.getMonth() + 2);
          this.queryParams.end = nowDate;
          break;
        }
        case '4': {
          // 开始日期：昨天-两个月  结束日期：昨天
          this.queryParams.end = new Date(nowDate.getTime() - 24 * 3600 * 1000);
          const date = new Date(nowDate.getTime() - 24 * 3600 * 1000);
          date.setMonth(date.getMonth() - 2);
          this.queryParams.start = date;
          break;
        }
        default:
          break;
      }
    },
    endTimeChange() {
      this.queryParams.status = '0';
    },

    // 搜索
    handleQuery() {
      this.page = 1;
      this.isChecked = false;
      const { clearSort } = this.$refs.multipleTable;
      clearSort();
      // 赋值currentQueryParams对象
      this.currentQueryParams = { ...this.queryParams };
      let url = this.queryParams.orgId ? `/${this.queryParams.orgId}` : '/all';
      url = `/customerManagement${url}`;
      if (this.isOrgIdChange(url)) {
        this.$router.push(url);
      } else {
        this.getList();
      }
    },
    // 判断orgId是否变化
    isOrgIdChange(url) {
      const { path } = this.$route;
      return path !== url;
    },
    // 清空搜索条件
    handleClear() {
      this.page = 1;
      this.isChecked = false;
      const { clearSort } = this.$refs.multipleTable;
      clearSort();
      this.queryParams = {
        orgId: '',
        status: '0',
        type: -1,
        start: undefined,
        end: undefined,
      };
      this.$refs.CustomerTree.handleSelect('all');
      // 赋值currentQueryParams对象
      this.currentQueryParams = { ...this.queryParams };
    },
    setName() {
      const { name } = this.addOrgForm;
      this.addOrgForm.name = name.replace(/\s+/g, '');
    },
    // 域名机构创建
    handleAddOrg() {
      this.$refs.addOrgForm.validate((valid) => {
        if (valid) {
          console.log(toRaw(this.addOrgForm));
          AdminApi.addDomain(this.addOrgForm).then((res) => {
            const { code, message } = res.data;
            if (code === 200) {
              this.$message.success('域名机构创建成功');
              // 关闭弹窗 刷新左侧树
              this.addOrgVisible = false;
              this.getCuntomerTreeData();
            } else {
              this.$message.warning(message);
            }
          });
        }
      });
    },

    handleExport(type) {
      if (!type && !this.multipleSelection.length) {
        this.$message.warning('未选中数据');
        return;
      }
      const text = type ? '点击确定，将为您导出所有信息' : '点击确定，将为您导出选中的所有信息';
      const title = type ? '确认导出所有信息吗？' : '确认导出选中的所有信息吗？';
      const params = {
        condition: {
          ...toRaw(this.queryParams),
          page: this.page,
        },
        idList: [],
      };
      // 处理查询条件
      if (params.condition.start) params.condition.start = dateUtils.formatStandardDate(params.condition.start);
      if (params.condition.end) params.condition.end = dateUtils.formatStandardDate(params.condition.end);
      if (params.condition.type === -1) {
        delete params.condition.type;
      }
      // 处理选中的id
      params.idList = type ? [] : this.multipleSelection.map((item) => item.id);
      $modalConfirm({ text, title }).then(() => {
        this.isChecked = false;
        AdminApi.orgExport(params).then((res) => {
          const { status } = res;
          if (status === 200) {
            fileDownload(res);
          } else {
            this.$message.error('导出失败!');
          }
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    resetAddOrgForm() {
      this.$refs.addOrgForm.resetFields();
    },
    // 打开弹窗 域名机构以及顶级机构创建
    showModal(sign, params = {}) {
      this.isChecked = false;
      if (sign === 'edit') {
        const { id } = params;
        AdminApi.orgPermission(id).then((res) => {
          const { code, data = {} } = res.data || {};
          if (code === 200) {
            this.$refs.RulesModal.open(data, false);
          } else {
            this.$message.error('请求错误');
          }
        });
      } else if (this.editable) {
        this.$refs.RulesModal.open(toRaw(this.customerObj), true);
      } else {
        this.addOrgVisible = true;
      }
    },
    // 左侧树点击事件
    customerTreeClick(val, obj) {
      // 改变路由后带参 以便刷新获取id和name做逻辑操作
      let url = '/customerManagement';
      if (val && val === 'all') {
        this.queryParams.orgId = '';
        url += '/all';
      } else {
        this.queryParams.orgId = obj.id;
        url += `/${obj.id}`;
      }
      this.currentQueryParams = { ...this.queryParams };
      this.isChecked = false;
      this.$refs.multipleTable.clearSort();
      if (this.isOrgIdChange(url)) {
        this.$router.push(url);
      } else {
        this.getList();
      }
    },

    // 保存顶级机构名称
    saveName(name) {
      console.log(name);
    },

    // 日期控件做前后限制
    disabledStartDate(startTime) {
      if (this.queryParams.end) {
        const time = dateUtils.formatStandardDate(this.queryParams.end);
        return startTime.getTime() > new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    },
    disabledEndDate(endTime) {
      if (this.queryParams.start) {
        const time = dateUtils.formatStandardDate(this.queryParams.start);
        return endTime.getTime() < new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    },

    remoteMethod(val) {
      if (this.selectTimer) {
        clearTimeout(this.selectTimer);
        this.selectTimer = null;
      }
      this.selectTimer = setTimeout(() => {
        // 调用接口查询
        this.getOrgList(val);
        clearTimeout(this.selectTimer);
        this.selectTimer = null;
      }, 300);
    },

    // 查询机构数据
    getOrgList(val) {
      // 去除字符串中的空格
      const field = val.replace(/\s/g, '');
      AdminApi.simpleListOrg(field).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          this.customerOptions = data;
        } else {
          this.$message.error(res.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },

    // 查询完之后给多选框下拉列表赋值
    setCustomerName() {
      this.getOrgList('');
    },
  },
};
</script>

<style lang="scss">
.customer-management-container {
  background-color: #f0f2f5 !important;
  .query-content {
    background: #fff;
    margin-bottom: 20px;
    .query-form{
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-form-item {
        margin: 22px 10px 22px;
        .query-time {
          width: 130px;
          input {
            padding-right: 15px;
          }
        }
      }
    }
  }
  .main-content {
    display: flex;
    &-left {
      min-height: 79vh;
      background: #fff;
      width: 300px;
      margin-right: 20px;
      padding: 20px;
    }
    &-right {
      flex: 1 !important;
      width: 500px;
      background-color: #fff;
      .customer-detail {
        display: flex;
        justify-content: space-between;
        padding-top: 12px;
        padding-bottom: 21px;
        &-left {
          width: calc(100% - 450px);
          font-size: 14px;
          color: #4E5566;
          .link {
            line-height: 14px;
            a {
              color: #296DD3;
            }
            span:first-child {
              margin-right: 11px;
            }
          }
          .link:last-child {
            margin-top: 16px;
          }
        }
        &-right {
          width: 500px;
          text-align: right;
          .customer {
            display: inline-block;
            text-align: center;
            &-type {
              color: #4E5566;
              font-size: 14px;
              line-height: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                cursor: pointer;
                margin-right: 5px;
              }
            }
            &-num {
              color: #20242E;
              line-height: 22px;
              font-size: 22px;
              margin-top: 10px;
            }
          }
          .num1 {
            width: 180px;
          }
          .num2 {
            width: 147px;
          }
          .num3 {
            width: 98px;
            text-align: center;
          }
          .divider {
            display: inline-block;
            vertical-align: super;
            width: 1px;
            height: 28px;
            background:#E2E4E9;
          }
        }
      }
      .table-content {
        padding: 20px;
        &-btn {
          margin-bottom: 20px;
          .total-tips {
            font-size: 14px;
            padding-left: 20px;
            color: #4e5566;
            b {
              color: #20242e;
            }
          }
        }
      }
    }
  }
}
.add-org-modal {
  padding-right: 40px;
}
</style>
