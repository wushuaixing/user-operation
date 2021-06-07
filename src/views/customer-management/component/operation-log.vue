<template>
  <div class="yc-newpage-contaner">
    <section class="main-wrapper operation-log-wrapper">
      <BreadCrumb :text="`操作日志-${name}`" />
      <div class="query-content">
        <el-form :inline="true" :model="params" class="query-form" ref="formRef">
          <el-form-item label="操作人：" prop="uid">
            <el-select v-model="params.uid" style="width: 94px">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作模块：" prop="title">
            <el-select v-model="params.title" style="width: 162px">
              <el-option
                v-for="item in operaModuleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
            v-for="item in column"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="item.class"
            :class-name="item.class"
          />
          <el-table-column label="操作内容">
            <template #default="scope">
              <span :style="{display:show(scope.row).display}">{{show(scope.row).before}}</span>
              <span v-if=" show(scope.row).after && (show(scope.row).display !=='block')" style="margin: 0 8px">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconjiantou"></use>
                </svg>
              </span>
              <span :style="{display:show(scope.row).display}">{{show(scope.row).after}}</span>
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
        />
      </div>
    </section>>
  </div>
</template>

<script>
import BreadCrumb from '@/components/bread-crumb/index.vue';
import AdminApi from '@/server/api/admin';
import { toRaw } from 'vue';
import { operaModuleList } from '@/utils/static';
import { operationColumn } from '@/static/column';
import { dateUtils } from '@/utils';
import { zcjkRules } from '../modal/data';

export default {
  name: 'operation-log',
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
        id: '',
        title: '',
        end: '',
        start: '',
        uid: '',
        num: 10,
      },
      data: [],
      userList: [],
      operaModuleList,
      column: operationColumn,
    };
  },

  created() {
    document.title = '操作日志';
    const {
      query: { name, id },
    } = this.$route;
    this.name = name;
    this.params.id = id;
    this.getData();
  },
  methods: {
    getData() {
      this.operatorList();
      this.getList();
    },
    // 操作人
    operatorList() {
      AdminApi.operatorList().then((res) => {
        const { data } = res.data || {};
        this.userList = [{ id: '', value: '全部' }, ...data];
      });
    },
    // 列表
    getList() {
      const time = (val) => dateUtils.formatStandardDate(val);
      const { end, start, ...rest } = toRaw(this.params);
      const params = {
        ...rest,
        end: time(end),
        start: time(start),
        page: this.page,
      };
      AdminApi.orgListOrgLog(params).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const { list = [], page, total } = data || {};
          const f = (j) => this.operaModuleList.find((i) => i.value === j.title).label;
          this.data = list.map((i) => ({ ...i, title: f(i) }));
          this.page = page;
          this.total = total;
        } else {
          this.$message.error('请求出错');
        }
      });
    },
    // 搜索
    handleSearch() {
      this.page = 1;
      this.getList();
    },
    // 清空搜索条件
    resetParams() {
      this.$refs.formRef.resetFields();
      this.getList();
    },
    // 换页
    pageChange(page) {
      if (!this.isTriggerCurrent) {
        this.page = parseInt(page, 10);
        this.getList();
      }
      this.isTriggerCurrent = false;
    },
    // 切换pageSize
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
    // 操作内容展示
    show(params = {}) {
      const { title, before, after } = toRaw(params);
      let type = this.operaModuleList.find((i) => i.label === title).value;
      if ([6, 7, 8, 9, 10].includes(type)) type = 6;
      let obj = { before, after, display: 'inline' };
      const suffixNum = (i) => (i === '-1' ? '不限' : `${i}次`);
      const sufficRules = (text, flag) => {
        const fn = (str = '') => str.split(',').map((i) => (zcjkRules.find((j) => j.val === i) || {}).label).join();
        const str = fn(text);
        const action = flag ? '【新增权限】' : '【取消权限】';
        return str ? `${action}${str}` : '';
      };
      const sufficType = (i) => (Number(i) ? '正式' : '试用');
      switch (type) {
        case 3:
          obj = { before: sufficType(before), after: sufficType(after), display: 'inline' };
          break;
        case 6:
          obj = { before: suffixNum(before), after: suffixNum(after), display: 'inline' };
          break;
        case 11:
          obj = { before: sufficRules(before, false), after: sufficRules(after, true), display: 'block' };
          break;
        default: break;
      }
      return obj;
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
