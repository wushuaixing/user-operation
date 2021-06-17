<template>
  <div>
    <el-form :inline="true" :model="queryParams" class="query-form-list">
      <div>
        <el-form-item label="机构名称：">
          <el-select
            id="org-select"
            v-model="queryParams.orgId"
            style="width: 220px"
            filterable
            placeholder="请输入机构名称"
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
              v-for="item in Object.keys(TOP_ORG_STATUS)"
              :key="item"
              :label="TOP_ORG_STATUS[item]"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构类型：">
          <el-select v-model="queryParams.type" style="width: 94px">
            <el-option
              v-for="item in orgType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item class="query-button">
        <el-button type="primary"
                   @click="handleQuery"
                   class="button-first"
        >搜索</el-button>
        <el-button
          type="primary"
          @click="handleClear"
          class="button-fourth"
        >清空搜索条件</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import AdminApi from '@/server/api/admin';
import { dateUtils } from '@/utils';
import { TOP_ORG_STATUS, orgType } from '@/static';

export default {
  emits: ['handleQuery', 'handleClear'],
  data() {
    return {
      TOP_ORG_STATUS,
      orgType,
      queryParams: {
        orgId: '',
        status: '0',
        type: -1,
        start: undefined,
        end: undefined,
      },
      customerOptions: [],
    };
  },
  created() {
    this.getOrgList('');
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    setOrgId(id) {
      this.queryParams.orgId = id;
    },
    handleQuery() {
      this.$emit('handleQuery');
    },
    handleClear() {
      // 清空搜索条件
      this.queryParams = {
        orgId: '',
        status: '0',
        type: -1,
        start: undefined,
        end: undefined,
      };
      this.$emit('handleClear');
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
  },
};
</script>
<style lang="scss">
  .query-form-list{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .el-form-item {
      margin: 20px 10px 20px 20px;
      .query-time {
        width: 130px;
        input {
          padding-right: 15px;
        }
      }
      .el-form-item__label {
        line-height: 32px !important;
      }
      .el-form-item__content {
        line-height: 32px !important;
        .el-select {
          .el-input__inner {
            padding: 0 25px 0 12px;
          }
        }
      }
    }
    .query-button {
      margin-right: 20px;
    }
  }
</style>
