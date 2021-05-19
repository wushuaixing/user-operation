<template>
  <div class="data-audit-container">
    <div class="content-left">
      <el-select
        v-model="value"
        filterable
        remote
        placeholder="请输入搜索内容"
        :remote-method="remoteMethod"
        @clear="remoteMethod"
        :loading="loading"
        style="width: 280px"
        :clearable="true"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-tree
        :data="data"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
      />
    </div>
    <div class="content-right">
      <BreadCrumb :text="title" />
      <div class="query-content">
        <el-form :inline="true" :model="params" class="query-form">
          <el-form-item label="债务人：">
            <el-input
              v-model="params.name"
              placeholder="姓名、公司名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="标题：">
            <el-input v-model="params.title" placeholder="拍卖标题"></el-input>
          </el-form-item>
          <el-form-item label="机构名称：">
            <el-input
              v-model="params.orgName"
              placeholder="机构名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="拍卖状态：">
            <el-select v-model="params.status">
              <el-option
                v-for="item in AUCTION_STATUS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="债务人类别：">
            <el-select v-model="params.approveStatus">
              <el-option
                v-for="item in DEBTORES_TYPE"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="params.actionStatus">
              <el-option
                v-for="item in ACTION_TYPE"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="更新时间：">
            <el-date-picker
              v-model="params.updateTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="起拍时间：">
            <el-date-picker
              v-model="params.startTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="params.important">近一个月</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button type="primary" @click="resetForm"
              >清空搜索条件</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="table-content">
        <div class="table-content-head">
          <div class="table-content-head-tabs">
            <el-tabs v-model="tabKey">
              <el-tab-pane
                v-for="item in dataAuditTabs(matchNum, noReadNum)"
                :label="item.label"
                :name="item.name"
                :key="item.name"
              />
            </el-tabs>
          </div>
          <div class="table-content-head-action">
            <el-button type="primary" icon="el-icon-folder-opened"
              >批量管理</el-button
            >
            <el-button type="primary" icon="el-icon-thumb">一键导出</el-button>
          </div>
        </div>
        <div class="table-content-body">
          <el-table
            :data="dataList"
            style="width: 100%"
            v-loading="tableLoading"
          >
            <el-table-column label="资产信息" width="322">
              <template #default="scope">
                {{ scope.a }}
              </template>
            </el-table-column>
            <el-table-column label="匹配原因" width="299">
              <template #default="scope">
                {{ scope.a }}
              </template>
            </el-table-column>
            <el-table-column label="拍卖信息 (拍卖时间)" width="469">
              <template #default="scope">
                {{ scope.a }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="110">
              <template #default="scope">
                {{ scope.a }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110">
              <template #default="scope">
                {{ scope.a }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "@/components/bread-crumb";
import { toRaw } from "vue";
import {
  AUCTION_STATUS,
  DEBTORES_TYPE,
  ACTION_TYPE,
  dataAuditTabs,
} from "@/utils/static";

export default {
  name: "dataAudit",
  nameComment: "数据审核",
  components: {
    BreadCrumb,
  },
  data() {
    return {
      options: [],
      list: [
        {
          label: "恒丰银行域名机构",
          value: "1",
        },
        {
          label: "光大银行域名机构",
          value: "2",
        },
      ],
      value: "",
      loading: false,
      data: [
        {
          label: "待审核机构",
          children: [
            {
              label: "四川天府银行 (100)",
              id: "10",
              children: [
                {
                  label: "分行清收小组 (30)",
                  id: "100",
                },
                {
                  label: "惠普清收-李四 (30)",
                  id: "101",
                },
                {
                  label: "清收小组-章三 (40)",
                  id: "102",
                },
              ],
            },
          ],
        },
        {
          label: "全部试用机构",
          children: [
            {
              label: "文琴银行杭州分行",
              id: "20",
              children: [
                {
                  label: "家驹清收小组（11）",
                  id: "200",
                  children: [
                    {
                      label: "家驹清收小组（222）",
                      id: "2000",
                      children: [
                        {
                          label: "家驹清收小组（3333）",
                          id: "20000",
                          children: [
                            {
                              label: "家驹清收小组（44444）",
                              id: "200000",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              label: "壮钰银行杭州分行",
              id: "24320",
              children: [
                {
                  label: "壮钰清收小组",
                  id: "2432420",
                },
              ],
            },
          ],
        },
        {
          label: "全部负责机构 (10)",
          children: [
            {
              label: "夏云银行南阳分行",
              id: "424",
              children: [
                {
                  label: "夏云清收小组",
                  id: "300",
                },
              ],
            },
            {
              label: "王川银行河南分行",
              id: "31443",
              children: [
                {
                  label: "王川清收小组",
                  id: "3042420",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      title: "",
      params: {
        name: "",
        title: "",
        orgName: "",
        approveStatus: "",
        actionStatus: "",
        status: "",
        updateTime: "",
        startTime: "",
        important: 0,
      },
      matchNum: 20,
      noReadNum: 10,
      tabKey: "0",
      AUCTION_STATUS,
      DEBTORES_TYPE,
      ACTION_TYPE,
      dataAuditTabs,
      dataList: [],
      tableLoading: false,
    };
  },
  methods: {
    remoteMethod(query) {
      if (query) {
        this.options = this.list.filter((item) => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      } else {
        this.options = [];
      }
    },
    handleNodeClick(data) {
      const { id, label } = toRaw(data);
      if (id) {
        this.title = label;
      }
    },
    onSubmit() {
      console.log(this.params);
    },
    resetForm() {},
  },
};
</script>

<style lang="scss">
.data-audit-container {
  display: flex;
  min-height: 86vh;

  .content-left {
    width: 320px;
    background-color: #fff;
    height: 90vh;
    margin-right: 20px;
    padding: 20px;
    box-sizing: border-box;
  }

  .content-right {
    background-color: #fff;
    flex: 1;
  }
}
</style>
