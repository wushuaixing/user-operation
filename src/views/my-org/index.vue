<template>
  <div class="yc-container my-org">
    <div class="my-org-header">
      <div class="tabs-button">
        <el-radio-group v-model="tabKey" @change="showTab">
          <el-radio-button :label="1">正式机构</el-radio-button>
          <el-radio-button :label="0">试用机构</el-radio-button>
        </el-radio-group>
      </div>
      <OrgMessage :data="orgMessage" :type="tabKey"></OrgMessage>
    </div>
    <div class="query-content">
<!--      <Query></Query>-->
      <el-form :inline="true" :model="queryParams" class="query-form">
        <el-form-item label="顶级合作机构名称：">
          <el-input
            v-model.trim="queryParams.name"
            placeholder="请输入机构名称"
            style="width: 220px"
            maxlength="100"
            @input="(val) => queryParams.name = val.replace(/\s+/g, '')"
            clearable
          />
        </el-form-item>
        <el-form-item label="合同结束日期：">
          <div class="form-item-time">
            <el-form-item prop="start">
              <el-date-picker
                type="date"
                placeholder="开始日期"
                v-model="queryParams.start"
                style="width: 130px"
                :disabledDate="disabledStartDate"
                popper-class="data-picker"
                :append-to-body="false"
              />
            </el-form-item>
            <span class="line" style="margin: 0 6px">至</span>
            <el-form-item prop="end">
              <el-date-picker
                type="date"
                placeholder="结束日期"
                v-model="queryParams.end"
                style="width: 130px"
                :disabledDate="disabledEndDate"
                popper-class="data-picker"
                :append-to-body="false"
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="resetOptions(true)"
            class="button-first"
            style="padding: 0 21px"
          >搜索</el-button
          >
          <el-button
            type="primary"
            @click="resetOptions(false)"
            class="button-fourth"
            style="padding: 0 11px"
          >清空搜索条件</el-button
          >
        </el-form-item>
      </el-form>
    </div>
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
          v-else
          @click="handleBatchCheck(false)"
          class="button-second"
          style="padding: 0 12px"
        >取消批量管理</el-button
        >
        <el-button
          @click="handleExport()"
          class="button-fourth"
          v-show="isChecked"
        >
          导出
        </el-button>
        <span v-if="(multipleSelection || []).length" class="total-tips">
          <svg
            class="icon"
            aria-hidden="true"
            style="
              margin-right: 3px;
              font-size: 16px;
              position: relative;
              top: 1px;
            "
          >
            <use xlink:href="#iconxuanzhongshuju"></use>
          </svg>
          已选中 <b>{{ (multipleSelection || []).length }}</b> 条数据
        </span>
      </div>
      <div class="table-content-body">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="(val) => (this.multipleSelection = val)"
          @sort-change="handleSortChange"
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
            :min-width="item.width"
            :key="item.class"
            :align="item.align"
            :class-name="item.class"
          />
          <el-table-column label="操作" min-width="15%">
            <template #default="scope">
              <el-button
                type="text"
                @click="handleOpen(scope.row)"
                class="button-link"
              >
                监控管理
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                @click="handleOpenModal(scope.row)"
                class="button-link"
              >
                客户报告
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
          :page-size="params.num"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
          :key="page"
        />
      </div>
    </div>
    <Report ref="Report"></Report>
  </div>
</template>

<script>
import { MYORG_LIST } from '@/static';
import { taskAssignTabs } from '@/static/fn';
import { myOrgColumn } from '@/static/column';
import MyOrgApi from '@/server/api/my-org';
import { dateUtils, fileDownload, clearEmpty } from '@/utils';
import { toRaw } from 'vue';
import $modalConfirm from '@/utils/better-el';
// import Query from './query/query';
import Report from '@/views/my-org/report/report.vue';
import OrgMessage from './header/org-message';

export default {
  name: 'index',
  nameComment: '顶级机构分配',
  components: {
    OrgMessage,
    Report,
  },
  data() {
    return {
      visible: false,
      taskAssignTabs,
      toggle: true,
      column: myOrgColumn,
      isTriggerCurrent: false,
      isChecked: false,
      tabKey: 1,
      orgMessage: {},
      tableData: [],
      userList: [],
      multipleSelection: [],
      page: 1,
      total: 0,
      loading: false,
      params: {
        sortColumn: '',
        sortOrder: '',
        num: 10,
      },
      queryParams: {
        name: '',
        start: undefined,
        end: undefined,
      },
      queryOption: {},
      topOrgNameList: [],
    };
  },
  created() {
    this.getData();
    document.title = '我的机构';
  },
  methods: {
    showTab(val) {
      console.log(val, this.tabKey, 'tab');
    },
    getData() {
      this.getList();
    },
    getList() {
      this.loading = true;
      const params = {
        ...toRaw(this.params),
        ...toRaw(this.queryOption),
        type: this.tabKey,
        page: this.page,
      };
      // if (params.name) params.name = params.name.replace(/\s+/g, '');
      if (params.start) params.start = dateUtils.formatStandardDate(params.start);
      if (params.end) params.end = dateUtils.formatStandardDate(params.end);
      MyOrgApi.myOrgList(params)
        .then((res) => {
          const { code, data } = res.data || {};
          if (code === 200) {
            const { myOrgList, ...orgMessage } = data || {};
            this.orgMessage = orgMessage;
            const { list, page, total } = myOrgList || {};
            this.tableData = list.map((item) => {
              const start = item.start || '-';
              const readRate = item.readRate ? `${item.readRate.toFixed(2)}%` : 0;
              return Object.assign(item, { start, readRate });
            });
            this.total = total;
            this.page = page;
          } else {
            this.$message.error('请求出错');
          }
        })
        // eslint-disable-next-line no-return-assign
        .finally(() => (this.loading = false));
    },
    // 排序
    handleSortChange({ prop, order }) {
      this.isChecked = false;
      const { clearSelection } = this.$refs.multipleTable;
      clearSelection();
      this.page = 1;
      this.params = {
        ...this.params,
        sortColumn: MYORG_LIST[prop],
        sortOrder: MYORG_LIST[order],
      };
      this.getList();
    },
    // 翻页
    pageChange(page) {
      if (!this.isTriggerCurrent) {
        this.page = parseInt(page, 10);
        this.getList();
      }
      this.isTriggerCurrent = false;
    },
    // pageSize 改变
    sizeChange(num) {
      this.params = {
        ...this.params,
        num,
      };
      this.isTriggerCurrent = this.page > Math.ceil(this.total / num);
      this.page = 1;
      this.getList();
    },

    // tab切换 && 清空搜索条件
    resetOptions(flag = false) {
      this.page = 1;
      this.isChecked = false;
      const { clearSelection, clearSort } = this.$refs.multipleTable;
      clearSelection();
      clearSort();
      if (!flag) {
        this.queryParams = {
          name: '',
          start: undefined,
          end: undefined,
        };
        this.params = {
          sortColumn: '',
          sortOrder: '',
          num: 10,
        };
      }
      this.queryOption = { ...this.queryParams };
      this.getList();
    },
    // （取消）批量管理
    handleBatchCheck(isChecked) {
      this.isChecked = isChecked;
      if (!isChecked) this.$refs.multipleTable.clearSelection();
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
    handleExport(type) {
      if (!type && !this.multipleSelection.length) {
        this.$message.warning('未选中数据');
        return;
      }
      const info = type ? {
        text: '点击确定，将为您导出所有信息',
        title: '确认导出所有信息吗？',
      } : {
        text: '点击确定，将为您导出选中的所有信息',
        title: '确认导出选中的所有信息吗？',
      };
      const params = {
        condition: {
          ...toRaw(clearEmpty(this.params)),
          ...toRaw(clearEmpty(this.queryOption)),
          type: this.tabKey,
          page: this.page,
        },
        idList: [],
      };
      // 处理查询条件
      console.log(params, 'params');
      if (params.condition.start) params.condition.start = dateUtils.formatStandardDate(params.condition.start);
      if (params.condition.end) params.condition.end = dateUtils.formatStandardDate(params.condition.end);
      // 处理选中的id
      params.idList = type ? [] : this.multipleSelection.map((item) => item.id);
      $modalConfirm(info).then(() => {
        this.isChecked = false;
        MyOrgApi.export(params).then((res) => {
          const { code = 200, message = '' } = res;
          if (code === 200) {
            fileDownload(res);
          } else {
            this.$message.error(message);
          }
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    handleOpen(row) {
      this.isChecked = false;
      const { id, name } = row;
      const routerData = this.$router.resolve({
        path: '/monitorManage',
        query: { id, name },
      });
      window.open(routerData.href, '_blank');
    },
    handleOpenModal(row) {
      this.isChecked = false;
      const { open } = this.$refs.Report;
      open(row.id);
    },
  },
  watch: {
    tabKey() {
      this.resetOptions();
    },
    isChecked(val) {
      if (!val) {
        this.multipleSelection = [];
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
};
</script>

<style lang="scss">
  .my-org {
    padding-top: 0 !important;
    padding-bottom: 40px !important;
    margin: 20px;
    &-header {
      height: 89px;
      border-bottom: 1px solid #E2E4E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tabs-button {
        border: 1px solid #296DD3;
        width: 240px;
        height: 36px;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-radio-button:first-child .el-radio-button__inner {
          border-left: none;
        }
        .el-radio-button__inner {
          padding: 7px 30px;
          border: none;
          border-radius: 2px !important;
        }
      }
    }
    .table-content {
      &-btn {
        padding: 1px 0 12px 0;
        .total-tips {
          font-size: 14px;
          padding-left: 20px;
          color: #4e5566;
          b {
            color: #20242e;
          }
        }
      }
      &-body {
        tbody {
          .org-num {
            padding-right: 25px;
          }
          .obligor-num {
            padding-right: 18px;
          }
        }
      }
    }
    .query-content {
      margin-top: 18px;
      .el-form-item {
        margin: 0 32px 12px 0;
      }
      .form-item-time {
        .el-form-item {
          margin: 0;
          .el-input--suffix .el-input__inner {
            padding-right: 9px;
          }
        }
      }
    }
    .modal-content {
      .el-dialog__body {
        ul {
          padding: 4px 32px 0 32px;
          li {
            display: flex;
            line-height: 18px;
            margin-bottom: 22px;
            &:last-child {
              display: flex;
              align-items: center;
              margin-bottom: 40px;
            }
            div {
              &:first-child {
                min-width: 126px;
                text-align: right;
              }
              &:last-child {
                p {
                  margin-bottom: 8px;
                  .el-button {
                    padding: 0 0 0 14px !important;
                    min-height: 18px !important;
                    i {
                      margin-left: 4px;
                      position: relative;
                      top: 1px;
                    }
                  }
                  &:last-child {
                    margin-bottom: 0;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
