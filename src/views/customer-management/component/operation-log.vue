<template>
  <div class="yc-newpage-contaner">
    <section class="main-wrapper operation-log-wrapper">
      <BreadCrumb :text="`操作日志-${name}`" />
      <div class="query-content">
        <el-form :inline="true" :model="queryParams" class="query-form" ref="formRef">
          <el-form-item label="操作人：" prop="uid">
            <el-select v-model="queryParams.uid" style="width: 94px">
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
            <el-select v-model="queryParams.title" style="width: 162px">
              <el-option
                v-for="item in OPERA_MODULE_LIST"
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
              placeholder="开始时间"
              v-model="queryParams.start"
              style="width: 140px"
              :disabledDate="disabledStartDate" />
          </el-form-item>
          <el-form-item label="至"   prop="end" class="time-end">
            <el-date-picker
              type="date"
              placeholder="结束时间"
              v-model="queryParams.end"
              style="width: 140px"
              :disabledDate="disabledEndDate"
            />
          </el-form-item>
          <el-form-item class="btn-group">
            <el-button
              type="primary"
              @click="handleAction(true)"
              class="button-first"
              style="padding: 0 21px"
            >搜索</el-button
            >
            <el-button
              type="primary"
              @click="handleAction(false)"
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
          <el-table-column label="操作内容" width="556px">
            <template #default="scope">
                <template v-if="!show(scope.row).isRules">
                  <span>{{show(scope.row).before}}</span>
                  <span v-if=" show(scope.row).after" style="margin: 0 8px">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconjiantou"></use>
                    </svg>
                  </span>
                  <span>{{show(scope.row).after}}</span>
                </template>
                <template v-else>
                    <ul class="zcjk-rules-box">
                      <template v-for="(item,index) in Object.keys(show(scope.row))" :key="index">
                        <li v-if="show(scope.row)[item].length">
                          <div>{{item === 'before'?'取消权限':'新增权限'}}：</div>
                          <div>
                            <p v-for="itemChild in show(scope.row)[item]" :key="itemChild.title">
                              【{{itemChild.title}}:
                              <span v-for="(childItem,index) in itemChild.child" :key="childItem">
                              {{childItem}}
                              {{index === itemChild.child.length-1 ? null:'、'}}
                              </span>】
                            </p>
                          </div>
                        </li>
                      </template>
                    </ul>
                </template>
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
          hide-on-single-page
        />
      </div>
    </section>
  </div>
</template>

<script>
import BreadCrumb from '@/components/bread-crumb/index.vue';
import AdminApi from '@/server/api/admin';
import { toRaw } from 'vue';
import { OPERA_MODULE_LIST } from '@/static';
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
      total: 0,
      page: 1,
      name: '',
      loading: false,
      isTriggerCurrent: false,
      params: {
        id: '',
        num: 10,
      },
      queryParams: {
        title: '',
        end: '',
        start: '',
        uid: '',
      },
      queryOptions: {},
      data: [],
      userList: [],
      OPERA_MODULE_LIST,
      column: operationColumn,
    };
  },

  created() {
    const {
      query: { name, id, type },
    } = this.$route;
    const text = type ? '正式' : '试用';
    this.name = `${name}(${text})`;
    document.title = `【操作日志】${name}`;
    this.params = {
      id,
      num: 10,
    };
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
      const { end, start, ...rest } = toRaw(this.queryOptions);
      const params = {
        ...rest,
        ...this.params,
        end: time(end),
        start: time(start),
        page: this.page,
      };
      AdminApi.orgListOrgLog(params).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const { list = [], page, total } = data || {};
          const f = (j) => this.OPERA_MODULE_LIST.find((i) => i.value === j.title).label;
          this.data = list.map((i) => ({ ...i, title: f(i) }));
          this.page = page;
          this.total = total;
        } else {
          this.$message.error('请求出错');
        }
      });
    },
    // 搜索 & 清空搜索条件
    handleAction(isSearch = false) {
      if (!isSearch) this.$refs.formRef.resetFields();
      this.queryOptions = { ...this.queryParams };
      this.page = 1;
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
      const { end } = this.queryParams;
      if (!startTime || !end) return false;
      const dynamicEndTime = new Date(end).valueOf();
      return startTime.valueOf() > dynamicEndTime;
    },
    disabledEndDate(endTime) {
      const { start } = this.queryParams;
      if (!endTime || !start) return false;
      const startTime = new Date(start).valueOf();
      const dynamicTime = startTime - 86400000;
      return endTime.valueOf() <= dynamicTime;
    },
    // 操作内容展示
    show(params = {}) {
      const { title, before, after } = toRaw(params);
      let type = this.OPERA_MODULE_LIST.find((i) => i.label === title).value;
      if ([6, 7].includes(type)) type = 6;
      if ([8, 9, 10].includes(type)) type = 8;
      let obj = { before, after };
      const suffixNum = (i, unit) => (i === '-1' ? '不限' : `${i}${unit}`);
      const sufficRules = (text) => {
        const str = text.split(',');
        const fn = (arr) => arr.filter((i) => str.indexOf(i) > -1);
        let data = [];
        zcjkRules.forEach((i) => {
          const arr = i.children.map((c) => c.val);
          // eslint-disable-next-line no-param-reassign
          data = [...data, { title: i.title, child: fn(arr).map((d) => d = i.children.find((k) => k.val === d).label) }];
        });
        return data.filter((i) => i.child.length);
      };
      const sufficType = (i) => (Number(i) ? '正式' : '试用');
      switch (type) {
        case 3:
          obj = { before: sufficType(before), after: sufficType(after) };
          break;
        case 6:
          obj = { before: suffixNum(before, '次'), after: suffixNum(after, '次') };
          break;
        case 8:
          obj = { before: suffixNum(before, '个'), after: suffixNum(after, '个') };
          break;
        case 11:
          obj = { before: sufficRules(before), after: sufficRules(after), isRules: true };
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
      padding: 16px 20px 20px;
      .el-table__body-wrapper{
          .el-table__body{
            td{
              padding: 15px 0 !important;
            }
          }
      }
      .zcjk-rules-box{
        li{
          display: flex;
          div{
            &:first-child{
              min-width: 70px;
              font-weight: bold;
            }
            &:last-child{
              display: flex;
              flex-wrap: wrap;
            }
          }
        }
      }
    }
  }
</style>
