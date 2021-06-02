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
            :max-length="10"
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
            <!-- <el-button type="primary" @click="isChecked = !this.isChecked">{{
              batchHandleText
            }}</el-button>
            <el-button type="primary" @click="handleExport">导出</el-button> -->
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
                    @click.stop="handleAction(scope.row, 'logs')"
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
import { topOrgStatus, orgType, CUSTOMER_LIST } from "@/utils/static";
import BreadCrumb from "@/components/bread-crumb";
import { customerColumn } from "@/static/column";
import { toRaw } from "vue";
import AdminApi from "@/server/api/admin";
import RulesModal from "@/views/customer-management/modal/rules-modal";
import CustomerTree from "./component/CustomerTree";
import { $modalConfirm } from "@/utils/better-el";
import { dateUtils, fileDownload } from "@/utils";

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
        type: -1,
        start: undefined,
        end: undefined,
      },
      customerOptions: [], // 搜索框中的机构列表
      customerName: "",
      selectTimer: null,
      title: "全部",
      topOrgStatus,
      orgType,
      tableData: [{}, {}, {}, {}],
      multipleSelection: [],
      loading: false,
      isChecked: false,
      column: customerColumn,
      page: 1,
      total: 0,
      isActive: 0,
      activities: [], // 域名机构列表
      totalOrgNum: 12, // 总机构数
      totalOperatedOrgNum: 6, // 总合作中机构数
      activeKey: -1,
      editable: false, // 是否可编辑
      customerObj: { // 选中的域名机构详情
        subDomain: "",
        createTime: "",
        topCooperateOrgNum: 0,
        formalOrgNum: 0,
        trialOrgNum: 0,
        domainId:'',
        domainName:'',
      },
      addOrgVisible: false,
      addOrgForm: {
        subDomain: "",
        name: "",
      },
      rulesForm: {},
      addOrgFormOptions: {
        options: {
          labelPosition: "right",
          labelWidth: "120px",
          destroyOnClose: true,
          class: "add-org-modal",
        },
        rules: {
          subDomain: [
            { required: true, message: "二级域名不允许为空", trigger: "change" },
          ],
          name: [
            { required: true, message: "机构名称不允许为空", trigger: "change" },
          ],
        },
      },
    };
  },
  created() {
    this.getCuntomerTreeData()
  },
  mounted() {
    // 点击浏览器刷新时，响应 对带参做处理
    this.$nextTick(() => {
      let { id, customerName } = this.$route.params;
      if (id && id !== "all") {
        this.queryParams.orgId = id
        this.customerName = customerName
        this.customerOptions = [Object.assign({}, {value: customerName, id: id})]
      } else {
        // 查询机构 使得2查询框默认展示搜索数据
        this.getOrgList("")
      }
      this.getList()
    })
    // 给机构搜索select框添加最大输入长度
    let dom = document.getElementById("org-select")
    dom.setAttribute("maxLength", 100)
  },
  watch: {
    $route() {
      // 对路由变化作出响应...
      // this.getList()
    },
  },
  methods: {
    getData(){
      this.getCuntomerTreeData();
      this.getList();
    },
    // 获取列表数据
    getList() {
      console.log(toRaw(this.queryParams));
      // 处理搜索条件参数
      const params = {
        ...toRaw(this.queryParams),
        page: this.page,
      };
      params.start && (params.start = dateUtils.formatStandardDate(params.start))
      params.end && (params.end = dateUtils.formatStandardDate(params.end))
      if (params.type === -1) {
        delete params.type
      }
      this.loading = true;
      AdminApi.searchOrg(params)
        .then((res) => {
          const { code, data } = res.data || {};
          if (code === 200) {
            const { list, page, total } = data.result || {};
            this.tableData = list.map(item => {
              let typeName = item.type ? "正式" : "试用"
              let startTime = item.startTime || "-"
              return Object.assign(item, {typeName: typeName, startTime: startTime})
            });
            this.total = total;
            this.page = page;

            // 若不是全部机构 则赋值机构详情 customerObj
            const {detail} = data
            if (detail && Object.keys(detail).length > 0) {
              this.editable = true
              this.customerObj = Object.assign(this.customerObj, detail)
              this.title = `${detail.domainName}（ID：${detail.domainId}）`
              this.activeKey = detail.domainId
            } else {
              this.title = `全部机构（${this.totalOperatedOrgNum}/${this.totalOrgNum}）`;
              this.editable = false
            }
          } else {
            this.$message.error("请求出错");
          }
        })
        .finally(() => this.loading = false);
    },
    // 获取左侧树 数据
    getCuntomerTreeData () {
      AdminApi.orgListDomain().then(res => {
        const {code, data} = res.data || {}
        if (code === 200) {
          const {list, totalOrgNum, totalOperatedOrgNum} = data
          this.activities = list
          this.totalOrgNum = totalOrgNum
          this.totalOperatedOrgNum = totalOperatedOrgNum
        }
      })
    },
    //排序
    handleSortChange({ prop, order }) {
      this.isChecked = false;
      this.multipleSelection = []
      this.page = 1;
      let sort = {
        sortColumn: CUSTOMER_LIST[prop],
        sortOrder: CUSTOMER_LIST[order],
      };
      this.queryParams = Object.assign(this.queryParams, sort)
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
    //操作日志
    handleAction(params = {}) {
      console.log(params);
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

    // 搜索
    handleQuery () {
      debugger
      let url = this.queryParams.orgId ? `/${this.customerName}/${this.queryParams.orgId}`  : "/全部/all"
      this.$router.push(`/customerManagement${url}`);
      this.page = 1
      this.isChecked = false;
      const { clearSelection, clearSort } = this.$refs.multipleTable;
      clearSelection();
      clearSort();
      this.getList()
    },

    //清空搜索条件
    handleClear() {
      this.page = 1;
      this.isChecked = false;
      const { clearSelection, clearSort } = this.$refs.multipleTable;
      clearSelection();
      clearSort();
      this.queryParams = {
        orgId: "",
        status: "0",
        type: -1,
        start: undefined,
        end: undefined,
      };
      this.$refs.CustomerTree.handleSelect("all")
      this.customerOptions = []
      this.getList();
    },
    //域名机构切换
    handleAddOrg() {
      this.$refs["addOrgForm"].validate((valid) => {
        if (valid) {
          console.log(toRaw(this.addOrgForm));
          AdminApi.addDomain(this.addOrgForm).then((res) => {
            let {code, message} = res.data
            if (code === 200) {
              this.$message.success("域名机构创建成功")
              // 关闭弹窗 刷新左侧树
              this.addOrgVisible = false
              this.getCuntomerTreeData()
            } else {
              this.$message.warning(message)
            }
          })
        }
      });
    },
    handleExport(type) {
      let text = "点击确定，将为您导出选中的所有信息"
      let title = type ? "确认导出所有信息吗？" : "确认导出选中的所有信息吗？"
      const params = {
        condition: {
          ...toRaw(this.queryParams),
          page: this.page,
        },
        idList: []
      };
      // 处理查询条件
      params.condition.start && (params.condition.start = dateUtils.formatStandardDate(params.condition.start))
      params.condition.end && (params.condition.end = dateUtils.formatStandardDate(params.condition.end))
      if (params.condition.type === -1) {
        delete params.condition.type
      }
      // 处理选中的id
      params.idList = type ? [] : this.multipleSelection.map(item => item.id)
      $modalConfirm({ text, title }).then(() => {
        AdminApi.orgExport(params).then(res => {
          let {status} = res
          if (status === 200) {
            fileDownload(res)
          } else {
            this.$message.error("导出失败!")
          }
        })}
      ).catch((err) => {
          console.log(err);
        });
    },
    resetAddOrgForm() {
      this.$refs["addOrgForm"].resetFields();
    },
    // 打开弹窗 域名机构以及顶级机构创建
    showModal (sign,params = {}) {
      if(sign === 'edit'){
        const { id } = params;
        AdminApi.orgPermission(id).then((res)=>{
          const { code, data = {} } = res.data || {};
          if(code === 200){
            this.$refs.RulesModal.open(data,false);
          }else {
            this.$message.error('请求错误');
          }
        })
      }else {
        if (this.editable) {
          this.$refs.RulesModal.open(toRaw(this.customerObj), true);
        } else {
          this.addOrgVisible = true
        }
      }
    },
    // 左侧树点击事件
    customerTreeClick(val, obj) {
      // 通过路由控制，改变右侧表格数据
      let url = "/customerManagement"
      if (val && val === 'all') {
        this.queryParams.orgId = ""
        this.customerName = "全部"
        url += `/全部/all`
      } else {
        this.customerOptions = [Object.assign(obj, {value: obj.name})]
        this.customerName = obj.name
        this.queryParams.orgId = obj.id
        url += `/${obj.name}/${obj.id}`
      }
      this.$router.push(url);
      this.getList()
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
      console.log(endTime, this.queryParams.start)
    },

    remoteMethod (val) {
      if (this.selectTimer) {
        clearTimeout(this.selectTimer)
        this.selectTimer = null
      }
      this.selectTimer = setTimeout(() => {
        // 调用接口查询
        this.getOrgList(val)
        clearTimeout(this.selectTimer)
        this.selectTimer = null
      }, 300)
    },
    // 查询机构数据
    getOrgList (val) {
      AdminApi.simpleListOrg(val).then((res) => {
        const { code, data } = res.data || {}
        if (code === 200) {
          this.customerOptions = data
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    setCustomerName (val) {
      let arr = this.customerOptions.filter(item => item.id === val)
      this.customerName = arr[0].value
    },
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
