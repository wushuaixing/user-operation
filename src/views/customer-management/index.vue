<template>
  <div class="customer-management-container">
    <div class="query-content">
      <el-form :inline="true" :model="queryParams" class="query-form">
        <el-form-item label="机构名称：" style="width: 300px">
          <el-select v-model="queryParams.orgId" filterable placeholder="请输入机构名称" @input="inputChange">
            <el-option
              v-for="item in customerOptions"
              :key="item.id"
              :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同结束日期：">
          <el-date-picker
            class="query-time"
            v-model="queryParams.start"
            type="date"
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
              :key="item"
              :label="orgType[item]"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
          <el-button type="primary" @click="handleClear"
            >清空搜索条件</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content">
      <div class="main-content-left">
        <!-- <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :color="isActive === index ? 'green' : ''"
            @click="handleItemClick(index, activity.content)"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline> -->
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
          @handleClick="showModal"
          @saveName="saveName"
        >
          <template v-slot:detail v-if="editable">
            <div class="customer-detail">
              <div class="customer-detail-left">
                <div class="link">
                  <span>二级域名:</span>
                  <a :href="`http://www.${this.customerObj.domainName}`" target='_blank'>{{customerObj.domainName}}</a>
                </div>
                <div class="link">
                  <span>创建时间:</span>
                  <span>{{customerObj.createTime}}</span>
                </div>
              </div>
              <div class="customer-detail-right">
                <div class="customer num1">
                  <div class="customer-type">
                    <img src="../../assets/img/icon.png"/>
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
            <el-button type="primary" @click="isChecked = !this.isChecked">{{
              batchHandleText
            }}</el-button>
            <el-button type="primary" @click="handleExport">导出</el-button>
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
                :key="item.label"
              />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="text"
                    @click="handleAction(scope.row, 'rules')"
                  >
                    权限管理
                  </el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button
                    type="text"
                    @click="handleAction(scope.row, 'logs')"
                    >操作日志
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="pageChange"
              background
              :current-page="page"
              layout="total, prev, pager, next, jumper"
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
                maxlength="20"
                placeholder="请输入二级域名"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="机构名称：" prop="name">
              <el-input
                v-model="addOrgForm.name"
                autocomplete="off"
                maxlength="11"
                placeholder="请输入机构名称"
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
          :formData="rulesForm"
          :isAdd="isAdd"
          :title="isAdd ? '创建顶级合作机构' : '权限管理'"
          :visible="rulesModalVisible"
          @close="rulesModalVisible = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { topOrgStatus, orgType, SORTER_TYPE } from "@/utils/static";
import BreadCrumb from "@/components/bread-crumb";
import { taskAssignColumn } from "@/static/column";
import { toRaw } from "vue";
import AdminApi from "@/server/api/admin";
import RulesModal from "@/views/customer-management/modal/rules-modal";
import CustomerTree from "./component/CustomerTree";
export default {
  name: "customerManagement",
  nameComment: "客户管理",
  components: {
    RulesModal,
    BreadCrumb,
    CustomerTree,
  },
  data() {
    return {
      queryParams: {
        orgId: "",
        status: "0",
        type: "0",
        start: undefined,
        end: undefined,
      },
      customerOptions: [], // 搜索框中的机构列表
      selectTimer: null,
      title: "全部",
      topOrgStatus,
      orgType,
      tableData: [],
      multipleSelection: [],
      loading: false,
      isChecked: false,
      column: taskAssignColumn,
      page: 1,
      total: 0,
      isActive: 0,
      activities: [], // 域名机构列表
      totalOrgNum: 12, // 总机构数
      totalOperatedOrgNum: 6, // 总合作中机构数
      activeKey: -1,
      isAdd: true, // 是否是新增
      editable: false, // 是否可编辑
      customerObj: { // 选中的域名机构详情
        subDomain: 'cmbc.yczcjk.com',
        createTime: '2019-12-21',
        topCooperateOrgNum: 12,
        formalOrgNum: 8,
        trialOrgNum: 4
      },
      addOrgVisible: false,
      rulesModalVisible: false,
      addOrgForm: {
        subDomain: "",
        name: "",
      },
      rulesForm: {
        a: "2112111ID",
        b: "顶级合作机构名称",
        f:"559",
        g: "民生银行域名机构",
      },
      addOrgFormOptions: {
        options: {
          labelPosition: "right",
          labelWidth: "120px",
          destroyOnClose: true,
          class: "add-org-modal",
        },
        rules: {
          url: [
            { required: true, message: "请输入二级域名", trigger: "change" },
          ],
          name: [
            { required: true, message: "请输入机构名称", trigger: "change" },
          ],
        },
      },
    };
  },
  created() {
    this.getList();
    // let name = [
    //   "河北省",
    //   "山西省",
    //   "辽宁省",
    //   "吉林省",
    //   "黑龙江省",
    //   "江苏省",
    //   "浙江省",
    //   "安徽省",
    //   "福建省",
    //   "江西省",
    //   "山东省",
    //   "河南省",
    //   "湖北省",
    //   "湖南省",
    //   "广东省",
    //   "海南省",
    //   "四川省",
    //   "贵州省",
    //   "云南省",
    //   "陕西省",
    //   "甘肃省",
    //   "青海省",
    //   "台湾省",
    // ];
    // for (let i = 0; i < name.length; i++) {
    //   let obj = {
    //     content: `${name[i]}银行域名机构(${Math.random().toString()[5]}/${
    //       Math.random().toString()[8]
    //     })`,
    //   };
    //   this.activities = [...this.activities, obj];
    // }
  },
  mounted() {
    this.getCuntomerTreeData()
    // 点击浏览器刷新时，响应 对带参做处理
    let { customerName, id } = this.$route.params;
    if (id) {
      this.activeKey = id || -1;
      this.title = `${customerName}（ID：${id}）`
      this.editable = true
    } else {
      this.title = `全部机构（${this.totalOperatedOrgNum}/${this.totalOrgNum}）`
      this.editable = false
    }
  },
  watch: {
    $route() {
      // 对路由变化作出响应...
      // this.title = to.params.customerName
      this.getCuntomerTreeData()
    },
  },
  methods: {
    // 获取列表数据
    getList() {
      this.activeKey = '20'
      this.loading = true;
      console.log(toRaw(this.queryParams));
      const params = {
        ...toRaw(this.queryParams),
        page: this.page,
      };
      AdminApi.getUsersList(params)
        .then((res) => {
          const { code, data } = res.data || {};
          if (code === 200) {
            const { list, page, total } = data || {};
            this.tableData = list;
            this.total = total;
            this.page = page;
          } else {
            this.$message.error("请求出错");
          }
        })
        .finally(() => this.loading = false);
    },
    // 获取左侧树 数据
    getCuntomerTreeData () {
       this.activities = [ // 域名机构列表
        // {
        //   id: 1,
        //   name: "台州银行域名机构台州银行台州银行域名机构台州银行域名机构台州域名机构台州",
        //   operatedOrgNum: 1,
        //   orgNum: 3
        // },
        // {
        //   id: 2,
        //   name: "杭州银行域名机构",
        //   operatedOrgNum: 2,
        //   orgNum: 4
        // },
        // {
        //   id: 3,
        //   name: "溫州银行域名机构",
        //   operatedOrgNum: 3,
        //   orgNum: 5
        // },
      ];
      for (let i = 0; i < 50; i++) {
        let obj = {
          operatedOrgNum: 2,
          orgNum: 4,
          name: "杭州银行域名机构"
        }
        obj.id = i + 1
        this.activities.push(obj)
      }
      this.totalOrgNum = 12; // 总机构数
      this.totalOperatedOrgNum = 6; // 总合作中机构数
    },
    //排序
    handleSortChange({ prop, order }) {
      this.isChecked = false;
      this.page = 1;
      this.queryParams = {
        orderField: SORTER_TYPE[prop],
        sortOrder: SORTER_TYPE[order],
      };
      this.getList();
    },
    //翻页
    pageChange(page) {
      this.page = parseInt(page);
      this.getList();
    },
    //（取消）批量管理
    handleBatchCheck(isChecked) {
      this.isChecked = isChecked;
      if (!isChecked) this.$refs.multipleTable.clearSelection();
    },
    handleAction(params, sign) {
      if (sign === "rules") {
        this.rulesModalVisible = true;
        this.isAdd = false
      }
      console.log(params, sign);
    },

    // 点击一行跳转详情页
    rowClick () {
      window.open("/customerDetail/12", "_blank")
    },

    // 机构状态改变 结束日期改变
    statusChange (val) {
      let nowDate = new Date()
      switch (val) {
        case "1" :{
          // 开始日期赋值当天 结束日期置空
          this.queryParams.start = nowDate
          this.queryParams.end = undefined
          break
        }
        case "2" :{
          // 开始日期置空 结束日期赋值昨天
          this.queryParams.start = undefined
          this.queryParams.end = new Date(nowDate.getTime() - 24 * 3600 * 1000)
          break
        }
        case "3" :{
          // 开始日期今天 结束日期：今天+两个月
          this.queryParams.start = new Date()
          nowDate.setMonth(nowDate.getMonth() + 2)
          this.queryParams.end = nowDate
          break
        }
        case "4" :{
          // 开始日期：昨天-两个月  结束日期：昨天
          this.queryParams.end = new Date(nowDate.getTime() - 24 * 3600 * 1000)
          let date = new Date(nowDate.getTime() - 24 * 3600 * 1000)
          date.setMonth(date.getMonth() - 2)
          this.queryParams.start = date
          break
        }
        default:
          break
      }
    },
    endTimeChange () {
      this.queryParams.status = "0"
    },
    //清空搜索条件
    handleClear() {
      this.page = 1;
      this.isChecked = false;
      const { clearSelection, clearSort } = this.$refs.multipleTable;
      clearSelection();
      clearSort();
      this.queryParams = {
        orgName: "",
        user: "",
      };
      this.getList();
    },
    //域名机构切换
    handleItemClick(index, title) {
      this.isActive = index;
      this.title = title;
    },
    handleAddOrg() {
      this.$refs["addOrgForm"].validate((valid) => {
        if (valid) {
          console.log(toRaw(this.addOrgForm));
        }
      });
    },
    handleExport() {
      this.$confirm(
        "点击确定，将为您导出选中的所有信息",
        "点击确定，将为您导出选中的所有信息",
        {
          type: "warning",
        }
      )
        .then(() => {
          this.$message.success("导出成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetAddOrgForm() {
      this.$refs["addOrgForm"].resetFields();
    },
    // 打开弹窗 域名机构以及顶级机构创建
    showModal () {
      if (this.editable) {
        this.rulesModalVisible = true
        this.isAdd = true
      } else {
        this.addOrgVisible = true
      }
    },
    // 左侧树点击事件
    customerTreeClick(val, obj) {
      // 通过路由控制，改变右侧表格数据
      if (val && val === 'all') {
        this.title = `全部机构（${this.totalOperatedOrgNum}/${this.totalOrgNum}）`;
        this.$router.push('/customerManagement');
        this.editable = false
      } else {
        this.title = `${obj.name}（ID：${obj.id}）`
        this.$router.push(`/customerManagement/${obj.name}/${obj.id}`);
        this.editable = true
      }
    },
    // 保存顶级机构名称
    saveName (name) {
      console.log(name)
    },

    // 日期控件做前后限制
    disabledStartDate (startTime) {
      if (this.queryParams.end) {
        return startTime.getTime() > this.queryParams.end.getTime()
      }
    },
    disabledEndDate (endTime) {
      if (this.queryParams.start) {
        return endTime.getTime() < this.queryParams.start.getTime()
      }
    },

    // 机构搜索做防抖处理
    inputChange (val) {
      if (this.selectTimer) {
        clearTimeout(this.selectTimer)
        this.selectTimer = null
      }
      this.selectTimer = setTimeout(() => {
        console.log('1', val.target.value)
        clearTimeout(this.selectTimer)
        this.selectTimer = null
      }, 1000)
    }
  },
  computed: {
    batchHandleText: function () {
      return this.isChecked ? "取消批量管理" : "批量管理";
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
          width: 400px !important;
        }
      }
    }
  }
}
.add-org-modal {
  padding-right: 40px;
}
</style>
