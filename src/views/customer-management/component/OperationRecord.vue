<template>
  <div class="yc-newpage-contaner">
    <section class="main-wrapper operation-log-wrapper">
      <BreadCrumb :text="`历史操作记录-${name}`" />
      <div class="query-content">
        <el-form :inline="true" :model="params" class="query-form" ref="formRef">
          <el-form-item label="操作类型：" prop="title">
            <el-select v-model="params.type" style="width: 162px">
              <el-option
                v-for="item in Object.keys(operationType)"
                :key="item"
                :label="operationType[item]"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间："   prop="start" style="margin-right: 0">
            <el-date-picker
              type="date"
              placeholder="开始日期"
              v-model="params.start"
              style="width: 140px"
              :disabledDate="disabledStartDate" />
          </el-form-item>
          <el-form-item label="至"   prop="end" class="time-end">
            <el-date-picker
              type="date"
              placeholder="结束日期"
              v-model="params.end"
              style="width: 140px"
              :disabledDate="disabledEndDate"
            />
          </el-form-item>
          <el-form-item class="btn-group">
            <el-button
              type="primary"
              @click="handleSearch"
              class="button-first"
              style="padding: 0 21px"
            >搜索</el-button
            >
            <el-button
              type="primary"
              @click="resetParams"
              class="button-fourth"
              style="padding: 0 11px"
            >清空搜索条件</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="table-content">
        <el-table
          :data="data"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loading"
          :row-key="(val) => val.id"
        >
          <template #empty>
            <img src="../../../assets/img/no_data.png" alt="" />
            <p>暂无数据</p>
          </template>
          <el-table-column
            prop="time"
            label="操作时间">
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="操作类型"
          >
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
        />
      </div>
    </section>>
  </div>
</template>

<script>
import BreadCrumb from '@/components/bread-crumb/index.vue';
import AdminApi from '@/server/api/admin';
import { toRaw } from 'vue';
import { operationType } from '@/utils/static';
import { operationColumn } from '@/static/column';
import { dateUtils } from '@/utils';

export default {
  name: 'OperationRecord',
  components: {
    BreadCrumb,
  },
  data() {
    return {
      name: '',
      total: 0,
      page: 1,
      loading: false,
      isTriggerCurrent: false,
      params: {
        type: '0',
        id: '',
        end: '',
        start: '',
        num: 10,
      },
      data: [],
      userList: [],
      operationType,
      column: operationColumn,
    };
  },

  created() {
    document.title = '客户管理';
    const {
      query: { name, id },
    } = this.$route;
    this.name = name;
    this.params.id = id;
    this.getData();
  },
  methods: {
    getData() {
      this.getList();
    },
    getList() {
      const params = {
        ...toRaw(this.params),
        page: this.page,
      };
      if (params.start) params.start = dateUtils.formatStandardDate(params.start);
      if (params.end) params.end = dateUtils.formatStandardDate(params.end);
      if (!Number(params.type)) delete params.type;
      AdminApi.detailOrgUserLog(params).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const { list = [], page, total } = data || {};
          // 处理操作类型
          this.data = list.map((item) => {
            const typeName = this.operationType[item.type];
            return Object.assign(item, { typeName });
          });
          this.page = page;
          this.total = total;
          console.log(this.data);
        } else {
          this.$message.error('请求出错');
        }
      });
    },
    handleSearch() {
      this.page = 1;
      this.getList();
    },
    resetParams() {
      this.$refs.formRef.resetFields();
      this.params.type = '0';
      this.getList();
    },
    pageChange(page) {
      if (!this.isTriggerCurrent) {
        this.page = parseInt(page, 10);
        this.getList();
      }
      this.isTriggerCurrent = false;
    },
    sizeChange(num) {
      this.params = {
        ...this.params,
        num,
      };
      this.isTriggerCurrent = this.page > Math.ceil(this.total / num);
      this.page = 1;
      this.getList();
    },
    // 时间控件做前后限制
    disabledStartDate(startTime) {
      const endTime = this.params.end;
      if (!startTime || !endTime) return false;
      const dynamicEndTime = new Date(endTime).valueOf();
      return startTime.valueOf() > dynamicEndTime;
    },
    disabledEndDate(endTime) {
      const { start } = this.params;
      if (!endTime || !start) return false;
      const startTime = new Date(start).valueOf();
      const dynamicTime = startTime - 86400000;
      return endTime.valueOf() <= dynamicTime;
    },
  },
};
</script>

<style lang="scss">
  .operation-log-wrapper{
    .query-content{
      padding-left: 20px;
      .query-form{
        display: flex;
        .el-form-item{
          margin: 16px 32px 0 0 ;
        }
        .time-end{
          .el-form-item__label{
            margin: 0 6px;
          }
        }
        .btn-group{
          flex: 1;
          text-align: right;
          margin-right: 20px;
        }
      }
    }
    .table-content{
      padding: 20px;
    }
  }
</style>
