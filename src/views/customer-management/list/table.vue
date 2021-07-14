<template>
  <div>
    <div class="table-content-button">
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
        v-loading="loading"
        :row-key="(val) => val.id"
      >
        <template #empty>
          <img src="../../../assets/img/no_data.png" alt="" />
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
          :align="item.align"
          :key="item.label"
        >
          <template #default="scope" v-if="item.prop === 'name'">
                  <span>{{ scope.row.name }}
                    <span class="iconfont iconyiguoqi"
                          style="font-size: 17px;color: #F93535;margin-left: 4px"
                          v-if="scope.row.isExpire"
                    ></span></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="19%">
          <template #default="scope">
            <el-button
              type="text"
              class="button-link"
              @click.stop="toDetail(scope.row)"
            >
              详情
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              type="text"
              class="button-link"
              @click.stop="showModal('edit',scope.row)"
            >
              权限管理
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              type="text"
              class="button-link"
              @click.stop="handleAction(scope.row)"
            >操作日志
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="pageChange"
        background
        :key="page"
        :current-page="page"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :hide-on-single-page="total === 0"
      />
    </div>
  </div>
</template>
<script>
import { customerColumn } from '@/static/column';

export default {
  emits: ['pageOrSizeChange', 'handleExport', 'handleSortChange', 'showModal'],
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isChecked: false,
      multipleSelection: [],
      loading: false,
      column: customerColumn,
      page: 1,
      pageSize: 10,
      total: 0,
    };
  },
  watch: {
    isChecked(newVal) {
      // isChecked字段变为false时，清空选中的数组
      if (!newVal) {
        this.multipleSelection = [];
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
  methods: {
    setPageData(page, total) {
      this.page = page;
      this.total = total;
    },
    searchBefore() {
      this.page = 1;
      this.isChecked = false;
      const { clearSort } = this.$refs.multipleTable;
      clearSort();
    },
    // （取消）批量管理
    handleBatchCheck(isChecked) {
      this.isChecked = isChecked;
    },
    handleExport(type) {
      this.$emit('handleExport', type);
    },
    handleSortChange(obj) {
      this.isChecked = false;
      this.page = 1;
      this.$emit('handleSortChange', obj);
    },
    // 点击一行跳转详情页
    toDetail(row) {
      const { id } = row;
      window.open(`/customerDetail/${id}`, '_blank');
    },
    // 操作日志
    handleAction(params = {}) {
      const { name, id, type } = params;
      const routerData = this.$router.resolve({
        path: '/OperationLog',
        query: { name, id, type },
      });
      window.open(routerData.href, '_blank');
    },
    showModal(type, row) {
      // 'edit',scope.row
      this.isChecked = false;
      this.$emit('showModal', type, row);
    },
    // 翻页
    pageChange(page) {
      this.page = parseInt(page, 10);
      this.$emit('pageOrSizeChange');
    },
  },
};
</script>
<style lang="scss">
.table-content-button {
  margin-bottom: 12px;
  .total-tips {
    font-size: 14px;
    padding-left: 20px;
    color: #4e5566;
    b {
      color: #20242e;
    }
  }
}
</style>
